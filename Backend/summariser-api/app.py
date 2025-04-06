from flask import Flask, request, jsonify
from model.inference import generate_summary

app = Flask(__name__)

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

if __name__ == "__main__":
    app.run(debug=True)
