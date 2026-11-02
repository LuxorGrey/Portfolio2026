export type CurtainPhase = 'idle' | 'cover' | 'reveal'

export default function NavigationCurtain({ phase }: { phase: CurtainPhase }) {
  return <div className={`navigation-curtain is-${phase}`} aria-hidden="true"><span /><span /></div>
}
