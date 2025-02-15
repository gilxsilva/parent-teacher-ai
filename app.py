from flask import Flask, request, jsonify
from openai import OpenAI
import os
from dotenv import load_dotenv
from flask_cors import CORS  # Allows frontend requests

# Load environment variables
load_dotenv()

# Retrieve API key securely
api_key = os.getenv("OPENAI_API_KEY")

# Initialize OpenAI client
client = OpenAI(api_key=api_key)

# Create Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS so frontend can call backend

@app.route("/generate-summary", methods=["POST"])
def generate_summary():
    data = request.json
    performance_text = data.get("performance", "")

    if not performance_text:
        return jsonify({"error": "No performance text provided"}), 400

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": f"Summarize this student performance: {performance_text}"}]
        )

        summary = response.choices[0].message.content
        return jsonify({"summary": summary})

    except Exception as e:
        return jsonify({"error": str(e)}), 500  # Handle API errors gracefully

if __name__ == "__main__":
    app.run(debug=True)
