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

  const navBtnBase = 'px-3 py-1.5 sm:px-4 sm:py-2 rounded transition-colors text-sm sm:text-base'
  const navBtnActive = `${navBtnBase} bg-forest-500`
  const navBtnInactive = `${navBtnBase} bg-forest-600 hover:bg-forest-500`

  const isActive = (target: string) => {
    if (target === 'history') return showHistory
    if (target === 'verify') return showVerify
    if (target === 'play') return !showHistory && !showVerify && phase === 'playing'
    if (target === 'scoring') return !showHistory && !showVerify && (phase === 'scoring' || phase === 'finished')
    if (target === 'setup') return !showHistory && !showVerify && phase === 'setup'
    return false
  }

  const renderNav = () => (
    <nav className="flex-shrink-0 z-50 bg-forest-700 text-white px-3 py-2 sm:p-4">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <h1 className="text-base sm:text-xl font-bold whitespace-nowrap">
            Forest Shuffle: Dartmoor
          </h1>
          {playerName && (
            <span className="text-forest-200 text-xs sm:text-sm border-l border-forest-500 pl-3 hidden sm:inline">
              {playerName}
            </span>
          )}
        </div>
        <div className="flex gap-1.5 sm:gap-2 flex-wrap">
          <button
            onClick={() => handleNavigate('setup')}
            className={isActive('setup') ? navBtnActive : navBtnInactive}
          >
            {t('nav.setup')}
          </button>
          {phase !== 'setup' && phase !== 'finished' && !showHistory && !showVerify && (
            <button
              onClick={() => handleNavigate('play')}
              className={isActive('play') ? navBtnActive : navBtnInactive}
            >
              {t('nav.play')}
            </button>
          )}
          {phase !== 'setup' && !showHistory && !showVerify && (
            <button
              onClick={() => handleNavigate('scoring')}
              className={isActive('scoring') ? navBtnActive : navBtnInactive}
            >
              {t('nav.scoring')}
            </button>
          )}
          <button
            onClick={() => handleNavigate('history')}
            className={isActive('history') ? navBtnActive : navBtnInactive}
          >
            {t('nav.history')}
          </button>
          <button
            onClick={() => handleNavigate('verify')}
            className={isActive('verify') ? navBtnActive : navBtnInactive}
          >
            {t('nav.verify')}
          </button>
        </div>
      </div>
    </nav>
  )

  if (showHistory) {
    return (
      <div className="h-screen flex flex-col bg-forest-50 overflow-hidden">
        {renderNav()}
        <div className="flex-1 overflow-y-auto">
          <HistoryScreen onBack={() => setShowHistory(false)} />
        </div>
      </div>
    )
  }

  if (showVerify) {
    return (
      <div className="h-screen flex flex-col bg-forest-50 overflow-hidden">
        {renderNav()}
        <div className="flex-1 overflow-y-auto">
          <VerifyScreen onBack={() => setShowVerify(false)} />
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-forest-50 overflow-hidden">
      {renderNav()}

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
