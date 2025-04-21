from flask import Flask, request, jsonify
from model.inference import generate_summary
import pandas as pd
from flask_cors import CORS




app = Flask(__name__)
CORS(app)
df = pd.read_csv("filtered_train.csv")

@app.route("/summarize", methods=["POST"])
def summarize():
    data = request.json
    if not data or "text" not in data:
        return jsonify({"error": "Missing 'text' in request"}), 400

    input_text = data["text"]
    summary = generate_summary(input_text)

    return jsonify({
        "input": input_text,
        "summary": summary
    })

    


@app.route("/article", methods=["GET"])
def get_random_article():
    if df.empty or "article" not in df.columns:
        return jsonify({"error": "No articles available or missing 'article' column"}), 500

    # Get a random article
    random_article = df.sample(n=1).iloc[0]["article"]

    return jsonify({
        "article": random_article
    })

if __name__ == "__main__":
    app.run(debug=True)
