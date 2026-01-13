import { useTranslation } from 'react-i18next'
import { useGameState } from '../hooks/useGameState'
import { AutomaActionDisplay } from './AutomaActionDisplay'
import { LanguageSwitcher } from './LanguageSwitcher'

export function PlayScreen() {
  const { t } = useTranslation()
  const {
    currentAutomaCard,
    round,
    remainingCards,
    proceedToNextAction,
    finishGame
  } = useGameState()

  if (!currentAutomaCard) {
    return (
      <div className="min-h-screen bg-forest-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-forest-600 mb-4">{t('play.noMoreCards')}</p>
          <button
            onClick={() => proceedToNextAction()}
            className="btn-primary"
          >
            {t('play.nextAction')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-forest-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-forest-800 mb-2">
              {t('play.title')}
            </h1>
            <div className="flex gap-4 text-forest-600">
              <span>
                {t('play.round')}: {round}
              </span>
              <span>
                {t('play.remainingCards')}: {remainingCards}
              </span>
            </div>
          </div>
          <LanguageSwitcher />
        </div>

        {/* Current Action Display */}
        <section className="mb-8 animate-fade-in">
          <h2 className="text-2xl font-semibold text-forest-800 mb-4">
            {t('play.currentAction')}
          </h2>
          <AutomaActionDisplay card={currentAutomaCard} />
        </section>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={() => proceedToNextAction()}
            className="btn-primary w-full text-xl py-4"
          >
            {t('play.nextAction')}
          </button>
          
          <button
            onClick={finishGame}
            className="btn-secondary w-full text-xl py-4"
          >
            {t('play.winterCard')}
          </button>
        </div>
      </div>
    </div>
  )
}

