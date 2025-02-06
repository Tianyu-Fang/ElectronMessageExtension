from flask import Flask, request, jsonify
from openai import OpenAI
import os
from dotenv import load_dotenv
from flask_cors import CORS


# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return jsonify({"message": "Flask server is running!"})
# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def generate_polite_response(user_input, content_type, recipient_type, num_responses=1):
    """Generate polite responses based on user input."""
    format_rules = {
        "Professor": {
            "Text": "Formal but friendly message with proper salutations.",
            "Email": "Professional email format with a formal closing."
        },
        "Classmate": {
            "Text": "Casual, friendly tone with emojis if needed.",
            "Email": "Simple subject and informal greeting."
        }
    }

    system_prompt = f"""
    You are a communication assistant helping craft messages.
    Format it as:
    {format_rules[recipient_type][content_type]}

    Original message: "{user_input}"
    """

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": "Generate responses"}
        ],
        temperature=0.3,
        max_tokens=300
    )

    return response.choices[0].message.content

@app.route("/generate", methods=["POST"])
def generate():
    """Generate an improved message based on user input."""
    data = request.json
    user_input = data.get("message")
    content_type = data.get("contentType", "Text")
    recipient_type = data.get("recipientType", "Professor")

    if not user_input:
        return jsonify({"error": "Message input is required"}), 400

    prompt = f"""
    You are an AI assistant. Rewrite this message to improve its clarity:
    - Recipient: {recipient_type}
    - Format: {content_type}
    
    Original message: "{user_input}"
    """

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "system", "content": prompt}],
        temperature=0.5,
        max_tokens=200
    )

    return jsonify({"response": response.choices[0].message.content})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
