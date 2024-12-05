'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const levels = [
  { word: 'SOL', hint: '☀️ Brilla en el día' },
  { word: 'LUNA', hint: '🌕 La vemos de noche' },
  { word: 'CASA', hint: '🏠 Donde vivimos' },
  { word: 'PEZ', hint: '🐟 Vive en el agua' },
  { word: 'PERRO', hint: '🐕 El amigo fiel' },
  { word: 'GATO', hint: '🐈 Le gusta ronronear' },
  { word: 'AVE', hint: '🐦 Vuela en el cielo' },
  { word: 'NIÑO', hint: '👦 Una persona pequeña' },
  { word: 'FLOR', hint: '🌸 Algo que crece en el jardín' },
  { word: 'CARRO', hint: '🚗 Medio de transporte' },
  { word: 'AVION', hint: '✈️ Viaja por el cielo' },
  { word: 'NUBE', hint: '☁️ Flota en el cielo' },
  { word: 'PLAYA', hint: '🏖️ Lugar de arena y mar' },
  { word: 'LIBRO', hint: '📚 Para leer y aprender' },
  { word: 'ARBOL', hint: '🌳 Planta alta con ramas' },
  { word: 'QUESO', hint: '🧀 Comida que viene de la leche' },
  { word: 'MANO', hint: '🖐 Parte del cuerpo que usamos para tocar' },
  { word: 'CAMPO', hint: '🏞️ Espacio grande y verde' },
  { word: 'ESTRELLA', hint: '⭐ Brilla en el cielo de noche' },
  { word: 'CARAMELO', hint: '🍬 Dulce y delicioso' }
]

const generateRandomLetters = (word: string) => {
  const letters = [...word]
  const additionalLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  
  while (letters.length < word.length + 5) {
    const randomLetter = additionalLetters[Math.floor(Math.random() * additionalLetters.length)]
    if (!letters.includes(randomLetter)) {
      letters.push(randomLetter)
    }
  }
  
  return letters.sort(() => Math.random() - 0.5)
}

export default function WordGame() {
  const router = useRouter()
  const [currentLevel, setCurrentLevel] = useState(0)
  const [selectedLetters, setSelectedLetters] = useState<string[]>([])
  const [availableLetters, setAvailableLetters] = useState<string[]>(generateRandomLetters(levels[0].word))
  const [lives, setLives] = useState(3)
  const [timeRemaining, setTimeRemaining] = useState(30)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (timeRemaining <= 0) {
      setLives((prevLives) => prevLives - 1)
      if (lives - 1 <= 0) {
        router.push('/lose')
      } else {
        resetLevel()
      }
    } else {
      const timer = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [timeRemaining, lives])

  const resetLevel = () => {
    setTimeRemaining(30)
    setAvailableLetters(generateRandomLetters(levels[currentLevel].word))
    setSelectedLetters([])
    setMessage('')
  }

  useEffect(() => {
    if (currentLevel >= levels.length) {
      router.push('/win')
    } else if (lives <= 0) {
      router.push('/lose')
    } else {
      resetLevel()
    }
  }, [currentLevel, lives])

  const handleLetterPress = (letter: string, index: number) => {
    if (selectedLetters.length < levels[currentLevel].word.length) {
      setSelectedLetters([...selectedLetters, letter])
      setAvailableLetters(availableLetters.filter((_, i) => i !== index))
    }
  }

  const handleCheckWord = () => {
    const currentWord = levels[currentLevel].word
    const selectedWord = selectedLetters.join('')

    if (selectedWord === currentWord) {
      setMessage('¡Correcto!')
      setTimeout(() => {
        if (currentLevel + 1 >= levels.length) {
          router.push('/win')
        } else {
          setCurrentLevel(currentLevel + 1)
        }
      }, 1000)
    } else {
      setMessage('Incorrecto, intenta de nuevo')
      setLives((prevLives) => prevLives - 1)
      if (lives - 1 > 0) {
        setAvailableLetters(generateRandomLetters(currentWord))
      }
    }
    setSelectedLetters([])
  }

  return (
    <div className="min-h-screen bg-[#FFF3E4] flex flex-col items-center p-8">
      <button
        onClick={() => router.push('/')}
        className="self-start px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors"
      >
        ⬅️ Volver al Menú
      </button>

      <div className="w-full flex justify-between items-center mb-8">
        <div className="text-lg">
          Nivel: {'⭐'.repeat(currentLevel + 1)}{'☆'.repeat(Math.max(0, levels.length - currentLevel - 1))}
        </div>
        <div className="text-lg">
          Vidas: {'❤️'.repeat(lives)}
        </div>
        <div className="text-lg">
          Tiempo: {timeRemaining}s
        </div>
      </div>

      {currentLevel < levels.length && (
        <>
          <h2 className="text-2xl font-bold mb-8">{levels[currentLevel].hint}</h2>

          <div className="flex gap-4 mb-8">
            {levels[currentLevel].word.split('').map((_, index) => (
              <div
                key={index}
                className={`w-16 h-16 flex items-center justify-center text-2xl font-bold rounded-lg
                  ${selectedLetters[index] ? 'bg-green-200' : 'bg-gray-200'}`}
              >
                {selectedLetters[index] || ''}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-8 max-w-2xl">
            {availableLetters.map((letter, index) => (
              <button
                key={index}
                onClick={() => handleLetterPress(letter, index)}
                className="w-16 h-16 bg-[#FFB74D] hover:bg-[#FFA726] text-white text-2xl font-bold rounded-lg transition-colors"
              >
                {letter}
              </button>
            ))}
          </div>

          <button
            onClick={handleCheckWord}
            className="px-8 py-4 bg-[#1E88E5] hover:bg-[#1976D2] text-white text-xl font-bold rounded-lg transition-colors"
          >
            Comprobar
          </button>

          {message && (
            <div className="mt-4 text-xl font-bold text-red-600">
              {message}
            </div>
          )}
        </>
      )}
    </div>
  )
}