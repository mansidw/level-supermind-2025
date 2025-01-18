from flask import Flask
import os
from flask_cors import CORS
from dotenv import load_dotenv
from db import initialize_client

load_dotenv()
app = Flask(__name__)
CORS(app)

db = initialize_client()
print(f"Connected to Astra DB: {db.list_collection_names()}")


@app.route("/health")
def health():
    return f"Yes healthy {os.getenv('SAMPLE')}!"


if __name__ == "__main__":
    app.run(debug=True)
