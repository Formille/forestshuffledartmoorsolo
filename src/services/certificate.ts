import { GameHistory } from '../types'
import { getChallengeById } from '../data/challenges'
import { historiesToVerificationData, encodeToQRDataUrl } from './verification'
import { getGameHistory } from './history'

/**
 * Canvas API를 사용한 인증 이미지 생성 (QR 포함)
 */
export function generateCertificate(
  history: GameHistory,
  language: 'ko' | 'en' = 'ko'
): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const canvas = document.createElement('canvas')
    canvas.width = 1200
    canvas.height = 800
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      reject(new Error('Canvas context not available'))
      return
    }

    // 배경 그라데이션
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    gradient.addColorStop(0, '#f0f4e8')
    gradient.addColorStop(0.5, '#d9e4c8')
    gradient.addColorStop(1, '#b8cc9a')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // 제목
    ctx.fillStyle = '#2d5016'
    ctx.font = 'bold 48px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('Forest Shuffle: Dartmoor', canvas.width / 2, 80)
    
    ctx.font = '32px Arial'
    ctx.fillText(
      language === 'ko' ? '솔로 도전 완료' : 'Solo Challenge Completed',
      canvas.width / 2,
      130
    )

    // 메달 아이콘
    const medalEmoji = {
      bronze: '🥉',
      silver: '🥈',
      gold: '🥇'
    }[history.difficulty]
    
    ctx.font = '120px Arial'
    ctx.fillText(medalEmoji, canvas.width / 2, 250)

    // 도전 과제 정보
    const challenge = getChallengeById(history.challengeId)
    ctx.fillStyle = '#1f3a0f'
    ctx.font = 'bold 36px Arial'
    ctx.fillText(
      challenge ? `${challenge.id}. ${challenge.title[language]}` : `Challenge ${history.challengeId}`,
      canvas.width / 2,
      350
    )

    // 점수
    ctx.font = '28px Arial'
    ctx.fillText(
      `${language === 'ko' ? '점수' : 'Score'}: ${history.score}`,
      canvas.width / 2,
      420
    )

    // 난이도
    const difficultyText = {
      bronze: language === 'ko' ? '동메달' : 'Bronze',
      silver: language === 'ko' ? '은메달' : 'Silver',
      gold: language === 'ko' ? '금메달' : 'Gold'
    }[history.difficulty]
    
    ctx.fillText(
      `${language === 'ko' ? '난이도' : 'Difficulty'}: ${difficultyText}`,
      canvas.width / 2,
      470
    )

    // 날짜
    const date = new Date(history.date)
    const formattedDate = date.toLocaleDateString(
      language === 'ko' ? 'ko-KR' : 'en-US',
      { year: 'numeric', month: 'long', day: 'numeric' }
    )
    ctx.fillText(
      `${language === 'ko' ? '날짜' : 'Date'}: ${formattedDate}`,
      canvas.width / 2,
      520
    )

    // 결과
    ctx.font = 'bold 32px Arial'
    ctx.fillStyle = history.isVictory ? '#2d5016' : '#63477a'
    ctx.fillText(
      history.isVictory
        ? (language === 'ko' ? '승리!' : 'Victory!')
        : (language === 'ko' ? '패배' : 'Defeat'),
      canvas.width / 2,
      600
    )

    // QR 코드 (gzip 압축된 인증 데이터 - 누적된 전체 플레이 기록 포함)
    try {
      const allHistories = getGameHistory()
      const toTimestamp = (h: GameHistory) =>
        h.completedAt ?? Math.floor(new Date(h.date).getTime() / 1000)
      const sortedHistories = [...allHistories].sort(
        (a, b) => toTimestamp(a) - toTimestamp(b)
      )
      const verificationData = historiesToVerificationData(
        sortedHistories,
        history.playerName ?? '',
        language
      )
      const qrDataUrl = await encodeToQRDataUrl(verificationData)

      const qrSize = 160
      const qrX = canvas.width - qrSize - 40
      const qrY = canvas.height - qrSize - 40

      const qrImg = new Image()
      qrImg.onload = () => {
        ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize)
        const dataUrl = canvas.toDataURL('image/png')
        resolve(dataUrl)
      }
      qrImg.onerror = () => reject(new Error('QR image load failed'))
      qrImg.src = qrDataUrl
    } catch (error) {
      reject(error)
    }
  })
}

