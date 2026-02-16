import { getFrame, getSpriteMeta } from '../utils/missionResultsSprite'

/** public 폴더에서 직접 서빙 (스프라이트 시트) */
const SPRITE_URL = '/mission_results_sprite.webp'

interface MissionResultThumbnailProps {
  missionId: number
  /** 0=실패, 1=동, 2=은, 3=금 */
  medalCode: number
  width?: number
  height?: number
  className?: string
}

/** 아틀라스 해상도에 무관하게 스프라이트에서 한 프레임만 표시 (넘침 방지) */
export function MissionResultThumbnail({
  missionId,
  medalCode,
  width = 120,
  height = 90,
  className = ''
}: MissionResultThumbnailProps) {
  const frame = getFrame(missionId, medalCode)
  if (!frame) return null

  const { width: spriteW, height: spriteH } = getSpriteMeta()
  const scaleX = width / frame.w
  const scaleY = height / frame.h
  const bgWidth = spriteW * scaleX
  const bgHeight = spriteH * scaleY
  const bgPosX = -frame.x * scaleX
  const bgPosY = -frame.y * scaleY

  return (
    <div
      className={`rounded-lg overflow-hidden bg-forest-100 flex-shrink-0 ${className}`}
      style={{
        width,
        height,
        backgroundImage: `url(${SPRITE_URL})`,
        backgroundSize: `${bgWidth}px ${bgHeight}px`,
        backgroundPosition: `${bgPosX}px ${bgPosY}px`,
        backgroundRepeat: 'no-repeat'
      }}
      role="img"
      aria-label={`Mission ${missionId} result thumbnail`}
    />
  )
}
