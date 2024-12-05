'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function LoseScreen() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/')
    }, 5000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-100">
      <h1 className="text-4xl font-bold text-red-800 mb-4">¡Sigue Intentando!</h1>
      <p className="text-xl text-red-700">Te has quedado sin vidas.</p>
    </div>
  )
}