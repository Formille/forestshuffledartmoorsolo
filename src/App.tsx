import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGameStore } from './store/gameStore'
import { SetupScreen } from './components/SetupScreen'
import { PlayScreen } from './components/PlayScreen'
import { ScoringScreen } from './components/ScoringScreen'
import { HistoryScreen } from './components/HistoryScreen'

function App() {
  const { i18n } = useTranslation()
  const phase = useGameStore(state => state.phase)
  const [showHistory, setShowHistory] = useState(false)

  useEffect(() => {
    // 언어 설정 로드
    const savedLanguage = localStorage.getItem('dartmoor-language')
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage)
    }
  }, [i18n])

  if (showHistory) {
    return <HistoryScreen onBack={() => setShowHistory(false)} />
  }

  return (
    <div className="min-h-screen bg-forest-50">
      {/* Navigation */}
      <nav className="bg-forest-700 text-white p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Forest Shuffle: Dartmoor</h1>
          <div className="flex gap-4">
            {phase === 'setup' && (
              <button
                onClick={() => setShowHistory(true)}
                className="px-4 py-2 bg-forest-600 rounded hover:bg-forest-500 transition-colors"
              >
                History
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        {phase === 'setup' && <SetupScreen />}
        {phase === 'playing' && <PlayScreen />}
        {phase === 'scoring' && <ScoringScreen />}
        {phase === 'finished' && <ScoringScreen />}
      </main>
    </div>
  )
}

export default App
