# ADR 0005: Arrastre desde toda la cabeza y tres expresiones de enfado

**Estado:** implementada el 31 de octubre de 2026.

Oscar pidió poder tirar desde cualquier parte visible del avatar, no solo de una mejilla. Durante el arrastre, el retrato alterna tres expresiones de enfado (leve, marcado y exasperado) cada 450 ms. Las tres son imágenes completas transparentes derivadas del avatar frontal; no se superponen ojos ni rasgos. Al soltar, vuelve la mirada normal y la deformación recupera su forma.

El punto de agarre se valida con el canal alfa de la imagen frontal, por lo que el área cuadrada transparente no inicia el gesto. Una malla local alrededor del punto pulsado permite deformar pelo, frente, nariz, orejas, mejillas o barbilla. El puntero capturado mantiene el gesto aunque salga de la silueta. Los nuevos recursos están en `Portfolio2026/src/assets/face/oscar-face-angry-{1,2,3}.png`.

Las expresiones se generaron con la herramienta integrada de ImageGen, tomando `oscar-face-center.png` como objetivo de edición. Se preservaron persona, pose frontal, pelo, ojos azules, bigote, perilla y transparencia. Antes de publicar, revisar su alineación en un dispositivo real y optimizar los nueve PNG del avatar.
