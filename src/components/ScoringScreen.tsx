import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGameState } from '../hooks/useGameState'
import { useGameStore } from '../store/gameStore'
import { ScoreInputForm } from './ScoreInputForm'
import { ScoreInput, Difficulty } from '../types'
import { checkVictory } from '../services/scoring'
import { getChallengeById } from '../data/challenges'
import { saveGameHistory } from '../services/history'
import { LanguageSwitcher } from './LanguageSwitcher'
import { VictoryCertificate } from './VictoryCertificate'
import { GameHistory } from '../types'
import { getMissionThumbnailUrl } from '../utils/missionThumbnails'

interface ScoringScreenProps {
  onGoToHistory?: () => void
}

export function ScoringScreen({ onGoToHistory: _onGoToHistory }: ScoringScreenProps) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language as 'ko' | 'en'
  const { challengeId, clearGame } = useGameState()
  const playDuration = useGameStore(state => state.playDuration)
  const playerName = useGameStore(state => state.playerName)
  const [result, setResult] = useState<{
    isVictory: boolean
    score: number
    medal: Difficulty | null
    requiredScore: number | null
    history: GameHistory
  } | null>(null)
  const [showCertificate, setShowCertificate] = useState(false)

  if (!challengeId) {
    return (
      <div className="min-h-screen bg-forest-50 flex items-center justify-center">
        <p className="text-forest-600">{t('common.loading')}</p>
      </div>
    )
  }

  const challenge = getChallengeById(challengeId)
  if (!challenge) {
    return (
      <div className="min-h-screen bg-forest-50 flex items-center justify-center">
        <p className="text-forest-600">Challenge not found</p>
      </div>
    )
  }

  const handleScoreSubmit = (input: ScoreInput, adjustedScore: number) => {
    const { isVictory, medal } = checkVictory(adjustedScore, challengeId, input.goalMet)
    const requiredScore = medal ? challenge.minScore[medal] : null

    const completedAt = Math.floor(Date.now() / 1000)
    const duration = playDuration ?? 0

    const savedHistory = saveGameHistory({
      challengeId,
      difficulty: medal || 'bronze', // 메달이 없어도 기록을 위해 기본값 사용
      score: adjustedScore,
      goalMet: input.goalMet,
      isVictory,
      playerName: playerName || undefined,
      duration: duration > 0 ? duration : undefined,
      completedAt
    })

    setResult({
      isVictory,
      score: adjustedScore,
      medal,
      requiredScore,
      history: savedHistory
    })

    setShowCertificate(true)
  }

  const handleNewGame = () => {
    clearGame()
  }

  return (
    <div className="min-h-screen bg-forest-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-forest-800 mb-2">
              {t('scoring.title')}
            </h1>
            <div className="text-forest-600">
              <p className="font-semibold">
                {challenge.id}. {challenge.title[lang]}
              </p>
              <p className="text-sm">{challenge.description[lang]}</p>
            </div>
          </div>
          <LanguageSwitcher />
        </div>

        {/* Score Input Form */}
        {!result && (
          <section className="card mb-8">
            <h2 className="text-2xl font-semibold text-forest-800 mb-6">
              {t('scoring.title')}
            </h2>
            <ScoreInputForm
              onSubmit={handleScoreSubmit}
              challengeId={challengeId}
            />
          </section>
        )}

        {/* Result Display */}
        {result && (
          <section className="card mb-8 overflow-hidden p-0">
            {/* 미션 이미지: 해상도 무관하게 컨테이너 안에서만 표시 */}
            <div className="w-full overflow-hidden rounded-t-xl aspect-[4/3] bg-forest-100">
              <img
                src={getMissionThumbnailUrl(challengeId, {
                  difficulty: result.medal || 'bronze',
                  isVictory: result.isVictory
                })}
                alt=""
                className="w-full h-full object-cover object-center"
              />
            </div>

            <div className="p-6">
              <div className={`flex items-center gap-3 mb-4 ${
                result.isVictory ? 'text-forest-800' : 'text-moor-800'
              }`}>
                <span className="text-4xl">
                  {result.isVictory ? '🎉' : '😢'}
                </span>
                <div>
                  <h2 className="text-2xl font-bold">
                    {result.isVictory ? t('scoring.victory') : t('scoring.defeat')}
                  </h2>
                  <p className="text-lg font-semibold">
                    {result.score}점
                    {result.medal && (
                      <span className="ml-2">
                        {result.medal === 'bronze' && '🥉'}
                        {result.medal === 'silver' && '🥈'}
                        {result.medal === 'gold' && '🥇'}
                        {t(`setup.${result.medal}`)} 메달
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {result.requiredScore && (
                <p className="text-forest-600 mb-4">
                  {t('scoring.scoreRequired')}: {result.requiredScore}점
                </p>
              )}

              <div className="flex gap-4">
                <button
                  onClick={() => setShowCertificate(true)}
                  className="btn-primary flex-1"
                >
                  {t('certificate.title')}
                </button>
                <button
                  onClick={handleNewGame}
                  className="btn-secondary flex-1"
                >
                  {t('setup.title')}
                </button>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Victory Certificate Modal */}
      {showCertificate && result && (
        <VictoryCertificate
          history={result.history}
          onClose={() => setShowCertificate(false)}
        />
      )}
    </div>
  )
}
