'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { Edit2, Trash2, Eye, EyeOff } from 'lucide-react'

// Import all UI components
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { motion, AnimatePresence } from 'framer-motion'

// API Functions
const fetchUserBlogs = async (email) => {
  try {
    const response = await axios.post('http://127.0.0.1:5000/fetchUserBlogs', {
      email: email
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching blogs:', error)
    throw error
  }
}

const fetchBlogContent = async (email, blogId, language) => {
  try {
    const response = await axios.post('http://127.0.0.1:5000/getBlog', {
      email: email,
      blog_id: blogId,
      language: language
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching blog content:', error)
    throw error
  }
}

const deleteBlog = async (blogId) => {
  try {
    const response = await axios.delete(`http://127.0.0.1:5000/deleteBlog/${blogId}`)
    return response.data
  } catch (error) {
    console.error('Error deleting blog:', error)
    throw error
  }
}

const updateBlog = async (blogId, blogData) => {
  try {
    const response = await axios.put(`http://127.0.0.1:5000/updateBlog/${blogId}`, blogData)
    return response.data
  } catch (error) {
    console.error('Error updating blog:', error)
    throw error
  }
}

const toggleBlogPublish = async (blogId) => {
  try {
    const response = await axios.post(`http://127.0.0.1:5000/togglePublish/${blogId}`)
    return response.data
  } catch (error) {
    console.error('Error toggling blog publish status:', error)
    throw error
  }
}

export default function Dashboard() {
  // State Management
  const [blogs, setBlogs] = useState([])
  const [editingBlog, setEditingBlog] = useState(null)
  const [viewingBlog, setViewingBlog] = useState(null)
  const [selectedLanguage, setSelectedLanguage] = useState("")
  const [blogContent, setBlogContent] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingContent, setIsLoadingContent] = useState(false)
  const { toast } = useToast()
  
  // Replace with actual user email
  const userEmail = localStorage.getItem('email')
  // Initial Load
  useEffect(() => {
    const loadBlogs = async () => {
      try {
        setIsLoading(true)
        const data = await fetchUserBlogs(userEmail)
        setBlogs(data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load blogs. Please try again later.",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }
    loadBlogs()
  }, [])

  // Event Handlers
  const handleViewBlog = (blog) => {
    setViewingBlog(blog)
    setSelectedLanguage(blog.language[0])
    handleLanguageChange(blog.language[0], blog.blogId)
  }

  const handleLanguageChange = async (language, blogId) => {
    try {
      setIsLoadingContent(true)
      setSelectedLanguage(language)
      const content = await fetchBlogContent(userEmail, blogId, language)
      setBlogContent(content)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load blog content",
        variant: "destructive"
      })
    } finally {
      setIsLoadingContent(false)
    }
  }

  const handleDelete = async (blogId) => {
    try {
      await deleteBlog(blogId)
      setBlogs(blogs.filter(blog => blog.blogId !== blogId))
      toast({
        title: "Success",
        description: "Blog deleted successfully"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete blog",
        variant: "destructive"
      })
    }
  }

  const handleTogglePublish = async (blogId) => {
    try {
      await toggleBlogPublish(blogId)
      setBlogs(blogs.map(blog =>
        blog.blogId === blogId ? { ...blog, published: !blog.published } : blog
      ))
      toast({
        title: "Success",
        description: "Blog status updated successfully"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update blog status",
        variant: "destructive"
      })
    }
  }

  const handleEdit = (blog) => {
    setEditingBlog(blog)
  }

  const handleUpdate = async () => {
    if (editingBlog) {
      try {
        await updateBlog(editingBlog.blogId, editingBlog)
        setBlogs(blogs.map(blog =>
          blog.blogId === editingBlog.blogId ? editingBlog : blog
        ))
        setEditingBlog(null)
        toast({
          title: "Success",
          description: "Blog updated successfully"
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update blog",
          variant: "destructive"
        })
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto mt-20 px-4"
    >
      <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
        <CardContent className="p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Blog Dashboard</h2>
          {isLoading ? (
            <div className="text-center py-8">Loading blogs...</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-700">Title</TableHead>
                    <TableHead className="text-gray-700">Languages</TableHead>
                    <TableHead className="text-gray-700">Labels</TableHead>
                    <TableHead className="text-gray-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {blogs.map((blog, index) => (
                    <motion.tr
                      key={blog.blogId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <TableCell className="font-medium text-gray-900">{blog.blogTitle}</TableCell>
                      <TableCell className="text-gray-700">{blog.language.join(', ')}</TableCell>
                      <TableCell className="text-gray-700">
                        <div className="flex flex-wrap gap-1">
                          {blog.label.filter(label => label).map((label, i) => (
                            <span key={i} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                              {label}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="text-gray-700 hover:text-blue-600"
                            onClick={() => handleEdit(blog)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDelete(blog.blogId)}
                            className="text-gray-700 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleTogglePublish(blog.blogId)}
                            className="text-gray-700 hover:text-green-600"
                          >
                            {blog.published ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-gray-700 hover:text-blue-600"
                            onClick={() => handleViewBlog(blog)}
                          >
                            View
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
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
                    value={editingBlog.blogTitle}
                    onChange={(e) => setEditingBlog({ ...editingBlog, blogTitle: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="content" className="text-right">
                    Content
                  </label>
                  <Textarea
                    id="content"
                    value={editingBlog.blogText}
                    onChange={(e) => setEditingBlog({ ...editingBlog, blogText: e.target.value })}
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

      {/* View Blog Dialog */}
      <AnimatePresence>
        {viewingBlog && (
          <Dialog open={!!viewingBlog} onOpenChange={() => {
            setViewingBlog(null)
            setBlogContent(null)
            setSelectedLanguage("")
          }}>
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle>{blogContent?.blogtitle || viewingBlog.blogTitle}</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <div className="mb-4">
                  <label className="text-sm font-medium mb-2 block">
                    Select Language
                  </label>
                  <Select
                    value={selectedLanguage}
                    onValueChange={(value) => handleLanguageChange(value, viewingBlog.blogId)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a language" />
                    </SelectTrigger>
                    <SelectContent>
                      {viewingBlog.language.map((lang) => (
                        <SelectItem key={lang} value={lang}>
                          {lang.toUpperCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {isLoadingContent ? (
                  <div className="text-center py-4">Loading content...</div>
                ) : blogContent ? (
                  <div className="space-y-4">
                    <div className="prose max-w-none">
                      {blogContent.blogtext}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {blogContent.labels.filter(label => label).map((label, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          {label}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">Select a language to view content</div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setViewingBlog(null)
                  setBlogContent(null)
                  setSelectedLanguage("")
                }}>
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </motion.div>
  )
}