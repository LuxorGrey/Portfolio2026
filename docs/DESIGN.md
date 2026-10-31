# Diseño vigente

La dirección visual parte del RTF original y del prototipo C. La decisión más reciente de Oscar está registrada en [ADR 0004](adr/0004-project-first-layout-and-direct-gaze.md). La implementación CSS está en `Portfolio2026/src/app.css`.

## Composición

```text
Navegación ES/EN
ÓSCAR
TREVEJO      ← avatar ilustrado delante del nombre
PROYECTOS    ← inmediatamente después del hero
WHTY / Presenty
ENTRE EL CÓDIGO Y LA IMAGEN + experiencia
Carrusel de tecnologías sobre cuadrícula oscura
LO QUE HAGO (cinco áreas)
¿HABLAMOS? / LinkedIn, GitHub, ArtStation
```

No hay descriptor, CTA ni pistas de interacción bajo la portada. El avatar puede cubrir parte del nombre a propósito. «PROYECTOS» es más corto que «Trabajo que se puede ver» y se mantiene en una línea. Las dos fichas editoriales alternan imagen y texto en escritorio; en móvil se apilan.

## Tokens visuales de partida

| Elemento | Valor |
| --- | --- |
| Fondo principal | `#0C0C0C` |
| Texto claro | `#D7E2EA` |
| Fondo de proyectos | `#E9EDF0` |
| Fondo de especialidades | `#FFFFFF` |
| Degradado del nombre | `#646973` → `#BBCCD7` |
| Tipografía | Kanit 300–900 |
| Esquinas de secciones | 60 px escritorio, 36 px móvil |

El único acento figurativo es el avatar. El menú conserva las esquinas recortadas y el contorno fino de LuxorStudio. El hero, Sobre mí, el carrusel y el contacto comparten su cuadrícula de 100 px; alrededor del puntero se ilumina ligeramente. No se copia la línea roja animada. Mantener foco visible, lectura clara, contraste suficiente y modo de movimiento reducido. El parallax suave del avatar se conserva; la mirada, el parpadeo y la lengua cambian una imagen completa de forma inmediata.

## Revisión visual

Comprobar ES/EN a 360, 768 y 1440 px. El nombre debe poder quedar parcialmente tapado por el avatar, pero la identidad completa debe seguir siendo comprensible. El título de proyectos debe caber en una línea sin recorte. Las fichas no deben perder su enlace al apilarse. El carrusel no debe impedir la lectura ni capturar el foco.
