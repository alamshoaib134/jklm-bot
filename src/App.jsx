import { useState, useEffect, useMemo, useCallback } from 'react'
import { words } from './words'
import './App.css'

function App() {
  const [sequence, setSequence] = useState('')
  const [usedLetters, setUsedLetters] = useState(new Set())
  const [showAll, setShowAll] = useState(false)

  // Find words containing the sequence, sorted by length
  const results = useMemo(() => {
    if (sequence.length < 2) return []
    
    const lowerSeq = sequence.toLowerCase()
    const matching = words
      .filter(word => word.includes(lowerSeq))
      .sort((a, b) => a.length - b.length)
    
    return matching
  }, [sequence])

  // Get words that help complete unused letters
  const strategicWords = useMemo(() => {
    if (results.length === 0) return []
    
    const unusedLetters = 'abcdefghijklmnopqrstuvwxyz'
      .split('')
      .filter(l => !usedLetters.has(l))
    
    if (unusedLetters.length === 0) return results.slice(0, 20)
    
    // Score words by how many unused letters they contain
    const scored = results.map(word => {
      const uniqueUnused = new Set(
        word.split('').filter(l => unusedLetters.includes(l))
      )
      return { word, score: uniqueUnused.size, unusedHit: [...uniqueUnused] }
    })
    
    // Sort by: shortest first, then by most unused letters covered
    scored.sort((a, b) => {
      // Prioritize short words that hit unused letters
      const aValue = a.word.length - (a.score * 2)
      const bValue = b.word.length - (b.score * 2)
      return aValue - bValue
    })
    
    return scored.slice(0, 20)
  }, [results, usedLetters])

  const toggleLetter = useCallback((letter) => {
    setUsedLetters(prev => {
      const next = new Set(prev)
      if (next.has(letter)) {
        next.delete(letter)
      } else {
        next.add(letter)
      }
      return next
    })
  }, [])

  const resetLetters = useCallback(() => {
    setUsedLetters(new Set())
  }, [])

  const handleWordClick = useCallback((word) => {
    // Mark all letters in this word as used
    setUsedLetters(prev => {
      const next = new Set(prev)
      word.split('').forEach(l => next.add(l.toLowerCase()))
      return next
    })
  }, [])

  const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('')
  const unusedCount = 26 - usedLetters.size

  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <span className="bomb-icon">💣</span>
          <h1>JKLM Helper</h1>
        </div>
        <p className="tagline">Never explode again</p>
      </header>

      <main className="main">
        <section className="search-section">
          <div className="input-wrapper">
            <input
              type="text"
              value={sequence}
              onChange={(e) => setSequence(e.target.value.toLowerCase())}
              placeholder="Enter letter sequence..."
              className="search-input"
              autoFocus
              spellCheck={false}
            />
            {sequence && (
              <button className="clear-btn" onClick={() => setSequence('')}>
                ×
              </button>
            )}
          </div>
          
          {sequence.length >= 2 && (
            <div className="results-info">
              Found <span className="count">{results.length}</span> words containing 
              <span className="sequence"> "{sequence}"</span>
            </div>
          )}
        </section>

        <section className="keyboard-section">
          <div className="keyboard-header">
            <h2>Letter Tracker</h2>
            <div className="keyboard-stats">
              <span className={`unused-count ${unusedCount <= 5 ? 'low' : ''}`}>
                {unusedCount} remaining
              </span>
              <button className="reset-btn" onClick={resetLetters}>
                Reset
              </button>
            </div>
          </div>
          <div className="keyboard">
            {alphabet.map(letter => (
              <button
                key={letter}
                className={`key ${usedLetters.has(letter) ? 'used' : ''}`}
                onClick={() => toggleLetter(letter)}
              >
                {letter.toUpperCase()}
              </button>
            ))}
          </div>
        </section>

        {sequence.length >= 2 && (
          <section className="results-section">
            <div className="results-header">
              <h2>
                {usedLetters.size > 0 ? '⚡ Strategic Words' : '📝 Shortest Words'}
              </h2>
              <label className="show-all-toggle">
                <input
                  type="checkbox"
                  checked={showAll}
                  onChange={(e) => setShowAll(e.target.checked)}
                />
                <span>Show all ({results.length})</span>
              </label>
            </div>

            <div className="results-grid">
              {(showAll ? results.slice(0, 100) : strategicWords).map((item, idx) => {
                const word = typeof item === 'string' ? item : item.word
                const unusedHit = typeof item === 'object' ? item.unusedHit : []
                
                return (
                  <div 
                    key={word} 
                    className={`word-card ${idx === 0 ? 'best' : ''}`}
                    onClick={() => handleWordClick(word)}
                    title="Click to mark letters as used"
                  >
                    <span className="word">
                      {word.split('').map((char, i) => {
                        const isSequence = word.indexOf(sequence) <= i && 
                                          i < word.indexOf(sequence) + sequence.length
                        const isUnused = unusedHit.includes(char)
                        return (
                          <span 
                            key={i} 
                            className={`char ${isSequence ? 'highlight' : ''} ${isUnused ? 'unused-letter' : ''}`}
                          >
                            {char}
                          </span>
                        )
                      })}
                    </span>
                    <span className="word-length">{word.length}</span>
                  </div>
                )
              })}
            </div>

            {results.length === 0 && (
              <div className="no-results">
                <span className="no-results-icon">🤔</span>
                <p>No words found with "{sequence}"</p>
                <p className="hint">Try a different sequence</p>
              </div>
            )}
          </section>
        )}

        {sequence.length < 2 && sequence.length > 0 && (
          <div className="hint-message">
            <span>💡</span> Type at least 2 letters to search
          </div>
        )}
      </main>

      <footer className="footer">
        <p>Click a word to mark its letters as used • Click letters to toggle</p>
      </footer>
    </div>
  )
}

export default App
