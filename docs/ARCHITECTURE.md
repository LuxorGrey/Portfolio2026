# Arquitectura actual

La aplicación principal está en `src/`; el prototipo de variantes queda en `src/prototype/` para consulta durante desarrollo. La portada se renderiza en `/es/` y `/en/`; la galería, en `/es/galeria/` y `/en/gallery/`. `public/_redirects` prepara las rutas para Netlify, sin desplegar el sitio.

```text
src/
  App.tsx                  estructura y cambio de idioma
  app.css                  estilos de producción
  components/
    InteractiveFace.tsx   canvas, mirada, parpadeo, lengua y arrastre
    HeroRoleBubble.tsx   frases profesionales rotativas
    GalleryPage.tsx      filtros, mosaico y visor de obras
  constants/
    site.ts               identidad, idiomas y perfiles
    content.ts            proyectos, experiencia y orden de áreas
    gallery.ts            categorías, portadas y vídeos
    gallery-images.generated.json  rutas y dimensiones generadas
    design-tokens.css     paleta, tipografía y radios
  locales/
    es.ts                 copy castellano
    en.ts                 copy inglés
    types.ts              contrato de claves
    index.ts              selector de diccionario
  assets/
    face/                 seis imágenes de mirada/parpadeo y tres de enfado
    projects/             capturas de WHTY y Presenty
source-assets/gallery/    originales para regenerar imágenes
public/gallery/           WebP completos y miniaturas de 480 px
scripts/optimize-images.mjs  conversión reproducible con Sharp
```

`App.tsx` no contiene copy editorial fijo. La traducción se elige por la URL y se refleja en `html[lang]`, `<title>` y descripción. El selector cambia la ruta preservando el ancla. Las dos fichas se generan desde `PROJECTS` y las cinco áreas desde `SPECIALTY_IDS`. Las rutas de proyecto y de perfil se modifican en una sola constante.

El retrato usa un canvas 2D de 640×640. La imagen central WebP se carga primero; las otras nueve variantes transparentes se cargan después. Cada repintado dibuja **una sola imagen completa**, seleccionada por la posición del puntero, el parpadeo, la lengua o la expresión de enfado; una variante aún sin cargar usa la imagen disponible anterior. El parallax anima el contenedor por separado. El canal alfa frontal define dónde se puede iniciar el gesto. La imagen frontal queda de respaldo. Los listeners y el frame loop se limpian al desmontar, y el repintado se pausa fuera de pantalla. Un navegador con movimiento reducido no aplica parallax.

`App.tsx` elige portada o galería por la ruta y cambia el idioma sin salir de la pantalla actual. El tema persiste en `localStorage` y las variables de `design-tokens.css` lo aplican a ambas pantallas. El módulo de galería se importa al entrar en su ruta. Renderiza 24 piezas inicialmente y añade bloques de 24 cerca del final mediante `IntersectionObserver`; las miniaturas usan `loading="lazy"` y las imágenes completas solo se solicitan al abrir el diálogo. El iframe de vídeo aparece solo en el diálogo abierto. El inventario y los créditos pendientes se detallan en [GALLERY.md](GALLERY.md).

Los PNG originales del avatar permanecen como fuente local; la compilación importa los WebP optimizados. Se conserva una sola resolución y alineación exacta entre variantes para que el cambio inmediato no produzca saltos. La fuente Kanit se sirve localmente. `public/_headers` configura CSP, políticas del navegador y caché para Netlify. Véase [PERFORMANCE-SECURITY.md](PERFORMANCE-SECURITY.md) para medidas y comprobaciones.

No se ha introducido CMS ni una abstracción de datos remotos. El módulo de constantes ofrece una **interface** pequeña a la presentación; esa **seam** concentra el contenido con **locality** y **leverage**. Un **adapter** remoto sería hipotético. La **depth** de nuevos módulos se evaluará con el *deletion test* cuando haya una necesidad real. La *interface* del catálogo es una superficie de prueba útil para idiomas, proyectos y estados.
