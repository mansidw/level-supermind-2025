import asyncio
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
from db import initialize_client, fetch_collection_data
from werkzeug.utils import secure_filename
from helpers.videoProcessor import VideoTranscriptionTranslator
from dotenv import load_dotenv
import bcrypt
import os
import jwt
import datetime
import uuid
from blog import insert_blog, get_user_blog

load_dotenv()
ALLOWED_EXTENSIONS = set(["mp4", "mov"])
UPLOAD_FOLDER = os.path.abspath(os.path.join(os.path.dirname(__file__), "temp"))
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
app = Flask(__name__)
CORS(app)

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config["MAX_CONTENT_LENGTH"] = 500 * 1000 * 1000  # 500 MB
app.config["CORS_HEADER"] = "application/json"

db = initialize_client()

INDIAN_LANGUAGES = {
    "Hindi": "hi",
    "Marathi": "mr",
    "Gujarati": "gu",
    "Tamil": "ta",
    "Kannada": "kn",
    "Telugu": "te",
    "Bengali": "bn",
    "Malayalam": "ml",
    "Punjabi": "pa",
    "Odia": "or",
}


def allowedFile(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route("/health")
def health():
    return f"Yes healthy {os.getenv('SAMPLE')}!"


@app.route("/process-data", methods=["POST"])
def processData():
    if request.method == "POST":
        isVideo = request.form.get("isVideo")
        content = request.form.get("content")
        email = request.form.get("email")

        required_languages = {}
        required_languages_list = [
            item.strip() for item in request.form.get("required_languages").split(",")
        ]
        for i in required_languages_list:
            required_languages[i] = INDIAN_LANGUAGES[i]

        translator = VideoTranscriptionTranslator(GOOGLE_API_KEY)
        # check is the user inputted a text content/file
        final_resp = {}
        rawInputId = str(uuid.uuid4())
        raw_input = db["raw_input"]

        translate = db["translate"]
        results = asyncio.run(
            translator.translate_text_transcript(required_languages, content)
        )
        final_resp["original_transcript"] = results["original_transcript"]

        raw_input.insert_one(
            {
                "id": rawInputId,
                "useremail": email,
                "content": content,
                "type": "video" if isVideo == "true" else "text",
            }
        )
        allTranslationIds = []
        for language, data in results["translations"].items():
            print(f"\n{language}:")
            translateId = str(uuid.uuid4())
            final_resp[language] = [
                data["gemini_translation"],
                data["metrics"]["bleu"],
                data["metrics"]["rouge1"],
                data["metrics"]["rouge2"],
                data["metrics"]["rougeL"],
                data["metrics"]["cosine_similarity_with_ground_truth"],
            ]
            translate.insert_one(
                {
                    "id": translateId,
                    "inpid": rawInputId,
                    "lang": language,
                    "content": data["gemini_translation"],
                    "bleuscore": data["metrics"]["bleu"],
                    "rouge1": data["metrics"]["rouge1"],
                    "rouge2": data["metrics"]["rouge2"],
                    "rougel": data["metrics"]["rougeL"],
                    "cosinesimilarity": data["metrics"][
                        "cosine_similarity_with_ground_truth"
                    ],
                }
            )
            allTranslationIds.append(translateId)

        return jsonify(
            {
                "data": final_resp,
                "status": "success",
                "rawInputId": rawInputId,
                "translateId": allTranslationIds,
            }
        )


@app.route("/transcribe-video", methods=["POST"])
def transcribeVideo():
    if request.method == "POST":
        translator = VideoTranscriptionTranslator(GOOGLE_API_KEY)
        file = request.files.getlist("files")
        filename = ""
        print(request.files, "....")
        transcript = ""
        for f in file:
            print(f.filename)
            filename = secure_filename(f.filename)
            print(allowedFile(filename))
            if allowedFile(filename):
                f.save(os.path.join(app.config["UPLOAD_FOLDER"], filename))
            else:
                return jsonify({"message": "File type not allowed"}), 400
            video_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
            print(video_path)
            try:
                audio_path = translator.extract_audio(video_path)
                transcript = translator.transcribe_audio(audio_path)

                os.remove(audio_path)
                if os.path.exists(video_path):
                    os.remove(video_path)
                else:
                    print(f"File {video_path} does not exist.")
            except Exception as e:
                print(f"An error occurred: {str(e)}")
                return jsonify({"status": f"error encountered - {e}"})

        return jsonify(
            {"data": transcript, "status": "successful in generating transcript"}
        )
    else:
        return jsonify({"status": "Method not allowed"})


# Route to insert a new user
@app.route("/insert_user", methods=["POST"])
def insert_user():
    try:
        # Get JSON data from request
        data = request.get_json()
        user_id = data.get("user_id")
        name = data.get("name")
        email = data.get("email")
        password = data.get("password")

        user = db["user"]

        # Validate required fields
        if not user_id or not name or not email or not password:
            return jsonify({"error": "name, email, and password are required"}), 400

        # Hash the password
        hashed_password = bcrypt.hashpw(
            password.encode("utf-8"), bcrypt.gensalt()
        ).decode("utf-8")

        user.insert_one(
            {
                "user_id": user_id,
                "email": email,
                "name": name,
                "password": hashed_password,
            }
        )

        return (
            jsonify(
                {
                    "message": "User inserted successfully",
                    "email": email,
                    "user_id": user_id,
                }
            ),
            201,
        )

    except Exception as e:
        print(f"Error inserting user: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not all(k in data for k in ["email", "password"]):
        return jsonify({"message": "Missing required fields"}), 400

    # Get user from database
    user = db["user"]
    result = user.find_one({"email": email})

    if not result or not bcrypt.checkpw(
        password.encode("utf-8"), result["password"].encode("utf-8")
    ):
        return jsonify({"message": "Invalid credentials"}), 401

    # Generate JWT token
    token = jwt.encode(
        {
            "email": result["email"],
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24),
        },
        os.getenv("APP_SECRET_KEY"),
        algorithm="HS256",
    )

    return (
        jsonify(
            {
                "message": "Login successful",
                "token": token,
                "email": email,
                "user_id": result["user_id"],
            }
        ),
        200,
    )

@app.route('/insertBlog', methods=['POST'])
def insertBlog():
    return insert_blog(request)

@app.route('/fetchUserBlogs', methods=['POST'])
def fetchUserBlogs():
    return get_user_blog(request)

@app.route("/get-translated", methods=["GET"])
def getTranslatedData():
    data = request.get_json()
    id = data.get("id")

    # Get user from database
    translate = db["translate"]
    result = translate.find_one({"id": id})

    if not result:
        return jsonify({"message": "Entry not found"}), 400

    return (
        jsonify({"data": result, "status": "success"}),
        200,
    )


if __name__ == "__main__":
    app.run(debug=True)
