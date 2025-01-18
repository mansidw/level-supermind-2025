'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'

const translateText = async (language: string) => {
  await new Promise(resolve => setTimeout(resolve, Math.random() * 3000 + 1000))
  return `Translated text for ${language}`
}

export default function TranslationScreen() {
  const [translations, setTranslations] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const router = useRouter()

  const selectedLanguages = ['Hindi', 'Marathi', 'Gujarati']

  useEffect(() => {
    selectedLanguages.forEach(async (language) => {
      setLoading(prev => ({ ...prev, [language]: true }))
      const translatedText = await translateText(language)
      setTranslations(prev => ({ ...prev, [language]: translatedText }))
      setLoading(prev => ({ ...prev, [language]: false }))
    })
  }, [])

  const handlePublish = (language: string) => {
    console.log(`Publishing ${language} translation`)
  }

  const handleViewDashboard = () => {
    router.push('/dashboard')
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
                          e.stopPropagation()
                          handlePublish(language)
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
  )
}

