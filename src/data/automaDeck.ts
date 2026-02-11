import { AutomaCard } from '../types'
import { shuffle } from '../utils/shuffle'

/** 오토마 카드 고유 ID (1~20) */
const CARD_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20] as const

/**
 * 오토마 덱 생성 함수
 * 총 20장의 카드를 생성합니다. 각 카드는 1~20 고유 ID를 가집니다.
 */
export function generateAutomaDeck(): AutomaCard[] {
  const cards: AutomaCard[] = []
  let idx = 0
  
  // 1. 3장 추가 : 2장 (ID 1, 2)
  for (let i = 0; i < 2; i++) {
    cards.push({
      id: CARD_IDS[idx++],
      addCount: 3,
      removeCount: 0,
      removeDirection: null,
      burnCount: 0
    })
  }
  
  // 2. 3장 추가 + 더미에서 1장 제거 : 2장 (ID 3, 4)
  for (let i = 0; i < 2; i++) {
    cards.push({
      id: CARD_IDS[idx++],
      addCount: 3,
      removeCount: 0,
      removeDirection: null,
      burnCount: 1
    })
  }
  
  // 3. 2장 추가 : 2장 (ID 5, 6)
  for (let i = 0; i < 2; i++) {
    cards.push({
      id: CARD_IDS[idx++],
      addCount: 2,
      removeCount: 0,
      removeDirection: null,
      burnCount: 1
    })
  }
  
  // 4. 1장 추가 + 더미에서 2장 제거 : 2장 (ID 7, 8)
  for (let i = 0; i < 2; i++) {
    cards.push({
      id: CARD_IDS[idx++],
      addCount: 1,
      removeCount: 0,
      removeDirection: null,
      burnCount: 2
    })
  }
  
  // 5. 공터 왼쪽에서부터 2장 제거 : 1장 (ID 9)
  cards.push({
    id: CARD_IDS[idx++],
    addCount: 0,
    removeCount: 2,
    removeDirection: 'left_to_right'
  })
  
  // 6. 공터 오른쪽에서부터 2장 제거 : 1장 (ID 10)
  cards.push({
    id: CARD_IDS[idx++],
    addCount: 0,
    removeCount: 2,
    removeDirection: 'right_to_left'
  })
  
  // 7. 공터 왼쪽에서부터 3장 제거 : 1장 (ID 11)
  cards.push({
    id: CARD_IDS[idx++],
    addCount: 0,
    removeCount: 3,
    removeDirection: 'left_to_right'
  })
  
  // 8. 공터 오른쪽에서부터 3장 제거 : 1장 (ID 12)
  cards.push({
    id: CARD_IDS[idx++],
    addCount: 0,
    removeCount: 3,
    removeDirection: 'right_to_left'
  })
  
  // 9. 공터 왼쪽에서부터 3장 제거 + 더미에서 1장 제거: 1장 (ID 13)
  cards.push({
    id: CARD_IDS[idx++],
    addCount: 0,
    removeCount: 3,
    removeDirection: 'left_to_right',
    burnCount: 1
  })
  
  // 10. 공터 오른쪽에서부터 3장 제거 + 더미에서 1장 제거: 1장 (ID 14)
  cards.push({
    id: CARD_IDS[idx++],
    addCount: 0,
    removeCount: 3,
    removeDirection: 'right_to_left',
    burnCount: 1
  })
  
  // 11. 공터 왼쪽에서부터 1장 제거 + 더미에서 1장 제거: 3장 (ID 15, 16, 17)
  for (let i = 0; i < 3; i++) {
    cards.push({
      id: CARD_IDS[idx++],
      addCount: 0,
      removeCount: 1,
      removeDirection: 'left_to_right',
      burnCount: 1
    })
  }
  
  // 12. 공터 오른쪽에서부터 1장 제거 + 더미에서 1장 제거: 3장 (ID 18, 19, 20)
  for (let i = 0; i < 3; i++) {
    cards.push({
      id: CARD_IDS[idx++],
      addCount: 0,
      removeCount: 1,
      removeDirection: 'right_to_left',
      burnCount: 1
    })
  }
  
  // 셔플하여 반환
  return shuffle(cards)
}

/** ID별 카드 정의 (persist 복원 시 누락된 필드 보완용) */
const CARDS_BY_ID = (() => {
  const deck = generateAutomaDeck()
  const map = new Map<number, AutomaCard>()
  deck.forEach(c => map.set(c.id, c))
  return map
})()

/** ID로 전체 카드 정의 반환 (표시 시 누락 필드 보완) */
export function getCanonicalCard(id: number): AutomaCard | undefined {
  return CARDS_BY_ID.get(id)
}

/**
 * 오토마 덱 재생성 (버려진 카드로부터)
 */
export function regenerateAutomaDeck(discard: AutomaCard[]): AutomaCard[] {
  return shuffle(discard)
}

