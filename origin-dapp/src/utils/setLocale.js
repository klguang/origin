import { IntlViewerContext, init } from 'fbt-runtime'
import Languages from '../constants/Languages'

export default async function setLocale(newLocale) {
  let userLocale = newLocale || localStorage.locale
  if (newLocale) {
    localStorage.locale = newLocale
  } else if (!userLocale) {
    // Default to English until our translations are improved.
    userLocale = 'en_US'
    //userLocale = (navigator.language || 'en_US').replace('-', '_')
  }

  const hasLanguage = Languages.find(l => l[0].indexOf(userLocale) === 0)
  let locale = 'en_US'
  if (hasLanguage) {
    locale = hasLanguage[0]
    if (locale !== 'en_US') {
      const res = await fetch(`translations/${locale}.json`)
      if (res.ok) {
        const json = await res.json()
        init({ translations: { [locale]: json } })
      }
    }
  }

  IntlViewerContext.locale = locale
  return locale
}
