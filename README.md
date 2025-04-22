# NLP Project

This repository focuses on **Abstractive Text Summarization** and includes both backend and frontend components to handle text summarization tasks. Below is a detailed explanation of the project, its components, and how to use it.

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
- **Purpose**: It contains the **SAME** Seq2Seq model architecture as used in `abstractive-summarisation-model.ipynb`. It has only been implemented here to use it for loading the model for inference purposes (API)

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

### 4. `inference.ipynb`
- **Path**: [Backend/summariser-api/model/inference.ipynb](https://github.com/KetanGhungralekar/NLP_Project/blob/main/Backend/summariser-api/model/inference.ipynb)
- **Purpose**: Demonstrates the inference process for generating summaries using the trained Seq2Seq model in a Jupyter Notebook format. This is designed for submission purposes.
- **Workflow**:
  1. **Model Loading**:
     - Loads the trained `Attention_Model_(teacher_forcing).keras` model.
     - Utilizes custom objects (e.g., `Seq2Seq`) for proper model reconstruction during loading.
  3. **Interactive Summary Generation**:
     - Provides an interactive cell to input custom text.
     - Converts the input text into token sequences using the encoder tokenizer (`e_tk`) and pads the sequences.
     - Feeds the processed input into the model to generate output token sequences.
     - Decodes the output token IDs into words using the word dictionary (`word_dict`) and displays the final summary.
---

## Requirements to Run the API

The following files are required to run the API and should be placed in the `Backend/summariser-api/model` directory:

1. **Attention_Model_(teacher_forcing).keras**: The main trained Keras model file (2.07 GB).
2. **d_tk.pkl**: Pickle file for the decoder tokenizer (1.61 MB).
3. **e_tk.pkl**: Pickle file for the encoder tokenizer (3.67 MB).
4. **metadata.pkl**: Pickle file containing metadata related to the model and tokenizers (543 KB).

### **Download the Required Files**

All the above files are available in a shared OneDrive folder.  
**[Click here to access the OneDrive files](https://1drv.ms/f/c/e5c64c50ac0c88ae/EgdBuH5wFwlPov6UETlhLUEBZIwjyauxGzvIsmKYx7L0dw?e=cT2BXY)**  

### **Steps to Place the Files**
1. Download the files from the OneDrive link.
2. Navigate to the `Backend/summariser-api/model` directory in your project:
   ```bash
   cd Backend/summariser-api/model
   ```
3. Place the downloaded files (`Attention_Model_(teacher_forcing).keras`, `d_tk.pkl`, `e_tk.pkl`, `metadata.pkl`) in this directory.

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
   - **Description:** Returns a random article from the preloaded dataset. 
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
