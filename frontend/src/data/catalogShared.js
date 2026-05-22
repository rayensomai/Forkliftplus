export function formatCapacity(lb, locale) {
  if (!lb || lb < 500) {
    return locale === 'fr-CA' ? 'Accessoire' : 'Accessory'
  }
  const formatted = new Intl.NumberFormat(locale === 'fr-CA' ? 'fr-CA' : 'en-CA').format(lb)
  return `${formatted} lb`
}

export function parsePrice(value) {
  return Math.round(parseFloat(String(value).replace(/,/g, '')))
}

export function parseCapacityFromTitle(title) {
  const match = title.match(/([\d\s,]+)\s*(?:lb|Lbs|lbs)/i)
  if (!match) return 4500
  return parseInt(match[1].replace(/\s/g, '').replace(/,/g, ''), 10)
}

export function parseDimensionsFromTitle(title) {
  const match = title.match(/(\d+)\s*[x×]\s*(\d+)/i)
  if (!match) return null
  return `${match[1]}" × ${match[2]}"`
}
