'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Edit2, Trash2, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent } from '@/components/ui/card'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'

// Sample function to fetch user's blogs
const fetchUserBlogs = async () => {
  // In a real application, this would be an API call
  return [
    {
      id: 1,
      title: 'My First Blog',
      content: 'This is the content of my first blog post.',
      languages: ['English', 'Hindi', 'Marathi'],
      published: true,
    },
    {
      id: 2,
      title: 'Travel Adventures',
      content: 'Exploring the world one step at a time.',
      languages: ['English', 'French', 'Spanish'],
      published: true,
    },
    {
      id: 3,
      title: 'Cooking Tips',
      content: 'Learn to cook like a pro with these simple tips.',
      languages: ['English', 'Italian', 'Japanese'],
      published: false,
    },
  ]
}

export default function Dashboard() {
  const [blogs, setBlogs] = useState<any[]>([])
  const [editingBlog, setEditingBlog] = useState<any | null>(null)

  useEffect(() => {
    const loadBlogs = async () => {
      const data = await fetchUserBlogs()
      setBlogs(data)
    }
    loadBlogs()
  }, [])

  const handleDelete = (id: number) => {
    setBlogs(blogs.filter(blog => blog.id !== id))
  }

  const handleTogglePublish = (id: number) => {
    setBlogs(blogs.map(blog =>
      blog.id === id ? { ...blog, published: !blog.published } : blog
    ))
  }

  const handleEdit = (blog: any) => {
    setEditingBlog(blog)
  }

  const handleUpdate = () => {
    if (editingBlog) {
      setBlogs(blogs.map(blog =>
        blog.id === editingBlog.id ? editingBlog : blog
      ))
      setEditingBlog(null)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto mt-20"
    >
      <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
        <CardContent className="p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Blog Dashboard</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-gray-700">Title</TableHead>
                <TableHead className="text-gray-700">Languages</TableHead>
                <TableHead className="text-gray-700">Status</TableHead>
                <TableHead className="text-gray-700">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blogs.map((blog, index) => (
                <motion.tr
                  key={blog.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <TableCell className="font-medium text-gray-900">{blog.title}</TableCell>
                  <TableCell className="text-gray-700">{blog.languages.join(', ')}</TableCell>
                  <TableCell>
                    {blog.published ? (
                      <span className="text-green-600 font-medium">Published</span>
                    ) : (
                      <span className="text-yellow-600 font-medium">Draft</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="icon" className="text-gray-700 hover:text-blue-600" onClick={() => handleEdit(blog)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(blog.id)}
                        className="text-gray-700 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleTogglePublish(blog.id)}
                        className="text-gray-700 hover:text-green-600"
                      >
                        {blog.published ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      {blog.published && (
                        <Link href={`/blog/${blog.id}`} passHref>
                          <Button variant="outline" size="sm" className="text-gray-700 hover:text-blue-600">
                            View
                          </Button>
                        </Link>
                      )}
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AnimatePresence>
        {editingBlog && (
          <Dialog open={!!editingBlog} onOpenChange={() => setEditingBlog(null)}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Blog Post</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="title" className="text-right">
                    Title
                  </label>
                  <Input
                    id="title"
                    value={editingBlog.title}
                    onChange={(e) => setEditingBlog({ ...editingBlog, title: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="content" className="text-right">
                    Content
                  </label>
                  <Textarea
                    id="content"
                    value={editingBlog.content}
                    onChange={(e) => setEditingBlog({ ...editingBlog, content: e.target.value })}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleUpdate}>Update</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

