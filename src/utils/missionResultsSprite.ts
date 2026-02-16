import missionResultsAtlas from '../data/mission_results_atlas.json'

export type ResultType = 'fail' | 'bronze' | 'silver' | 'gold'

const RESULT_NAMES: ResultType[] = ['fail', 'bronze', 'silver', 'gold']

type AtlasMeta = { width: number; height: number }
type AtlasFrame = { x: number; y: number; w: number; h: number }
const atlas = missionResultsAtlas as {
  meta: AtlasMeta
  frames: Record<string, AtlasFrame>
}

/** 스프라이트 시트 전체 크기 (아틀라스 meta, 해상도 무관) */
export function getSpriteMeta(): { width: number; height: number } {
  return { width: atlas.meta.width, height: atlas.meta.height }
}

/** 메달 코드(0~3) → result_name */
export function medalCodeToResultName(code: number): ResultType {
  const idx = Math.max(0, Math.min(3, code))
  return RESULT_NAMES[idx]
}

/** missionId + medalCode → 아틀라스 프레임 키 */
export function getFrameKey(missionId: number, medalCode: number): string {
  const resultName = medalCodeToResultName(medalCode)
  return `${missionId}_${resultName}`
}

/** 아틀라스에서 프레임 정보 조회 */
export function getFrame(missionId: number, medalCode: number): { x: number; y: number; w: number; h: number } | null {
  const key = getFrameKey(missionId, medalCode)
  const frame = atlas.frames[key]
  return frame ?? null
}
