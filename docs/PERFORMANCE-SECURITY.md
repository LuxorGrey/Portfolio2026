# Rendimiento y seguridad

Auditoría local del 1 de noviembre de 2026. Las cifras son tamaños de archivos de compilación, no métricas de una conexión real. Conviene medir LCP, INP y CLS en la URL publicada con Lighthouse o PageSpeed Insights después del despliegue.

## Cambios aplicados

| Recurso | Antes | Ahora | Resultado |
| --- | ---: | ---: | --- |
| Diez variantes del retrato | Aproximadamente 18 MiB en PNG | 1,83 MiB en WebP | La imagen central carga primero; las demás llegan después. |
| Dos imágenes de proyectos | Aproximadamente 1,44 MiB en PNG | 0,10 MiB en WebP | `loading="lazy"`, `decoding="async"` y dimensiones declaradas. |
| Galería y portada de vídeo | 83 originales, parte de los 24,19 MiB de entrada total | 83 WebP completos y 83 miniaturas; 5,6 MiB en conjunto | El mosaico solicita miniaturas; el visor solicita la imagen grande bajo demanda. |
| JavaScript de la portada | Sin medición anterior comparable | 245,15 KB bruto / 77,87 KB gzip | El código de la galería queda en otro bloque: 14,27 KB bruto / 2,89 KB gzip. |
| CSS de producción | Tailwind y estilos propios | 19,99 KB bruto / 4,98 KB gzip | Se retiraron Tailwind y Motion porque no se usaban en la aplicación. |

`npm run images:optimize` utiliza Sharp y `source-assets/gallery/` para generar `public/gallery/`, `src/constants/gallery-images.generated.json` y los WebP del avatar/proyectos. Los originales se conservan para cambios futuros, pero Vite no los incluye en `dist/`. Al añadir o sustituir una obra hay que regenerar y revisar el manifiesto. Las miniaturas miden como máximo 480 px; las imágenes ampliadas, 1920 px. Los originales del avatar mantienen 1254 × 1254 para conservar la alineación de todas las expresiones.

La portada da prioridad a la variante central del avatar. La galería se importa con `React.lazy`, muestra 24 piezas al entrar y añade lotes de 24 con `IntersectionObserver` y margen de 900 px. Esto limita el DOM y las solicitudes iniciales; no es virtualización estricta con desmontaje de piezas anteriores. Para 87 piezas y un mosaico de alturas variables, evita un sistema de posicionamiento complejo y mantiene la navegación y el foco. Las imágenes fuera de pantalla usan carga nativa diferida; el iframe de YouTube solo existe al abrir un vídeo. Kanit se sirve desde el propio sitio, sin petición a Google Fonts. Los recursos con nombre versionado tienen caché inmutable; los de galería, caché de una semana.

## Comprobación

1. `npm ci` y `npm run images:optimize` para regenerar assets.
2. `npm run lint`, `npm run typecheck` y `npm run build`.
3. Abrir `/es/` y `/es/galeria/`; comprobar en Network que la portada no descarga los originales PNG ni el bloque de galería, que el mosaico descarga `thumbs/`, y que el WebP completo solo llega al abrir una obra.
4. Comprobar las diez expresiones del retrato, su transparencia y la alineación; probar el arrastre, la mirada, el parpadeo y el clic. Repetir en móvil y con movimiento reducido.
5. En la URL publicada, ejecutar Lighthouse móvil y escritorio y revisar LCP, INP, CLS, peso transferido y errores de consola/red. El servidor de desarrollo y las cifras gzip de Vite no sustituyen esa medición.

## Seguridad y privacidad

- `npm audit --omit=dev` informa **0 vulnerabilidades** en dependencias de producción. `npm audit` informa **12 avisos moderados** en herramientas locales de ESLint y TypeScript ESLint, derivados de `minimatch` 10.2.6. El [aviso oficial](https://github.com/advisories/GHSA-g3hv-75wg-m249) indica que se corrige en 11.0.1; forzar esa versión mayor sobre dependencias de lint sin soporte declarado puede romper la herramienta. Revisar cuando ESLint y sus dependencias publiquen versiones compatibles. No hay avisos altos ni críticos en el informe actual.
- No se encontraron claves, tokens, contraseñas ni secretos en el código de la aplicación. Los enlaces a LinkedIn, GitHub, ArtStation y proyectos son datos profesionales públicos; `localStorage` solo guarda la preferencia de tema. `.env` y variantes locales están excluidos por `.gitignore`. La única imagen fuente con EXIF/XMP/IPTC (`Titles/title6.jpg`) se convirtió sin pérdidas a PNG sin metadatos antes de incorporarla; los WebP publicados tampoco contienen esos bloques. Nunca añadir credenciales a constantes cliente, `public/` ni variables `VITE_*`: estas últimas se entregan al navegador.
- `public/_headers` aplica en Netlify una CSP que limita scripts y conexiones al propio sitio, permite miniaturas de `i.ytimg.com` y marcos de `youtube-nocookie.com`, bloquea objetos e incrustación de la página, además de `nosniff`, política de referencias y desactivación de permisos no usados. Validar los encabezados en la URL publicada; Vite local no los aplica. La CSP permite estilos en línea porque la interfaz usa estilos dinámicos.
- Abrir la categoría de vídeos envía una solicitud de miniatura a YouTube; abrir el visor carga el reproductor `youtube-nocookie.com`. Si se busca cero solicitudes a terceros antes de consentimiento, habría que sustituir también esas miniaturas por copias locales con derechos de uso comprobados. Los enlaces externos utilizan `rel="noopener noreferrer"` cuando abren otra pestaña.
- Las imágenes de WHTY proceden del proyecto local del artista. La propiedad y el permiso de publicación de cada obra siguen pendientes de confirmar, tal como consta en [GALLERY.md](GALLERY.md). Es un riesgo editorial, no una vulnerabilidad técnica.
