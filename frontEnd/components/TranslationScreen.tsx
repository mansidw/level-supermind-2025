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

// Sample function for translation API call
const translateText = async (text: string, language: string) => {
  try {
    const response = await axios.post('/api/translate', { text, language });
    return response.data.translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    return `Error translating to ${language}`;
  }
};

export default function TranslationScreen() {
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams(); // Next.js hook for accessing query params

  const originalText = 'This is the original text to be translated.';

  useEffect(() => {
    // Parse selectedLanguages from query params
    const selectedLanguagesParam = searchParams.get('selectedLanguages');
    const languages = selectedLanguagesParam
      ? selectedLanguagesParam.split(',')
      : [];
    setSelectedLanguages(languages);

    // Trigger translations for each selected language
    languages.forEach(async (language) => {
      setLoading((prev) => ({ ...prev, [language]: true }));
      const translatedText = await translateText(originalText, language);
      setTranslations((prev) => ({ ...prev, [language]: translatedText }));
      setLoading((prev) => ({ ...prev, [language]: false }));
    });
  }, [searchParams]); // Re-run effect when query parameters change

  const handlePublish = (language: string) => {
    console.log(`Publishing ${language} translation`);
  };

  const handleViewDashboard = () => {
    router.push('/dashboard');
  };

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
          <Accordion type="single" collapsible className="w-full">
            {selectedLanguages.map((language, index) => (
              <motion.div
                key={language}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <AccordionItem value={language}>
                  <AccordionTrigger className="text-lg font-medium text-gray-700 py-4 border-b">
                    {language}
                    {loading[language] ? (
                      <span className="text-sm font-normal text-gray-500 ml-2">
                        Translating...
                      </span>
                    ) : (
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePublish(language);
                        }}
                        className="ml-2 bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200"
                      >
                        Publish
                      </Button>
                    )}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="p-4 bg-gray-50 rounded-md mt-2">
                      {loading[language] ? (
                        <p className="text-gray-600">Translating...</p>
                      ) : (
                        <p className="text-gray-800">{translations[language]}</p>
                      )}
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
