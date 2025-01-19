# Blog Application

This project is a blog application with a unique twist. Users can upload text/doc files or video files, translate the content into multiple languages, and manage their blogs through a dashboard.

## Features

- Upload text/doc files or video files.
- Edit the uploaded text.
- Translate the text into multiple languages.
- Publish and manage blogs.
- View all blogs in a dashboard.
- Update, delete, and unpublish blogs.
- Generate URLs for published blogs.


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
- Automatically converts video speech to text in English using advanced AI Speech-to-Text models such as Google Speech-to-Text or AWS Transcribe.
- Provides an intuitive interface for users to review and edit the transcription before proceeding to translation.

### Translation (For Text or Transcribed Content)
- Translates English content into 10 regional Indian languages:
  - **Hindi, Marathi, Gujarati, Tamil, Kannada, Telugu, Bengali, Malayalam, Punjabi, and Odia**.
- Uses advanced NLP models such as AWS Translate, Google Cloud Translation, or OpenAI to ensure high-quality translations.
- Displays translation accuracy metrics (e.g., BLEU or ROUGE scores) for user transparency.

### Blog Publishing
- Converts translations into blog-ready formats for each language.
- Generates SEO-optimized content with:
  - Unique URLs for each language version (e.g., `/blog-title-hindi`, `/blog-title-tamil`).
  - Metadata, structured data, and language tags for improved search engine indexing.
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

5. **Usability**:
   - Deliver a seamless workflow with an intuitive user interface and minimal errors.



## Screens and Components

### 1. Upload Screen

- **Options**: Upload a text/doc file or a video file.
- **Text File Upload**: Read text from the uploaded file and display it in a textarea for editing.
- **Proceed Button**: Navigate to the language selection screen.

### 2. Language Selection Screen

- **Checkbox List**: Select languages from [Hindi, Marathi, Gujarati, Tamil, Kannada, Telugu, Bengali, Malayalam, Punjabi, Odia].
- **Translate Button**: Make a backend API call to translate the text.
- **Accordion List**: Display the selected languages with loading text. Show the translated text and a "Publish" button once translation is complete.

### 3. Dashboard

- **Manage Blogs**: Display all translated and English versions of the blogs.
- **Options**: Update text, delete the blog, unpublish the blog.
- **Published Blogs**: Generate URLs to view the blogs.

## How to Run

1. Clone the repository.
2. Install the required dependencies.
3. Set up the environment variables.
4. Run the backend server.
5. Open the frontend application.



## Technologies Used

- Astra DB
- Langflow
- OpenAI
- Gemini
- Google Generative AI
- Google Translate 
- Flask
- NextJS
