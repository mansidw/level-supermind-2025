'use client'
import FileUploadScreen from '@/components/FileUploadScreen'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import '@/styles/globals.css'

export default function Home() {
  const router = useRouter()
  useEffect(() => {
    if(!localStorage.getItem('token')) {
      alert('You must be logged in to access this page');
      router.push('/login');
    }
  }, [])
  return (
    <main className="container mx-auto px-4 py-8">
      <FileUploadScreen />
    </main>
  )
}

