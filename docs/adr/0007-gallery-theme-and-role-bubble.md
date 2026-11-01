# ADR 0007: Galería, selector de tema y bocadillo del avatar

**Estado:** implementada el 1 de noviembre de 2026.

Óscar pidió un selector claro/oscuro en la cabecera, frases profesionales rotativas bajo el avatar y una pantalla de galería basada en WHTY. El tema se guarda en `localStorage` y se expresa mediante variables semánticas de CSS. El interruptor muestra sol y luna, expone su estado a tecnologías de asistencia y anima el indicador salvo cuando se prefiere menos movimiento.

El bocadillo ocupa el espacio bajo la cabeza sin cubrir el rostro. Cambia de frase cada 4,2 segundos; en movimiento reducido permanece en la primera. Las frases ES/EN se guardan en los archivos de idioma. El avatar mantiene su interacción independiente.

La galería vive en rutas localizadas y usa el mismo encabezado y pie. Su organización, inventario y modo de edición están en [GALLERY.md](../GALLERY.md). Los archivos visuales están en `public/gallery` y sus rutas en `src/constants/gallery.ts`. Los vídeos no cargan un iframe hasta que el visitante abre uno. Se preservó la entrada local de Ubisoft ya presente en `src/constants/content.ts` antes de este cambio.
