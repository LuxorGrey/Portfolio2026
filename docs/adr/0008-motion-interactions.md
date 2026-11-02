# ADR 0008 — Interacciones tipográficas, galería destacada y cortina

Estado: implementado el 1 de noviembre de 2026.

Óscar pidió seis efectos a partir de ejemplos de Motion. Las páginas públicas de Typewriter, Scramble Text Hover, Carousel Pagination y Curtains Mixed describen el resultado, pero el código completo de esos componentes está reservado a Motion+. Se implementaron versiones propias para este portfolio; el revelado por palabras y la transición de imágenes usan la API pública de `motion/react`.

## Comportamiento

- El bocadillo bajo el retrato escribe la frase activa carácter a carácter, la mantiene visible y pasa a la siguiente. Las frases siguen en `src/locales/es.ts` y `en.ts`.
- «ÓSCAR / TREVEJO» mezcla caracteres al aparecer y al entrar el puntero en la zona del retrato. Durante el arrastre la mezcla es continua y acelera hasta un límite; Motion desplaza el título con una oscilación que también acelera y se detiene al soltar. La malla geométrica de la deformación se ve sobre la cara mientras se arrastra. El nombre accesible permanece completo durante la animación.
- El número, el título y la descripción de cada entrada de «Lo que hago» cambian su opacidad según el desplazamiento. El encabezado de la sección permanece sticky mientras la sección está a la vista. El texto accesible es continuo, sin anunciar cada letra o palabra.
- La galería muestra un skeleton de tarjetas durante la importación diferida y un shimmer sobre miniaturas individuales hasta que cargan. Se conservan tamaños conocidos para evitar saltos.
- Después de Proyectos, cinco páginas de tres imágenes locales aparecen en un carrusel con flechas, indicadores y enlace a la galería completa. Todas usan la misma composición editorial: imagen central alta y dos laterales más bajas e inclinadas. Solo existe en el DOM la composición activa; no hay reproducción automática.
- La navegación interna usa dos paneles que cubren la pantalla desde los lados y se retiran en vertical. Los colores salen de `design-tokens.css` y cambian con el tema. La URL, el historial y las rutas ES/EN siguen funcionando.
- La cabecera queda sticky y visible al desplazarse. Las secciones tienen margen de scroll según su altura en escritorio y móvil; el encabezado sticky de «Lo que hago» se sitúa debajo de ella.

`prefers-reduced-motion` presenta texto completo, desactiva escritura y mezcla de letras, muestra las descripciones sin revelado y evita la cortina. El carrusel conserva los controles sin animación. Los módulos de Motion del carrusel y las descripciones se importan cuando sus secciones se acercan al viewport. El skeleton de galería no añade un tiempo artificial de espera.

Referencias visuales: [Typewriter](https://motion.dev/examples/react-typewriter), [Scroll word reveal](https://motion.dev/examples/react-text-scroll-word-reveal), [Scramble text hover](https://motion.dev/examples/react-scramble-text-hover), [Skeleton shimmer](https://motion.dev/examples/react-skeleton-shimmer), [Carousel pagination](https://motion.dev/examples/react-carousel-pagination-arrows) y [Curtains mixed](https://motion.dev/examples/react-curtains-mixed).
