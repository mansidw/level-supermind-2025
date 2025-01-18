import os
from moviepy import VideoFileClip
import speech_recognition as sr
from langchain_google_genai import ChatGoogleGenerativeAI
from pydub import AudioSegment
import tempfile
from nltk.translate.bleu_score import sentence_bleu
from rouge_score import rouge_scorer
import nltk
from googletrans import Translator
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

nltk.download("punkt")


class VideoTranscriptionTranslator:
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

    def __init__(self, google_api_key):
        """
        Initialize the translator with Google API key
        """
        os.environ["GOOGLE_API_KEY"] = google_api_key
        self.llm = ChatGoogleGenerativeAI(model="gemini-pro", temperature=0)
        self.recognizer = sr.Recognizer()
        self.scorer = rouge_scorer.RougeScorer(
            ["rouge1", "rouge2", "rougeL"], use_stemmer=True
        )
        self.google_translator = Translator()
        self.vectorizer = TfidfVectorizer()

    def extract_audio(self, video_path):
        """
        Extract audio from video file
        """
        print("Extracting audio from video...")
        video = VideoFileClip(video_path)

        temp_wav = tempfile.NamedTemporaryFile(suffix=".wav", delete=False)
        video.audio.write_audiofile(temp_wav.name)
        video.close()

        return temp_wav.name

    def transcribe_audio(self, audio_path):
        """
        Transcribe audio file to text
        """
        print("Transcribing audio...")
        audio = AudioSegment.from_wav(audio_path)

        chunk_length_ms = 30000  # 30 seconds
        chunks = [
            audio[i : i + chunk_length_ms]
            for i in range(0, len(audio), chunk_length_ms)
        ]

        full_transcript = ""

        for i, chunk in enumerate(chunks):
            chunk_path = f"temp_chunk_{i}.wav"
            chunk.export(chunk_path, format="wav")

            with sr.AudioFile(chunk_path) as source:
                audio_data = self.recognizer.record(source)
                try:
                    text = self.recognizer.recognize_google(audio_data)
                    full_transcript += " " + text
                except sr.UnknownValueError:
                    print(f"Could not understand audio in chunk {i}")
                except sr.RequestError as e:
                    print(
                        f"Could not request results from speech recognition service in chunk {i}; {e}"
                    )

            os.remove(chunk_path)

        return full_transcript.strip()

    async def get_google_translate_ground_truth(self, text, target_language_code):
        """
        Get ground truth translation using Google Translate
        """
        try:
            translation = await self.google_translator.translate(
                text, dest=target_language_code
            )
            return translation.text
        except Exception as e:
            print(f"Error in Google Translate: {e}")
            return None

    def calculate_cosine_similarity(self, text1, text2):
        """
        Calculate cosine similarity between two texts using character-level n-grams
        for better handling of non-English text
        """
        try:
            # Convert texts to lowercase for better comparison
            text1 = text1.lower()
            text2 = text2.lower()

            # Create character-level n-grams (3-grams) for better comparison of non-English text
            vectorizer = TfidfVectorizer(analyzer="char", ngram_range=(3, 3))

            # Fit and transform the texts
            tfidf_matrix = vectorizer.fit_transform([text1, text2])

            # Calculate cosine similarity
            similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
            return similarity
        except Exception as e:
            print(f"Error calculating cosine similarity: {e}")
            return 0.0

    def translate_text(self, text, target_language):
        """
        Translate text using Gemini
        """
        print(f"Translating text to {target_language}...")
        prompt = f"""
        Translate the following text to {target_language}:

        {text}

        Provide only the translation without any additional comments.
        """

        response = self.llm.invoke(prompt)
        return response.content

    async def translate_to_english(self, text, source_language):
        """
        Translate text back to English for evaluation using Google Translate
        """
        try:
            translation = await self.google_translator.translate(
                text, src=self.INDIAN_LANGUAGES[source_language], dest="en"
            )
            return translation.text
        except Exception as e:
            print(f"Error in Google Translate (falling back to Gemini): {e}")
            # Fallback to Gemini
            prompt = f"""
            Translate the following {source_language} text to English:

            {text}

            Provide only the translation without any additional comments.
            """
            response = self.llm.invoke(prompt)
            return response.content

    async def calculate_metrics(
        self, original_text, translated_text, ground_truth_translation, language
    ):
        """
        Calculate BLEU, ROUGE scores, and cosine similarity for translations
        with improved BLEU calculation
        """
        # Translate back to English for comparison
        back_translation = await self.translate_to_english(translated_text, language)

        # Tokenize texts for BLEU score
        reference = nltk.word_tokenize(original_text.lower())
        candidate = nltk.word_tokenize(back_translation.lower())

        # Calculate BLEU score with smoothing
        from nltk.translate.bleu_score import SmoothingFunction

        smoothie = SmoothingFunction().method1
        bleu_score = sentence_bleu(
            [reference],
            candidate,
            weights=(0.25, 0.25, 0.25, 0.25),  # Equal weights for 1-4 grams
            smoothing_function=smoothie,
        )

        # Calculate ROUGE scores
        rouge_scores = self.scorer.score(original_text, back_translation)

        # Calculate cosine similarity between translated texts
        cosine_sim = self.calculate_cosine_similarity(
            translated_text, ground_truth_translation
        )

        return {
            "bleu": bleu_score,
            "rouge1": rouge_scores["rouge1"].fmeasure,
            "rouge2": rouge_scores["rouge2"].fmeasure,
            "rougeL": rouge_scores["rougeL"].fmeasure,
            "cosine_similarity_with_ground_truth": cosine_sim,
        }

    async def process_video(self, video_path, required_languages):
        """
        Process video with improved error handling and progress reporting
        """
        try:
            # Extract audio
            audio_path = self.extract_audio(video_path)

            # Transcribe audio
            transcript = self.transcribe_audio(audio_path)

            # Clean up temporary audio file
            os.remove(audio_path)

            results = {"original_transcript": transcript, "translations": {}}

            # Translate to all Indian languages and calculate metrics
            print("yaha tak")
            total_languages = len(required_languages)
            for idx, (language, lang_code) in enumerate(required_languages.items(), 1):
                print(f"\nProcessing {language} ({idx}/{total_languages})...")

                # Get Gemini translation
                gemini_translation = self.translate_text(transcript, language)

                # Get Google Translate ground truth (awaited)
                ground_truth = await self.get_google_translate_ground_truth(
                    transcript, lang_code
                )

                if ground_truth is None:
                    print(
                        f"Warning: Could not get ground truth translation for {language}"
                    )
                    continue

                # Calculate metrics
                metrics = await self.calculate_metrics(
                    transcript, gemini_translation, ground_truth, language
                )

                results["translations"][language] = {
                    "gemini_translation": gemini_translation,
                    "google_translation": ground_truth,
                    "metrics": metrics,
                }

            return results

        except Exception as e:
            print(f"Error processing video: {str(e)}")
            raise

    async def translate_text_transcript(self, required_languages, transcript):
        try:
            results = {"original_transcript": transcript, "translations": {}}
            total_languages = len(required_languages)
            for idx, (language, lang_code) in enumerate(required_languages.items(), 1):
                print(f"\nProcessing {language} ({idx}/{total_languages})...")

                # Get Gemini translation
                gemini_translation = self.translate_text(transcript, language)

                # Get Google Translate ground truth (awaited)
                ground_truth = await self.get_google_translate_ground_truth(
                    transcript, lang_code
                )

                if ground_truth is None:
                    print(
                        f"Warning: Could not get ground truth translation for {language}"
                    )
                    continue

                # Calculate metrics
                metrics = await self.calculate_metrics(
                    transcript, gemini_translation, ground_truth, language
                )

                results["translations"][language] = {
                    "gemini_translation": gemini_translation,
                    "google_translation": ground_truth,
                    "metrics": metrics,
                }

            return results
        except Exception as e:
            print(f"Error processing video: {str(e)}")
            raise
