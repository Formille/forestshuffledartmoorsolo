import { Difficulty } from '../types'
import { getChallengeById } from '../data/challenges'

/**
 * 습지·흑꼬리도요·다트무어 포니 점수는 점수 계산 단계에서 안내문구로만 안내하며,
 * 사용자가 총점에 직접 포함하여 입력함
 */

/**
 * 점수에 따라 메달 결정
 */
export function determineMedal(score: number, challengeId: number): Difficulty | null {
  const challenge = getChallengeById(challengeId)
  if (!challenge) return null
  
  // 점수가 높은 메달부터 확인
  if (score >= challenge.minScore.gold) {
    return 'gold'
  } else if (score >= challenge.minScore.silver) {
    return 'silver'
  } else if (score >= challenge.minScore.bronze) {
    return 'bronze'
  }
  
  return null
}

/**
 * 승리 조건 검증
 */
export function checkVictory(
  score: number,
  challengeId: number,
  goalMet: boolean
): {
  isVictory: boolean
  medal: Difficulty | null
} {
  const challenge = getChallengeById(challengeId)
  if (!challenge) {
    return { isVictory: false, medal: null }
  }
  
  const medal = determineMedal(score, challengeId)
  
  // 목표를 달성하고 메달을 획득해야 승리
  const isVictory = medal !== null && goalMet
  
  return { isVictory, medal }
}

/**
 * 도전 과제 목표 달성 여부 검증
 * (실제 검증은 사용자가 직접 확인하지만, 여기서는 기본 검증 로직 제공)
 */
export function validateChallengeGoal(
  challengeId: number,
  goalMet: boolean
): boolean {
  // Challenge #15 (Winged Kingdom)는 복잡한 검증이 필요하므로
  // 사용자가 직접 확인해야 함
  if (challengeId === 15) {
    return goalMet // 사용자 확인 결과를 그대로 사용
  }
  
  // 다른 도전 과제도 사용자가 직접 확인
  return goalMet
}

