import asyncio
import json
from flask import Flask, jsonify, request
import os
from flask_cors import CORS
from dotenv import load_dotenv
from db import initialize_client, fetch_collection_data
from werkzeug.utils import secure_filename
from helpers.videoProcessor import VideoTranscriptionTranslator

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
        required_languages = {}
        required_languages_list = [
            item.strip() for item in request.form.get("required_languages").split(",")
        ]
        for i in required_languages_list:
            required_languages[i] = INDIAN_LANGUAGES[i]
        translator = VideoTranscriptionTranslator(GOOGLE_API_KEY)
        # check is the user inputted a text content/file
        final_resp = {}
        if isVideo == "true":
            file = request.files.getlist("files")
            filename = ""
            print(request.files, "....")
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
                    results = asyncio.run(
                        translator.process_video(video_path, required_languages)
                    )
                    final_resp["original_transcript"] = results["original_transcript"]

                    for language, data in results["translations"].items():
                        print(f"\n{language}:")
                        final_resp[language] = [
                            data["gemini_translation"],
                            data["metrics"]["bleu"],
                            data["metrics"]["rouge1"],
                            data["metrics"]["rouge2"],
                            data["metrics"]["rougeL"],
                            data["metrics"]["cosine_similarity_with_ground_truth"],
                        ]

                    if os.path.exists(video_path):
                        os.remove(video_path)
                    else:
                        print(f"File {video_path} does not exist.")
                except Exception as e:
                    print(f"An error occurred: {str(e)}")
                    return jsonify({"status": f"error encountered - {e}"})

            return jsonify({"data": final_resp, "status": "success"})
        else:
            print("not a video")
            content = request.form.get("content")
            results = asyncio.run(
                translator.translate_text_transcript(required_languages, content)
            )
            final_resp["original_transcript"] = results["original_transcript"]

            for language, data in results["translations"].items():
                print(f"\n{language}:")
                final_resp[language] = [
                    data["gemini_translation"],
                    data["metrics"]["bleu"],
                    data["metrics"]["rouge1"],
                    data["metrics"]["rouge2"],
                    data["metrics"]["rougeL"],
                    data["metrics"]["cosine_similarity_with_ground_truth"],
                ]

            return jsonify({"data": final_resp, "status": "success"})


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


if __name__ == "__main__":
    app.run(debug=True)
