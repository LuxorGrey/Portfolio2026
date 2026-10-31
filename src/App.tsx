import { useEffect, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import InteractiveFace from './components/InteractiveFace'
import { EXPERIENCE, PROJECTS, SPECIALTY_IDS, TECHNOLOGIES } from './constants/content'
import { DEFAULT_LOCALE, SITE, type Locale } from './constants/site'
import { COPY } from './locales'
import './app.css'

function readLocale(): Locale {
  const route = window.location.pathname.split('/')[1]
  return route === 'es' || route === 'en' ? route : DEFAULT_LOCALE
}

function App() {
  const [locale, setLocale] = useState<Locale>(readLocale)
  const copy = COPY[locale]

  useEffect(() => {
    if (!/^\/(es|en)(\/|$)/.test(window.location.pathname)) {
      window.history.replaceState({}, '', `/${DEFAULT_LOCALE}/${window.location.hash}`)
    }
    const onPopState = () => setLocale(readLocale())
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    document.documentElement.lang = locale
    document.title = copy.meta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', copy.meta.description)
  }, [locale, copy.meta.title, copy.meta.description])

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
    window.history.pushState({}, '', `/${next}/${window.location.hash}`)
    setLocale(next)
  }

  return (
    <div className="site-shell" id="inicio">
      <header className="site-header grid-surface">
        <nav aria-label={copy.accessibility.navigation}>
          <a href="#proyectos">{copy.nav.projects}</a>
          <a href="#areas">{copy.nav.areas}</a>
          <a href="#sobre-mi">{copy.nav.about}</a>
          <a href="#contacto">{copy.nav.contact}<ArrowUpRight size={16} aria-hidden="true" /></a>
        </nav>
        <button type="button" className="language-switch" onClick={switchLocale} aria-label={copy.accessibility.language}>
          {locale.toUpperCase()} <span aria-hidden="true">/</span> <span className="language-other">{locale === 'es' ? 'EN' : 'ES'}</span>
        </button>
      </header>

      <main>
        <section className="hero grid-surface" aria-labelledby="hero-title">
          <div className="hero-stage">
            <h1 id="hero-title" className="hero-title"><span>{copy.hero.first}</span><span>{copy.hero.last}</span></h1>
            <div className="hero-face"><InteractiveFace ariaLabel={copy.hero.imageAlt} /></div>
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
                    <img src={project.image} alt={details.imageAlt} loading="lazy" />
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
      </main>

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
