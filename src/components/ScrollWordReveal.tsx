import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react'

function Word({ word, index, total, progress }: { word: string; index: number; total: number; progress: MotionValue<number> }) {
  const start = (index / Math.max(total, 1)) * 0.76
  const opacity = useTransform(progress, [start, Math.min(start + 0.24, 1)], [0.18, 1])
  return <motion.span aria-hidden="true" style={{ opacity }}>{word}</motion.span>
}

export default function ScrollWordReveal({ number, title, text }: { number: string; title: string; text: string }) {
  const ref = useRef<HTMLLIElement>(null)
  const reducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.9', 'end 0.25'] })
  const titleWords = title.split(/\s+/)
  const bodyWords = text.split(/\s+/)
  const total = 1 + titleWords.length + bodyWords.length
  const numberOpacity = useTransform(scrollYProgress, [0, 0.2], [0.18, 1])

  return <li ref={ref}>
    <motion.span className="specialty-number" aria-hidden="true" style={reducedMotion ? undefined : { opacity: numberOpacity }}>{number}</motion.span>
    <div>
      <h3 aria-label={title}>{reducedMotion ? title : titleWords.map((word, index) => <span key={`${word}-${index}`}><Word word={word} index={index + 1} total={total} progress={scrollYProgress} />{index < titleWords.length - 1 ? ' ' : null}</span>)}</h3>
      <p aria-label={text}>{reducedMotion ? text : bodyWords.map((word, index) => <span key={`${word}-${index}`}><Word word={word} index={index + titleWords.length + 1} total={total} progress={scrollYProgress} />{index < bodyWords.length - 1 ? ' ' : null}</span>)}</p>
    </div>
  </li>
}
