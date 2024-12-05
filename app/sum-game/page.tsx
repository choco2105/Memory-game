'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

function generateBalancedNumbersWithValidSum(target: number, selections: number) {
  const selectedNumbers = []
  let sum = 0

  for (let i = 0; i < selections - 1; i++) {
    const num = Math.floor(Math.random() * Math.min(target / selections, 9)) + 1
    selectedNumbers.push(num)
    sum += num
  }
  selectedNumbers.push(target - sum)

  const allNumbers = [...selectedNumbers]
  while (allNumbers.length < 6) {
    const randomNum = allNumbers.length % 2 === 0
      ? Math.floor(Math.random() * 9) + 1
      : Math.floor(Math.random() * 20) + 1
    allNumbers.push(randomNum)
  }

  return shuffleArray(allNumbers)
}

function shuffleArray(array: number[]) {
  return array.sort(() => Math.random() - 0.5)
}

const levels = Array.from({ length: 20 }, (_, i) => {
  const target = i < 10 ? 5 + i * 2 : 10 + (i - 10) * 5
  const requiredSelections = i < 10 ? 2 : 3
  return {
    target,
    numbers: generateBalancedNumbersWithValidSum(target, requiredSelections),
    requiredSelections,
  }
})

export default function SumGame() {
  const router = useRouter()
  const [level, setLevel] = useState(0)
  const [lives, setLives] = useState(3)
  const [selectedIndices, setSelectedIndices] = useState<number[]>([])
  const [message, setMessage] = useState('')
  const [timeRemaining, setTimeRemaining] = useState(30)
  const [numbers, setNumbers] = useState(levels[0].numbers)

  const currentLevel = levels[level]
  
  // Si no hay nivel actual, redirigir a la pantalla de victoria
  useEffect(() => {
    if (!currentLevel) {
      router.push('/win')
      return
    }
  }, [currentLevel, router])

  // Si no hay nivel actual, no renderizar el juego
  if (!currentLevel) return null

  const { target, requiredSelections } = currentLevel

  useEffect(() => {
    if (level >= levels.length) {
      router.push('/win')
      return
    }
    setSelectedIndices([])
    setMessage('')
    setTimeRemaining(30)
    setNumbers(levels[level].numbers)
  }, [level])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setLives((lives) => lives - 1)
          if (lives - 1 <= 0) {
            clearInterval(timer)
            router.push('/lose')
          } else {
            resetSelections()
          }
          return 30
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [lives])

  const handleNumberPress = (index: number) => {
    if (selectedIndices.length < requiredSelections && !selectedIndices.includes(index)) {
      setSelectedIndices([...selectedIndices, index])
    }
  }

  useEffect(() => {
    if (selectedIndices.length === requiredSelections) {
      const sum = selectedIndices.reduce((acc, index) => acc + numbers[index], 0)
      if (sum === target) {
        setMessage('¡Correcto! Pasando al siguiente nivel...')
        setTimeout(() => {
          if (level + 1 >= levels.length) {
            router.push('/win')
          } else {
            setLevel(level + 1)
          }
        }, 1000)
      } else {
        setMessage('Incorrecto, intenta de nuevo.')
        setLives((prevLives) => prevLives - 1)
        if (lives - 1 > 0) {
          resetSelections()
          setNumbers(generateBalancedNumbersWithValidSum(target, requiredSelections))
        } else {
          router.push('/lose')
        }
      }
    }
  }, [selectedIndices])

  const resetSelections = () => {
    setSelectedIndices([])
    setTimeRemaining(30)
    setMessage('')
  }

  return (
    <div className="min-h-screen bg-[#FFF9E6] flex flex-col items-center p-8">
      <button
        onClick={() => router.push('/')}
        className="self-start px-4 py-2 text-[#0066cc] hover:text-blue-800 transition-colors text-lg"
      >
        ⬅️ Volver al Menú
      </button>

      <div className="w-full bg-[#008080] text-white p-5 flex justify-between items-center mb-8">
        <div className="text-lg font-bold">
          Nivel: {'⭐'.repeat(level + 1)}{'☆'.repeat(Math.max(0, levels.length - level - 1))}
        </div>
        <div className="text-lg font-bold">
          Vidas: {'❤️'.repeat(lives)}
        </div>
        <div className="text-lg font-bold text-red-300">
          Tiempo: {timeRemaining}s
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-8">
        Selecciona {requiredSelections} números que sumen {target}
      </h2>

      <div className="flex flex-wrap justify-center max-w-2xl gap-4">
        {numbers.map((number, index) => (
          <button
            key={index}
            onClick={() => handleNumberPress(index)}
            className={`w-20 h-20 rounded-lg flex items-center justify-center text-3xl font-bold text-white transition-colors ${
              selectedIndices.includes(index)
                ? 'bg-[#FFD700]'
                : 'bg-[#0073e6] hover:bg-blue-600'
            }`}
          >
            {number}
          </button>
        ))}
      </div>

      {message && (
        <div className="mt-8 text-xl font-bold text-red-600">
          {message}
        </div>
      )}
    </div>
  )
}