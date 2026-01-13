import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { GameHistory } from '../types'
import { generateCertificate } from '../services/certificate'

interface VictoryCertificateProps {
  history: GameHistory
  onClose: () => void
}

export function VictoryCertificate({ history, onClose }: VictoryCertificateProps) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language as 'ko' | 'en'
  const [certificateImage, setCertificateImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    generateCertificate(history, lang)
      .then(image => {
        setCertificateImage(image)
        setLoading(false)
      })
      .catch(error => {
        console.error('Failed to generate certificate:', error)
        setLoading(false)
      })
  }, [history, lang])

  const handleSaveImage = () => {
    if (!certificateImage) return

    const link = document.createElement('a')
    link.download = `dartmoor-certificate-${history.id}.png`
    link.href = certificateImage
    link.click()
  }

  const handleShare = async () => {
    if (!certificateImage) return

    try {
      // Base64를 Blob으로 변환
      const response = await fetch(certificateImage)
      const blob = await response.blob()
      const file = new File([blob], `dartmoor-certificate-${history.id}.png`, {
        type: 'image/png'
      })

      if (navigator.share) {
        await navigator.share({
          title: t('certificate.challengeCompleted'),
          text: `${t('certificate.challengeCompleted')} - Score: ${history.score}`,
          files: [file]
        })
      } else {
        // 폴백: 이미지 다운로드
        handleSaveImage()
      }
    } catch (error) {
      console.error('Share failed:', error)
      // 폴백: 이미지 다운로드
      handleSaveImage()
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="card bg-white p-8">
          <p className="text-forest-600">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  if (!certificateImage) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="card bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-forest-800">
            {t('certificate.title')}
          </h2>
          <button
            onClick={onClose}
            className="text-forest-600 hover:text-forest-800 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="mb-4">
          <img
            src={certificateImage}
            alt="Certificate"
            className="w-full rounded-lg"
          />
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleSaveImage}
            className="btn-secondary flex-1"
          >
            {t('certificate.saveImage')}
          </button>
          <button
            onClick={handleShare}
            className="btn-primary flex-1"
          >
            {t('certificate.share')}
          </button>
        </div>
      </div>
    </div>
  )
}

