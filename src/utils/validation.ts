import { Challenge } from '../types'

/**
 * 도전 과제별 검증 로직
 * 실제 게임에서는 플레이어가 직접 확인하지만,
 * 여기서는 검증 타입에 따른 기본 로직을 제공
 */

export function validateChallenge(
  challenge: Challenge,
  playerData: {
    goalMet: boolean
    // 향후 확장 가능: 실제 카드 데이터 등
  }
): boolean {
  switch (challenge.validationType) {
    case 'diversity':
      // 종 다양성 체크 (Challenge #1, #3, #8)
      // 실제로는 플레이어가 직접 확인
      return playerData.goalMet
    
    case 'count':
      // 개수 체크 (대부분의 도전 과제)
      return playerData.goalMet
    
    case 'score':
      // 점수 체크 (Challenge #6, #7)
      return playerData.goalMet
    
    case 'complex':
      // 복잡한 조건 (Challenge #15: Winged Kingdom)
      // 모든 나무/관목/습지에 새가 2마리 이상인지 확인
      // 사용자가 직접 확인해야 함
      return playerData.goalMet
    
    default:
      return playerData.goalMet
  }
}

/**
 * Challenge #15 (Winged Kingdom) 특별 검증 안내
 */
export function getWingedKingdomValidationMessage(lang: 'ko' | 'en' = 'ko'): string {
  if (lang === 'ko') {
    return '모든 나무, 관목, 습지에 새가 최소 2마리씩 배치되어 있습니까?'
  }
  return 'Do you have at least 2 birds on every tree, bush, and moor?'
}

