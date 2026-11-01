# Especificación vigente de la aplicación

La implementación vive en `Portfolio2026/`. Esta especificación refleja el cambio pedido por Oscar el 31 de octubre de 2026 y prevalece sobre los primeros bocetos y el RTF cuando haya conflicto. No publicar desde esta tarea; se trabaja en local.

## Orden y contenido

1. Navegación con Proyectos, Áreas, Galería, Sobre mí, Contacto, selector ES/EN e interruptor claro/oscuro. El menú toma de LuxorStudio su contorno fino, etiquetas en mayúsculas y esquinas recortadas.
2. Hero con «ÓSCAR» y «TREVEJO» en dos líneas detrás del retrato ilustrado propio. El avatar puede tapar parte del texto. Un bocadillo bajo la cara presenta cuatro roles en rotación cada 4,2 segundos. No mostrar botones ni galería de imágenes bajo el hero.
3. Proyectos inmediatamente después del hero. Título «PROYECTOS» / «PROJECTS» en una línea. Dos fichas amplias con imagen, tipo, estado, resumen y enlace: WHTY y Presenty. Presenty lleva «Fase temprana» / «Early stage». Las fichas alternan la posición de imagen y texto en escritorio y se apilan en móvil.
4. Sobre mí: titular «ENTRE EL CÓDIGO Y LA IMAGEN.» / «BETWEEN CODE AND IMAGE.», bio breve y experiencia de CaixaBank Tech, Capgemini / Openbank y Aquiles Solutions.
5. Carrusel de tecnologías sobre fondo oscuro, entre Sobre mí y Lo que hago. La lista editable está en `src/constants/content.ts`; su movimiento se detiene al pasar el puntero y se sustituye por desplazamiento manual con movimiento reducido. No se muestra un segundo avatar encima de Lo que hago.
6. Lo que hago: cinco áreas con número, título y descripción sobre fondo blanco.
7. Galería independiente ES/EN: seis categorías de WHTY, 82 imágenes, cinco videoclips, filtros, vista ampliada y navegación por teclado. Ver [GALLERY.md](GALLERY.md).
8. Contacto: LinkedIn como enlace principal, GitHub y ArtStation como secundarios.

## Sistema visual heredado

Kanit, fondo `#0C0C0C`, texto frío `#D7E2EA`, degradado de titulares `#646973` a `#BBCCD7` y contraste fuerte entre fondos oscuros y claros. El hero conserva la escala grande y la composición centrada del RTF. Los proyectos reciben un tratamiento editorial más simple que el prototipo C: fondo claro, dos fichas de gran formato, bordes finos y radio contenido. La sección de especialidades conserva cinco filas y números grandes. El contacto vuelve al fondo oscuro. Las superficies oscuras tienen una cuadrícula estática de 100 px inspirada en LuxorStudio, con iluminación suave cerca del puntero. La línea roja animada de ese proyecto queda excluida.

Breakpoints: móvil hasta 620 px, formato intermedio hasta 900 px y escritorio por encima. En móvil el titular y el avatar se adaptan sin desbordamiento horizontal, el título de proyectos sigue en una línea y las fichas pasan a una columna. Usar foco visible y movimiento reducido.

El tema claro cambia las superficies, texto, cuadrícula, menú y degradado mediante variables semánticas de CSS. La elección se guarda en `localStorage`; el tema oscuro es el inicial. El selector expone su estado accesible y reduce la animación si el usuario lo prefiere. El bocadillo permanece estático con movimiento reducido.

## Retrato: regla de una imagen

Usar los diez recursos en `src/assets/face/`: frente, izquierda, derecha, arriba, abajo, parpadeo, tres enfados y lengua. El componente carga las imágenes en canvas de 640×640 y conserva la frontal como alternativa hasta que están listas. Según la posición del ratón respecto del centro del retrato, selecciona una sola imagen completa. No mezclar ojos, iris ni frames con opacidad; la elección de imagen ocurre en el evento de puntero. Las variantes disponibles permiten cinco direcciones discretas, no seguimiento continuo por píxel.

Parpadeo: sustituir la imagen completa por `blink` durante unos 110 ms, con inicio cada 2–3 segundos. El parallax de cabeza mantiene suavizado independiente para conservar el efecto que Oscar aprobó. El gesto empieza en cualquier píxel visible de la cabeza, según el alfa del frame frontal. Un desplazamiento físico del puntero de al menos 8 px activa el arrastre y deforma una zona local alrededor del punto de agarre. El umbral se mide en coordenadas de pantalla para que el parallax no convierta un clic inmóvil en arrastre. Mientras dura, alternar `angry1`, `angry2` y `angry3` cada 450 ms; cada una es un frame completo. Si se suelta sin arrastrar, mostrar el frame completo `tongue` durante un segundo y recuperar la mirada previa según la posición actual del puntero. El parpadeo se pospone durante la lengua y el arrastre. Detener repintados fuera de pantalla y liberar listeners al desmontar. Con movimiento reducido, desactivar el parallax, manteniendo el cambio de mirada.

## Organización editable

- `src/locales/es.ts` y `src/locales/en.ts`: todos los textos, SEO, alt y etiquetas accesibles.
- `src/constants/site.ts`: nombre, idiomas y enlaces profesionales.
- `src/constants/content.ts`: orden, IDs, URLs, estados e imágenes de proyectos; experiencia, áreas y tecnologías del carrusel.
- `src/constants/gallery.ts`: categorías, imágenes locales y vídeos de la galería.
- `src/App.tsx`: estructura y lectura de constantes, sin copy editorial fijo.
- `src/components/InteractiveFace.tsx`: interacción aislada del retrato.
- `src/constants/design-tokens.css`: paleta, tipografía y radios principales.
- `src/app.css`: composición de las secciones y reglas adaptables.

El prototipo A/B/C en `src/prototype/` queda para comparar ideas durante desarrollo; no forma parte del build principal salvo su ruta especial de desarrollo.

## Verificación

Ejecutar `npm run lint`, `npm run typecheck` y `npm run build` en `Portfolio2026/`. Revisar visualmente `/es/` y `/en/` en móvil y escritorio, y comprobar que el título de proyectos no se parte, el retrato conserva una sola cara/iris por frame, los enlaces son útiles y el cambio de idioma mantiene los anclajes. El deploy público queda fuera del alcance actual.
