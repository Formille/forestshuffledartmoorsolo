import { GameHistory } from '../types'

const STORAGE_KEY = 'dartmoor-game-history'

/**
 * 게임 기록 저장
 */
export function saveGameHistory(history: Omit<GameHistory, 'id' | 'date'> & {
  playerName?: string
  duration?: number
  completedAt?: number
}): GameHistory {
  const gameHistory: GameHistory = {
    id: `game-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    date: new Date().toISOString().split('T')[0],
    ...history
  }

  const histories = getGameHistory()
  histories.unshift(gameHistory) // 최신 기록을 앞에 추가
  
  // 최대 100개까지만 저장
  const limitedHistories = histories.slice(0, 100)
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedHistories))
  
  return gameHistory
}

/**
 * 게임 기록 조회
 */
export function getGameHistory(): GameHistory[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return []
    
    return JSON.parse(data) as GameHistory[]
  } catch (error) {
    console.error('Failed to load game history:', error)
    return []
  }
}

/**
 * 특정 기록 조회
 */
export function getGameHistoryById(id: string): GameHistory | null {
  const histories = getGameHistory()
  return histories.find(h => h.id === id) || null
}

/**
 * 게임 기록 삭제
 */
export function deleteGameHistory(id: string): boolean {
  try {
    const histories = getGameHistory()
    const filtered = histories.filter(h => h.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
    return true
  } catch (error) {
    console.error('Failed to delete game history:', error)
    return false
  }
}

/**
 * 모든 기록 삭제
 */
export function clearAllHistory(): boolean {
  try {
    localStorage.removeItem(STORAGE_KEY)
    return true
  } catch (error) {
    console.error('Failed to clear game history:', error)
    return false
  }
}

