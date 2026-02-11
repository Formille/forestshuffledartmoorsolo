import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScoreInput } from '../types'
import { getChallengeById } from '../data/challenges'

interface ScoreInputFormProps {
  onSubmit: (input: ScoreInput, adjustedScore: number) => void
  challengeId: number
}

export function ScoreInputForm({ onSubmit, challengeId }: ScoreInputFormProps) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language as 'ko' | 'en'
  
  const challenge = getChallengeById(challengeId)
  
  const [totalScore, setTotalScore] = useState<number>(0)
  const [goalMet, setGoalMet] = useState<boolean>(false)

  const handleSubmit = () => {
    const input: ScoreInput = {
      totalScore,
      moors: 0,
      blackTailedGodwits: 0,
      dartmoorPonies: 0,
      goalMet
    }
    onSubmit(input, totalScore)
  }

  return (
    <div className="space-y-6">
      {/* Challenge Goal Checklist - First */}
      {challenge && (
        <div className="card bg-forest-50 border-2 border-forest-300">
          <h3 className="font-bold text-forest-800 mb-3">
            {challenge.id}. {challenge.title[lang]} - {t('scoring.challengeChecklist')}
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-white rounded-lg border border-forest-200">
              <p className="text-sm text-forest-700 font-semibold mb-2">
                {challenge.description[lang]}
              </p>
              {(challengeId === 6 || challengeId === 7) && (
                <p className="text-sm text-moor-700 mt-2 font-semibold">
                  ⚠ {challenge.description[lang]} 조건을 충족했는지 확인하세요
                </p>
              )}
            </div>
            <p className="text-xs text-forest-600 italic">
              {t('scoring.challengeChecklistNote')}
            </p>
          </div>
        </div>
      )}

      {/* 흑꼬리도요·다트무어 포니 점수 안내 */}
      <div className="card bg-moor-50 border-2 border-moor-200">
        <h3 className="font-bold text-moor-800 mb-2">
          {t('scoring.specialCardsGuideTitle')}
        </h3>
        <ul className="text-sm text-moor-700 space-y-1">
          <li>• {t('scoring.blackTailedGodwit')}: {t('scoring.blackTailedGodwitNote')}</li>
          <li>• {t('scoring.dartmoorPony')}: {t('scoring.dartmoorPonyNote')}</li>
        </ul>
        <p className="text-xs text-moor-600 mt-2 italic">
          {t('scoring.specialCardsGuideNote')}
        </p>
      </div>

      {/* Goal Met Checkbox - Second */}
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
        <p className="text-xs text-forest-600 mt-1">
          {t('scoring.totalScoreNote')}
        </p>
      </div>

      {/* Score Display with Medal Requirements */}
      <div className="card bg-forest-50 border-2 border-forest-300">
        <div className="flex justify-between items-center mb-3">
          <span className="font-semibold text-forest-800">
            {t('scoring.scoreAchieved')}:
          </span>
          <span className="text-2xl font-bold text-forest-600">
            {totalScore}점
          </span>
        </div>
        {/* Medal Score Requirements - Only show if goal is met */}
        {goalMet && challenge && (
          <div className="pt-3 border-t border-forest-200">
            <p className="text-xs text-forest-600 mb-2 font-semibold">
              {t('scoring.medalScoreRequirements')}:
            </p>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center">
                <span className="text-lg">🥉</span>
                <p className="text-forest-700 font-semibold">
                  {t('setup.bronze')}: {challenge.minScore.bronze}점
                </p>
              </div>
              <div className="text-center">
                <span className="text-lg">🥈</span>
                <p className="text-forest-700 font-semibold">
                  {t('setup.silver')}: {challenge.minScore.silver}점
                </p>
              </div>
              <div className="text-center">
                <span className="text-lg">🥇</span>
                <p className="text-forest-700 font-semibold">
                  {t('setup.gold')}: {challenge.minScore.gold}점
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Save Button */}
      <button
        onClick={handleSubmit}
        className="btn-primary w-full text-xl py-4"
      >
        {t('scoring.saveRecord')}
      </button>
    </div>
  )
}

