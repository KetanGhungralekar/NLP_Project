import os
import pickle
import numpy as np
from keras.models import load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences
from .seq2seq import Seq2Seq  # adjust import path if needed

# Resolve absolute path of the model file
BASE_DIR = os.path.dirname(__file__)
model_path = os.path.join(BASE_DIR, "Attention_Model_(teacher_forcing).keras")

model = load_model(model_path, custom_objects={"Seq2Seq": Seq2Seq})

# Load tokenizers
with open(os.path.join(BASE_DIR, "e_tk.pkl"), "rb") as f:
    e_tk = pickle.load(f)

with open(os.path.join(BASE_DIR, "d_tk.pkl"), "rb") as f:
    d_tk = pickle.load(f)

# Load metadata
with open(os.path.join(BASE_DIR, "metadata.pkl"), "rb") as f:
    metadata = pickle.load(f)

word_dict = metadata["word_dict"]
start_id = metadata["start_id"]
end_id = metadata["end_id"]
input_seq_len = metadata["input_seq_len"]
output_seq_len = metadata["output_seq_len"]

def generate_summary(text):
    seq = e_tk.texts_to_sequences([text])
    seq = pad_sequences(seq, maxlen=input_seq_len, padding='post')

    model_output = model.generate(seq, output_seq_len, start_id, end_id)

    output_text = []
    for token_id in model_output:
        if isinstance(token_id, (list, tuple, np.ndarray)):
            token_id = int(token_id[0])
        else:
            token_id = int(token_id)

        if token_id == end_id:
            break

        word = word_dict.get(token_id, '')
        if word:
            output_text.append(word)

    return ' '.join(output_text)
