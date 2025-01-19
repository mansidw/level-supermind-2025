'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, FileText, Video } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'
import axios from 'axios'

export default function FileUploadScreen() {
  const [file, setFile] = useState<File | null>(null)
  const [fileContent, setFileContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0]
    if (!uploadedFile) return

    setFile(uploadedFile)
    setError('')
    
    if (uploadedFile.type.startsWith('video/')) {
      // Handle video file
      setIsLoading(true)
      try {
        const formData = new FormData()
        console.log("Uploaded file: ", uploadedFile)
        // The field name must match what your backend expects: "files"
        formData.append('files', uploadedFile)
        
        const response = await axios.post(`${NEXT_PUBLIC_BACKEND_URL}/transcribe-video`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          // Add these options to handle larger files
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
        })
        
        if (response.data.data) {
          setFileContent(response.data.data)
          localStorage.setItem('lang_text', response.data.data)
        } else if (response.data.status.includes('error')) {
          throw new Error(response.data.status)
        } else {
          throw new Error('Transcription failed')
        }
      } catch (err: any) {
        setError(err.message || 'Failed to transcribe video. Please try again.')
        console.error('Transcription error:', err)
      } finally {
        setIsLoading(false)
      }
    } else {
      // Handle text file
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setFileContent(content)
        localStorage.setItem('lang_text', content)
      }
      reader.onerror = () => {
        setError('Failed to read file. Please try again.')
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
                  disabled={isLoading}
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
                  disabled={isLoading}
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
            {isLoading && (
              <div className="text-center text-gray-600">
                <p>Transcribing video... Please wait...</p>
                <p className="text-sm text-gray-500">This may take a few minutes depending on the video length</p>
              </div>
            )}
            {error && (
              <div className="text-center text-red-600">
                {error}
              </div>
            )}
            {file && !isLoading && (
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
                <Button 
                  onClick={handleProceed} 
                  className="premium-button w-full"
                  disabled={!fileContent}
                >
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