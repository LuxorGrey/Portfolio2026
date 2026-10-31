# Auditoría de fuentes y afirmaciones

## Verificado en el portfolio local

Fuente: `E:\PortfolioReact\DeveloperCurriculum`, consultada el 31 de octubre de 2026. Solo lectura; no se modificó.

| Dato | Evidencia local | Uso recomendado |
| --- | --- | --- |
| Nombre Oscar Trevejo Rodríguez | `src/components/Footer/Footer.tsx`; `src/pages/home/components/animatedHeader.tsx` | Identidad principal |
| Desarrollo frontend y diseño | `src/pages/home/components/animatedHeader.tsx`; `src/i18n.ts` | Presentación principal |
| React, TypeScript, Tailwind CSS | `src/i18n.ts`; `src/pages/projects/constants/projectList.tsx` | Capacidades y fichas cuando corresponda |
| Experiencia en CaixaBank Tech, Capgemini/Openbank y Aquiles Solutions | `src/pages/about/AboutPage.tsx`; Oscar confirmó que quiere mostrar experiencia | Incluir trayectoria; verificar fechas y cargos antes de publicar |
| WHTY, enlace `https://whty.netlify.app/` | `src/pages/projects/constants/projectList.tsx`; Oscar lo describe como portfolio de artista y confirma desarrollo completo | Proyecto real; revisar imágenes y enlace |
| Presenty, enlace `https://presenty.netlify.app/` | Mismos archivos; Oscar lo describe como buscador de regalos en fase muy temprana y confirma desarrollo completo | Proyecto real en fase temprana; revisar imágenes y enlace |
| LinkedIn, ArtStation y GitHub | `src/pages/contact/ContactPage.tsx`; Oscar eligió LinkedIn como CTA | Contacto principal en LinkedIn; comprobar vigencia |
| Barcelona, España y «+4 años» | `src/i18n.ts` | **No publicar sin confirmar actualidad** |

El portfolio local incluye TaskFlow y CodeMaster con imágenes `placehold.co` y estado WIP. No son casos publicables confirmados. `public/OscarCV2024.pdf` puede estar desactualizado.

## Referencia original que se descarta como contenido

`README.rtf` pide una web de «Mina — 3D Creator», aunque menciona a Oscar en la primera frase. Atribuye experiencia, servicios 3D, clientes y tres proyectos de ejemplo, 21 GIF de `motionsites.ai`, recursos de Figma/Higgs/CloudFront y un retrato animado de una mujer. Todo ello es material de referencia de diseño, no evidencia biográfica ni trabajos de Oscar. También contiene una contradicción: dice que el retrato no tiene efecto magnético y después incluye CSS comentado como «with magnet».

## Comprobaciones antes de publicar

1. Usar inicialmente las capturas que ya están en el portfolio local y comprobar que las URLs de WHTY y Presenty siguen activas.
2. Verificar la vigencia de cargos, empresas y fechas laborales del portfolio local. Omitir ubicación, años de experiencia y CV hasta tener datos actuales.
3. El 31 de octubre de 2026 Oscar aportó una fotografía propia y una referencia de estilo 3D ilustrado. Solicitó ojos azul claro, mirada que siga el cursor, parpadeo, parallax y mejilla deformable. El prototipo genera seis recortes transparentes basados en esos archivos; verificar el resultado visual y optimizarlo antes de publicar.

## Decisiones confirmadas por Oscar

- Perfil híbrido de desarrollo frontend y diseño gráfico.
- Composición gráfica en el centro de la portada.
- Desarrollo completo de WHTY y Presenty; WHTY es un portfolio de artista y Presenty un buscador de regalos en fase muy temprana.
- Experiencia laboral visible y LinkedIn como destino del CTA principal.
- Retrato ilustrado de su propia cara como centro interactivo de la portada, con ojos azul claro y las interacciones descritas en ADR 0003.

La URL pública facilitada es `https://oscartrevejo.netlify.app/`. La herramienta de consulta web no pudo abrirla en esta sesión; el repositorio local suministró la información anterior.
