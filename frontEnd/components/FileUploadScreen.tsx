'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, FileText, Video } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'

export default function FileUploadScreen() {
  const [file, setFile] = useState<File | null>(null)
  const [fileContent, setFileContent] = useState('')
  const router = useRouter()

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0]
    if (uploadedFile) {
      setFile(uploadedFile)
      const reader = new FileReader()
      reader.onload = (e) => {
        setFileContent(e.target?.result as string)
      }
      reader.readAsText(uploadedFile)
    }
  }

  const handleProceed = () => {
    router.push('/language-selection')
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
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Upload Your Content</h2>
          <div className="space-y-6">
            <div className="flex justify-center space-x-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  className="w-40 h-40 flex flex-col items-center justify-center text-gray-600 hover:text-gray-900 hover:border-gray-400 transition-all duration-300 ease-in-out"
                  onClick={() => document.getElementById('fileInput')?.click()}
                >
                  <FileText size={32} />
                  <span className="mt-2 text-sm">Upload Text</span>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  className="w-40 h-40 flex flex-col items-center justify-center text-gray-600 hover:text-gray-900 hover:border-gray-400 transition-all duration-300 ease-in-out"
                  onClick={() => document.getElementById('videoInput')?.click()}
                >
                  <Video size={32} />
                  <span className="mt-2 text-sm">Upload Video</span>
                </Button>
              </motion.div>
            </div>
            <input
              id="fileInput"
              type="file"
              accept=".txt,.doc,.docx"
              className="hidden"
              onChange={handleFileUpload}
            />
            <input
              id="videoInput"
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleFileUpload}
            />
            {file && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
              >
                <p className="text-sm font-medium text-gray-700">
                  File uploaded: {file.name}
                </p>
                <Textarea
                  value={fileContent}
                  onChange={(e) => setFileContent(e.target.value)}
                  placeholder="Edit your content here..."
                  className="premium-input min-h-[200px]"
                />
                <Button onClick={handleProceed} className="premium-button w-full">
                  Proceed
                </Button>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

