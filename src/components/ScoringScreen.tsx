import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGameState } from '../hooks/useGameState'
import { ScoreInputForm } from './ScoreInputForm'
import { ScoreInput, Difficulty } from '../types'
import { checkVictory } from '../services/scoring'
import { getChallengeById } from '../data/challenges'
import { saveGameHistory } from '../services/history'
import { LanguageSwitcher } from './LanguageSwitcher'
import { VictoryCertificate } from './VictoryCertificate'
import { GameHistory } from '../types'

export function ScoringScreen() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language as 'ko' | 'en'
  const { challengeId, difficulty, clearGame } = useGameState()
  const [result, setResult] = useState<{
    isVictory: boolean
    score: number
    requiredScore: number
    history: GameHistory
  } | null>(null)
  const [showCertificate, setShowCertificate] = useState(false)

  if (!challengeId || !difficulty) {
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

  const requiredScore = challenge.minScore[difficulty]

  const handleScoreSubmit = (input: ScoreInput, adjustedScore: number) => {
    const isVictory = checkVictory(adjustedScore, challengeId, difficulty, input.goalMet)

    const savedHistory = saveGameHistory({
      challengeId,
      difficulty: difficulty as Difficulty,
      score: adjustedScore,
      goalMet: input.goalMet,
      isVictory
    })

    setResult({
      isVictory,
      score: adjustedScore,
      requiredScore,
      history: savedHistory
    })

    if (isVictory) {
      setShowCertificate(true)
    }
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
              difficulty={difficulty}
            />
          </section>
        )}

        {/* Result Display */}
        {result && (
          <section className="card mb-8">
            <div className={`text-center p-8 rounded-lg ${
              result.isVictory
                ? 'bg-forest-100 border-4 border-forest-500'
                : 'bg-moor-100 border-4 border-moor-500'
            }`}>
              <div className="text-6xl mb-4">
                {result.isVictory ? '🎉' : '😢'}
              </div>
              <h2 className={`text-4xl font-bold mb-4 ${
                result.isVictory ? 'text-forest-800' : 'text-moor-800'
              }`}>
                {result.isVictory ? t('scoring.victory') : t('scoring.defeat')}
              </h2>
              <div className="space-y-2 mb-6">
                <p className="text-lg text-forest-700">
                  {t('scoring.scoreAchieved')}: <strong>{result.score}점</strong>
                </p>
                <p className="text-lg text-forest-700">
                  {t('scoring.scoreRequired')}: <strong>{result.requiredScore}점</strong>
                </p>
              </div>
              {result.isVictory && (
                <p className="text-xl text-forest-800 font-semibold">
                  {t('scoring.victoryMessage', { difficulty: t(`setup.${difficulty}`) })}
                </p>
              )}
              {!result.isVictory && (
                <p className="text-xl text-moor-800 font-semibold">
                  {t('scoring.defeatMessage')}
                </p>
              )}
            </div>

            <div className="mt-6 flex gap-4">
              {result.isVictory && (
                <button
                  onClick={() => setShowCertificate(true)}
                  className="btn-primary flex-1"
                >
                  {t('certificate.title')}
                </button>
              )}
              <button
                onClick={handleNewGame}
                className="btn-secondary flex-1"
              >
                {t('setup.title')}
              </button>
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
