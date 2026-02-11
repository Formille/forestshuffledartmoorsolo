import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGameStore } from './store/gameStore'
import { SetupScreen } from './components/SetupScreen'
import { PlayScreen } from './components/PlayScreen'
import { ScoringScreen } from './components/ScoringScreen'
import { HistoryScreen } from './components/HistoryScreen'
import { VerifyScreen } from './components/VerifyScreen'

function App() {
  const { t, i18n } = useTranslation()
  const phase = useGameStore(state => state.phase)
  const playerName = useGameStore(state => state.playerName)
  const resetGame = useGameStore(state => state.resetGame)
  const setPhase = useGameStore(state => state.setPhase)
  const [showHistory, setShowHistory] = useState(false)
  const [showVerify, setShowVerify] = useState(false)

  useEffect(() => {
    // 언어 설정 로드
    const savedLanguage = localStorage.getItem('dartmoor-language')
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage)
    }
  }, [i18n])

  const handleNavigate = (targetPhase: string) => {
    if (targetPhase === 'history') {
      setShowHistory(true)
      setShowVerify(false)
    } else if (targetPhase === 'verify') {
      setShowVerify(true)
      setShowHistory(false)
    } else if (targetPhase === 'setup') {
      setShowHistory(false)
      setShowVerify(false)
      resetGame()
    } else if (targetPhase === 'play' && phase !== 'setup' && phase !== 'finished') {
      setShowHistory(false)
      setPhase('playing')
    } else if (targetPhase === 'scoring' && phase !== 'setup') {
      setShowHistory(false)
      if (phase === 'playing') {
        useGameStore.getState().endGame()
      } else {
        setPhase('scoring')
      }
    }
  }

  if (showHistory) {
    return (
      <div className="h-screen flex flex-col bg-forest-50 overflow-hidden">
        {/* Navigation */}
        <nav className="flex-shrink-0 z-50 bg-forest-700 text-white p-4">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold">Forest Shuffle: Dartmoor</h1>
              {playerName && (
                <span className="text-forest-200 text-sm border-l border-forest-500 pl-4">
                  {playerName}
                </span>
              )}
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => handleNavigate('setup')}
                className={`px-4 py-2 rounded transition-colors ${
                  showHistory && phase === 'setup'
                    ? 'bg-forest-500'
                    : 'bg-forest-600 hover:bg-forest-500'
                }`}
              >
                {t('nav.setup')}
              </button>
              {phase !== 'setup' && phase !== 'finished' && (
                <button
                  onClick={() => handleNavigate('play')}
                  className={`px-4 py-2 rounded transition-colors ${
                    phase === 'playing'
                      ? 'bg-forest-500'
                      : 'bg-forest-600 hover:bg-forest-500'
                  }`}
                >
                  {t('nav.play')}
                </button>
              )}
              {phase !== 'setup' && (
                <button
                  onClick={() => handleNavigate('scoring')}
                  className={`px-4 py-2 rounded transition-colors ${
                    phase === 'scoring' || phase === 'finished'
                      ? 'bg-forest-500'
                      : 'bg-forest-600 hover:bg-forest-500'
                  }`}
                >
                  {t('nav.scoring')}
                </button>
              )}
              <button
                onClick={() => handleNavigate('history')}
                className={`px-4 py-2 rounded transition-colors ${
                  showHistory
                    ? 'bg-forest-500'
                    : 'bg-forest-600 hover:bg-forest-500'
                }`}
              >
                {t('nav.history')}
              </button>
              <button
                onClick={() => handleNavigate('verify')}
                className="bg-forest-600 hover:bg-forest-500 px-4 py-2 rounded transition-colors"
              >
                {t('nav.verify')}
              </button>
            </div>
          </div>
        </nav>
        <div className="flex-1 overflow-y-auto">
          <HistoryScreen onBack={() => setShowHistory(false)} />
        </div>
      </div>
    )
  }

  if (showVerify) {
    return (
      <div className="h-screen flex flex-col bg-forest-50 overflow-hidden">
        <nav className="flex-shrink-0 z-50 bg-forest-700 text-white p-4">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold">Forest Shuffle: Dartmoor</h1>
              {playerName && (
                <span className="text-forest-200 text-sm border-l border-forest-500 pl-4">
                  {playerName}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleNavigate('setup')}
                className="bg-forest-600 hover:bg-forest-500 px-4 py-2 rounded transition-colors"
              >
                {t('nav.setup')}
              </button>
              <button
                onClick={() => handleNavigate('history')}
                className="bg-forest-600 hover:bg-forest-500 px-4 py-2 rounded transition-colors"
              >
                {t('nav.history')}
              </button>
              <button
                onClick={() => handleNavigate('verify')}
                className="bg-forest-500 px-4 py-2 rounded transition-colors"
              >
                {t('nav.verify')}
              </button>
            </div>
          </div>
        </nav>
        <div className="flex-1 overflow-y-auto">
          <VerifyScreen onBack={() => setShowVerify(false)} />
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-forest-50 overflow-hidden">
      {/* Navigation */}
      <nav className="flex-shrink-0 z-50 bg-forest-700 text-white p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">Forest Shuffle: Dartmoor</h1>
            {playerName && (
              <span className="text-forest-200 text-sm border-l border-forest-500 pl-4">
                {playerName}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleNavigate('setup')}
              className={`px-4 py-2 rounded transition-colors ${
                phase === 'setup'
                  ? 'bg-forest-500'
                  : 'bg-forest-600 hover:bg-forest-500'
              }`}
            >
              {t('nav.setup')}
            </button>
            {phase !== 'setup' && phase !== 'finished' && (
              <button
                onClick={() => handleNavigate('play')}
                className={`px-4 py-2 rounded transition-colors ${
                  phase === 'playing'
                    ? 'bg-forest-500'
                    : 'bg-forest-600 hover:bg-forest-500'
                }`}
              >
                {t('nav.play')}
              </button>
            )}
            {phase !== 'setup' && (
              <button
                onClick={() => handleNavigate('scoring')}
                className={`px-4 py-2 rounded transition-colors ${
                  phase === 'scoring' || phase === 'finished'
                    ? 'bg-forest-500'
                    : 'bg-forest-600 hover:bg-forest-500'
                }`}
              >
                {t('nav.scoring')}
              </button>
            )}
            <button
              onClick={() => handleNavigate('history')}
              className={`px-4 py-2 rounded transition-colors ${
                showHistory
                  ? 'bg-forest-500'
                  : 'bg-forest-600 hover:bg-forest-500'
              }`}
            >
              {t('nav.history')}
            </button>
            <button
              onClick={() => handleNavigate('verify')}
              className="bg-forest-600 hover:bg-forest-500 px-4 py-2 rounded transition-colors"
            >
              {t('nav.verify')}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {phase === 'setup' && <SetupScreen />}
        {phase === 'playing' && <PlayScreen />}
        {phase === 'scoring' && <ScoringScreen onGoToHistory={() => handleNavigate('history')} />}
        {phase === 'finished' && <ScoringScreen onGoToHistory={() => handleNavigate('history')} />}
      </main>
    </div>
  )
}

export default App
