# ADR 0002: Constantes locales, traducciones separadas y recursos propios

**Estado:** aceptada para implementación. 31 de octubre de 2026.

## Contexto

Oscar quiere cambiar cualquier texto o dato del portfolio rápidamente. El RTF mezcla textos, URLs, CSS y lógica de interacción. El portfolio anterior guarda traducciones en un archivo y proyectos en otro, pero también contiene cadenas de interfaz dentro de componentes.

## Decisión

Todos los datos no traducibles se almacenan en `src/constants/`; todo texto visible o accesible, incluido SEO y `alt`, en `src/locales/es.ts` y `src/locales/en.ts`. Los componentes solo consultan esas fuentes. Colores, tamaños, radios y tiempos se centralizan en tokens. La composición y los paneles de galería son SVG/CSS originales; las únicas capturas de proyecto iniciales proceden del portfolio local de Oscar.

## Consecuencias

- Una corrección de copy exige editar los dos archivos de idioma; una URL o imagen se cambia en un solo registro de constantes.
- La comprobación de tipos debe detectar claves ausentes y estados de proyecto no contemplados.
- La estética del RTF permanece en layout y movimiento, pero sus activos ajenos no se incorporan.
- La documentación `CONTENT-CONTRACT.md` es la referencia para crear y mantener los archivos.
