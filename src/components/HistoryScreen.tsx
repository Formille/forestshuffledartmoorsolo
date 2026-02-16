import { useTranslation } from 'react-i18next'
import { getChallengeById } from '../data/challenges'
import { getGameHistory, deleteGameHistory } from '../services/history'
import { GameHistory } from '../types'
import { useState, useEffect } from 'react'
import { LanguageSwitcher } from './LanguageSwitcher'
import { getMissionThumbnailUrl } from '../utils/missionThumbnails'
import { VictoryCertificate } from './VictoryCertificate'

interface HistoryScreenProps {
  onBack?: () => void
}

export function HistoryScreen({ onBack }: HistoryScreenProps) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language as 'ko' | 'en'
  const [histories, setHistories] = useState<GameHistory[]>([])
  const [selectedHistory, setSelectedHistory] = useState<GameHistory | null>(null)
  const [showCertificateFor, setShowCertificateFor] = useState<GameHistory | null>(null)

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {histories.map(history => {
            const challenge = getChallengeById(history.challengeId)
            return (
              <div
                key={history.id}
                className={`text-left transition-all duration-200 flex flex-col overflow-hidden h-full bg-white rounded-xl shadow-lg border border-forest-100 cursor-pointer ${
                  selectedHistory?.id === history.id
                    ? 'ring-4 ring-forest-500 bg-forest-50'
                    : 'hover:shadow-xl hover:scale-105'
                }`}
                onClick={() => setSelectedHistory(history)}
              >
                {/* 이미지: 해상도 무관하게 컨테이너 안에서만 표시 */}
                <div className="w-full flex-shrink-0 overflow-hidden rounded-t-xl relative aspect-[4/3] bg-forest-100">
                  <img
                    src={getMissionThumbnailUrl(history.challengeId, {
                      difficulty: history.difficulty,
                      isVictory: history.isVictory
                    })}
                    alt=""
                    className="w-full h-full object-cover object-center block"
                  />
                  <span className="absolute top-2 right-2 text-3xl drop-shadow-lg">
                    {history.isVictory
                      ? { bronze: '🥉', silver: '🥈', gold: '🥇' }[history.difficulty]
                      : '❌'}
                  </span>
                </div>

                {/* 본문: ChallengeCard와 동일 스타일 */}
                <div className="p-6 flex flex-col flex-1 min-h-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-lg font-bold text-forest-800 flex-1 min-w-0">
                      {challenge ? `${challenge.id}. ${challenge.title[lang]}` : `Challenge ${history.challengeId}`}
                    </h3>
                    {selectedHistory?.id === history.id && (
                      <span className="text-forest-600 text-2xl flex-shrink-0">✓</span>
                    )}
                  </div>

                  <p className="text-sm text-forest-600 mb-3">
                    {challenge?.description[lang] ?? ''}
                  </p>

                  {/* 점수 기준 (ChallengeCard와 동일) */}
                  <div className="flex gap-2 text-xs mb-3">
                    {challenge && (
                      <>
                        <span className="bg-tree-200 text-tree-800 px-2 py-1 rounded">
                          동 {challenge.minScore.bronze}
                        </span>
                        <span className="bg-moor-200 text-moor-800 px-2 py-1 rounded">
                          은 {challenge.minScore.silver}
                        </span>
                        <span className="bg-forest-300 text-forest-900 px-2 py-1 rounded">
                          금 {challenge.minScore.gold}
                        </span>
                      </>
                    )}
                  </div>

                  {/* 결과: 날짜, 승리/패배, 점수 */}
                  <div className="flex flex-wrap gap-2 text-xs mb-3">
                    <span className="text-forest-600">{formatDate(history.date)}</span>
                    <span
                      className={`px-2 py-0.5 rounded font-semibold ${
                        history.isVictory ? 'bg-forest-200 text-forest-800' : 'bg-moor-200 text-moor-800'
                      }`}
                    >
                      {history.isVictory ? t('history.victory') : t('history.defeat')}
                    </span>
                    <span className="font-bold text-forest-800">
                      {history.isVictory
                        ? { bronze: '🥉', silver: '🥈', gold: '🥇' }[history.difficulty]
                        : '❌'}{' '}
                      {history.score}점
                    </span>
                  </div>

                  <div className="flex gap-2 mt-auto">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowCertificateFor(history)
                      }}
                      className="flex-1 px-3 py-2 bg-forest-200 text-forest-800 rounded-lg text-sm font-semibold hover:bg-forest-300 transition-colors"
                    >
                      {t('certificate.title')}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(history.id)
                      }}
                      className="px-3 py-2 bg-moor-200 text-moor-800 rounded-lg text-sm font-semibold hover:bg-moor-300 transition-colors"
                    >
                      {t('history.delete')}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* 인증서 모달 */}
        {showCertificateFor && (
          <VictoryCertificate
            history={showCertificateFor}
            onClose={() => setShowCertificateFor(null)}
          />
        )}
      </div>
    </div>
  )
}

