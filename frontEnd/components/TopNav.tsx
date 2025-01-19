'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'

// Define a type for the user state
type User = {
  token?: string;
  user_id?: string;
  email?: string;
} | null;

export function TopNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<User>(null)

  // Add a function to check authentication status
  const checkAuth = () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')
      if (token) {
        setUser({
          token,
          user_id: localStorage.getItem('user_id') ?? undefined,
          email: localStorage.getItem('email') ?? undefined,
        })
      } else {
        setUser(null)
      }
    }
  }

  // Check auth status on mount and when localStorage changes
  useEffect(() => {
    checkAuth()
    
    // Add event listener for storage changes
    window.addEventListener('storage', checkAuth)
    
    // Custom event listener for auth changes
    window.addEventListener('authChange', checkAuth)
    
    return () => {
      window.removeEventListener('storage', checkAuth)
      window.removeEventListener('authChange', checkAuth)
    }
  }, [])

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('user_id')
      localStorage.removeItem('email')
      
      // Dispatch custom event to notify of auth change
      window.dispatchEvent(new Event('authChange'))
      
      setUser(null)
      router.push('/login')
    }
  }

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-semibold text-gray-900">
                <span className='text-xl'>भाषाबंधु</span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  pathname === '/'
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Home
              </Link>
              <Link
                href="/dashboard"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  pathname === '/dashboard'
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Dashboard
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user?.email ? (
              <>
                <span className="text-gray-700">{user.email}</span>
                <Button className="ml-4" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild className="text-gray-500 hover:text-gray-700">
                  <Link href="/login">Log in</Link>
                </Button>
                <Button asChild className="ml-4">
                  <Link href="/register">Register</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}