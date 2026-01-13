import { useTranslation } from 'react-i18next'
import { getChallengeById } from '../data/challenges'
import { getGameHistory, deleteGameHistory, GameHistory } from '../services/history'
import { useState, useEffect } from 'react'
import { LanguageSwitcher } from './LanguageSwitcher'

interface HistoryScreenProps {
  onBack?: () => void
}

export function HistoryScreen({ onBack }: HistoryScreenProps) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language as 'ko' | 'en'
  const [histories, setHistories] = useState<GameHistory[]>([])
  const [selectedHistory, setSelectedHistory] = useState<GameHistory | null>(null)

  useEffect(() => {
    const loadedHistories = getGameHistory()
    setHistories(loadedHistories)
  }, [])

  const handleDelete = (id: string) => {
    if (confirm(t('common.confirm') + '?')) {
      deleteGameHistory(id)
      setHistories(getGameHistory())
      if (selectedHistory?.id === id) {
        setSelectedHistory(null)
      }
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(lang === 'ko' ? 'ko-KR' : 'en-US')
  }

  if (histories.length === 0) {
    return (
      <div className="min-h-screen bg-forest-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-forest-800">
              {t('history.title')}
            </h1>
            <LanguageSwitcher />
          </div>
          <div className="card text-center py-12">
            <p className="text-forest-600 text-lg">{t('history.noHistory')}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-forest-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            {onBack && (
              <button
                onClick={onBack}
                className="text-forest-600 hover:text-forest-800 text-xl"
              >
                ← {t('common.back')}
              </button>
            )}
            <h1 className="text-3xl font-bold text-forest-800">
              {t('history.title')}
            </h1>
          </div>
          <LanguageSwitcher />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {histories.map(history => {
            const challenge = getChallengeById(history.challengeId)
            return (
              <div
                key={history.id}
                className={`card cursor-pointer transition-all ${
                  selectedHistory?.id === history.id
                    ? 'ring-4 ring-forest-500 bg-forest-50'
                    : 'hover:shadow-xl'
                }`}
                onClick={() => setSelectedHistory(history)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-forest-800">
                      {challenge ? `${challenge.id}. ${challenge.title[lang]}` : `Challenge ${history.challengeId}`}
                    </h3>
                    <p className="text-sm text-forest-600">
                      {formatDate(history.date)}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded text-sm font-semibold ${
                      history.isVictory
                        ? 'bg-forest-200 text-forest-800'
                        : 'bg-moor-200 text-moor-800'
                    }`}
                  >
                    {history.isVictory ? t('history.victory') : t('history.defeat')}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <div>
                    <p className="text-sm text-forest-600">
                      {t('history.difficulty')}: {t(`setup.${history.difficulty}`)}
                    </p>
                    <p className="text-lg font-bold text-forest-800">
                      {t('history.score')}: {history.score}점
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(history.id)
                    }}
                    className="px-3 py-1 bg-moor-200 text-moor-800 rounded hover:bg-moor-300 transition-colors"
                  >
                    {t('history.delete')}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Selected History Detail */}
        {selectedHistory && (
          <div className="mt-8 card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-forest-800">
                {t('history.view')}
              </h2>
              <button
                onClick={() => setSelectedHistory(null)}
                className="text-forest-600 hover:text-forest-800"
              >
                {t('common.close')}
              </button>
            </div>
            {selectedHistory.certificateImage && (
              <div className="mb-4">
                <img
                  src={selectedHistory.certificateImage}
                  alt="Certificate"
                  className="w-full rounded-lg"
                />
              </div>
            )}
            <div className="space-y-2">
              <p><strong>{t('history.date')}:</strong> {formatDate(selectedHistory.date)}</p>
              <p><strong>{t('history.challenge')}:</strong> {
                getChallengeById(selectedHistory.challengeId)?.title[lang] || `Challenge ${selectedHistory.challengeId}`
              }</p>
              <p><strong>{t('history.difficulty')}:</strong> {t(`setup.${selectedHistory.difficulty}`)}</p>
              <p><strong>{t('history.score')}:</strong> {selectedHistory.score}점</p>
              <p><strong>{t('history.result')}:</strong> {
                selectedHistory.isVictory ? t('history.victory') : t('history.defeat')
              }</p>
              <p><strong>{t('scoring.goalMet')}:</strong> {
                selectedHistory.goalMet ? t('scoring.goalMet') : t('scoring.goalNotMet')
              }</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

