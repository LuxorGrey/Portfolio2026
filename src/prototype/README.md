# Prototipo visual descartable

Pregunta de diseño: ¿funciona la dirección C con un retrato 3D ilustrado de Oscar centrado, que mire al cursor, parpadee y permita estirar una mejilla?

Ejecutar desde la raíz del repositorio:

```bash
npm run prototype
```

Abrir `/prototype/design?variant=C`. Las variantes A y B siguen disponibles para comparar.

`assets/oscar-face-*.png` son seis recortes transparentes generados a partir de una fotografía aportada por Oscar y una referencia de estilo. La foto original no se guarda en este repositorio. Las imágenes corresponden a frente, izquierda, derecha, arriba, abajo y parpadeo. La mirada se mezcla en canvas; la deformación de mejilla usa una malla local de triángulos. La imagen frontal queda detrás del canvas como alternativa estática.

Prompt base resumido: «retrato 3D ilustrado de la persona de la fotografía, pelo castaño oscuro voluminoso, cejas gruesas, bigote y perilla, ojos azul claro, cabeza frontal aislada con transparencia, luz de estudio, sin cuerpo, texto ni accesorios». Cada variante cambia solo la dirección de las pupilas o cierra los ojos, manteniendo encuadre e identidad.

Este código y sus imágenes son material de evaluación; se reharán u optimizarán al aprobar la dirección visual. La implementación final debe medir fluidez y peso en móvil, respetar movimiento reducido y pausar repintados fuera de pantalla.
