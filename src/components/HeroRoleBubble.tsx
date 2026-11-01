import { useEffect, useState } from 'react'

export default function HeroRoleBubble({ roles }: { roles: readonly string[] }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const interval = window.setInterval(() => setIndex((current) => (current + 1) % roles.length), 4200)
    return () => window.clearInterval(interval)
  }, [roles.length])

  return <div className="hero-role-bubble" aria-live="off"><span>{roles[index % roles.length]}</span></div>
}
