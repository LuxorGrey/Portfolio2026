import type { Copy } from '../locales/types'

export default function GallerySkeleton({ copy }: { copy: Copy }) {
  return <main className="gallery-page gallery-skeleton" aria-busy="true" aria-label={copy.gallery.loading}>
    <div className="gallery-intro grid-surface"><div className="gallery-intro-inner"><h1>{copy.gallery.title}</h1><span className="sr-only">{copy.gallery.loading}</span></div></div>
    <div className="gallery-content"><div className="gallery-skeleton-grid" aria-hidden="true">
      {Array.from({ length: 6 }, (_, index) => <div className="gallery-skeleton-card shimmer" key={index} />)}
    </div></div>
  </main>
}
