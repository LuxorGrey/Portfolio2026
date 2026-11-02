# Portfolio de Oscar Trevejo Rodríguez — briefing de producto

> **Estado:** portfolio publicado en GitHub Pages desde `main`. `README.rtf` conserva la referencia visual inicial. La decisión más reciente sobre diseño e interacción está en [ADR 0008](docs/adr/0008-motion-interactions.md).

Las interacciones de escritura, revelado, carrusel, skeleton y cortina de navegación se describen en [ADR 0008](docs/adr/0008-motion-interactions.md).

## Desarrollo local

Requiere Node.js 24 o superior y npm. Ejecutar `npm ci`, `npm run dev`, `npm run lint`, `npm run typecheck` y `npm run build` desde la raíz del repositorio. La portada se abre en `/es/` y `/en/`, y la galería en `/es/galeria/` y `/en/gallery/`. El prototipo de diseño está en `/prototype/design`.

Para regenerar las imágenes WebP y sus miniaturas a partir de los originales locales, ejecutar `npm run images:optimize`. Las decisiones de carga, las cifras medidas, el escaneo de seguridad y los pasos de comprobación están en [docs/PERFORMANCE-SECURITY.md](docs/PERFORMANCE-SECURITY.md).

## Despliegue

Cada push a `main` ejecuta `.github/workflows/deploy.yml` y publica `dist/` en [GitHub Pages](https://luxorgrey.github.io/Portfolio2026/). Vite usa `/Portfolio2026/` como base; el build crea páginas de entrada para los dos idiomas y sus galerías, de modo que los enlaces directos y las recargas funcionen en Pages.

## Objetivo

Crear un portfolio bilingüe (castellano e inglés) para **Oscar Trevejo Rodríguez**, desarrollador frontend y diseñador gráfico. Oscar ha elegido un **perfil híbrido**: ambas disciplinas deben tener el mismo peso. El público principal son equipos que buscan desarrollo frontend, diseño gráfico o una combinación de ambos. La acción principal es explorar proyectos reales; la secundaria, contactar con Oscar.

La aplicación conserva del RTF el fondo oscuro `#0C0C0C`, Kanit de gran escala, títulos contundentes, contraste entre secciones y el retrato como centro de la portada. Oscar ha afinado el diseño: el retrato es suyo, «ÓSCAR / TREVEJO» queda detrás y los proyectos aparecen justo después del hero, sin galería ni bloque inferior de texto. La [especificación vigente](docs/IMPLEMENTATION-SPEC.md) y el [contrato de constantes](docs/CONTENT-CONTRACT.md) describen esta versión.

## Contenido y orden

1. **Portada:** «ÓSCAR» y «TREVEJO» detrás del retrato interactivo. Mirada inmediata hacia el cursor, parpadeo cada 2–3 segundos, parallax suave y un bocadillo profesional que cambia cada 4,2 segundos.
2. **Proyectos:** título corto en una línea, WHTY y Presenty en dos fichas amplias. Presenty indica su fase temprana.
3. **Sobre mí y experiencia:** presentación breve y trayectoria laboral.
4. **Tecnologías:** carrusel de React, TypeScript, JavaScript, HTML, CSS, C#, Node.js, Tailwind CSS, Styled Components y PostgreSQL. La lista se edita en `src/constants/content.ts`.
5. **Especialidades:** cinco entradas de desarrollo, diseño y su unión.
6. **Galería:** 87 piezas organizadas como en WHTY: fotografía, diseño, portadas, logotipos, 3D y videoclips. Véase [inventario y edición](docs/GALLERY.md).
7. **Contacto:** enlaces a [LinkedIn](https://www.linkedin.com/in/oscar-trevejo-rodriguez-a8a471166/), GitHub y ArtStation. El CV de 2024 no se enlaza.

## Diseño que se conserva y ajustes propuestos

- Mantener contraste oscuro/claro, proporciones expresivas y transiciones de sección. Los proyectos usan fichas editoriales amplias, alternando imagen y texto.
- El retrato animado de la mujer del original **no representa a Oscar**. La decisión posterior de Oscar es usar un retrato 3D ilustrado basado en su propia foto, con ojos azul claro, mirada que siga el cursor, parpadeo, parallax sutil, arrastre desde toda la cara y un clic breve que muestra la lengua un segundo. El prototipo está en `src/prototype/`. Véanse [ADR 0003](docs/adr/0003-interactive-portrait.md) y [ADR 0006](docs/adr/0006-tongue-grid-nav-and-technologies.md).
- Priorizar material propio. Los enlaces de `motionsites.ai`, Figma, Higgs y CloudFront del RTF son referencias ajenas, no activos de producción.
- Conservar el carácter de la tipografía y el degradado. Revisar el tamaño de `OSCAR TREVEJO` a dos líneas si el nombre se corta: la legibilidad prevalece sobre reproducir literalmente el `h1` de Mina.
- La navegación usa **Proyectos / Áreas / Galería / Sobre mí / Contacto** y su equivalente inglés, con el contorno y las esquinas recortadas de LuxorStudio. Los selectores de idioma y tema permanecen en la cabecera. Las superficies de portada conservan la cuadrícula, iluminada suavemente al pasar el puntero; se excluye la línea roja animada.

## Requisitos de calidad

- **Todo texto visible, URL, alt, etiqueta, metadato y dato editable vive en `src/constants/` o `src/locales/`; las secciones hacen referencia a esos archivos y no contienen cadenas editoriales fijas.** Ver [docs/CONTENT-CONTRACT.md](docs/CONTENT-CONTRACT.md) y [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).
- Castellano e inglés completos, selector visible y persistente, enlaces compartibles por idioma, atributo `lang`, metadatos y textos alternativos localizados.
- Diseño adaptable desde móvil; navegación, botones, tarjetas y cambio de idioma utilizables con teclado y lector de pantalla. Respeto a `prefers-reduced-motion` y retrato estático cuando se reduzca el movimiento o falle la interacción.
- Imágenes optimizadas con dimensiones conocidas, formatos modernos, carga diferida fuera de portada y sin desplazar el contenido. Las animaciones ligadas a scroll no deben bloquear el hilo principal ni ser necesarias para entender la página.
- Enlaces externos comprobados, `rel="noopener noreferrer"` cuando corresponda, datos personales limitados a los aprobados y ninguna dependencia de imágenes alojadas por terceros sin derecho de uso.
- Calidad antes de publicar: revisión de textos en ambos idiomas, contraste, foco, móvil, rendimiento, enlaces y contenido real. Los criterios de aceptación detallados están en [docs/ACCEPTANCE.md](docs/ACCEPTANCE.md).

## Procedencia y decisiones pendientes

La fuente de datos revisada es `E:\PortfolioReact\DeveloperCurriculum` (código local del portfolio actual). Su web pública indicada por Oscar es [oscartrevejo.netlify.app](https://oscartrevejo.netlify.app/); la consulta automatizada a esa URL no respondió, por lo que los datos se extrajeron del repositorio local. El RTF original incluye material de muestra ajeno y contradicciones internas; se conserva sin editar para comparación. [docs/SOURCE-AUDIT.md](docs/SOURCE-AUDIT.md) distingue hechos y comprobaciones editoriales. [GLOSSARY.md](GLOSSARY.md) fija el vocabulario. Los ADR [0001](docs/adr/0001-content-and-visual-identity.md), [0002](docs/adr/0002-local-content-and-assets.md) y [0003](docs/adr/0003-interactive-portrait.md) registran las decisiones de identidad, contenido y retrato interactivo.

**Implementación local:** el repositorio incluye la web ES/EN, capturas de WHTY/Presenty, retrato interactivo, experiencia, carrusel de tecnologías, galería, especialidades y contacto. Las imágenes publicadas se sirven como WebP; los originales quedan fuera de `dist/`. Antes de publicar se comprobarán fechas, enlaces y créditos de las piezas importadas de WHTY. Los 21 GIF y el retrato ajeno del RTF siguen excluidos.
