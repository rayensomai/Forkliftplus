function LanguageToggle({ lang, onLangChange }) {
  return (
    <div className="lang-toggle" role="group" aria-label="Language">
      <button
        type="button"
        className={lang === 'fr' ? 'active' : ''}
        onClick={() => onLangChange('fr')}
      >
        FR
      </button>
      <button
        type="button"
        className={lang === 'en' ? 'active' : ''}
        onClick={() => onLangChange('en')}
      >
        EN
      </button>
    </div>
  )
}

export default LanguageToggle
