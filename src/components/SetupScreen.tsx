import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { challenges } from '../data/challenges'
import { ChallengeCard } from './ChallengeCard'
import { useGameState } from '../hooks/useGameState'
import { Difficulty } from '../types'
import { LanguageSwitcher } from './LanguageSwitcher'

export function SetupScreen() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language as 'ko' | 'en'
  const { startNewGame } = useGameState()
  
  const [selectedChallengeId, setSelectedChallengeId] = useState<number | null>(null)
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null)

  const selectedChallenge = selectedChallengeId
    ? challenges.find(c => c.id === selectedChallengeId)
    : null

  const handleStartGame = () => {
    if (selectedChallengeId && selectedDifficulty) {
      startNewGame(selectedChallengeId, selectedDifficulty)
    }
  }

  return (
    <div className="min-h-screen bg-forest-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-forest-800 mb-2">
              {t('setup.title')}
            </h1>
            <p className="text-forest-600">{t('app.subtitle')}</p>
          </div>
          <LanguageSwitcher />
        </div>

        {/* Challenge Selection */}
        <section className="mb-8 animate-fade-in">
          <h2 className="text-2xl font-semibold text-forest-800 mb-4">
            {t('setup.selectChallenge')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {challenges.map(challenge => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                selected={selectedChallengeId === challenge.id}
                onClick={() => setSelectedChallengeId(challenge.id)}
              />
            ))}
          </div>
        </section>

        {/* Difficulty Selection */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-forest-800 mb-4">
            {t('setup.selectDifficulty')}
          </h2>
          <div className="flex gap-4">
            {(['bronze', 'silver', 'gold'] as Difficulty[]).map(difficulty => (
              <button
                key={difficulty}
                onClick={() => setSelectedDifficulty(difficulty)}
                className={`flex-1 card text-center transition-all ${
                  selectedDifficulty === difficulty
                    ? 'ring-4 ring-forest-500 bg-forest-50'
                    : 'hover:shadow-xl'
                }`}
              >
                <div className="text-4xl mb-2">
                  {difficulty === 'bronze' && '🥉'}
                  {difficulty === 'silver' && '🥈'}
                  {difficulty === 'gold' && '🥇'}
                </div>
                <h3 className="text-xl font-bold text-forest-800 mb-2">
                  {t(`setup.${difficulty}`)}
                </h3>
                {selectedChallenge && (
                  <p className="text-sm text-forest-600">
                    {t('scoring.scoreRequired')}: {selectedChallenge.minScore[difficulty]}
                  </p>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Special Setup Reminder */}
        {selectedChallenge?.specialSetup && (
          <section className="mb-8 p-4 bg-moor-100 rounded-lg border-2 border-moor-300">
            <h3 className="font-bold text-moor-900 mb-2">
              {t('setup.specialSetup')}
            </h3>
            <p className="text-moor-800">
              {selectedChallenge.specialSetup}
            </p>
          </section>
        )}

        {/* General Reminder */}
        <section className="mb-8 p-4 bg-tree-100 rounded-lg border-2 border-tree-300">
          <p className="text-tree-800">
            {t('setup.cave3Reminder')}
          </p>
        </section>

        {/* Start Button */}
        <button
          onClick={handleStartGame}
          disabled={!selectedChallengeId || !selectedDifficulty}
          className="btn-primary w-full text-xl py-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t('setup.startGame')}
        </button>
      </div>
    </div>
  )
}

