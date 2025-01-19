'use client'
import Dashboard from '@/components/Dashboard'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import '../../styles/globals.css'


export default function DashboardPage() {
  const router = useRouter()
  useEffect(() => {
    if(!localStorage.getItem('token')) {
      alert('You must be logged in to access this page');
      router.push('/login');
    }
  }, [])
  return (
    <main className="container mx-auto px-4 py-8">
      <Dashboard />
    </main>
  )
}

