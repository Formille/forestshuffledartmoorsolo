import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScoreInput } from '../types'
import { calculateSpecialCardScores } from '../services/scoring'

interface ScoreInputFormProps {
  onSubmit: (input: ScoreInput, adjustedScore: number) => void
  challengeId: number
  difficulty: 'bronze' | 'silver' | 'gold'
}

export function ScoreInputForm({ onSubmit, challengeId, difficulty }: ScoreInputFormProps) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language as 'ko' | 'en'
  
  const [totalScore, setTotalScore] = useState<number>(0)
  const [moors, setMoors] = useState<number>(0)
  const [blackTailedGodwits, setBlackTailedGodwits] = useState<number>(0)
  const [dartmoorPonies, setDartmoorPonies] = useState<number>(0)
  const [goalMet, setGoalMet] = useState<boolean>(false)
  const [isWingedKingdom, setIsWingedKingdom] = useState<boolean>(false)

  const specialScores = calculateSpecialCardScores(moors, blackTailedGodwits, dartmoorPonies)
  const adjustedScore = totalScore + specialScores.totalSpecialScore

  const handleSubmit = () => {
    const input: ScoreInput = {
      totalScore,
      moors,
      blackTailedGodwits,
      dartmoorPonies,
      goalMet
    }
    onSubmit(input, adjustedScore)
  }

  return (
    <div className="space-y-6">
      {/* Total Score */}
      <div>
        <label className="block text-forest-800 font-semibold mb-2">
          {t('scoring.totalScore')}
        </label>
        <input
          type="number"
          value={totalScore || ''}
          onChange={(e) => setTotalScore(Number(e.target.value))}
          className="w-full px-4 py-3 rounded-lg border-2 border-forest-300 focus:border-forest-500 focus:outline-none text-lg"
          min="0"
        />
      </div>

      {/* Moors (Required) */}
      <div>
        <label className="block text-forest-800 font-semibold mb-2">
          {t('scoring.moorsRequired')} *
        </label>
        <input
          type="number"
          value={moors || ''}
          onChange={(e) => setMoors(Number(e.target.value))}
          className="w-full px-4 py-3 rounded-lg border-2 border-forest-300 focus:border-forest-500 focus:outline-none text-lg"
          min="0"
          required
        />
      </div>

      {/* Black-Tailed Godwit */}
      <div>
        <label className="block text-forest-800 font-semibold mb-2">
          {t('scoring.blackTailedGodwit')}
        </label>
        <input
          type="number"
          value={blackTailedGodwits || ''}
          onChange={(e) => setBlackTailedGodwits(Number(e.target.value))}
          className="w-full px-4 py-3 rounded-lg border-2 border-forest-300 focus:border-forest-500 focus:outline-none text-lg mb-2"
          min="0"
        />
        <p className="text-sm text-forest-600">
          {t('scoring.blackTailedGodwitNote')}
        </p>
        {blackTailedGodwits > 0 && (
          <p className="text-sm text-moor-700 mt-1">
            점수: {specialScores.godwitScore}점
          </p>
        )}
      </div>

      {/* Dartmoor Pony */}
      <div>
        <label className="block text-forest-800 font-semibold mb-2">
          {t('scoring.dartmoorPony')}
        </label>
        <input
          type="number"
          value={dartmoorPonies || ''}
          onChange={(e) => setDartmoorPonies(Number(e.target.value))}
          className="w-full px-4 py-3 rounded-lg border-2 border-forest-300 focus:border-forest-500 focus:outline-none text-lg mb-2"
          min="0"
        />
        <p className="text-sm text-forest-600">
          {t('scoring.dartmoorPonyNote')}
        </p>
        {dartmoorPonies > 0 && (
          <p className="text-sm text-moor-700 mt-1">
            점수: {specialScores.ponyScore}점
          </p>
        )}
      </div>

      {/* Goal Met Checkbox */}
      <div>
        {challengeId === 15 ? (
          <div className="card bg-moor-50 border-2 border-moor-300">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={goalMet}
                onChange={(e) => setGoalMet(e.target.checked)}
                className="mt-1 w-5 h-5"
              />
              <div>
                <p className="font-semibold text-moor-800 mb-1">
                  {t('scoring.wingedKingdomCheck')}
                </p>
                <p className="text-sm text-moor-600">
                  {t('scoring.goalMet')}
                </p>
              </div>
            </label>
          </div>
        ) : (
          <label className="flex items-center gap-3 cursor-pointer card">
            <input
              type="checkbox"
              checked={goalMet}
              onChange={(e) => setGoalMet(e.target.checked)}
              className="w-5 h-5"
            />
            <span className="font-semibold text-forest-800">
              {t('scoring.goalMet')}
            </span>
          </label>
        )}
      </div>

      {/* Adjusted Score Display */}
      <div className="card bg-forest-50 border-2 border-forest-300">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-forest-800">
            {t('scoring.scoreAchieved')}:
          </span>
          <span className="text-2xl font-bold text-forest-600">
            {adjustedScore}점
          </span>
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={moors === 0}
        className="btn-primary w-full text-xl py-4 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {t('scoring.calculate')}
      </button>
    </div>
  )
}

