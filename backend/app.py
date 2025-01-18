from flask import Flask
import os
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)
CORS(app)


@app.route("/health")
def health():
    return f"Yes healthy {os.getenv('SAMPLE')}!"


if __name__ == "__main__":
    app.run(debug=True)
