---

# NLP Project

This repository focuses on **Abstractive Text Summarization** and includes both backend and frontend components to handle text summarization tasks. Below is a detailed explanation of the project, its components, and how to use it.

---

## Repository Overview

- **Repository URL**: [NLP_Project](https://github.com/KetanGhungralekar/NLP_Project)
- **Languages Used**:
  - Jupyter Notebook: 83.2%
  - Python: 12%
  - JavaScript: 2.5%
  - CSS: 2%
  - HTML: 0.3%

---

## Directory Structure

### **Frontend**
- Located in the `vite-project` directory.
- Built using [Vite](https://vitejs.dev/), a modern frontend tool.
- Provides an interface for users to input text and view generated summaries.

### **Backend**
- Located in the `Backend/summariser-api` directory.
- Built using Flask and includes the APIs for handling summarization tasks.
- Includes the `model` subdirectory, containing the summarization model logic. ([model directory link](https://github.com/KetanGhungralekar/NLP_Project/tree/main/Backend/summariser-api/model))

---

## Files Overview

### 1. `abstractive-summarisation-model.ipynb`
- **Purpose**: Implements the abstractive text summarization model using deep learning techniques.
- **Dataset**: Uses the **CNN/DailyMail dataset**, loaded from `/kaggle/input/newspaper-text-summarization-cnn-dailymail/cnn_dailymail/train.csv`.
- **Workflow**:
  1. **Preprocessing**:
     - Tokenizes and pads text data using TensorFlow/Keras preprocessing utilities.
  2. **Model Instance**:
     - Builds an encoder-decoder architecture with attention mechanisms using TensorFlow/Keras.
  3. **Training**:
     - Trains the model on the dataset using categorical crossentropy loss and Adam optimizer.
  4. **Saving**:
     - Saves the trained model for later use.
  5. **Testing**:
     - Tests the model on unseen data and evaluates it using metrics like the **ROUGE score**.

### 2. `seq2seq.py`
- **Path**: [Backend/summariser-api/model/seq2seq.py](https://github.com/KetanGhungralekar/NLP_Project/blob/main/Backend/summariser-api/model/seq2seq.py)
- **Purpose**: Implements the Seq2Seq model architecture with an attention mechanism for abstractive summarization.
- **Components**:
  1. **BahdanauAttention**:
     - A custom attention layer that focuses on relevant parts of the input sequence while generating output tokens.
  2. **Encoder**:
     - Converts input text into meaningful feature representations using an embedding layer and an LSTM.
  3. **Decoder**:
     - Generates the summary token by token using an embedding layer, LSTM, and the BahdanauAttention layer.
  4. **Seq2Seq**:
     - Combines the encoder and decoder into a complete model.
     - Includes methods for training (`train_step`), inference (`call`), and summary generation (`generate`).
- **Highlights**:
  - Manages input/output vocabularies and sequences.
  - Uses TensorFlow/Keras APIs and custom logic for attention and sequence generation.

### 3. `inference.py`
- **Path**: [Backend/summariser-api/model/inference.py](https://github.com/KetanGhungralekar/NLP_Project/blob/main/Backend/summariser-api/model/inference.py)
- **Purpose**: Provides the logic to generate summaries using the trained Seq2Seq model.
- **Workflow**:
  1. **Model Loading**:
     - Loads the trained `Attention_Model_(teacher_forcing).keras` model.
     - Uses custom objects (e.g., `Seq2Seq`) during the loading process.
  2. **Tokenizers and Metadata**:
     - Loads tokenizers (`e_tk.pkl` and `d_tk.pkl`) for encoding input text and decoding output token sequences.
     - Loads metadata (`metadata.pkl`) containing the word dictionary (`word_dict`), special tokens (`start_id`, `end_id`), and sequence length configurations (`input_seq_len`, `output_seq_len`).
  3. **Summary Generation** (`generate_summary` function):
     - Takes input text, converts it into token sequences using the encoder tokenizer (`e_tk`), and pads the sequences.
     - Feeds the processed input to the model to generate output token sequences.
     - Converts the output token IDs back into words using the word dictionary (`word_dict`) and returns the final summary.

---

## Requirements

### Importing Libraries
The project uses the following Python libraries:
```python
import keras
import tensorflow as tf
import numpy as np
import pandas as pd
from tensorflow.keras import layers as L
from tensorflow.keras import models as M
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from rouge_score import rouge_scorer
```

### Dependencies
Make sure these Python modules are installed:
- `keras`
- `tensorflow`
- `pandas`
- `flask`
- `flask-cors`
- `numpy`
- `rouge-score`

Install all dependencies using:
```bash
pip install keras tensorflow pandas flask flask-cors numpy rouge-score
```

---

## Running the Backend

To start the backend service:

1. Navigate to the backend directory:
   ```bash
   cd Backend/summariser-api
   ```
2. Start the Flask server:
   ```bash
   python app.py
   ```
3. The server will run by default on `http://localhost:5000`.

### Backend API Endpoints

1. **`/summarize`**
   - **Method:** POST  
   - **Description:** Accepts raw text input and generates an abstractive summary using the logic from `inference.py`.  
   - **Input Example:**
     ```json
     {
       "text": "Your input text here."
     }
     ```
   - **Output Example:**
     ```json
     {
       "input": "Your input text here.",
       "summary": "Generated summary here."
     }
     ```

2. **`/article`**
   - **Method:** GET  
   - **Description:** Returns a random article from the preloaded dataset (`filtered_train.csv`).  
   - **Output Example:**
     ```json
     {
       "article": "A random article text here."
     }
     ```

---

## Running the Frontend

To start the frontend application:

1. Navigate to the frontend directory:
   ```bash
   cd vite-project
   ```
2. Install the required dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Access the frontend in your browser at the address provided by Vite (e.g., `http://localhost:5173`).

The frontend allows users to input text or fetch random articles for summarization and displays the generated summaries.

---

## How to Use

1. Start the **backend** and **frontend** as described above.
2. Use the frontend interface to:
   - Input custom text for summarization, or
   - Fetch a random article for summarization.
3. The frontend communicates with the backend APIs to generate and display summaries.

---
