import keras
import tensorflow as tf
import numpy as np
import pandas as pd
from tensorflow.keras import layers as L
from tensorflow.keras import models as M
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
class BahdanauAttention(L.Layer):
    def __init__(self, units):
        super(BahdanauAttention, self).__init__()
        self.W1 = L.Dense(units)
        self.W2 = L.Dense(units)
        self.V = L.Dense(1)

    def call(self, query, values):
        # query - shape == (batch_size, hidden_size) -> decoder hidden state at the current timestep
        # values - shape == (batch_size, max_len/timesteps, hidden_size) -> encoder outputs (all timesteps)
        # here, hidden_size = units, max_len = timesteps
        query = tf.expand_dims(query, axis = 1)                # (batch_size, 1, hidden_size)
        score = self.V(tf.nn.tanh(self.W1(query) + self.W2(values)))  # (batch_size, timesteps, 1)
        attention_weight = tf.nn.softmax(score, axis = 1)      # (batch_size, timesteps, 1)
        context = attention_weight*values                      # (batch_size, timesteps, hidden_size)
        context_vector = tf.reduce_sum(context, axis = 1)      # (batch_size, hidden_size)
        return context_vector, attention_weight
class Encoder(L.Layer):
    def __init__(self, in_vocab, embedding_dim, hidden_units):
        super(Encoder, self).__init__()
        self.embed = L.Embedding(in_vocab, embedding_dim)       # (batch_size, seq_length) -> (batch_size, seq_length, embedding_dim)
        self.lstm = L.LSTM(hidden_units, return_sequences=True,return_state = True)   # (batch_size, seq_length, embedding_dim) -> (batch_size, hidden_units)

    def call(self, inputs):
        # input : (batch_size, seq_length)
        x = self.embed(inputs)                               # (batch_size, seq_length, embeddign_dim)
        enc_out, hidden_state, cell_state = self.lstm(x)     # O/P (batch_size, seq_len, hidden_size)
        return enc_out, hidden_state, cell_state
class Decoder(L.Layer):
    def __init__(self, out_vocab, embedding_dim, hidden_units):
        super(Decoder, self).__init__()
        self.embed = L.Embedding(out_vocab, embedding_dim)     # (batch_size, seq_length) -> (batch_size, seq_length, embedding_dim)
        self.lstm = L.LSTM(hidden_units, return_sequences = True, return_state = True)  # (batch_size, seq_length, embedding_dim) -> (batch_size, hidden_units)
        self.dense = L.Dense(out_vocab, activation='softmax')  # (batch_size, seq_length, hidden_units) -> (batch_size, seq_length, out_vocab)
        self.attention = BahdanauAttention(64)
    
    def call(self, inputs, hidden_state, cell_state, enc_output):
        # input : (batch_size, 1)
        x = self.embed(inputs)                                 # (batch_size, 1, embedding_dim)
        states = [hidden_state, cell_state] 
        context, attention_weights = self.attention(query = hidden_state, values = enc_output)
        dec_out, hidden_state, cell_state = self.lstm(x, initial_state=states)  # O/P : (batch_size, 1, hidden_units)
        dec_out = tf.squeeze(dec_out, axis=1)                  # (batch_size, hidden_units)
        # context = tf.expand_dims(context, axis=1)              # (batch_size, 1, embedding_dim)
        inputs = tf.concat([context, dec_out], axis=-1)        # (batch_size, 1, embedding_dim + enc_units)
        out = self.dense(inputs)                               # (batch_size, 1, out_vocab)
        return out, hidden_state, cell_state 

@keras.saving.register_keras_serializable(package="Custom", name="Seq2Seq")
class Seq2Seq(M.Model):

    def __init__(self, in_vocab, out_vocab, embedding_dim, hidden_units, end_token):
        super(Seq2Seq, self).__init__()

        self.in_vocab = in_vocab
        self.out_vocab = out_vocab
        self.embedding_dim = embedding_dim
        self.hidden_units = hidden_units
        
        self.encoder = Encoder(in_vocab, embedding_dim, hidden_units)
        self.decoder = Decoder(out_vocab, embedding_dim, hidden_units)
        self.end_token = end_token
    
    @tf.function
    def train_step(self, inputs):
        (enc_inputs, dec_inputs), targets = inputs         # (batch_size, seq_length)
        
        with tf.GradientTape() as tape:
            enc_out, hidden_state, cell_state = self.encoder(enc_inputs)           # (batch_size, hidden_units)
            seq_len = dec_inputs.shape[1]
            dec_out = tf.TensorArray(tf.float32, seq_len)  # (batch_size, seq_len, target_vocab_size)
            mask = tf.TensorArray(tf.bool, size=seq_len)
            for timestep in tf.range(seq_len):
                timestep_input = dec_inputs[:, timestep:timestep+1]       # (batch_size, 1)
                timestep_output, hidden_state, cell_state = self.decoder(timestep_input, hidden_state, cell_state, enc_out)   # timestep_output -> # (batch_size, 1, hidden_units)
                dec_out = dec_out.write(timestep, timestep_output)
                is_end = tf.equal(targets[:, timestep], self.end_token)  # Creating mask based on whether end token is encountered
                mask = mask.write(timestep, tf.logical_not(is_end))
            dec_out = tf.transpose(dec_out.stack(), [1, 0, 2])
            sequence_mask = tf.transpose(mask.stack(), [1, 0])
            loss = self.compiled_loss(targets, dec_out, sample_weight=tf.cast(sequence_mask, tf.float32))   
        variables = self.trainable_variables
        gradients = tape.gradient(loss, variables)
        self.optimizer.apply_gradients(zip(gradients, variables))
        self.compiled_metrics.update_state(targets, dec_out) # Update metrics
        return {m.name : m.result() for m in self.metrics}

    @tf.function
    def call(self, inputs, training=False):
        enc_inputs, dec_inputs = inputs                       
        enc_out, hidden_state, cell_state = self.encoder(enc_inputs)   # (batch_size, hidden_units)
        seq_len = tf.shape(dec_inputs)[1]
        dec_out = tf.TensorArray(tf.float32, seq_len)  # (batch_size, seq_len, target_vocab_size)
        for timestep in tf.range(seq_len):
            timestep_input = dec_inputs[:, timestep:timestep+1]       # (batch_size, 1)
            timestep_output, hidden_state, cell_state = self.decoder(timestep_input, hidden_state, cell_state, enc_out)   # timestep_output -> # (batch_size, 1, hidden_units)
            dec_out = dec_out.write(timestep, timestep_output)
        return tf.transpose(dec_out.stack(), [1, 0, 2])
    

    def generate(self, enc_inputs, max_len, start, end):
        enc_out, hidden_state, cell_state = self.encoder(enc_inputs)
        dec_in = tf.expand_dims([start], 0)              # To get from int -> (1,1) tensor
        result = []
        for _ in range(max_len): 
            prediction_logits, hidden_state, cell_state = self.decoder(dec_in, hidden_state, cell_state, enc_out) # (1, 1, hidden_units)
            prediction = tf.argmax(prediction_logits, axis=-1)        # return token ID (int)
            if prediction == end:
                break
            result.append(prediction.numpy())
            dec_in = tf.expand_dims(prediction, 0) 
        return result
    def get_config(self):
        config = super(Seq2Seq, self).get_config()
        config.update({
            'in_vocab': self.in_vocab,
            'out_vocab': self.out_vocab,
            'embedding_dim': self.embedding_dim,
            'hidden_units': self.hidden_units,
            'end_token': self.end_token  # 🛠️ include this!
        })
        return config

    @classmethod
    def from_config(cls, config):
        end_token = config.get('end_token', 0)  # 🛠️ set a default or handle gracefully
        return cls(
            in_vocab=config['in_vocab'],
            out_vocab=config['out_vocab'],
            embedding_dim=config['embedding_dim'],
            hidden_units=config['hidden_units'],
            end_token=end_token
        )