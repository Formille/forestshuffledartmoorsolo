import { AutomaCard, ActionLog } from '../types'
import { generateAutomaDeck, regenerateAutomaDeck } from '../data/automaDeck'

/**
 * 다음 오토마 카드를 가져옵니다
 */
export function getNextAutomaCard(
  deck: AutomaCard[],
  discard: AutomaCard[]
): { card: AutomaCard | null; newDeck: AutomaCard[]; newDiscard: AutomaCard[] } {
  let newDeck = [...deck]
  let newDiscard = [...discard]
  
  // 덱이 비어있으면 버려진 카드를 재생성
  if (newDeck.length === 0) {
    if (newDiscard.length === 0) {
      // 처음 시작하는 경우
      newDeck = generateAutomaDeck()
    } else {
      // 버려진 카드를 재셔플
      newDeck = regenerateAutomaDeck(newDiscard)
      newDiscard = []
    }
  }
  
  // 맨 위 카드를 가져옴
  const card = newDeck.shift() || null
  
  // 사용한 카드를 버림
  if (card) {
    newDiscard.push(card)
  }
  
  return {
    card,
    newDeck,
    newDiscard
  }
}

/**
 * 오토마 행동을 처리하고 로그를 생성합니다
 */
export function processAutomaAction(
  card: AutomaCard,
  clearingCardCount: number = 0 // 공터에 있는 카드 수 (실제 게임에서는 추적 필요)
): ActionLog {
  const actualRemove = Math.min(card.removeCount, clearingCardCount)
  
  return {
    id: `action-${Date.now()}-${Math.random()}`,
    timestamp: new Date().toISOString(),
    cardId: card.id,
    action: {
      add: card.addCount,
      remove: actualRemove,
      direction: card.removeDirection,
      burn: card.burnTopCard
    }
  }
}

/**
 * 게임 초기화
 */
export function initializeGame(): {
  automaDeck: AutomaCard[]
  automaDiscard: AutomaCard[]
  currentAutomaCard: AutomaCard | null
  round: number
} {
  const automaDeck = generateAutomaDeck()
  const { card, newDeck, newDiscard } = getNextAutomaCard(automaDeck, [])
  
  return {
    automaDeck: newDeck,
    automaDiscard: newDiscard,
    currentAutomaCard: card,
    round: 1
  }
}

