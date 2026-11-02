import { useEffect, useRef, useState } from 'react'
import { motion, useAnimationFrame, useMotionValue, useReducedMotion } from 'motion/react'

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

export default function HeroScrambleTitle({ first, last, trigger, dragging }: { first: string; last: string; trigger: number; dragging: boolean }) {
  const [display, setDisplay] = useState(`${first}\n${last}`)
  const x = useMotionValue(0)
  const reducedMotion = useReducedMotion()
  const dragStarted = useRef(0)
  const phase = useRef(0)

  useEffect(() => {
    dragStarted.current = dragging ? performance.now() : 0
    phase.current = 0
    if (!dragging) x.set(0)
  }, [dragging, x])

  useAnimationFrame((_time, delta) => {
    if (!dragging || reducedMotion) return
    const elapsed = performance.now() - dragStarted.current
    const cyclesPerSecond = Math.min(9, 1.8 + elapsed / 450)
    phase.current += (delta / 1000) * cyclesPerSecond * Math.PI * 2
    x.set(Math.sin(phase.current) * Math.min(9, 4 + elapsed / 1000))
  })

  useEffect(() => {
    const target = `${first}\n${last}`
    if (reducedMotion) return
    let timer = 0
    if (dragging) {
      const scramble = () => {
        setDisplay([...target].map((character) => character === '\n' || character === ' ' ? character : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]).join(''))
        const elapsed = performance.now() - dragStarted.current
        timer = window.setTimeout(scramble, Math.max(28, 130 - elapsed / 25))
      }
      timer = window.setTimeout(scramble, 0)
      return () => window.clearTimeout(timer)
    }
    let frame = 0
    timer = window.setInterval(() => {
      frame += 1
      setDisplay([...target].map((character, index) => {
        if (character === '\n' || character === ' ') return character
        if (index < frame * 1.5) return character
        return GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
      }).join(''))
      if (frame * 1.5 >= target.length) {
        window.clearInterval(timer)
        setDisplay(target)
      }
    }, 35)
    return () => window.clearInterval(timer)
  }, [first, last, trigger, dragging, reducedMotion])

  const [visibleFirst, visibleLast] = (reducedMotion ? `${first}\n${last}` : display).split('\n')
  return <motion.h1 id="hero-title" className="hero-title" aria-label={`${first} ${last}`} style={{ x }}>
    <span aria-hidden="true">{visibleFirst}</span><span aria-hidden="true">{visibleLast}</span>
  </motion.h1>
}
