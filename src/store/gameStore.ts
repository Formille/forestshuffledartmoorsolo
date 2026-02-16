import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { GameState, GamePhase, ActionLog } from '../types'
import { initializeGame, getNextAutomaCard, processAutomaAction } from '../services/gameLogic'

interface GameStore extends GameState {
  playerName: string
  playDuration: number | null  // 점수계산 페이지 이동 시 기록된 플레이 시간(초)
  shownCardsSinceShuffle: number[]  // 마지막 섞기 이후 나온 카드 ID (순서)
  // Actions
  setPlayerName: (name: string) => void
  startGame: (challengeId: number) => void
  nextAction: (clearingCardCount?: number) => void
  endGame: () => void
  resetGame: () => void
  addActionLog: (log: ActionLog) => void
  setPhase: (phase: GamePhase) => void
}

const PLAYER_NAME_KEY = 'dartmoor-player-name'

const initialState: GameState & { playerName: string; playDuration: number | null; shownCardsSinceShuffle: number[] } = {
  phase: 'setup',
  challengeId: null,
  difficulty: null,
  automaDeck: [],
  automaDiscard: [],
  currentAutomaCard: null,
  round: 1,
  actionHistory: [],
  startTime: null,
  playerName: localStorage.getItem(PLAYER_NAME_KEY) || '',
  playDuration: null,
  shownCardsSinceShuffle: []
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setPlayerName: (name: string) => {
        localStorage.setItem(PLAYER_NAME_KEY, name)
        set({ playerName: name })
      },

      startGame: (challengeId: number) => {
        const gameInit = initializeGame()
        set({
          phase: 'playing',
          challengeId,
          difficulty: null,
          startTime: new Date().toISOString(),
          ...gameInit,
          shownCardsSinceShuffle: []  // 첫 카드는 표시 시 currentAutomaCard로 포함
        })
      },

      nextAction: (clearingCardCount: number = 0) => {
        const state = get()
        if (!state.currentAutomaCard) return

        // 현재 카드 처리
        const log = processAutomaAction(state.currentAutomaCard, clearingCardCount)
        
        // 다음 카드 가져오기
        const { card, newDeck, newDiscard } = getNextAutomaCard(
          state.automaDeck,
          state.automaDiscard
        )

        // 라운드 증가 (덱이 재생성될 때)
        let newRound = state.round
        const didReshuffle = state.automaDeck.length === 0 && state.automaDiscard.length > 0
        if (didReshuffle) {
          newRound += 1
        }

        // 마지막 섞기 이후 나온 카드: 재섞 시 초기화, 아니면 현재 카드 추가
        const prevShown = state.shownCardsSinceShuffle ?? []
        const newShownCardsSinceShuffle = didReshuffle
          ? (card ? [card.id] : [])
          : [...prevShown, state.currentAutomaCard.id]

        set({
          currentAutomaCard: card,
          automaDeck: newDeck,
          automaDiscard: newDiscard,
          round: newRound,
          actionHistory: [...state.actionHistory, log],
          shownCardsSinceShuffle: newShownCardsSinceShuffle
        })
      },

      endGame: () => {
        const state = get()
        const duration = state.startTime
          ? Math.floor((Date.now() - new Date(state.startTime).getTime()) / 1000)
          : 0
        set({
          phase: 'scoring',
          playDuration: duration > 0 ? duration : null,
          startTime: null  // 타이머 초기화
        })
      },

      resetGame: () => {
        const currentPlayerName = get().playerName || localStorage.getItem(PLAYER_NAME_KEY) || ''
        set({
          ...initialState,
          startTime: null,
          playDuration: null,
          playerName: currentPlayerName
        })
      },

      addActionLog: (log: ActionLog) => {
        set(state => ({
          actionHistory: [...state.actionHistory, log]
        }))
      },

      setPhase: (phase: GamePhase) => {
        set({ phase })
      }
    }),
    {
      name: 'dartmoor-game-storage',
      partialize: (state) => ({
        phase: state.phase,
        challengeId: state.challengeId,
        difficulty: state.difficulty,
        automaDeck: state.automaDeck,
        automaDiscard: state.automaDiscard,
        currentAutomaCard: state.currentAutomaCard,
        round: state.round,
        actionHistory: state.actionHistory,
        startTime: state.startTime,
        playerName: state.playerName,
        playDuration: state.playDuration,
        shownCardsSinceShuffle: state.shownCardsSinceShuffle
      })
    }
  )
)

