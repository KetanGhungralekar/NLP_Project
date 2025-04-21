# import os
# import pickle
# import numpy as np
# from keras.models import load_model
# from tensorflow.keras.preprocessing.sequence import pad_sequences
# from .seq2seq import Seq2Seq  # adjust import path if needed

# # Resolve absolute path of the model file
# BASE_DIR = os.path.dirname(__file__)
# model_path = os.path.join(BASE_DIR, "Attention_Model_(teacher_forcing).keras")

# model = load_model(model_path, custom_objects={"Seq2Seq": Seq2Seq})

# # Load tokenizers
# with open(os.path.join(BASE_DIR, "e_tk.pkl"), "rb") as f:
#     e_tk = pickle.load(f)

# with open(os.path.join(BASE_DIR, "d_tk.pkl"), "rb") as f:
#     d_tk = pickle.load(f)

# # Load metadata
# with open(os.path.join(BASE_DIR, "metadata.pkl"), "rb") as f:
#     metadata = pickle.load(f)

# word_dict = metadata["word_dict"]
# start_id = metadata["start_id"]
# end_id = metadata["end_id"]
# input_seq_len = metadata["input_seq_len"]
# output_seq_len = metadata["output_seq_len"]

# def generate_summary(text):
#     seq = e_tk.texts_to_sequences([text])
#     seq = pad_sequences(seq, maxlen=input_seq_len, padding='post')

#     model_output = model.generate(seq, output_seq_len, start_id, end_id)

#     output_text = []
#     for token_id in model_output:
#         if isinstance(token_id, (list, tuple, np.ndarray)):
#             token_id = int(token_id[0])
#         else:
#             token_id = int(token_id)

#         if token_id == end_id:
#             break

#         word = word_dict.get(token_id, '')
#         if word:
#             output_text.append(word)

#     return ' '.join(output_text)


# article1 = "Hundreds filed by a casket on Sunday to say goodbye to a small-town hero who died shortly after scoring the winning shot to clinch an undefeated season for his Michigan high school basketball team. Friends, family and even competitors braved a cold Michigan day for a pair of afternoon visitations for 16-year-old Wes Leonard of Fennville. Some piled off of school buses and hugged each other in the crisp winter air. \"He was just an all around great guy to play against,\" Craig Peterson, a player on the Bangor high school basketball team, told CNN affiliate WZZM. \"He was always respectful, he didn't run his mouth like most of the people would. He just liked to have fun, and was a great athlete.\" Leonard's funeral is set for 10:30 a.m. Tuesday at Christ Memorial Church in nearby Holland. Leonard died moments after scoring the winning basket in overtime Thursday, securing a perfect season for the Fennville High School Blackhawks. Leonard scored his team's last four points in the 57-55 victory. An autopsy Friday revealed Leonard died of cardiac arrest due to an enlarged heart, according to a statement from Dr. David A. Start, the Ottawa County chief medical examiner."

# print(generate_summary(article1))

import os
import zipfile
import tempfile
import shutil
import pickle
import numpy as np
from keras.models import load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences
from .seq2seq import Seq2Seq  # adjust import path if needed

# Resolve absolute path of the .keras model archive
BASE_DIR = os.path.dirname(__file__)
keras_archive = os.path.join(BASE_DIR, "Attention_Model_(teacher_forcing).keras")

# Manually extract the .keras archive to a temporary directory to avoid internal cleanup issues
tmp_dir = tempfile.mkdtemp()
with zipfile.ZipFile(keras_archive, 'r') as zip_ref:
    zip_ref.extractall(tmp_dir)

try:
    # Load the extracted SavedModel directory
    model = load_model(tmp_dir, custom_objects={"Seq2Seq": Seq2Seq})
finally:
    # Ensure the temporary directory is removed after loading
    shutil.rmtree(tmp_dir)

# Load tokenizers
e_tk_path = os.path.join(BASE_DIR, "e_tk.pkl")
d_tk_path = os.path.join(BASE_DIR, "d_tk.pkl")
with open(e_tk_path, "rb") as f:
    e_tk = pickle.load(f)
with open(d_tk_path, "rb") as f:
    d_tk = pickle.load(f)

# Load metadata
metadata_path = os.path.join(BASE_DIR, "metadata.pkl")
with open(metadata_path, "rb") as f:
    metadata = pickle.load(f)

word_dict = metadata["word_dict"]
start_id = metadata["start_id"]
end_id = metadata["end_id"]
input_seq_len = metadata["input_seq_len"]
output_seq_len = metadata["output_seq_len"]

def generate_summary(text):
    # Preprocess input text to sequence
    seq = e_tk.texts_to_sequences([text])
    seq = pad_sequences(seq, maxlen=input_seq_len, padding='post')

    # Generate summary tokens
    model_output = model.generate(seq, output_seq_len, start_id, end_id)

    # Convert token IDs back to words
    output_words = []
    for token_id in model_output:
        # Handle potential array-like tokens
        token_id = int(token_id[0]) if hasattr(token_id, '__len__') else int(token_id)
        if token_id == end_id:
            break
        word = word_dict.get(token_id, '')
        if word:
            output_words.append(word)
    return ' '.join(output_words)
