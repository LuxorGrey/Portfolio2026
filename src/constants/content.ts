import whtyImage from '../assets/projects/whty.png'
import presentyImage from '../assets/projects/presenty.png'

export const PROJECTS = [
  {
    id: 'whty',
    image: whtyImage,
    url: 'https://whty.netlify.app/',
    status: 'published',
    number: '01',
  },
  {
    id: 'presenty',
    image: presentyImage,
    url: 'https://presenty.netlify.app/',
    status: 'early',
    number: '02',
  },
] as const

export const EXPERIENCE = [
  { id: 'caixabank', company: 'CaixaBank Tech', period: '2024 — ' },
  { id: 'capgemini', company: 'Capgemini / Openbank', period: '2023 — 2024' },
  { id: 'aquiles', company: 'Aquiles Solutions', period: '2019 — 2023' },
] as const

export const SPECIALTY_IDS = [
  'frontend',
  'interface',
  'graphic',
  'identity',
  'integration',
] as const

// Verified in the existing portfolio, its projects, or confirmed by Óscar.
export const TECHNOLOGIES = [
  'React', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'C#',
  'Node.js', 'Tailwind CSS', 'Styled Components', 'PostgreSQL',
] as const
