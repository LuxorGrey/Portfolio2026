// Prototipo descartable: tres direcciones visuales para la web de Oscar, seleccionables con ?variant=A|B|C.
import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Asterisk,
  Code2,
  MoveUpRight,
  PenTool,
} from 'lucide-react'
import whtyImage from './assets/whty.png'
import presentyImage from './assets/presenty.png'
import InteractiveFace from './InteractiveFace'
import './design-prototype.css'

type Variant = 'A' | 'B' | 'C'

const variants: { key: Variant; name: string; idea: string }[] = [
  {
    key: 'A',
    name: 'Escena central',
    idea: 'La firma gráfica ocupa el centro del escenario.',
  },
  {
    key: 'B',
    name: 'Manifiesto dividido',
    idea: 'La trayectoria y el proceso abren la página.',
  },
  {
    key: 'C',
    name: 'Mesa de trabajo',
    idea: 'Pieza central sobre el titular; proyectos a continuación.',
  },
]

const specialties = [
  [
    'Desarrollo frontend',
    'Interfaces web con estructura, accesibilidad y detalle.',
  ],
  ['Diseño de interfaces', 'Contenido y navegación que se entienden.'],
  ['Diseño gráfico', 'Composición, tipografía y tono visual.'],
  ['Identidad visual', 'Sistemas gráficos con continuidad.'],
  ['Diseño y código', 'Una idea que conserva su intención al construirse.'],
]

function getVariant(): Variant {
  const value = new URLSearchParams(window.location.search).get('variant')
  return value === 'B' || value === 'C' ? value : 'A'
}

function PrototypeSwitcher({
  current,
  setCurrent,
}: {
  current: Variant
  setCurrent: (value: Variant) => void
}) {
  const index = variants.findIndex(({ key }) => key === current)
  const move = (step: number) =>
    setCurrent(variants[(index + step + variants.length) % variants.length].key)

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null
      if (target?.closest('input, textarea, select, [contenteditable="true"]'))
        return
      if (event.key === 'ArrowLeft') move(-1)
      if (event.key === 'ArrowRight') move(1)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  })

  return (
    <div
      className="prototype-switcher"
      aria-label="Cambiar variante del prototipo"
    >
      <button
        type="button"
        onClick={() => move(-1)}
        aria-label="Variante anterior"
      >
        <ArrowLeft size={18} />
      </button>
      <div className="prototype-switcher-label" aria-live="polite">
        <strong>
          Prototipo · {current} / {variants[index].name}
        </strong>
        <span>{variants[index].idea}</span>
      </div>
      <button
        type="button"
        onClick={() => move(1)}
        aria-label="Variante siguiente"
      >
        <ArrowRight size={18} />
      </button>
    </div>
  )
}

function Header({ compact = false }: { compact?: boolean }) {
  return (
    <header className={`proto-header ${compact ? 'proto-header-compact' : ''}`}>
      <a className="brand" href="#inicio" aria-label="Oscar Trevejo, inicio">
        OT<span className="brand-dot">.</span>
      </a>
      <nav aria-label="Navegación principal">
        <a href="#sobre-mi">Sobre mí</a>
        <a href="#areas">Áreas</a>
        <a href="#proyectos">Proyectos</a>
        <a href="#contacto">Contacto</a>
      </nav>
      <span className="lang-preview">
        ES <span>/ EN</span>
      </span>
    </header>
  )
}

function GraphicSignature({
  mode = 'orbit',
}: {
  mode?: 'orbit' | 'panel' | 'tile'
}) {
  return (
    <div className={`graphic-signature graphic-${mode}`} aria-hidden="true">
      <div className="graphic-halo" />
      <div className="graphic-grid" />
      <div className="graphic-editor">
        <div className="editor-top">
          <i />
          <i />
          <i />
          <span>design / code</span>
        </div>
        <div className="editor-body">
          <div className="code-line short" />
          <div className="code-line" />
          <div className="code-line medium" />
          <div className="code-line short pale" />
          <div className="code-line medium" />
          <div className="code-line tiny" />
        </div>
      </div>
      <div className="graphic-disc">
        <span />
      </div>
      <div className="graphic-outline" />
      <div className="graphic-cross">+</div>
      <div className="graphic-tag">
        <PenTool size={15} /> <span>made to work</span>
      </div>
      <div className="graphic-code">
        <Code2 size={28} />
      </div>
    </div>
  )
}

function ProjectCard({
  title,
  image,
  status,
  index,
}: {
  title: string
  image: string
  status?: string
  index: string
}) {
  return (
    <article className="proto-project-card">
      <div className="project-top">
        <span>{index}</span>
        <span>{status ?? 'Proyecto publicado'}</span>
      </div>
      <div className="project-title-row">
        <h3>{title}</h3>
        <ArrowUpRight size={27} />
      </div>
      <img src={image} alt={`Captura del proyecto ${title}`} />
    </article>
  )
}

function VariantA() {
  return (
    <main className="variant variant-a" id="inicio">
      <div className="a-hero">
        <Header />
        <div className="a-hero-stage">
          <p className="a-hero-kicker">Oscar Trevejo Rodríguez</p>
          <h1>
            HOLA, SOY
            <br />
            <span>OSCAR</span>
          </h1>
          <GraphicSignature />
        </div>
        <div className="a-hero-bottom">
          <p>
            Desarrollo interfaces y diseño imágenes
            <br />
            que dan forma a ideas.
          </p>
          <a
            className="gradient-cta"
            href="https://www.linkedin.com/in/oscar-trevejo-rodriguez-a8a471166/"
          >
            Hablemos <ArrowUpRight size={18} />
          </a>
        </div>
      </div>
      <section className="a-gallery" aria-label="Muestra de trabajo">
        <div className="gallery-row">
          <div className="gallery-tile graphic-tile">
            DISEÑO
            <br />+ CÓDIGO
          </div>
          <img src={whtyImage} alt="Captura de WHTY" />
          <div className="gallery-tile line-tile">
            <span>La forma</span>
            <strong>
              sigue a<br />
              la idea.
            </strong>
          </div>
        </div>
        <div className="gallery-row gallery-row-reverse">
          <img src={presentyImage} alt="Captura de Presenty" />
          <div className="gallery-tile grid-tile">
            <Asterisk size={92} strokeWidth={1} />
          </div>
          <img src={whtyImage} alt="Otra vista de WHTY" />
        </div>
      </section>
      <section className="a-about" id="sobre-mi">
        <span className="corner-symbol">✳</span>
        <h2>SOBRE MÍ</h2>
        <p>
          Soy Oscar, desarrollador frontend y diseñador gráfico. Trabajo entre
          el código y la imagen para crear experiencias digitales claras,
          cuidadas y útiles.
        </p>
        <div className="experience-line">
          <span>Experiencia</span>
          <strong>
            CaixaBank Tech
            <br />
            Capgemini / Openbank
            <br />
            Aquiles Solutions
          </strong>
        </div>
      </section>
      <section className="a-specialties" id="areas">
        <h2>LO QUE HAGO</h2>
        <div>
          {specialties.map(([title, description], index) => (
            <div className="specialty-row" key={title}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="a-projects" id="proyectos">
        <h2>PROYECTOS</h2>
        <div className="a-project-grid">
          <ProjectCard title="WHTY" image={whtyImage} index="01" />
          <ProjectCard
            title="Presenty"
            image={presentyImage}
            index="02"
            status="Fase temprana"
          />
        </div>
        <div className="proto-contact" id="contacto">
          <p>¿Hablamos de tu proyecto?</p>
          <a href="https://www.linkedin.com/in/oscar-trevejo-rodriguez-a8a471166/">
            Hablemos <ArrowUpRight size={23} />
          </a>
        </div>
      </section>
    </main>
  )
}

function VariantB() {
  return (
    <main className="variant variant-b" id="inicio">
      <Header compact />
      <section className="b-hero">
        <div className="b-hero-copy">
          <p className="b-index">
            Oscar Trevejo Rodríguez <span>— Portfolio 2026</span>
          </p>
          <h1>
            UNA IDEA.
            <br />
            DOS
            <br />
            <em>LENGUAJES.</em>
          </h1>
          <div className="b-hero-foot">
            <p>
              Desarrollo frontend
              <br />y diseño gráfico.
            </p>
            <a href="#proyectos">
              Explorar proyectos <MoveUpRight size={19} />
            </a>
          </div>
        </div>
        <div className="b-hero-art">
          <GraphicSignature mode="panel" />
          <span className="b-art-caption">Código / imagen / intención</span>
        </div>
      </section>
      <section className="b-work" id="proyectos">
        <div className="b-section-heading">
          <span>Trabajo seleccionado</span>
          <h2>
            Dos proyectos,
            <br />
            dos contextos.
          </h2>
        </div>
        <div className="b-work-grid">
          <article>
            <img src={whtyImage} alt="Captura de WHTY" />
            <div>
              <span>01 / Portfolio de artista</span>
              <h3>WHTY</h3>
            </div>
          </article>
          <article>
            <img src={presentyImage} alt="Captura de Presenty" />
            <div>
              <span>02 / Fase temprana</span>
              <h3>Presenty</h3>
            </div>
          </article>
        </div>
      </section>
      <section className="b-about" id="sobre-mi">
        <div className="b-about-left">
          <span>Perfil híbrido</span>
          <h2>
            Del boceto
            <br />
            al navegador.
          </h2>
        </div>
        <div className="b-about-right">
          <p>
            Me interesa tanto cómo funciona una interfaz como lo que comunica.
            Trabajo entre código e imagen para dar forma a experiencias claras,
            cuidadas y útiles.
          </p>
          <div className="b-timeline">
            <span>Experiencia</span>
            <p>
              CaixaBank Tech
              <br />
              Capgemini / Openbank
              <br />
              Aquiles Solutions
            </p>
          </div>
        </div>
      </section>
      <section className="b-specialties" id="areas">
        <div>
          <span>Áreas de trabajo</span>
          <h2>Lo que hago</h2>
        </div>
        <ol>
          {specialties.map(([title], index) => (
            <li key={title}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              {title}
              <ArrowUpRight size={20} />
            </li>
          ))}
        </ol>
      </section>
      <footer className="b-contact" id="contacto">
        <h2>HABLEMOS.</h2>
        <a href="https://www.linkedin.com/in/oscar-trevejo-rodriguez-a8a471166/">
          Contactar por LinkedIn <ArrowUpRight size={22} />
        </a>
      </footer>
    </main>
  )
}

function VariantC() {
  return (
    <main className="variant variant-c" id="inicio">
      <header className="c-header">
        <nav aria-label="Navegación principal">
          <a href="#sobre-mi">Sobre mí</a>
          <a href="#areas">Áreas</a>
          <a href="#proyectos">Proyectos</a>
          <a href="#contacto">Contacto</a>
        </nav>
      </header>
      <section className="c-hero">
        <div className="c-center-stage">
          <h1 className="c-center-title">
            <span>HOLA, SOY</span> <span>OSCAR</span>
          </h1>
          <div className="c-center-art">
            <InteractiveFace />
          </div>
        </div>
        <div className="c-hero-bottom">
          <div className="c-hero-intro">
            <span>Oscar Trevejo Rodríguez</span>
            <p>
              Desarrollo interfaces y diseño imágenes
              <br />
              que dan forma a ideas.
            </p>
          </div>
          <a
            className="gradient-cta"
            href="https://www.linkedin.com/in/oscar-trevejo-rodriguez-a8a471166/"
          >
            Hablemos <ArrowUpRight size={18} />
          </a>
        </div>
        <a className="c-work-link" href="#proyectos">
          Ver proyectos <ArrowUpRight size={17} />
        </a>
        <p className="c-face-hint">Mueve el cursor · Arrastra una mejilla</p>
      </section>
      <section className="c-projects" id="proyectos">
        <div className="c-section-intro">
          <span>Proyectos</span>
          <h2>
            Trabajo que
            <br />
            se puede ver.
          </h2>
        </div>
        <div className="c-cases">
          <article>
            <div className="c-case-image">
              <img src={whtyImage} alt="Captura de WHTY" />
            </div>
            <div className="c-case-copy">
              <span>01 / Desarrollo completo</span>
              <h3>WHTY</h3>
              <p>Portfolio web para presentar el trabajo de un artista.</p>
            </div>
          </article>
          <article>
            <div className="c-case-image">
              <img src={presentyImage} alt="Captura de Presenty" />
            </div>
            <div className="c-case-copy">
              <span>02 / Fase temprana</span>
              <h3>Presenty</h3>
              <p>
                Buscador de regalos para encontrar ideas según cada ocasión.
              </p>
            </div>
          </article>
        </div>
      </section>
      <section className="c-about" id="sobre-mi">
        <div>
          <span>Sobre mí</span>
          <h2>
            Entre el
            <br />
            código y<br />
            la imagen.
          </h2>
        </div>
        <div>
          <p>
            Soy Oscar, desarrollador frontend y diseñador gráfico. Me interesa
            tanto cómo funciona una interfaz como lo que comunica.
          </p>
          <div className="c-experience">
            <span>Experiencia</span>
            <strong>
              CaixaBank Tech
              <br />
              Capgemini / Openbank
              <br />
              Aquiles Solutions
            </strong>
          </div>
        </div>
      </section>
      <section className="c-specialties" id="areas">
        <h2>LO QUE HAGO</h2>
        <div>
          {specialties.map(([title, description], index) => (
            <article key={title}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>
      <footer className="c-contact" id="contacto">
        <div>
          <span>Contacto</span>
          <h2>¿HABLAMOS?</h2>
        </div>
        <a href="https://www.linkedin.com/in/oscar-trevejo-rodriguez-a8a471166/">
          LinkedIn <ArrowUpRight size={24} />
        </a>
      </footer>
    </main>
  )
}

export default function DesignPrototype() {
  const [current, updateCurrent] = useState<Variant>(getVariant)

  useEffect(() => {
    const onPopState = () => updateCurrent(getVariant())
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  function setCurrent(value: Variant) {
    const url = new URL(window.location.href)
    url.searchParams.set('variant', value)
    url.hash = ''
    window.history.pushState({}, '', url)
    window.scrollTo({ top: 0, behavior: 'instant' })
    updateCurrent(value)
  }

  return (
    <>
      {current === 'A' ? (
        <VariantA />
      ) : current === 'B' ? (
        <VariantB />
      ) : (
        <VariantC />
      )}
      <PrototypeSwitcher current={current} setCurrent={setCurrent} />
    </>
  )
}
