# Contrato de constantes de la aplicación

La aplicación se implementa en `Portfolio2026/`. **Todo texto editorial visible** se define fuera de los componentes en un archivo de idioma. Los datos estables y enlaces se definen en archivos de constantes. Así una corrección no obliga a buscar dentro del JSX.

| Archivo | Contenido | Se cambia aquí para… |
| --- | --- | --- |
| `src/locales/es.ts` | Navegación, títulos, bio, especialidades, proyectos, estados, CTA, metadatos, textos alternativos y accesibilidad en castellano | Corregir cualquier frase ES |
| `src/locales/en.ts` | Mismas claves en inglés | Corregir cualquier frase EN |
| `src/locales/types.ts` | Tipo derivado del castellano | Detectar claves ausentes en inglés |
| `src/locales/index.ts` | Mapa de idiomas | Añadir un idioma en el futuro |
| `src/constants/site.ts` | Nombre, enlaces LinkedIn/GitHub/ArtStation, idioma inicial | Cambiar identidad o enlaces de contacto |
| `src/constants/content.ts` | Proyectos, imágenes, URLs, orden, estado, experiencia y orden de especialidades | Actualizar trabajos o trayectoria |
| `src/constants/gallery.ts` | Categorías, rutas de las 82 imágenes, portadas y cinco vídeos | Añadir o reordenar piezas visuales |
| `src/constants/design-tokens.css` | Paleta, tipografía y radios de sección | Cambiar los valores visuales principales |
| `src/app.css` | Composición y estilos de cada sección | Ajustar geometría y reglas adaptables |

`App.tsx` lee estas fuentes. Solo contiene estructura HTML, lógica de navegación y números de presentación derivados de las constantes. `InteractiveFace.tsx` no contiene copy: recibe su etiqueta accesible como propiedad desde el archivo de idioma. Los textos de imágenes y `aria-label` también son copy y deben mantenerse localizados.

Para añadir un proyecto: registro con ID, imagen, URL y estado en `content.ts`; título, categoría, descripción y alt en **ambos** idiomas. Para modificar un enlace, tocar una sola constante. Para cambiar una frase, editar cada idioma. El estado de Presenty permanece «fase temprana» hasta que Oscar indique otra cosa.

Las frases rotativas del avatar viven en `hero.roles` para cada idioma. El selector de tema usa las etiquetas localizadas `theme.toLight` y `theme.toDark`. Los textos, títulos de categorías y metadatos de la galería viven en `gallery`; sus imágenes y vídeos en `gallery.ts`. Véase [GALLERY.md](GALLERY.md).

La regla se aplica igualmente a futuros errores, estados vacíos, placeholders, copyright, SEO y texto dentro de gráficos. No incrustar palabras traducibles en PNG/SVG ni en pseudo-elementos CSS.
