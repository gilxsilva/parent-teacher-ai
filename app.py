from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from openai import OpenAI
import os
import pandas as pd
from flask_cors import CORS
from dotenv import load_dotenv

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///messages.db"
db = SQLAlchemy(app)
CORS(app)

# Load API Key
load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key)

# Database Model
class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    parent_name = db.Column(db.String(100), nullable=False)
    student_name = db.Column(db.String(100), nullable=False)
    summary = db.Column(db.Text, nullable=False)
    date_created = db.Column(db.DateTime, default=db.func.current_timestamp())

# **Fix: Use application context to initialize the database**
with app.app_context():
    db.create_all()

# Route to send feedback to parent
@app.route("/send-feedback", methods=["POST"])
def send_feedback():
    data = request.json
    parent_name = data.get("parent_name", "Parent")
    summary = data.get("summary", "")

    # Store the feedback as finalized
    new_message = Message(parent_name=parent_name, student_name="Student", summary=summary)
    db.session.add(new_message)
    db.session.commit()

    return jsonify({"message": "Feedback sent successfully!"})

# 📌 **Single Student Feedback Generation**
@app.route("/generate-summary", methods=["POST"])
def generate_summary():
    data = request.json
    performance = data.get("performance", "")
    
    # Simulate AI summary generation
    summary = f"It sounds like you're trying to convey that {performance}. If you need to expand on this, let me know!"

    # DO NOT SAVE TO DATABASE HERE
    return jsonify({"summary": summary})
@app.route("/generate-summary", methods=["POST"])

# 📌 **Bulk Upload for Multiple Students**
@app.route("/bulk-upload", methods=["POST"])
def bulk_upload():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    try:
        df = pd.read_csv(file)

        if "Parent Name" not in df.columns or "Student Name" not in df.columns or "Performance" not in df.columns:
            return jsonify({"error": "CSV must have columns: 'Parent Name', 'Student Name', 'Performance'"}), 400

        responses = []
        for index, row in df.iterrows():
            parent_name = row["Parent Name"]
            student_name = row["Student Name"]
            performance = row["Performance"]

            completion = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": performance}]
            )

            summary = completion.choices[0].message.content

            new_message = Message(parent_name=parent_name, student_name=student_name, summary=summary)
            db.session.add(new_message)

            responses.append({"student_name": student_name, "summary": summary})

        db.session.commit()
        return jsonify({"message": "Bulk upload successful!", "responses": responses})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 📌 **Retrieve Parent Summaries**
@app.route("/get-summaries", methods=["GET"])
def get_summaries():
    parent_name = request.args.get("parent_name")
    messages = Message.query.filter_by(parent_name=parent_name).all()
    return jsonify([
        {"student_name": msg.student_name, "summary": msg.summary, "date": msg.date_created} 
        for msg in messages
    ])

if __name__ == "__main__":
    app.run(debug=True)
