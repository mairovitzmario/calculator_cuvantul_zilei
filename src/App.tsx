import { useState, useEffect } from 'react'
import './App.css'
import { filterWordsEasy, loadWords } from './wordFilter'

interface GuessLetter {
  letter: string;
  status: 'correct' | 'present' | 'absent' | 'empty';
}

interface Guess {
  letters: GuessLetter[];
}

function App() {
  const [words, setWords] = useState<string[]>([])
  const [filteredWords, setFilteredWords] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showInstallButton, setShowInstallButton] = useState(false)

  // Game state
  const [guesses, setGuesses] = useState<Guess[]>([
    { letters: Array(5).fill(null).map(() => ({ letter: '', status: 'empty' })) },
    { letters: Array(5).fill(null).map(() => ({ letter: '', status: 'empty' })) },
    { letters: Array(5).fill(null).map(() => ({ letter: '', status: 'empty' })) },
    { letters: Array(5).fill(null).map(() => ({ letter: '', status: 'empty' })) },
    { letters: Array(5).fill(null).map(() => ({ letter: '', status: 'empty' })) },
    { letters: Array(5).fill(null).map(() => ({ letter: '', status: 'empty' })) }
  ])

  // Load words on component mount
  useEffect(() => {
    const loadWordList = async () => {
      setLoading(true)
      const wordList = await loadWords()
      setWords(wordList)
      setFilteredWords(wordList)
      setLoading(false)
    }
    loadWordList()
  }, [])

  // PWA install prompt handling
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstallButton(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  // Filter words whenever guesses change
  useEffect(() => {
    if (words.length > 0) {
      const { greenLetters, yellowLetters, grayLetters } = extractConstraints()
      const filtered = filterWordsEasy(words, greenLetters, yellowLetters, grayLetters)
      setFilteredWords(filtered)
    }
  }, [words, guesses])

  const extractConstraints = () => {
    let greenLetters = ''
    let yellowLetters = ''
    const grayLetters = new Set<string>()

    // Build green letters pattern (5 positions)
    const greenPattern = ['?', '?', '?', '?', '?']

    guesses.forEach(guess => {
      guess.letters.forEach((letterObj, index) => {
        if (letterObj.letter) {
          switch (letterObj.status) {
            case 'correct':
              greenPattern[index] = letterObj.letter.toLowerCase()
              break
            case 'present':
              yellowLetters += letterObj.letter.toLowerCase()
              break
            case 'absent':
              grayLetters.add(letterObj.letter.toLowerCase())
              break
          }
        }
      })
    })

    greenLetters = greenPattern.join('')

    return {
      greenLetters,
      yellowLetters,
      grayLetters: Array.from(grayLetters).join('')
    }
  }

  const handleLetterClick = (guessIndex: number, letterIndex: number) => {
    const newGuesses = [...guesses]
    const currentLetter = newGuesses[guessIndex].letters[letterIndex]

    // Cycle through states: empty -> absent -> present -> correct -> empty
    const statusCycle: GuessLetter['status'][] = ['empty', 'absent', 'present', 'correct']
    const currentIndex = statusCycle.indexOf(currentLetter.status)
    const nextIndex = (currentIndex + 1) % statusCycle.length

    newGuesses[guessIndex].letters[letterIndex].status = statusCycle[nextIndex]
    setGuesses(newGuesses)
  }

  const handleLetterInput = (guessIndex: number, letterIndex: number, value: string) => {
    const newGuesses = [...guesses]
    newGuesses[guessIndex].letters[letterIndex].letter = value.toUpperCase()

    // If letter was empty and now has content, set to absent by default
    if (value && newGuesses[guessIndex].letters[letterIndex].status === 'empty') {
      newGuesses[guessIndex].letters[letterIndex].status = 'absent'
    }
    // If letter is cleared, set to empty
    if (!value) {
      newGuesses[guessIndex].letters[letterIndex].status = 'empty'
    }

    setGuesses(newGuesses)
  }

  const clearAllGuesses = () => {
    setGuesses([
      { letters: Array(5).fill(null).map(() => ({ letter: '', status: 'empty' })) },
      { letters: Array(5).fill(null).map(() => ({ letter: '', status: 'empty' })) },
      { letters: Array(5).fill(null).map(() => ({ letter: '', status: 'empty' })) },
      { letters: Array(5).fill(null).map(() => ({ letter: '', status: 'empty' })) },
      { letters: Array(5).fill(null).map(() => ({ letter: '', status: 'empty' })) },
      { letters: Array(5).fill(null).map(() => ({ letter: '', status: 'empty' })) }
    ])
  }

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      console.log(`User response to the install prompt: ${outcome}`)
      setDeferredPrompt(null)
      setShowInstallButton(false)
    }
  }

  if (loading) {
    return (
      <div className="app">
        <div className="loading">Se încarcă cuvintele...</div>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="header">
        <h1>🎯 Calculator Cuvântul Zilei</h1>
        <p>Filtrează cuvintele pentru cuvântul zilei</p>
        {showInstallButton && (
          <button onClick={handleInstallClick} className="install-btn">
            📱 Instalează aplicația
          </button>
        )}
      </header>

      <div className="game-section">
        <h2>📝 Introdu încercările tale</h2>
        <p className="instructions">
          Scrie cuvintele pe care le-ai încercat și apasă pe fiecare literă pentru a schimba culoarea:
        </p>
        <div className="color-legend">
          <div className="legend-item">
            <div className="letter-demo correct">A</div>
            <span>Verde = Poziție corectă</span>
          </div>
          <div className="legend-item">
            <div className="letter-demo present">B</div>
            <span>Galben = În cuvânt, poziție greșită</span>
          </div>
          <div className="legend-item">
            <div className="letter-demo absent">C</div>
            <span>Gri = Nu este în cuvânt</span>
          </div>
        </div>

        <div className="wordle-grid">
          {guesses.map((guess, guessIndex) => (
            <div key={guessIndex} className="guess-row">
              {guess.letters.map((letterObj, letterIndex) => (
                <div key={letterIndex} className="letter-container">
                  <input
                    type="text"
                    maxLength={1}
                    value={letterObj.letter}
                    onChange={(e) => handleLetterInput(guessIndex, letterIndex, e.target.value)}
                    className={`letter-input ${letterObj.status}`}
                    onClick={() => handleLetterClick(guessIndex, letterIndex)}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

        <button onClick={clearAllGuesses} className="clear-btn">
          🗑️ Șterge toate încercările
        </button>
      </div>      <div className="results">
        <div className="results-header">
          <h3>Rezultate: {filteredWords.length} cuvinte</h3>
        </div>

        <div className="words-grid">
          {filteredWords.slice(0, 100).map((word, index) => (
            <div key={index} className="word-item">
              {word}
            </div>
          ))}
          {filteredWords.length > 100 && (
            <div className="more-results">
              ... și încă {filteredWords.length - 100} cuvinte
            </div>
          )}
        </div>
      </div>

      {showInstallButton && (
        <div className="install-prompt">
          <p>Instalează aplicația pentru o experiență mai bună!</p>
          <button onClick={handleInstallClick} className="install-btn">
            Instalează
          </button>
        </div>
      )}
    </div>
  )
}

export default App
