import { useState, useEffect } from 'react'
import './App.css'
import { filterWordsEasy, loadWords } from './wordFilter'

function App() {
  const [words, setWords] = useState<string[]>([])
  const [filteredWords, setFilteredWords] = useState<string[]>([])
  const [greenLetters, setGreenLetters] = useState('')
  const [yellowLetters, setYellowLetters] = useState('')
  const [grayLetters, setGrayLetters] = useState('')
  const [loading, setLoading] = useState(true)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showInstallButton, setShowInstallButton] = useState(false)

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

  // Filter words whenever inputs change
  useEffect(() => {
    if (words.length > 0) {
      const filtered = filterWordsEasy(words, greenLetters, yellowLetters, grayLetters)
      setFilteredWords(filtered)
    }
  }, [words, greenLetters, yellowLetters, grayLetters])

  const clearFilters = () => {
    setGreenLetters('')
    setYellowLetters('')
    setGrayLetters('')
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

      <div className="filters">
        <div className="filter-group">
          <label htmlFor="green">
            🟩 Litere Verzi (poziție corectă)
          </label>
          <input
            id="green"
            type="text"
            value={greenLetters}
            onChange={(e) => setGreenLetters(e.target.value)}
            placeholder="ex: a?b?? (folosește ? pentru necunoscut)"
            maxLength={5}
          />
          <small>Exemplu: a?b?? înseamnă 'a' la poziția 1, 'b' la poziția 3</small>
        </div>

        <div className="filter-group">
          <label htmlFor="yellow">
            🟨 Litere Galbene (în cuvânt, poziție greșită)
          </label>
          <input
            id="yellow"
            type="text"
            value={yellowLetters}
            onChange={(e) => setYellowLetters(e.target.value)}
            placeholder="ex: rt"
          />
          <small>Exemplu: rt înseamnă că 'r' și 't' sunt în cuvânt</small>
        </div>

        <div className="filter-group">
          <label htmlFor="gray">
            ⬜ Litere Gri (nu sunt în cuvânt)
          </label>
          <input
            id="gray"
            type="text"
            value={grayLetters}
            onChange={(e) => setGrayLetters(e.target.value)}
            placeholder="ex: oilc"
          />
          <small>Exemplu: oilc înseamnă că aceste litere nu sunt în cuvânt</small>
        </div>

        <button onClick={clearFilters} className="clear-btn">
          Resetează Toate Filtrele
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
