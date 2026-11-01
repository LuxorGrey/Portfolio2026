import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Play, X } from 'lucide-react'
import { GALLERY_CATEGORY_IDS, GALLERY_IMAGES, GALLERY_PREVIEWS, GALLERY_VIDEOS, type GalleryCategoryId } from '../constants/gallery'
import type { Copy } from '../locales/types'

type GalleryItem = { category: GalleryCategoryId; src: string; thumbnail: string; width: number; height: number; videoId?: string; number: number }

const ALL_ITEMS: GalleryItem[] = GALLERY_CATEGORY_IDS.flatMap<GalleryItem>((category) =>
  category === 'videos'
    ? GALLERY_VIDEOS.map((videoId, index) => ({ category, videoId, src: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`, thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`, width: 480, height: 360, number: index + 1 }))
    : GALLERY_IMAGES[category].map((image, index) => ({ category, ...image, number: index + 1 })),
)

const categoryCount = (category: GalleryCategoryId) =>
  category === 'videos' ? GALLERY_VIDEOS.length : GALLERY_IMAGES[category].length

export default function GalleryPage({ copy }: { copy: Copy }) {
  const [category, setCategory] = useState<GalleryCategoryId | 'all'>('all')
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [renderCount, setRenderCount] = useState(24)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const visibleItems = useMemo(() => category === 'all' ? ALL_ITEMS : ALL_ITEMS.filter((item) => item.category === category), [category])
  const activeItem = activeIndex === null ? null : visibleItems[activeIndex]
  const shownItems = visibleItems.slice(0, renderCount)

  useEffect(() => {
    const node = loadMoreRef.current
    if (!node || renderCount >= visibleItems.length) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setRenderCount((count) => Math.min(count + 24, visibleItems.length))
    }, { rootMargin: '900px' })
    observer.observe(node)
    return () => observer.disconnect()
  }, [renderCount, visibleItems.length])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (activeIndex !== null && !dialog.open) dialog.showModal()
    if (activeIndex === null && dialog.open) {
      dialog.close()
      triggerRef.current?.focus()
    }
  }, [activeIndex])

  function openItem(index: number, trigger: HTMLButtonElement) {
    triggerRef.current = trigger
    setActiveIndex(index)
  }

  function moveItem(step: number) {
    setActiveIndex((current) => current === null ? null : (current + step + visibleItems.length) % visibleItems.length)
  }

  function selectCategory(next: GalleryCategoryId | 'all') {
    setCategory(next)
    setRenderCount(24)
    setActiveIndex(null)
    document.getElementById('gallery-work')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <main className="gallery-page" id="galeria">
      <div className="gallery-intro grid-surface">
        <div className="gallery-intro-inner">
          <h1>{copy.gallery.title}</h1>
          <p>{copy.gallery.intro}</p>
          <span className="gallery-total">{ALL_ITEMS.length} {copy.gallery.pieces}</span>
        </div>
      </div>

      <div className="gallery-content">
        <div className="gallery-categories">
          {GALLERY_CATEGORY_IDS.map((id) => (
            <button className="gallery-category-card" type="button" key={id} onClick={() => selectCategory(id)}>
              <img src={GALLERY_PREVIEWS[id]} alt="" loading="lazy" />
              <span className="gallery-category-overlay"><strong>{copy.gallery.categories[id].title}</strong><small>{categoryCount(id)} {copy.gallery.pieces}</small></span>
            </button>
          ))}
        </div>

        <section id="gallery-work" className="gallery-work" aria-label={copy.gallery.title}>
          <div className="gallery-filters" aria-label={copy.gallery.title}>
            <button type="button" aria-pressed={category === 'all'} onClick={() => selectCategory('all')}>{copy.gallery.all}<span>{ALL_ITEMS.length}</span></button>
            {GALLERY_CATEGORY_IDS.map((id) => (
              <button type="button" aria-pressed={category === id} onClick={() => selectCategory(id)} key={id}>
                {copy.gallery.categories[id].title}<span>{categoryCount(id)}</span>
              </button>
            ))}
          </div>
          <div className="gallery-masonry">
            {shownItems.map((item, index) => (
              <button className="gallery-tile" type="button" key={`${item.category}-${item.number}`} onClick={(event) => openItem(index, event.currentTarget)} aria-label={`${copy.gallery.categories[item.category].title} — ${item.videoId ? copy.gallery.video : copy.gallery.image} ${item.number}`}>
                <img src={item.thumbnail} alt="" width={item.width} height={item.height} loading="lazy" decoding="async" />
                <span className="gallery-tile-caption">{copy.gallery.categories[item.category].title}<span>{String(item.number).padStart(2, '0')}</span></span>
                {item.videoId && <Play className="gallery-play" aria-hidden="true" />}
              </button>
            ))}
          </div>
          {renderCount < visibleItems.length && <div className="gallery-load-more" ref={loadMoreRef} aria-hidden="true" />}
        </section>
      </div>

      <dialog className="gallery-dialog" ref={dialogRef} onClose={() => setActiveIndex(null)} onClick={(event) => { if (event.target === event.currentTarget) setActiveIndex(null) }} onKeyDown={(event) => {
        if (event.key === 'ArrowLeft') { event.preventDefault(); moveItem(-1) }
        if (event.key === 'ArrowRight') { event.preventDefault(); moveItem(1) }
      }} aria-label={activeItem ? `${copy.gallery.categories[activeItem.category].title} ${activeItem.number}` : copy.gallery.title}>
        {activeItem && <div className="gallery-dialog-inner">
          <div className="gallery-dialog-bar"><span>{copy.gallery.categories[activeItem.category].title} / {String(activeItem.number).padStart(2, '0')}</span><button type="button" onClick={() => setActiveIndex(null)} aria-label={copy.gallery.close}><X aria-hidden="true" /></button></div>
          {activeItem.videoId
            ? <iframe title={`${copy.gallery.video} ${activeItem.number}`} src={`https://www.youtube-nocookie.com/embed/${activeItem.videoId}`} allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            : <img src={activeItem.src} alt={`${copy.gallery.categories[activeItem.category].title} — ${copy.gallery.image} ${activeItem.number}`} />}
          <div className="gallery-dialog-controls"><button type="button" onClick={() => moveItem(-1)} aria-label={copy.gallery.previous}><ArrowLeft aria-hidden="true" />{copy.gallery.previous}</button><button type="button" onClick={() => moveItem(1)} aria-label={copy.gallery.next}>{copy.gallery.next}<ArrowRight aria-hidden="true" /></button></div>
        </div>}
      </dialog>
    </main>
  )
}
