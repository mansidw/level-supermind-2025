'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'

export default function BlogEditor({ blogId, language, content }: { blogId: number, language: string, content: string }) {
  const [editedContent, setEditedContent] = useState(content)

  const handleSave = () => {
    console.log(`Saving ${language} content for blog ${blogId}`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto mt-20"
    >
      <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-gray-50 border-b border-gray-200 p-6">
          <CardTitle className="text-2xl font-semibold text-gray-900">{`Editing ${language} Version`}</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="premium-input min-h-[300px] mb-4"
          />
          <Button
            onClick={handleSave}
            className="premium-button"
          >
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}

