# BhashaBandhu

Deployed Web App Link - https://level-supermind-2025-ioflbrm3v.vercel.app/
Yoitube Video Link (Architecture Explaination) - https://www.youtube.com/watch?v=5twHz0jkyp4

This project is a blog application with a unique twist. Users can upload text/doc files or video files, translate the content into multiple languages, and manage their blogs through a dashboard.

## Features

### Input Options
- **Text Input**:
  - Users can directly input text into the platform.
  - Option to upload text files in supported formats (e.g., .txt, .docx).

- **Video Input**:
  - Users can upload video files in popular formats (e.g., .mp4, .mov).
  - The system transcribes video content into English text using AI-powered Speech-to-Text models.
  - Transcription results are displayed for user review and editing.

### Transcription (For Video Content)
- Automatically converts video speech to text in English using advanced AI Speech-to-Text models such as AWS Transcribe.
- Provides an intuitive interface for users to review and edit the transcription before proceeding to translation.

### Translation (For Text or Transcribed Content)
- Translates English content into 10 regional Indian languages:
  - **Hindi, Marathi, Gujarati, Tamil, Kannada, Telugu, Bengali, Malayalam, Punjabi, and Odia**.
- Uses advanced NLP models in Google Cloud Translation and OpenAI to ensure high-quality translations.
- Displays translation accuracy metrics (e.g., BLEU or ROUGE scores) for user transparency.

### Blog Publishing
- Converts translations into blog-ready formats for each language.
- Generates SEO-optimized labels, url and metadata for each blobs using Langflow Workflows.
- Allows users to review and edit blog drafts before publishing.

### Dynamic Routing & SEO Indexing
- Implements dynamic routing to create language-specific URLs for translated blogs.
- Optimized for search engines with:
  - Fast page loading.
  - Proper indexing for multilingual blogs.
  - Language-specific SEO metadata.

### Server-Side Rendering (SSR)
- Ensures fast page loads and better SEO performance.
- Provides seamless accessibility across devices and networks.

### Dashboard Features
- **User-Friendly Interface**:
  - Upload and manage text and video inputs easily.
  - Review and edit transcriptions and translations.
  - Manage published blogs (edit, delete, or update).

- **Translation Metrics**:
  - Display BLEU/ROUGE accuracy scores for each translated language.

- **Blog Analytics**:
  - Track blog performance metrics such as views, engagement, language-based readership, and average session duration.

### Blog Portal
- A dedicated section for browsing published blogs.
- Supports categories, tags, and filters for easy content discovery.
- Multilingual support allows readers to select their preferred language for viewing blogs.

### Success Metrics
1. **Accuracy**:
   - Ensure translation accuracy of ≥ 85% for all supported languages.

2. **Processing Time**:
   - Complete transcription and translation within ≤ 10 seconds per language.

3. **Coverage**:
   - Support for all 10 regional Indian languages.

4. **Engagement**:
   - Measure blog engagement via analytics like unique visitors, language-based readership, and average session duration.

## Langflow and Astra DB

Snapshot of Our Langflow Workflow for translations

![WhatsApp Image 2025-01-19 at 7 36 45 AM (1)](https://github.com/user-attachments/assets/6f104916-6da9-4c84-a077-ec34ef3df981)

Snapshot of blog table of our Database in Astra DB

<img width="956" alt="astraDB" src="https://github.com/user-attachments/assets/e1cc6c9b-471f-4c52-8616-871a01526c90" />

## Screens and Components

### 1. Upload Screen

- **Options**: Upload a text/doc file or a video file.
- **Text File Upload**: Read text from the uploaded file and display it in a textarea for editing.
- **Proceed Button**: Navigate to the language selection screen.

- <img width="959" alt="Screenshot 2025-01-19 074817" src="https://github.com/user-attachments/assets/7e853cf1-2dcb-4ab0-9a39-e4a5d3ea4a58" />


### 2. Language Selection Screen

- **Checkbox List**: Select languages from [Hindi, Marathi, Gujarati, Tamil, Kannada, Telugu, Bengali, Malayalam, Punjabi, Odia].
- **Translate Button**: Make a backend API call to translate the text.
- **Accordion List**: Display the selected languages with loading text. Show the translated text and a "Publish" button once translation is complete.

<img width="960" alt="Screenshot 2025-01-19 075047" src="https://github.com/user-attachments/assets/533a4d4c-03a1-42c9-8ff2-9dd2625fb032" />

![WhatsApp Image 2025-01-19 at 7 58 38 AM](https://github.com/user-attachments/assets/5f9741a2-b261-4a6f-9267-5886dbb0d2aa)


### 3. Dashboard

- **Manage Blogs**: Display all translated and English versions of the blogs.
- **Options**: Update text, delete the blog, unpublish the blog.
- **Published Blogs**: Generate URLs to view the blogs.
![WhatsApp Image 2025-01-19 at 7 59 30 AM](https://github.com/user-attachments/assets/bc2225e8-38f2-4e2e-853c-573977618965)


![WhatsApp Image 2025-01-19 at 8 02 11 AM](https://github.com/user-attachments/assets/2e3ffe6c-c17c-4678-aeb9-99b084cf12dd)


## How to Run

#### 1. Clone the repository.
```
git clone https://github.com/mansidw/level-supermind-2025.git 
```

#### 2. Install the required dependencies.

For Frontend 

```
cd ./frontEnd

npm install
```

For Backend

```
cd ./backend

pip install -r requirements.txt
```
#### 3. Set up the environment variables.

For Frontend

```
NEXT_PUBLIC_BACKEND_URL = 'YOUR BACKEND URL'
```

For Backend

```
ASTRA_DB_TOKEN = 'YOUR TOKEN'
ASTRA_DB_ENDPOINT = 'YOUR TOKEN'
ASTRA_CLIENT_ID = 'YOUR TOKEN'
ASTRA_CLIENT_SECRET= 'YOUR TOKEN'
APP_SECRET_KEY = 'YOUR TOKEN'
GOOGLE_API_KEY = 'YOUR TOKEN'

```


#### 4. Run the backend server.
```
python app.py
```

#### 5. Open the frontend application.
```
npm run dev
```


## Technologies Used

- Astra DB
- Langflow
- OpenAI
- Gemini
- Google Generative AI
- Google Translate 
- Flask
- NextJS
