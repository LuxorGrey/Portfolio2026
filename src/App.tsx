import { lazy, Suspense, useEffect, useState } from 'react'
import { ArrowUpRight, Moon, Sun } from 'lucide-react'
import InteractiveFace from './components/InteractiveFace'
import HeroRoleBubble from './components/HeroRoleBubble'
import { EXPERIENCE, PROJECTS, SPECIALTY_IDS, TECHNOLOGIES } from './constants/content'
import { DEFAULT_LOCALE, SITE, type Locale } from './constants/site'
import { COPY } from './locales'
import './app.css'

const GalleryPage = lazy(() => import('./components/GalleryPage'))

function readLocale(): Locale {
  const route = window.location.pathname.split('/')[1]
  return route === 'es' || route === 'en' ? route : DEFAULT_LOCALE
}

function readPage() {
  return /^\/(es|en)\/(galeria|gallery)(\/|$)/.test(window.location.pathname) ? 'gallery' : 'home'
}

function readTheme(): 'dark' | 'light' {
  try { return window.localStorage.getItem('portfolio-theme') === 'light' ? 'light' : 'dark' }
  catch { return 'dark' }
}

function App() {
  const [locale, setLocale] = useState<Locale>(readLocale)
  const [page, setPage] = useState<'home' | 'gallery'>(readPage)
  const [theme, setTheme] = useState<'dark' | 'light'>(readTheme)
  const copy = COPY[locale]
  const homeHref = `/${locale}/`
  const galleryHref = `/${locale}/${locale === 'es' ? 'galeria' : 'gallery'}/`

  useEffect(() => {
    if (!/^\/(es|en)(\/|$)/.test(window.location.pathname)) {
      window.history.replaceState({}, '', `/${DEFAULT_LOCALE}/${window.location.hash}`)
    }
    const onPopState = () => { setLocale(readLocale()); setPage(readPage()) }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    document.documentElement.lang = locale
    document.title = page === 'gallery' ? copy.gallery.metaTitle : copy.meta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', page === 'gallery' ? copy.gallery.metaDescription : copy.meta.description)
  }, [locale, page, copy.meta.title, copy.meta.description, copy.gallery.metaTitle, copy.gallery.metaDescription])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try { window.localStorage.setItem('portfolio-theme', theme) } catch { /* Storage may be disabled. */ }
  }, [theme])

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      const surface = event.target instanceof Element
        ? event.target.closest<HTMLElement>('.grid-surface')
        : null
      if (!surface) return
      const bounds = surface.getBoundingClientRect()
      surface.style.setProperty('--grid-pointer-x', `${event.clientX - bounds.left}px`)
      surface.style.setProperty('--grid-pointer-y', `${event.clientY - bounds.top}px`)
    }
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    return () => window.removeEventListener('pointermove', onPointerMove)
  }, [])

  function switchLocale() {
    const next: Locale = locale === 'es' ? 'en' : 'es'
    const nextPath = page === 'gallery' ? `/${next}/${next === 'es' ? 'galeria' : 'gallery'}/` : `/${next}/`
    window.history.pushState({}, '', `${nextPath}${window.location.hash}`)
    setLocale(next)
  }

  return (
    <div className="site-shell" id="inicio">
      <header className="site-header grid-surface">
        <nav aria-label={copy.accessibility.navigation}>
          <a href={`${homeHref}#proyectos`}>{copy.nav.projects}</a>
          <a href={`${homeHref}#areas`}>{copy.nav.areas}</a>
          <a href={galleryHref} aria-current={page === 'gallery' ? 'page' : undefined}>{copy.nav.gallery}</a>
          <a href={`${homeHref}#sobre-mi`}>{copy.nav.about}</a>
          <a href="#contacto">{copy.nav.contact}<ArrowUpRight size={16} aria-hidden="true" /></a>
        </nav>
        <div className="header-controls">
          <button type="button" className="theme-switch" role="switch" aria-checked={theme === 'light'} aria-label={theme === 'dark' ? copy.theme.toLight : copy.theme.toDark} onClick={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')}>
            <Moon size={15} aria-hidden="true" /><span className="theme-switch-thumb" /><Sun size={15} aria-hidden="true" />
          </button>
          <button type="button" className="language-switch" onClick={switchLocale} aria-label={copy.accessibility.language}>
            {locale.toUpperCase()} <span aria-hidden="true">/</span> <span className="language-other">{locale === 'es' ? 'EN' : 'ES'}</span>
          </button>
        </div>
      </header>

      {page === 'gallery' ? <Suspense fallback={<main className="gallery-loading grid-surface" aria-busy="true">{copy.gallery.title}</main>}><GalleryPage copy={copy} /></Suspense> : <main>
        <section className="hero grid-surface" aria-labelledby="hero-title">
          <div className="hero-stage">
            <h1 id="hero-title" className="hero-title"><span>{copy.hero.first}</span><span>{copy.hero.last}</span></h1>
            <div className="hero-face"><InteractiveFace ariaLabel={copy.hero.imageAlt} /></div>
            <HeroRoleBubble roles={copy.hero.roles} />
          </div>
        </section>

        <section className="projects" id="proyectos" aria-labelledby="projects-title">
          <div className="section-heading projects-heading">
            <span className="section-index">01 / {copy.projects.eyebrow}</span>
            <h2 id="projects-title">{copy.projects.heading}</h2>
          </div>
          <div className="project-list">
            {PROJECTS.map((project) => {
              const details = copy.projects[project.id]
              return (
                <article className="project-card" key={project.id}>
                  <div className="project-image-wrap">
                    <img src={project.image} alt={details.imageAlt} width="1345" height="742" loading="lazy" decoding="async" />
                    <span className="project-number">{project.number}</span>
                  </div>
                  <div className="project-info">
                    <div className="project-meta"><span>{details.kind}</span><span>{project.status === 'early' ? copy.projects.early : copy.projects.fullDevelopment}</span></div>
                    <h3>{details.title}</h3>
                    <p>{details.summary}</p>
                    <a href={project.url} target="_blank" rel="noopener noreferrer" aria-label={`${copy.projects.view}: ${details.title}. ${copy.accessibility.external}`}>
                      {copy.projects.view} <ArrowUpRight size={20} aria-hidden="true" />
                    </a>
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        <section className="about grid-surface" id="sobre-mi" aria-labelledby="about-title">
          <div className="about-heading">
            <span className="section-index">02 / {copy.about.eyebrow}</span>
            <h2 id="about-title">{copy.about.heading}</h2>
          </div>
          <div className="about-copy">
            <p>{copy.about.body}</p>
            <div className="experience">
              <h3>{copy.about.experience}</h3>
              <ol>
                {EXPERIENCE.map((job) => (
                  <li key={job.id}><strong>{job.company}</strong><span>{job.period}{job.id === 'caixabank' ? copy.about.present : ''}</span></li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="technology-ticker grid-surface" aria-label={copy.technology.heading}>
          <span className="ticker-heading">{copy.technology.heading}</span>
          <div className="ticker-viewport">
            <div className="ticker-track">
              {[0, 1].map((repeat) => (
                <ul className="ticker-group" key={repeat} aria-hidden={repeat === 1}>
                  {TECHNOLOGIES.map((technology) => <li key={technology}>{technology}<span aria-hidden="true">✳</span></li>)}
                </ul>
              ))}
            </div>
          </div>
        </section>

        <section className="specialties" id="areas" aria-labelledby="areas-title">
          <div className="specialties-inner">
            <h2 id="areas-title">{copy.specialties.heading}</h2>
            <ol>
              {SPECIALTY_IDS.map((id, index) => (
                <li key={id}>
                  <span className="specialty-number">{String(index + 1).padStart(2, '0')}</span>
                  <div><h3>{copy.specialties[id].title}</h3><p>{copy.specialties[id].body}</p></div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>}

      <footer className="contact grid-surface" id="contacto">
        <span className="section-index">03 / {copy.contact.eyebrow}</span>
        <h2>{copy.contact.heading}</h2>
        <div className="contact-links">
          <a className="contact-primary" href={SITE.links.linkedin} target="_blank" rel="noopener noreferrer">{copy.contact.linkedin}<ArrowUpRight size={24} aria-hidden="true" /></a>
          <a href={SITE.links.github} target="_blank" rel="noopener noreferrer">{copy.contact.github}<ArrowUpRight size={18} aria-hidden="true" /></a>
          <a href={SITE.links.artstation} target="_blank" rel="noopener noreferrer">{copy.contact.artstation}<ArrowUpRight size={18} aria-hidden="true" /></a>
        </div>
        <small>{SITE.name}</small>
      </footer>
    </div>
  )
}

export default App
