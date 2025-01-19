'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import Image from 'next/image'
import axios from 'axios'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/login`, {
        email,
        password
      })

      // Verify that the response contains the expected data
      if (response.data && response.data.token) {
        // Store the data safely
        if (typeof window !== 'undefined') {localStorage.setItem('token', response.data.token)}
        
        // Only store user_id if it exists and is valid
        if (response.data.user_id) {
          if (typeof window !== 'undefined') {localStorage.setItem('user_id', String(response.data.user_id))}
        }
        
        // Only store email if it exists
        if (response.data.email) {
          if (typeof window !== 'undefined') {localStorage.setItem('email', response.data.email)}
        }

        // Verify the data was stored correctly
        let storedToken:any = ""
        if (typeof window !== 'undefined') {storedToken=localStorage.getItem('token')}
        if (!storedToken) {
          throw new Error('Failed to store authentication data')
        }

        // Redirect to dashboard or home page
        router.push('/dashboard') // or wherever you want to redirect after login
      } else {
        throw new Error('Invalid response from server')
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'An error occurred during login. Please try again.'
      )
      
      // Clear any potentially partial data from localStorage
      if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('user_id')
      localStorage.removeItem('email')}
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex w-full items-center justify-center min-h-screen bg-gray-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex w-full flex-row justify-center"
      >
        <Image
          src="/login.png"
          width={500}
          height={500}
          alt="Login image"
          priority
        />
        <Card className="w-1/3 bg-white shadow-lg rounded-lg overflow-hidden">
          <CardHeader className="bg-gray-50 border-b border-gray-200 p-6">
            <CardTitle className="text-2xl font-semibold text-center text-gray-900">
              Log In
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="premium-input mt-1"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="premium-input mt-1"
                  disabled={isLoading}
                />
              </div>
              <Button 
                type="submit" 
                className="premium-button w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Log In'}
              </Button>
            </form>
            <p className="mt-4 text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
                Register here
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}