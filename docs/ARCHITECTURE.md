# Arquitectura actual

La aplicación principal está en `Portfolio2026/src/`; el prototipo de variantes queda en `src/prototype/` para consulta durante desarrollo. La página principal se renderiza en `/es/` y `/en/`. `Portfolio2026/public/_redirects` prepara las rutas para Netlify, sin desplegar el sitio.

```text
src/
  App.tsx                  estructura y cambio de idioma
  app.css                  estilos de producción
  components/
    InteractiveFace.tsx   canvas, mirada, parpadeo, parallax y arrastre
  constants/
    site.ts               identidad, idiomas y perfiles
    content.ts            proyectos, experiencia y orden de áreas
    design-tokens.css     paleta, tipografía y radios
  locales/
    es.ts                 copy castellano
    en.ts                 copy inglés
    types.ts              contrato de claves
    index.ts              selector de diccionario
  assets/
    face/                 seis imágenes de mirada/parpadeo y tres de enfado
    projects/             capturas de WHTY y Presenty
```

`App.tsx` no contiene copy editorial fijo. La traducción se elige por la URL y se refleja en `html[lang]`, `<title>` y descripción. El selector cambia la ruta preservando el ancla. Las dos fichas se generan desde `PROJECTS` y las cinco áreas desde `SPECIALTY_IDS`. Las rutas de proyecto y de perfil se modifican en una sola constante.

El retrato usa un canvas 2D de 640×640. Se cargan nueve imágenes transparentes. Cada repintado dibuja **una sola imagen completa**, seleccionada por la posición del puntero, el parpadeo o la expresión de enfado; el parallax anima el contenedor por separado. El canal alfa frontal define dónde se puede iniciar el arrastre. La imagen frontal queda de respaldo. Los listeners y el frame loop se limpian al desmontar, y el repintado se pausa fuera de pantalla. Un navegador con movimiento reducido no aplica parallax.

El principal coste actual es el peso de los nueve PNG. Convertirlos a un formato con transparencia más ligero y medir fidelidad de ojos y bordes es una mejora concreta antes de publicar. Mantener una sola resolución y alineación exacta entre variantes para que el cambio inmediato no produzca saltos.

No se ha introducido CMS ni una abstracción de datos remotos. El módulo de constantes ofrece una **interface** pequeña a la presentación; esa **seam** concentra el contenido con **locality** y **leverage**. Un **adapter** remoto sería hipotético. La **depth** de nuevos módulos se evaluará con el *deletion test* cuando haya una necesidad real. La *interface* del catálogo es una superficie de prueba útil para idiomas, proyectos y estados.
