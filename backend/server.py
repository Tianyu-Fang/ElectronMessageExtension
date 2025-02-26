from flask import Flask, request, jsonify
import openai
import os
from dotenv import load_dotenv
from flask_cors import CORS

# Load environment variables from .env file
load_dotenv()

# Initialize OpenAI client
client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# --- Message Generation Endpoint ---
@app.route("/api/generate", methods=["POST"])
def generate_messages():
    data = request.json
    user_input = data.get("message")
    content_type = data.get("contentType", "Text")
    recipient_type = data.get("recipientType", "Professor")
    num_responses = data.get("numResponses", 1)

    if not user_input:
        return jsonify({"error": "Message input is required"}), 400

    format_rules = {
        "Professor": {
            "Text": """Microsoft Teams Message Rules (Professor):
1. Formal but friendly tone
2. Use proper salutations (Professor LastName)
3. Stay strictly relevant to the original query
4. 10-35 words maximum
5. Output FROM STUDENT TO PROFESSOR""",
            
            "Email": """Outlook Email Rules (Professor):
1. Subject line matching message intent
2. Formal salutation (Dear Professor LastName)
3. Mirror the user's original request style
4. Professional closing (Sincerely/Respectfully)
5. Signature: [Full Name]"""
        },
        "Classmate": {
            "Text": """Microsoft Teams Message Rules (Classmate):
1. Casual friendly tone
2. Use first names only ([Name])
3. Match the user's message length/style
4. Can include emojis
5. 10-20 words maximum
Example: "Hey [Name], wanna grab coffee before class?""",
            
            "Email": """Email Rules (Classmate):
1. Simple subject line
2. Informal greeting (Hi [Name])
3. Mirror the user's original request
4. Direct request/question
5. Friendly sign-off (Cheers/Thanks)"""
        }
    }

    subject_line = "Subject: [Subject if email]\n\n" if content_type == "Email" else ""

    system_prompt = f"""
You are a communication assistant helping a student craft messages.
Create {num_responses} variations that adhere to the following guidelines:

{format_rules[recipient_type][content_type]}

**KEY REQUIREMENTS:**
1. **Preserve** the original message's intent exactly.
2. **Mirror** the user's writing style (formal/casual).
3. **Use Appropriate Placeholders**:
   - Professor emails: [Full Name]
   - Classmate texts: [Name]

**FORMAT FOR EACH VARIATION:**
Variation [N]:
{subject_line}[Message body]

---

Original message: "{user_input}"
"""

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": "Generate exact variations matching my message."}
            ],
            temperature=0.3,  # Lower temperature for more focused responses
            max_tokens=500
        )

        clean_responses = response.choices[0].message.content.split("\n\n")

        return jsonify({"responses": clean_responses})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- Message Analysis Endpoint ---
@app.route("/api/analyze", methods=["POST"])
def analyze_message():
    data = request.json
    message = data.get("message")

    if not message or len(message.strip()) < 10:
        return jsonify({"error": "Message input must be at least 10 characters long."}), 400

    analysis_prompt = f"""
Analyze this message:

"{message}"

Provide output in this EXACT format:

##EMOTION##
[primary emotion: happy/neutral/sad/angry/anxious]

##SOCIAL CUES##
- [cue 1: formality level]
- [cue 2: urgency level]
- [cue 3: relationship context]

##SUMMARY##
[1-sentence plain language summary]

##KEYWORDS##
[comma-separated important words]

##RESPONSES##
Positive: [positive response draft]
Neutral: [neutral response draft]
Negative: [negative response draft]
"""

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": analysis_prompt},
                {"role": "user", "content": "Analyze the message."}
            ],
            temperature=0.2,
            max_tokens=300
        )
        raw_analysis = response.choices[0].message.content
        analysis = parse_analysis(raw_analysis)
        return jsonify({"analysis": analysis})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def parse_analysis(raw_text):
    """Parse LLM response into structured data"""
    sections = {
        "emotion": "",
        "cues": [],
        "summary": "",
        "keywords": [],
        "responses": {}
    }
    
    current_section = None
    for line in raw_text.split('\n'):
        line = line.strip()
        if line.startswith("##EMOTION##"):
            current_section = "emotion"
        elif line.startswith("##SOCIAL CUES##"):
            current_section = "cues"
        elif line.startswith("##SUMMARY##"):
            current_section = "summary"
        elif line.startswith("##KEYWORDS##"):
            current_section = "keywords"
        elif line.startswith("##RESPONSES##"):
            current_section = "responses"
        elif current_section == "emotion" and line:
            sections["emotion"] = line.split(":")[-1].strip().lower()
        elif current_section == "cues" and line.startswith("-"):
            sections["cues"].append(line[1:].strip())
        elif current_section == "summary" and line:
            sections["summary"] = line
        elif current_section == "keywords" and line:
            sections["keywords"] = [kw.strip() for kw in line.split(",")]
        elif current_section == "responses" and ":" in line:
            tone, text = line.split(":", 1)
            sections["responses"][tone.strip().lower()] = text.strip()
    
    return sections

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
