# Galería visual

La galería se abre en `/es/galeria/` y `/en/gallery/` desde el menú. Mantiene la organización de seis categorías del proyecto local `E:\PortfolioReact\PortfolioArt\WHTY`: fotografía, diseño, portadas, logotipos, arte 3D y videoclips. Presenta 87 piezas: 22 fotos, 6 diseños, 41 portadas, 6 logotipos, 7 imágenes 3D y 5 enlaces de vídeo. El sexto logotipo (`STREETALIENS.png`) está en el directorio fuente aunque la antigua página de WHTY solo mostraba cinco.

## Archivos y edición

- `source-assets/gallery/`: copia local de los originales; `Titles/title6.png` sirve de fuente para la portada de vídeo. Se convirtió sin pérdidas desde el JPEG para eliminar metadatos EXIF/XMP/IPTC. No forma parte de la compilación publicada.
- `public/gallery/`: WebP completos de hasta 1920 px y miniaturas de 480 px en `thumbs/`.
- `src/constants/gallery-images.generated.json`: rutas, orden numérico y dimensiones producidas por `npm run images:optimize`.
- `src/constants/gallery.ts`: categorías, portadas e identificadores de vídeo. Las imágenes siguen el orden numérico de WHTY.
- `HOME_GALLERY_SLIDES` en ese mismo archivo: cinco selecciones de tres obras para el carrusel de portada; todas usan el mismo layout, con la obra central alta y las laterales inclinadas. Sus títulos se traducen en `src/locales/es.ts` y `en.ts`.
- `src/locales/es.ts` y `src/locales/en.ts`: título, descripción, nombres de categorías, botones, textos alternativos y metadatos de la galería.
- `src/components/GalleryPage.tsx`: filtros, mosaico adaptable y vista ampliada con navegación anterior/siguiente.
- `src/app.css`: diseño de la galería en escritorio y móvil.

Para añadir una imagen, copiar el original a `source-assets/gallery/<categoría>/` y ejecutar `npm run images:optimize`. El manifiesto se regenera automáticamente. Para cambiar portada o vídeos, editar `src/constants/gallery.ts`; para cambiar palabras visibles, editar ambos idiomas. El mosaico empieza con 24 piezas y añade bloques de 24 al acercarse al final. Las miniaturas usan carga diferida y el original solo se solicita al ampliar. Los cinco vídeos usan sus miniaturas de YouTube y solo cargan un reproductor `youtube-nocookie.com` cuando se abre uno.

La fuente WHTY es un portfolio de artista desarrollado por Óscar. El inventario registra la procedencia técnica de las imágenes; **la autoría individual de cada obra no está verificada**. Antes de publicar la galería como obra propia de Óscar, confirmar créditos y derechos de cada pieza. Hasta entonces, la interfaz usa descripciones neutrales y no atribuye autoría individual.

## Comportamiento

Las seis tarjetas superiores llevan al filtro correspondiente. «Todo» devuelve las 87 piezas en el orden de categorías anterior. Cada imagen se abre en un diálogo modal; se puede cerrar con Escape, navegar con las flechas del teclado o usar los botones. El foco vuelve a la pieza al cerrar. El idioma conserva la ruta de galería y el tema se mantiene al navegar o recargar.
