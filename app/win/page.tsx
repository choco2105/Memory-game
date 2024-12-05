'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function WinScreen() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/')
    }, 5000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-100">
      <h1 className="text-4xl font-bold text-green-800 mb-4">¡Felicidades!</h1>
      <p className="text-xl text-green-700">Has completado el juego con éxito.</p>
    </div>
  )
}