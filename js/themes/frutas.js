/* ============================================================
 * TEMA: Frutas neón
 * ------------------------------------------------------------
 * Un tema define la progresión de piezas del juego de fusiones.
 * Cada nivel: { emoji | image, radius, color, points }
 *   - emoji:  carácter que se dibuja (si usas image, emoji es el fallback)
 *   - image:  (opcional) URL de una imagen PNG/WebP con transparencia
 *   - radius: radio de la pieza cuando el tablero mide scaleBase px de ancho
 *   - color:  color neón del halo (formato hex)
 *   - points: puntos que da al crearse al fusionar dos del nivel anterior
 * maxDropLevel: nivel máximo que puede aparecer para soltar (0-based).
 * scaleBase: ancho de referencia del tablero; los radios se escalan solos.
 * ============================================================ */
window.FUSION_THEME = {
  name: 'Frutas',
  scaleBase: 420,
  maxDropLevel: 4,
  levels: [
    { emoji: '\u{1F352}', radius: 16,  color: '#ff4d6d', points: 1  },  // cereza
    { emoji: '\u{1F353}', radius: 24,  color: '#ff2e88', points: 3  },  // fresa
    { emoji: '\u{1F347}', radius: 34,  color: '#b26bff', points: 6  },  // uvas
    { emoji: '\u{1F34A}', radius: 44,  color: '#ff9f1c', points: 10 },  // mandarina
    { emoji: '\u{1F34B}', radius: 54,  color: '#ffe600', points: 15 },  // limón
    { emoji: '\u{1F34E}', radius: 64,  color: '#ff3131', points: 21 },  // manzana
    { emoji: '\u{1F350}', radius: 76,  color: '#8dff57', points: 28 },  // pera
    { emoji: '\u{1F351}', radius: 88,  color: '#ff9e7d', points: 36 },  // melocotón
    { emoji: '\u{1F34D}', radius: 102, color: '#ffd23f', points: 45 },  // piña
    { emoji: '\u{1F348}', radius: 118, color: '#7dffce', points: 55 },  // melón
    { emoji: '\u{1F349}', radius: 136, color: '#00ff87', points: 66 }   // sandía
  ]
};
