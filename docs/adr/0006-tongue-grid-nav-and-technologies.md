# ADR 0006: Clic del avatar y elementos visuales de LuxorStudio

**Estado:** implementada el 31 de octubre de 2026.

Óscar pidió distinguir el clic sin arrastre del arrastre en el avatar. El clic sobre cualquier píxel visible, sin superar 8 px de movimiento del puntero en pantalla, muestra durante un segundo un sprite completo con la lengua fuera. El umbral usa coordenadas de pantalla para que el parallax de la cabeza no active un arrastre accidental. Después vuelve al frame de mirada correspondiente al cursor. El arrastre conserva la deformación local y alterna las tres caras de enfado. La lengua tiene prioridad sobre el parpadeo para que nunca aparezcan dos bocas u ojos por mezcla de imágenes. El sprite se generó con ImageGen a partir de `oscar-face-center.png`, conservando identidad, escala, pose, pelo, ojos azules y fondo transparente. Su archivo es `Portfolio2026/src/assets/face/oscar-face-tongue.png`.

El menú toma como referencia `E:\PortfolioReact\LuxorStudio\LuxorStudio\src\components\layout\Navbar.tsx` y la captura adjunta: barra negra, texto en mayúsculas, borde fino y esquinas recortadas. Se mantienen los enlaces del portfolio y el selector de idioma. Las secciones oscuras usan la cuadrícula de 100 px de `GridBackground.tsx`; se añade una luz tenue bajo el puntero. Se excluye explícitamente la línea roja animada.

La imagen pequeña entre Sobre mí y Lo que hago se retira. En su lugar aparece un carrusel de tecnologías. Los nombres se guardan en `src/constants/content.ts` y el título en los archivos ES/EN. La lista se basa en el portfolio anterior de Óscar (`DeveloperCurriculum`), sus proyectos y C# confirmado por él. El carrusel se pausa al pasar el ratón; con movimiento reducido se presenta como lista desplazable manualmente.
