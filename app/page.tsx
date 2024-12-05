'use client'

import { useRouter } from 'next/navigation'
import { BookOpen, Plus, Brain } from 'lucide-react'

export default function Home() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-b from-pink-100 to-cyan-100">
      <h1 className="text-4xl font-bold text-gray-800 mb-2 text-center">
        🎉 Bienvenido a Memory Game 🎉
      </h1>
      <p className="text-xl text-gray-600 mb-8 text-center">
        Selecciona un juego para comenzar:
      </p>

      <div className="flex flex-col gap-4 w-full max-w-md">
        <button
          onClick={() => router.push('/word-game')}
          className="flex items-center justify-center gap-3 px-6 py-4 bg-[#FF6F61] text-white rounded-lg shadow-lg hover:bg-[#ff5c4d] transition-colors"
        >
          <BookOpen className="w-6 h-6" />
          <span className="text-xl font-bold">Formando Palabras</span>
        </button>

        <button
          onClick={() => router.push('/sum-game')}
          className="flex items-center justify-center gap-3 px-6 py-4 bg-[#FFAB40] text-white rounded-lg shadow-lg hover:bg-[#ff9d26] transition-colors"
        >
          <Plus className="w-6 h-6" />
          <span className="text-xl font-bold">Sumando Números</span>
        </button>

        <button
          onClick={() => router.push('/memory-game')}
          className="flex items-center justify-center gap-3 px-6 py-4 bg-[#4CAF50] text-white rounded-lg shadow-lg hover:bg-[#3d8c40] transition-colors"
        >
          <Brain className="w-6 h-6" />
          <span className="text-xl font-bold">Memoria Mágica</span>
        </button>
      </div>
    </div>
  )
}