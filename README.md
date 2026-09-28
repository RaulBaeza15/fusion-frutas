# 🍉 Fusión Frutal

Juego web de fusiones tipo Suika con estética neón sobre negro. Dejas caer
piezas, dos iguales se fusionan en la siguiente de la cadena, y el objetivo
es llegar a la pieza final (la sandía) antes de que se llene el tablero.

**Jugar:** https://raulbaeza15.github.io/fusion-frutas/

- Sin backend, sin registros: HTML + CSS + JS estáticos.
- Físicas con [matter-js](https://brm.io/matter-js/) (CDN, con fallback).
- Táctil (móvil) y ratón (ordenador) con Pointer Events.
- Interfaz en 7 idiomas (ES, EN, FR, DE, IT, PT, TR) con detección de idioma
  del navegador y selector que recuerda la elección.
- Puntuación, récord guardado en localStorage, pieza siguiente visible y fin
  de partida cuando la pila cruza la línea de peligro.

## Estructura

```
index.html            página y HUD
css/style.css         estilo neón
js/engine.js          motor reutilizable (física, fusiones, puntuación, render)
js/themes/frutas.js   tema: la progresión de piezas
404.html              404 personalizado
```

## Crea y comparte un tema sin tocar código

Abre el panel **Crea tu tema** en la página principal, escribe de 3 a 11 emojis
(uno por línea, de menor a mayor), pulsa **Generar enlace** y copia el enlace.
Quien lo abra jugará con esa secuencia. El enlace contiene solo los emojis,
sin cuentas ni servidor; los tamaños, colores y puntos se calculan al abrirlo.
Cada tema guarda su propio récord en ese navegador. Un enlace sin parámetro
mantiene el tema de frutas. No introduzcas datos privados en el enlace.

El render de emojis usa sprites Twemoji desde jsDelivr para que se vean
sobre el canvas en iOS, con fuente emoji nativa si el recurso no carga.
Los emojis muy recientes que aún no estén en Twemoji pueden recurrir al
render nativo del dispositivo.

## Reutilizar la mecánica con otro tema

El motor (`js/engine.js`) no sabe nada de frutas: lee `window.FUSION_THEME`.
Para hacer otra versión (logos, planetas, coches, emoji de una marca...):

1. Copia `js/themes/frutas.js` a `js/themes/mi-tema.js`.
2. Edita la lista `levels`: una entrada por nivel, de menor a mayor:

```js
window.FUSION_THEME = {
  name: 'Planetas',
  scaleBase: 420,      // ancho de referencia para los radios
  maxDropLevel: 3,     // nivel máximo que aparece para soltar (0-based)
  levels: [
    { emoji: '\u{1FA90}', radius: 16, color: '#ff4d6d', points: 1 },
    // ...
    { emoji: '\u{1F30D}', radius: 136, color: '#00ff87', points: 66 }
  ]
};
```

3. En `index.html`, cambia el `<script src="js/themes/frutas.js">` por tu tema.

Opciones de cada nivel:

| Campo    | Qué hace |
|----------|----------|
| `emoji`  | Lo que se dibuja. Si defines `image`, actúa de fallback. |
| `image`  | (Opcional) URL de un PNG/WebP con transparencia; el motor la precarga y la dibuja rotando con la pieza. |
| `radius` | Radio en px cuando el tablero mide `scaleBase` de ancho (se escala solo). |
| `color`  | Color neón del halo (hex). |
| `points` | Puntos que da al crearse al fusionar dos del nivel anterior. |

Reglas del motor que conviene saber:

- Las piezas que caen se eligen al azar entre los niveles `0..maxDropLevel`.
- Al fusionar dos piezas del nivel máximo, desaparecen y dan el doble de puntos.
- La partida acaba cuando una pieza quieta pasa ~1,6 s por encima de la línea.

## Créditos

Hecho por [R15 Studios](https://r15studios.github.io/).
