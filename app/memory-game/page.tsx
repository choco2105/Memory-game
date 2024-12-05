'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const LEVELS = [
  { hint: "Encuentra las parejas", cards: ["🌟", "🌙", "🌟", "🌙"].sort(() => Math.random() - 0.5) },
  { hint: "Encuentra las parejas", cards: ["🍎", "🍌", "🍎", "🍌"].sort(() => Math.random() - 0.5) },
  { hint: "Encuentra las parejas", cards: ["🐱", "🐶", "🐱", "🐶"].sort(() => Math.random() - 0.5) },
  { hint: "Encuentra las parejas", cards: ["🌟", "🌙", "🦉", "🌟", "🌙", "🦉"].sort(() => Math.random() - 0.5) },
  { hint: "Encuentra las parejas", cards: ["🍎", "🍌", "🍒", "🍎", "🍌", "🍒"].sort(() => Math.random() - 0.5) },
  { hint: "Encuentra las parejas", cards: ["🐱", "🐶", "🐭", "🐱", "🐶", "🐭"].sort(() => Math.random() - 0.5) },
  { hint: "Encuentra las parejas", cards: ["🚗", "✈️", "🚲", "🚗", "✈️", "🚲", "🚂", "🚂"].sort(() => Math.random() - 0.5) },
  { hint: "Encuentra las parejas", cards: ["🍕", "🍔", "🍟", "🍕", "🍔", "🍟", "🌭", "🌭"].sort(() => Math.random() - 0.5) },
  { hint: "Encuentra las parejas", cards: ["🌞", "🌜", "⭐", "🌞", "🌜", "⭐", "🌍", "🌍"].sort(() => Math.random() - 0.5) },
  { hint: "Encuentra las parejas", cards: ["📚", "✏️", "📖", "📚", "✏️", "📖", "🖍️", "🖍️"].sort(() => Math.random() - 0.5) }
]

export default function MemoryGame() {
  const router = useRouter()
  const [level, setLevel] = useState(0)
  const [lives, setLives] = useState(5)
  const [selectedIndices, setSelectedIndices] = useState<number[]>([])
  const [matchedIndices, setMatchedIndices] = useState<number[]>([])
  const [timeRemaining, setTimeRemaining] = useState(30)
  const [message, setMessage] = useState('')
  const [showingCards, setShowingCards] = useState(true)

  useEffect(() => {
    // Al inicio de cada nivel, mostrar las cartas por 2 segundos
    setShowingCards(true)
    const timer = setTimeout(() => {
      setShowingCards(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [level])

  const handleCardPress = (index: number) => {
    if (showingCards) return // No permitir seleccionar cartas durante la muestra inicial
    if (selectedIndices.length < 2 && !selectedIndices.includes(index) && !matchedIndices.includes(index)) {
      setSelectedIndices([...selectedIndices, index])
    }
  }

  useEffect(() => {
    if (selectedIndices.length === 2) {
      const [first, second] = selectedIndices
      if (LEVELS[level].cards[first] === LEVELS[level].cards[second]) {
        setMatchedIndices([...matchedIndices, first, second])
        setSelectedIndices([])
        if (matchedIndices.length + 2 === LEVELS[level].cards.length) {
          setMessage('¡Nivel completado!')
          setTimeout(() => {
            if (level + 1 < LEVELS.length) {
              setLevel(level + 1)
              setMatchedIndices([])
              setSelectedIndices([])
              setMessage('')
              setTimeRemaining(30)
            } else {
              router.push('/win')
            }
          }, 1000)
        }
      } else {
        setLives(lives - 1)
        setTimeout(() => setSelectedIndices([]), 1000)
        if (lives - 1 <= 0) {
          setMessage('¡Perdiste! Inténtalo de nuevo.')
          setTimeout(() => router.push('/lose'), 1000)
        }
      }
    }
  }, [selectedIndices])

  useEffect(() => {
    if (!showingCards) { // Solo iniciar el temporizador cuando las cartas están ocultas
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setLives((prevLives) => {
              if (prevLives <= 1) {
                setMessage('¡Perdiste! Inténtalo de nuevo.')
                setTimeout(() => router.push('/lose'), 1000)
                clearInterval(timer)
                return 0
              } else {
                setMessage('¡Se acabó el tiempo!')
                setTimeout(() => {
                  setSelectedIndices([])
                  setMatchedIndices([])
                  setTimeRemaining(30)
                  setMessage('')
                }, 1000)
                return prevLives - 1
              }
            })
            return 30
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [level, lives, showingCards])

  const getGridDimensions = (numCards: number) => {
    if (numCards === 4) return { rows: 2, columns: 2 }
    if (numCards === 6) return { rows: 2, columns: 3 }
    if (numCards === 8) return { rows: 2, columns: 4 }
    return { rows: 2, columns: numCards / 2 }
  }

  const { rows, columns } = getGridDimensions(LEVELS[level].cards.length)

  return (
    <div className="min-h-screen bg-[#FFF7E1] flex flex-col items-center p-8">
      <button
        onClick={() => router.push('/')}
        className="self-start px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors"
      >
        ⬅️ Volver al Menú
      </button>

      <div className="w-full bg-[#28A745] text-white p-4 flex justify-between items-center mb-8">
        <div className="text-lg font-bold">
          Nivel: {'⭐'.repeat(level + 1)}{'☆'.repeat(Math.max(0, LEVELS.length - level - 1))}
        </div>
        <div className="text-lg font-bold">
          Vidas: {'❤️'.repeat(lives)}
        </div>
        <div className={`text-lg font-bold ${timeRemaining <= 5 ? 'text-yellow-300' : ''}`}>
          Tiempo: {timeRemaining}s
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-8">{LEVELS[level].hint}</h2>

      <div 
        className="grid gap-4"
        style={{
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          width: `${columns * 80}px`
        }}
      >
        {LEVELS[level].cards.map((card, index) => (
          <button
            key={index}
            onClick={() => handleCardPress(index)}
            className={`w-16 h-16 rounded-lg flex items-center justify-center text-2xl font-bold transition-all duration-300 transform ${
              matchedIndices.includes(index) || selectedIndices.includes(index) || showingCards
                ? 'bg-[#61DAFB] rotate-0'
                : 'bg-gray-600 rotate-180'
            }`}
          >
            {matchedIndices.includes(index) || selectedIndices.includes(index) || showingCards ? card : "?"}
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