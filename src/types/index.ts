export type GamePhase = 'setup' | 'playing' | 'scoring' | 'finished'
export type Difficulty = 'bronze' | 'silver' | 'gold'
/** left_to_right: 공터 왼쪽에서 제거, right_to_left: 공터 오른쪽에서 제거, null: 공터 추가만 또는 추가+더미제거(burnCount) */
export type RemoveDirection = 'left_to_right' | 'right_to_left' | null

export interface AutomaCard {
  id: number
  addCount: number // 1-3
  removeCount: number // left/right 시 공터 제거 수
  removeDirection: RemoveDirection
  burnCount?: number // 더미에서 제거할 수 (0이면 생략)
}

export interface Challenge {
  id: number
  title: {
    ko: string
    en: string
  }
  description: {
    ko: string
    en: string
  }
  minScore: {
    bronze: number
    silver: number
    gold: number
  }
  validationType: 'diversity' | 'count' | 'score' | 'complex'
  specialSetup?: string // Challenge #7의 경우
}

export interface GameState {
  phase: GamePhase
  challengeId: number | null
  difficulty: Difficulty | null
  automaDeck: AutomaCard[]
  automaDiscard: AutomaCard[]
  currentAutomaCard: AutomaCard | null
  round: number
  actionHistory: ActionLog[]
  startTime: string | null
}

export interface ActionLog {
  id: string
  timestamp: string
  cardId: number
  action: {
    add: number
    remove: number
    direction: RemoveDirection
    burn: number // 더미에서 제거할 수 (0이면 없음)
  }
}

export interface GameHistory {
  id: string
  date: string
  challengeId: number
  difficulty: Difficulty
  score: number
  goalMet: boolean
  isVictory: boolean
  note?: string
  certificateImage?: string // Base64 인코딩된 이미지
  playerName?: string
  duration?: number // 플레이 시간 (초)
  completedAt?: number // Unix timestamp
}

/** QR 인증용 컴팩트 기록 포맷 - c: [챌린지id, 점수, 메달] 메달: 0=실패 1=동 2=은 3=금 */
export interface VerificationRecord {
  t: number      // Unix timestamp
  d: number      // 플레이 시간 (초)
  c: [number, number, number]  // [challengeId, score, medal]
}

export interface VerificationData {
  p: string      // 플레이어 이름
  l: string      // 언어 (ko, en)
  g: string      // 게임 코드 (FS_D)
  r: VerificationRecord[]
}

export interface ScoreInput {
  totalScore: number
  moors: number
  blackTailedGodwits: number
  dartmoorPonies: number
  goalMet: boolean
}

