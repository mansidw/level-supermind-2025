'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input'

interface TranslationMetrics {
  [key: string]: [
    string,    // translated text
    number,    // BLEU score
    number,    // ROUGE-1 score
    number,    // ROUGE-2 score
    number,    // ROUGE-L score
    number     // Cosine Similarity
  ];
}

interface TranslationResponse {
  data: {
    [key: string]: any[];
    original_transcript: any[];
  };
  rawInputId: string;
  status: string;
  translateId: string[];
}

export default function TranslationScreen() {
  const [translations, setTranslations] = useState<TranslationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [publishingLanguages, setPublishingLanguages] = useState<string[]>([]); // New state for tracking publishing status
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [inputTitle, setInputTitle] = useState('');
  const [isPublishDisabled, setIsPublishDisabled] = useState<string[]>([]);

  const translateText = async (languages: string[]) => {
    try {
      setError(null);
      const formData = new FormData();
      formData.append('isVideo', 'false');
      formData.append('required_languages', languages.join(','));
      formData.append('content', localStorage.getItem('lang_text') || '');
      formData.append('email', localStorage.getItem('email') || '');

      const response = await axios.post<TranslationResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/process-data`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.status !== 'success') {
        throw new Error('Translation failed');
      }

      return response.data;
    } catch (error) {
      console.error('Translation error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred during translation');
      return null;
    }
  };

  useEffect(() => {
    const selectedLanguagesParam = searchParams.get('selectedLanguages');
    const languages = selectedLanguagesParam
      ? selectedLanguagesParam.split(',')
      : [];

    const fetchTranslations = async () => {
      setIsLoading(true);
      const response = await translateText(languages);
      if (response) {
        setTranslations(response);
      }
      setIsLoading(false);
    };

    if (languages.length > 0) {
      fetchTranslations();
    }
  }, [searchParams]);

  const handlePublish = async (language: string, translatedText: String) => {
    setPublishingLanguages(current => [...current, language]); // Add language to publishing state
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/insertBlog`, {
        email: localStorage.getItem('email'),
        blog_id: translations?.rawInputId,
        blogText: translatedText,
        blogTitle: inputTitle,
        publish: true,
        language: language
      });
      setIsPublishDisabled(current => [...current, language]);
      alert(`${inputTitle} Published Successfully in ${language}`);
    } catch (error) {
      alert('Failed to publish. Please try again.');
    } finally {
      setPublishingLanguages(current => current.filter(lang => lang !== language)); // Remove language from publishing state
    }
  };

  const handleViewDashboard = () => {
    router.push('/dashboard');
  };

  const getMetricLabel = (index: number) => {
    const labels = [
      'Bleu Score',
      'Rouge1 Score',
      'Rouge2 Score',
      'RougeL Score',
      'Cosine Similarity'
    ];
    return labels[index - 1] || `Metric ${index}`;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="mt-4 text-gray-600">Translating content...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto mt-20"
    >
      <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
        <CardContent className="p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Translation Progress</h2>
          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}
          <Input
            id="email"
            type="email"
            value={inputTitle}
            onChange={(e) => setInputTitle(e.target.value)}
            required
            className="premium-input mt-1 mb-5"
            disabled={isLoading}
          />
          {translations?.data.original_transcript && (
            <div className="mb-6 p-4 bg-gray-50 rounded-md">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Original Text:</h3>
              <p className="text-gray-900">{translations.data.original_transcript}</p>
            </div>
          )}

          <Accordion type="single" collapsible className="w-full">
            {translations && Object.entries(translations.data)
              .filter(([key]) => key !== 'original_transcript')
              .map(([language, data], index) => (
                <motion.div
                  key={language}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <AccordionItem value={language}>
                    <AccordionTrigger className="text-lg font-medium text-gray-700 py-4 border-b">
                      <span className="flex items-center">
                        {language}
                      </span>
                      <Button
                        key={language}
                        disabled={isPublishDisabled.includes(language) || publishingLanguages.includes(language)}
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePublish(language, data[0]);
                        }}
                        className="ml-2 bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200"
                      >
                        {publishingLanguages.includes(language) ? (
                          <div className="flex items-center">
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Publishing...
                          </div>
                        ) : (
                          'Publish'
                        )}
                      </Button>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="p-4 bg-gray-50 rounded-md mt-2 space-y-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-2">Translation:</h3>
                          <textarea className="w-full p-5 text-gray-800" name="translated_text" id="translated_text" value={data[0]}></textarea>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          {data.slice(1).map((metric, idx) => (
                            <div
                              key={idx}
                              className="bg-white p-3 rounded-md shadow-sm hover:shadow-md transition-shadow duration-200"
                            >
                              <h4 className="text-sm font-medium text-gray-500">{getMetricLabel(idx + 1)}</h4>
                              <p className="text-lg font-semibold text-gray-900">
                                {(metric).toFixed(3)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
          </Accordion>

          <Button
            onClick={handleViewDashboard}
            className="premium-button w-full mt-6"
          >
            View Dashboard
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}