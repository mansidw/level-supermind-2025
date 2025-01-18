'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'

// Sample function to fetch blog data
const fetchBlogData = async (id: string) => {
  // In a real application, this would be an API call
  return {
    title: 'Sample Blog Post',
    author: 'John Doe',
    date: '2023-06-01',
    content: 'This is a sample blog post content. It would be much longer in a real application.',
    language: 'English'
  }
}

export default function ViewBlog() {
  const [blog, setBlog] = useState<any>(null)
  const params = useParams()
  const id = params.id as string

  useEffect(() => {
    const loadBlog = async () => {
      const data = await fetchBlogData(id)
      setBlog(data)
    }
    loadBlog()
  }, [id])

  if (!blog) {
    return <div>Loading...</div>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto mt-20"
    >
      <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-gray-50 border-b border-gray-200 p-6">
          <CardTitle className="text-3xl font-semibold text-gray-900">{blog.title}</CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            By {blog.author} | {blog.date} | {blog.language}
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="prose max-w-none">
            {blog.content}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

