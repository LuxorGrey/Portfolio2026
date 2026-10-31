# ADR 0003: Retrato propio e interactivo en la portada

**Estado:** decisión solicitada por Oscar; prototipo en evaluación. 31 de octubre de 2026. Sustituye la elección de composición SVG/CSS como pieza central en ADR 0001.

## Contexto

Oscar eligió la dirección visual C del prototipo y aportó una fotografía propia y una referencia de estilo 3D ilustrado. Quiere conservar la composición central de la portada de referencia, pero la persona representada debe ser él. Ha indicado ojos azul claro y ha pedido mirada que siga el cursor, animaciones, parallax y la posibilidad de arrastrar una mejilla.

## Decisión

La portada mostrará un retrato 3D ilustrado de Oscar basado en su fotografía, sobre fondo transparente y delante del titular grande. La interacción combinará seguimiento de mirada en varias direcciones, parpadeo, parallax discreto y deformación localizada de la mejilla al arrastrar. El prototipo usa seis imágenes propias (frente, cuatro direcciones y parpadeo) y canvas 2D; estos recursos son una prueba de interacción, no una obligación de conservar esa técnica en producción. El retrato y las imágenes de terceros del RTF no se incorporan.

## Consecuencias

- El retrato debe seguir identificando a Oscar sin animación y no puede ocultar el nombre ni los enlaces.
- La producción necesita optimizar peso, memoria y repintado; solo procesar la interacción cuando el retrato sea visible. Con movimiento reducido, mostrar una versión estática.
- La interacción de mejilla es decorativa; el contenido y la navegación deben estar disponibles con teclado y lector de pantalla.
- Antes de publicación se validará con Oscar que la imagen generada representa su identidad como desea.
