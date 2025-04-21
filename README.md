---

# NLP Project

This repository focuses on **Abstractive Text Summarization** and includes both backend and frontend components to handle text summarization tasks. Below is a detailed overview of the files, setup instructions, and usage details.

## Files Overview

### 1. `abstractive-summarisation-model.ipynb`
- This Jupyter Notebook contains the implementation of the abstractive text summarization model.
- It demonstrates the process of training a model and generating summaries for input text using state-of-the-art NLP techniques.

### 2. `Csv_creation.py`
- A Python script that helps in creating structured CSV files from input data.
- The output CSV files can be used for model training or testing purposes.

---

## Directory Structure

### **Frontend**
- The frontend directory is located in `vite-project`.
- It is built using [Vite](https://vitejs.dev/), a modern frontend tool. The frontend provides an interface for users to input text and view generated summaries.

### **Backend**
- The backend directory is located in `Backend/summariser-api`.
- It is built using Flask and provides APIs for handling summarization tasks.

---

## Requirements

Before running the project, ensure you have the following Python modules installed:

- `transformers`
- `torch`
- `pandas`
- `flask`
- `flask-cors`
- `numpy`
- `gunicorn` (optional, for deployment)

Install all the dependencies using the following command:

```bash
pip install -r requirements.txt
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

1. **`/generate_summary`**
   - **Method:** POST  
   - **Description:** Accepts raw text input in JSON format and generates an abstractive summary.  
   - **Input Example:**
     ```json
     {
       "text": "Your input text here."
     }
     ```
   - **Output Example:**
     ```json
     {
       "summary": "Generated summary here."
     }
     ```

2. **`/get_summary_csv`**
   - **Method:** POST  
   - **Description:** Accepts a CSV file of text data and returns a new CSV file with summaries.  
   - **Input Example:** Upload a CSV file with a column containing text.  
   - **Output Example:** A downloadable CSV file with an additional column for summaries.

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

The frontend allows users to input text or upload files for summarization and displays the generated summaries.

---

## How to Use

1. Start both the **frontend** and **backend** as described above.
2. Use the frontend interface to input text or upload files for summarization.
3. The frontend communicates with the backend APIs to generate and display summaries.

---
