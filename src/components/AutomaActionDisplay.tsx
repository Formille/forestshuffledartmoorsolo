import type { CSSProperties } from 'react'
import { AutomaCard } from '../types'
import { useTranslation } from 'react-i18next'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import { getCanonicalCard } from '../data/automaDeck'

interface AutomaActionDisplayProps {
  card: AutomaCard
}

export function AutomaActionDisplay({ card }: AutomaActionDisplayProps) {
  const { t } = useTranslation()
  // persist 복원 시 burnCount 등 누락될 수 있으므로 canonical 정의로 보완
  const canonical = getCanonicalCard(card.id)
  const cardData = canonical ? { ...canonical, ...card } : card

  const getDirectionText = () => {
    if (cardData.removeDirection === 'left_to_right') return t('play.leftToRight')
    if (cardData.removeDirection === 'right_to_left') return t('play.rightToLeft')
    return ''
  }

  const isClearingRemove = cardData.removeDirection === 'left_to_right' || cardData.removeDirection === 'right_to_left'
  const burnCount = cardData.burnCount ?? 0

  // 공터 제거 애니메이션: 0.5s 페이드아웃 + 0.3s 딜레이*횟수 + 0.1s 복귀 + 1s 대기 + 1s 페이드인 + 0.5s 대기
  const removeCount = cardData.removeCount
  const cycleDuration = (removeCount - 1) * 0.3 + 0.5 + 0.1 + 1 + 1 + 0.5
  const getRemoveCardDelay = (index: number) => {
    if (cardData.removeDirection === 'right_to_left') {
      return (removeCount - 1 - index) * 0.3
    }
    return index * 0.3
  }
  const getRemoveCardAnimation = () => {
    return cardData.removeDirection === 'right_to_left'
      ? 'removeCardFadeOut'
      : 'removeCardFadeOutLeft'
  }

  // 덱 소각 애니메이션: 카드당 0.5s 소각 + 0.3s 간격, 공통 0.1s 복귀 + 1s 대기 + 1s 페이드인 + 0.5s 대기
  const burnCardDuration = 0.5
  const burnGapBetweenCards = 0.3
  const burnCycleDuration = (burnCount - 1) * burnGapBetweenCards + burnCardDuration + 0.1 + 1 + 1 + 0.5
  // 사라지는 순서 반대: 맨 앞(마지막) 카드부터 사라짐
  const getBurnCardDelayReversed = (index: number) => (burnCount - 1 - index) * burnGapBetweenCards

  // 공터 추가 애니메이션: 0.5s 비행 + 0.4s 카드 간격 + 2s 대기 + 1s 리셋
  const addCount = cardData.addCount
  const addCycleDuration = (addCount - 1) * 0.4 + 0.5 + 2 + 1
  const getAddCardDelay = (index: number) => index * 0.4

  return (
    <div className="space-y-4">
      {/* Step 1: Add Cards */}
      {cardData.addCount > 0 && (
        <div className="card bg-forest-50 border-2 border-forest-300">
          <div className="flex flex-col gap-3">
            <p className="text-forest-800 font-semibold">
              {t('play.step1', { count: cardData.addCount })}
            </p>
            <div className="flex gap-2 items-center mt-1 flex-wrap">
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-xs text-forest-600 font-medium">{t('play.step1DeckLabel')}</span>
                <div className="relative flex-shrink-0" style={{ width: 56, height: 72 }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute rounded border border-forest-300"
                      style={{
                        width: 48,
                        height: 64,
                        left: -i * 1.5,
                        top: -i * 1.5,
                        transform: `rotate(${-1.5 + i * 0.5}deg)`,
                        background: `linear-gradient(135deg, ${['#f0f4e8', '#d9e4c8', '#b8cc9a', '#9bb87a', '#8fa866'][i]} 0%, ${['#d9e4c8', '#b8cc9a', '#9bb87a', '#8fa866', '#7a9555'][i]} 100%)`,
                        boxShadow: '0 1px 2px rgba(0,0,0,0.08)'
                      }}
                    />
                  ))}
                </div>
              </div>
              <ArrowRight className="w-8 h-8 text-forest-600 flex-shrink-0" />
              <div
                className="w-12 h-16 rounded border border-forest-300 flex-shrink-0"
                style={{ background: 'linear-gradient(to right, transparent, rgba(184, 204, 154, 0.4))' }}
              />
              {Array.from({ length: addCount }).map((_, i) => (
                <div
                  key={i}
                  className="w-12 h-16 bg-forest-200 rounded border-2 border-forest-500 flex items-center justify-center flex-shrink-0"
                  style={{
                    ...{ '--add-card-offset': `calc(-10.5rem - ${i * 56}px)` } as CSSProperties,
                    animation: `addCardToClearing ${addCycleDuration}s ease-out infinite`,
                    animationDelay: `${getAddCardDelay(i)}s`,
                    animationFillMode: 'backwards'
                  }}
                >
                  <span className="text-forest-700 font-bold">+</span>
                </div>
              ))}
              <span className="text-xs text-forest-600 ml-1">{t('play.step1ToClearing')}</span>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Remove Cards from Clearing */}
      {isClearingRemove && cardData.removeCount > 0 && (
        <div className="card bg-moor-50 border-2 border-moor-300">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <p className="text-moor-800 font-semibold">
                {t('play.step2', {
                  count: cardData.removeCount,
                  direction: getDirectionText()
                })}
              </p>
              <div className="flex gap-2 mt-2 items-center">
                {cardData.removeDirection === 'left_to_right' && (
                  <ArrowRight className="w-6 h-6 text-moor-600" />
                )}
                {cardData.removeDirection === 'right_to_left' && (
                  <div
                    className="w-12 h-16 rounded border border-moor-400 flex-shrink-0"
                    style={{
                      background: 'linear-gradient(to right, transparent, rgba(212, 202, 225, 0.5))'
                    }}
                  />
                )}
                {Array.from({ length: cardData.removeCount }).map((_, i) => (
                  <div
                    key={i}
                    className="w-12 h-16 bg-moor-200 rounded border-2 border-moor-500 flex items-center justify-center"
                    style={{
                      animation: `${getRemoveCardAnimation()} ${cycleDuration}s ease-out infinite`,
                      animationDelay: `${2 + getRemoveCardDelay(i)}s`,
                      animationFillMode: 'backwards'
                    }}
                  >
                    <span className="text-moor-800 font-bold">-</span>
                  </div>
                ))}
                {cardData.removeDirection === 'right_to_left' && (
                  <ArrowLeft className="w-6 h-6 text-moor-600" />
                )}
                {cardData.removeDirection === 'left_to_right' && (
                  <div
                    className="w-12 h-16 rounded border border-moor-400 flex-shrink-0"
                    style={{
                      background: 'linear-gradient(to left, transparent, rgba(212, 202, 225, 0.5))'
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Burn Card from Deck - 대각선 겹친 카드가 사라지는 연출 */}
      {burnCount > 0 && (
        <div className="card bg-tree-50 border-2 border-tree-300">
          <div className="flex flex-col gap-3">
            <p className="text-tree-800 font-semibold">
              {t('play.step3', { count: burnCount })}
            </p>
            <div className="flex items-end gap-3 mt-2">
              {/* 덱 표시: 그라데이션 카드 5장 촘촘하게 쌓임 */}
              <div className="relative flex-shrink-0" style={{ width: 56, height: 72 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute rounded border border-tree-300"
                    style={{
                      width: 48,
                      height: 64,
                      left: -i * 1.5,
                      top: -i * 1.5,
                      transform: `rotate(${-1.5 + i * 0.5}deg)`,
                      background: `linear-gradient(135deg, ${['#faf7f2', '#f3ede0', '#e6d9c0', '#d9c9ad', '#d4be9a'][i]} 0%, ${['#f3ede0', '#e6d9c0', '#d9c9ad', '#d4be9a', '#c8af85'][i]} 100%)`,
                      boxShadow: '0 1px 2px rgba(0,0,0,0.08)'
                    }}
                  />
                ))}
                {/* 1장 이상: 덱 위에 카드 겹쳐서 사라지는 연출 */}
                {burnCount >= 1 && (
                  <>
                    {Array.from({ length: burnCount }).map((_, i) => {
                      const stackOffset = 0
                      return (
                        <div
                          key={i}
                          className="absolute w-12 h-16 rounded border-2 border-tree-500 shadow-md z-10"
                          style={{
                            left: stackOffset-5,
                            top: stackOffset-5,
                            transform: `rotate(${-1.5 + i * 0.5}deg)`,
                            background: 'linear-gradient(135deg, #e6d9c0 0%, #d4be9a 100%)',
                            animation: `burnStackFadeOut ${burnCycleDuration}s ease-out infinite`,
                            animationDelay: `${2 + getBurnCardDelayReversed(i)}s`,
                            animationFillMode: 'backwards'
                          }}
                        />
                      )
                    })}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

