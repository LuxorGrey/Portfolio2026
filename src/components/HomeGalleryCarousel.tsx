import { useState } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { HOME_GALLERY_SLIDES } from '../constants/gallery'
import type { Copy } from '../locales/types'

export default function HomeGalleryCarousel({ copy, href, navigate }: { copy: Copy; href: string; navigate: (href: string) => void }) {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const reducedMotion = useReducedMotion()
  const active = HOME_GALLERY_SLIDES[index]

  function go(next: number, travel = next > index ? 1 : -1) {
    setDirection(travel)
    setIndex((next + HOME_GALLERY_SLIDES.length) % HOME_GALLERY_SLIDES.length)
  }

  return <section className="home-gallery grid-surface" aria-labelledby="home-gallery-title">
    <div className="home-gallery-inner">
      <div className="home-gallery-heading">
        <div><span className="section-index">{copy.gallery.featuredEyebrow}</span><h2 id="home-gallery-title">{copy.gallery.featuredTitle}</h2></div>
        <a href={href} onClick={(event) => { event.preventDefault(); navigate(href) }}>{copy.gallery.featuredLink}<ArrowUpRight size={20} aria-hidden="true" /></a>
      </div>
      <div className="home-gallery-stage">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={active.id}
            className="home-gallery-composition"
            role="group" aria-label={copy.gallery.featuredSlides[active.id]}
            custom={direction}
            initial={reducedMotion ? false : { opacity: 0, x: direction * 55 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reducedMotion ? undefined : { opacity: 0, x: direction * -55 }}
            transition={{ duration: reducedMotion ? 0 : 0.34, ease: [0.22, 1, 0.36, 1] }}
          >
            {active.images.map(({ image, category }, imageIndex) => <figure className="home-gallery-piece" key={`${category}-${image.src}`}>
              <img src={image.src} alt={`${copy.gallery.categories[category].title}: ${copy.gallery.categories[category].description}`} width={image.width} height={image.height} loading="lazy" decoding="async" />
              <figcaption>{String(imageIndex + 1).padStart(2, '0')}</figcaption>
            </figure>)}
          </motion.div>
        </AnimatePresence>
        <div className="home-gallery-caption" aria-live="polite"><span>{copy.gallery.featuredSlides[active.id]}</span><span>{String(index + 1).padStart(2, '0')} / {String(HOME_GALLERY_SLIDES.length).padStart(2, '0')}</span></div>
      </div>
      <div className="home-gallery-controls">
        <div className="home-gallery-dots" aria-label={copy.gallery.featuredPagination}>
          {HOME_GALLERY_SLIDES.map((slide, dot) => <button key={slide.id} type="button" className={dot === index ? 'is-active' : ''} onClick={() => go(dot)} aria-label={`${copy.gallery.featuredGoTo} ${dot + 1}: ${copy.gallery.featuredSlides[slide.id]}`} aria-current={dot === index ? 'true' : undefined} />)}
        </div>
        <div className="home-gallery-arrows"><button type="button" onClick={() => go((index - 1 + HOME_GALLERY_SLIDES.length) % HOME_GALLERY_SLIDES.length, -1)} aria-label={copy.gallery.previous}><ArrowLeft aria-hidden="true" /></button><button type="button" onClick={() => go((index + 1) % HOME_GALLERY_SLIDES.length, 1)} aria-label={copy.gallery.next}><ArrowRight aria-hidden="true" /></button></div>
      </div>
    </div>
  </section>
}
