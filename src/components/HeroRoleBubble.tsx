import { useEffect, useState } from 'react'

export default function HeroRoleBubble({ roles }: { roles: readonly string[] }) {
  const [index, setIndex] = useState(0)
  const [length, setLength] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const role = roles[index % roles.length] ?? ''

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReducedMotion(query.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (reducedMotion) return
    if (length < role.length) {
      const timer = window.setTimeout(() => setLength((value) => value + 1), 45)
      return () => window.clearTimeout(timer)
    }
    const timer = window.setTimeout(() => { setIndex((value) => (value + 1) % roles.length); setLength(0) }, 2600)
    return () => window.clearTimeout(timer)
  }, [index, length, reducedMotion, role, roles.length])

  return <div className="hero-role-bubble" aria-label={role} aria-live="off">
    <span aria-hidden="true">{reducedMotion ? role : role.slice(0, length)}<span className="typewriter-caret" /></span>
  </div>
}
