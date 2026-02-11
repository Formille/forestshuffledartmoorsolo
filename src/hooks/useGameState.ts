import { useGameStore } from '../store/gameStore'

export function useGameState() {
  const {
    phase,
    challengeId,
    difficulty,
    automaDeck,
    automaDiscard,
    currentAutomaCard,
    round,
    actionHistory,
    shownCardsSinceShuffle,
    startGame,
    nextAction,
    endGame,
    resetGame
  } = useGameStore()

  const startNewGame = (challengeId: number) => {
    startGame(challengeId)
  }

  const proceedToNextAction = (clearingCardCount?: number) => {
    nextAction(clearingCardCount)
  }

  const finishGame = () => {
    endGame()
  }

  const clearGame = () => {
    resetGame()
  }

  return {
    phase,
    challengeId,
    difficulty,
    automaDeck,
    automaDiscard,
    currentAutomaCard,
    round,
    actionHistory,
    shownCardsSinceShuffle: shownCardsSinceShuffle ?? [],
    startNewGame,
    proceedToNextAction,
    finishGame,
    clearGame,
    remainingCards: automaDeck.length
  }
}

