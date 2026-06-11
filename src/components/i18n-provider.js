'use client'
import { createInstance } from 'i18next'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import { createContext, useContext, useMemo, forwardRef } from 'react'
import NextLink from 'next/link'
import { usePathname } from 'next/navigation'
import resources from '@/lib/locales'

const LocaleContext = createContext('bg')
export const languages = ['bg', 'en']

export default function I18nProvider({ locale, children }) {
  const i18n = useMemo(() => {
    const instance = createInstance()
    instance.use(initReactI18next).init({
      resources, lng: locale, fallbackLng: 'bg',
      interpolation: { escapeValue: false },
      react: { useSuspense: false },
      returnObjects: false,
    })
    return instance
  }, [locale])
  return (
    <LocaleContext.Provider value={locale}>
      <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
    </LocaleContext.Provider>
  )
}

export const useLocale = () => useContext(LocaleContext)

// Drop-in for gatsby-plugin-react-i18next's <Link to language>: ALWAYS locale-prefixes
// (live site evidence: on "/", logo renders href="/bg/", footer href="/bg/policies").
export const Link = forwardRef(function Link({ to, language, ...rest }, ref) {
  const locale = useLocale()
  return <NextLink ref={ref} href={`/${language ?? locale}${to}`} {...rest} />
})

// Drop-in for useI18next(): { languages, originalPath }
export function useI18next() {
  const pathname = usePathname() || '/'
  const originalPath = pathname.replace(/^\/(bg|en)(?=\/|$)/, '') || '/'
  return { languages, originalPath }
}
