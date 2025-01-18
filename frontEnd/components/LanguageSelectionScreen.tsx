'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'

const languages = [
  'Hindi', 'Marathi', 'Gujarati', 'Tamil', 'Kannada',
  'Telugu', 'Bengali', 'Malayalam', 'Punjabi', 'Odia'
]

export default function LanguageSelectionScreen() {
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])
  const router = useRouter()

  const handleLanguageToggle = (language: string) => {
    setSelectedLanguages(prev =>
      prev.includes(language)
        ? prev.filter(lang => lang !== language)
        : [...prev, language]
    )
  }

  const handleTranslate = () => {
    router.push('/translation')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto mt-20"
    >
      <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
        <CardContent className="p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Select Languages for Translation</h2>
          <div className="grid grid-cols-2 gap-4">
            {languages.map((language, index) => (
              <motion.div
                key={language}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <label
                  htmlFor={language}
                  className="flex items-center space-x-3 p-3 rounded-md border border-gray-200 cursor-pointer transition-all duration-300 ease-in-out hover:border-blue-500"
                >
                  <Checkbox
                    id={language}
                    checked={selectedLanguages.includes(language)}
                    onCheckedChange={() => handleLanguageToggle(language)}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {language}
                  </span>
                </label>
              </motion.div>
            ))}
          </div>
          {selectedLanguages.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Button
                onClick={handleTranslate}
                className="premium-button w-full mt-6"
              >
                Translate
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

