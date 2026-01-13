import { useGameStore } from '../store/gameStore'
import { Difficulty } from '../types'

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
    startGame,
    nextAction,
    endGame,
    resetGame
  } = useGameStore()

  const startNewGame = (challengeId: number, difficulty: Difficulty) => {
    startGame(challengeId, difficulty)
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
    startNewGame,
    proceedToNextAction,
    finishGame,
    clearGame,
    remainingCards: automaDeck.length
  }
}

