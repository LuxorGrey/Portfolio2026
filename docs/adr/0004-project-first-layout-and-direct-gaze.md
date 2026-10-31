# ADR 0004: Portada mínima, proyectos inmediatos y mirada sin mezcla

**Estado:** implementada el 31 de octubre de 2026. Sustituye el orden y la pieza central de los ADR anteriores donde exista conflicto.

## Decisión de Oscar

El titular detrás del avatar es «ÓSCAR» y debajo «TREVEJO». Se elimina el bloque inferior del hero: firma, descriptor, botones «Ver proyectos» y «Hablemos», y las pistas para mover el cursor o arrastrar una mejilla. La sección de proyectos empieza inmediatamente después de la portada. «Trabajo que se puede ver» se sustituye por «PROYECTOS», en una línea. Entre «Entre el código y la imagen» y «Lo que hago» aparece un detalle pequeño del avatar.

## Interacción del retrato

La mirada elige una imagen completa según la posición del puntero, sin fundidos ni capas de iris. La nueva imagen se pinta en el mismo evento de puntero. El parallax conserva su suavizado por separado. El parpadeo usa la imagen de ojos cerrados durante unos 110 ms y empieza cada 2–3 segundos. La imagen frontal permanece como alternativa hasta que cargan las variantes.

## Consecuencias

La galería del briefing anterior y las tres variantes del prototipo no se usan en la aplicación principal. El prototipo permanece disponible solo en desarrollo para comparación. Las cinco especialidades, la experiencia y el contacto siguen después de los proyectos. La experiencia está implementada en `Portfolio2026/` y los textos viven en dos archivos de idioma.
