'use client';

import TranslationScreen from '@/components/TranslationScreen'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Translation() {
  const router = useRouter();
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

  useEffect(() => {
    // Access query parameters from window.location.search
    const searchParams = new URLSearchParams(window.location.search);
    const languages = searchParams.get('selectedLanguages');
    setSelectedLanguages(languages ? languages.split(',') : []);
  }, []); 

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
        Translation Progress
      </h1>
      <TranslationScreen />
    </main>
  )
}

