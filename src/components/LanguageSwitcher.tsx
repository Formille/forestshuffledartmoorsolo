import { useTranslation } from 'react-i18next'

export function LanguageSwitcher() {
  const { i18n } = useTranslation()

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
    localStorage.setItem('dartmoor-language', lng)
  }

  return (
    <div className="flex gap-2 items-center">
      <button
        onClick={() => changeLanguage('ko')}
        className={`px-3 py-1 rounded ${
          i18n.language === 'ko'
            ? 'bg-forest-600 text-white'
            : 'bg-forest-100 text-forest-700 hover:bg-forest-200'
        } transition-colors`}
      >
        한국어
      </button>
      <button
        onClick={() => changeLanguage('en')}
        className={`px-3 py-1 rounded ${
          i18n.language === 'en'
            ? 'bg-forest-600 text-white'
            : 'bg-forest-100 text-forest-700 hover:bg-forest-200'
        } transition-colors`}
      >
        English
      </button>
    </div>
  )
}

