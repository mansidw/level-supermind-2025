from flask_cors import CORS
from dotenv import load_dotenv
from db import initialize_client
import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify
import bcrypt
import os
import jwt
import datetime

load_dotenv()
app = Flask(__name__)
CORS(app)

db = initialize_client()
print(f"Connected to Astra DB: {db.list_collection_names()}")


@app.route("/health")
def health():
    return f"Yes healthy {os.getenv('SAMPLE')}!"


# Route to insert a new user
@app.route('/insert_user', methods=['POST'])
def insert_user():
    try:
        # Get JSON data from request
        data = request.get_json()
        user_id = data.get('user_id')
        name = data.get("name")
        email = data.get("email")
        password = data.get("password")

        user = db["user"]
        
        # Validate required fields
        if not user_id or not name or not email or not password:
            return jsonify({"error": "name, email, and password are required"}), 400

        # Hash the password
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        
        user.insert_one({"user_id": user_id, "email": email, "name": name, "password": hashed_password})

        return jsonify({"message": "User inserted successfully", "email": email, "user_id": user_id }), 201

    except Exception as e:
        print(f"Error inserting user: {e}")
        return jsonify({"error": str(e)}), 500


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    
    if not all(k in data for k in ['email', 'password']):
        return jsonify({'message': 'Missing required fields'}), 400
    
    # Get user from database
    user = db['user']
    result = user.find_one({'email': email})
    
    if not result or not bcrypt.checkpw(password.encode('utf-8'), result['password'].encode('utf-8')):
        return jsonify({'message': 'Invalid credentials'}), 401
    
    # Generate JWT token
    token = jwt.encode({
        'email': result['email'],
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    },  os.getenv("APP_SECRET_KEY"), algorithm="HS256")
    
    return jsonify({
        'message': 'Login successful',
        'token': token,
        'email': email,
        'user_id': result['user_id']
    }), 200

if __name__ == "__main__":
    app.run(debug=True)
