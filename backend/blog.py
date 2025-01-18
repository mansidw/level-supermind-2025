from db import initialize_client
from flask import request, jsonify
import re
import unicodedata
import os
from langchain_google_genai import ChatGoogleGenerativeAI

db = initialize_client()

def url_generator(blogTitle):
    normalized_text = unicodedata.normalize('NFKD', blogTitle).encode('ascii', 'ignore').decode('ascii')
    seo_friendly_url = re.sub(r'[^a-zA-Z0-9]+', '-', normalized_text).strip('-').lower()
    return seo_friendly_url

def classify_blog_labels(blog_text: str):
    # Fetch the API key from the .env file
    api_key = os.getenv("GOOGLE_API_KEY")
    
    # Ensure the API key is available
    if not api_key:
        raise ValueError("API key not found in .env file.")

    # Initialize the Google Gemini model with the API key
    generative_ai = ChatGoogleGenerativeAI(model="gemini-pro", api_key=api_key)
    
    # Construct the prompt to classify the blog text
    prompt = f"Classify the following blog text into relevant categories or labels:\n\n{blog_text}. Donot send unwanted messages if you donot get any topic. Send one or maximum two words per item in the list."

    # Get the response from the model
    response = generative_ai.invoke(prompt)
    print(f"Response: {response}")

    # Extract the labels from the response (assuming the response object has a 'text' attribute)
    labels = response.content.strip() # Split based on commas
    labels = re.sub(r'[\*\n]+', ',', labels).strip(',').split(',')
    
    # Clean up whitespace and return labels as a list of strings
    labels = [label.strip() for label in labels]

    
    return labels

def insert_blog(req):
    try: 
        data = req.get_json()
        email = data.get('email')
        blog_id = data.get('blog_id')
        blogtext = data.get('blogText')
        blogtitle = data.get('blogTitle') 
        publish = True if data.get('publish') else False
        language = data.get('language')

        url = url_generator(blogtitle)
        labels = classify_blog_labels(blogtext)
        print(f"Labels: {labels}")
        
        blog = db["blog"]
        blog.insert_one({
            "email": email,
            "blog_id": blog_id,
            "url": url,
            "blogtext": blogtext,
            "blogtitle": blogtitle,
            "publish": publish,
            "language": language,
            "labels": labels
        })

        return jsonify({"message": "Blog inserted successfully", "email": email, "blog_id": blog_id }), 201

    except Exception as e:
        print(f"Error inserting blog: {e}")
        return jsonify({"error": str(e)}), 500

def transform_blogs(blog_list):
    transformed_blogs = {}

    for blog in blog_list:
        blog_id = blog["blog_id"]
        transformed_blog = {
            "label": blog["labels"],
            "blogText": blog["blogtext"],
            "blogTitle": blog["blogtitle"],
            "email": blog["email"],
            "blogId": blog_id,
            "language": [blog["language"]]
        }
        if blog_id not in transformed_blogs:
            transformed_blogs[blog_id] = transformed_blog
        else:
            transformed_blogs[blog_id][language].append(blog["language"])
    return transformed_blogs


def get_user_blog(req):
    try:
        data = req.get_json()
        email = data.get('email')

        blog = db["blog"]
        result = list(blog.find({"email": email}))  # Convert cursor to list


        transformed_blogs = transform_blogs(result)

        blogsValues= list(transformed_blogs.values())

        return jsonify(blogsValues), 200
    except Exception as e:
        print(f"Error getting blog: {e}")
        return jsonify({"error": str(e)}), 500

def get_blog(req):
    try:
        data = req.get_json()
        blog_id = data.get('blog_id')

        blog = db["blog"]
        result = blog.find_one({"blog_id": blog_id})

        return jsonify(result), 200
    except Exception as e:
        print(f"Error getting blog: {e}")
        return jsonify({"error": str(e)}), 500