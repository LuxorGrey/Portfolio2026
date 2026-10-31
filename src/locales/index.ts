import type { Locale } from '../constants/site'
import { es } from './es'
import { en } from './en'
import type { Copy } from './types'

export const COPY: Record<Locale, Copy> = { es, en }
