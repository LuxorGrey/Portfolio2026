export const SITE = {
  name: 'Óscar Trevejo Rodríguez',
  links: {
    linkedin: 'https://www.linkedin.com/in/oscar-trevejo-rodriguez-a8a471166/',
    github: 'https://github.com/LuxorGrey',
    artstation: 'https://www.artstation.com/oscartrevejo',
  },
} as const

export type Locale = 'es' | 'en'

export const DEFAULT_LOCALE: Locale = 'es'
