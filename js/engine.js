/* ============================================================
 * FruitFusion Engine - motor reutilizable de juego de fusiones
 * ------------------------------------------------------------
 * No sabe nada de frutas: lee window.FUSION_THEME (ver
 * js/themes/frutas.js) y dibuja lo que el tema defina.
 * Para otro juego (logos, coches, planetas...) solo cambia el
 * archivo de tema. API:
 *
 *   FruitFusion.start({
 *     canvas:    <canvas>,
 *     onScore:   function(score) {},
 *     onNext:    function(level) {},
 *     onGameOver:function(score) {},
 *     onMerge:   function(level) {},        // se crea una pieza de nivel `level`
 *     onMaxMerge:function() {}              // dos piezas máximas se funden
 *   });
 *   FruitFusion.restart();
 * ============================================================ */
window.FruitFusion = (function () {
  'use strict';

  var W = 420;              // ancho lógico del tablero (px)
  var H = 640;              // alto lógico
  var DROP_Y = 70;          // altura desde la que se suelta
  var LINE_Y = 120;         // línea de peligro
  var WALL = 12;            // grosor paredes
  var DROP_COOLDOWN = 450;  // ms entre pieza y pieza
  var OVER_TIME = 1600;     // ms sobre la línea para fin de partida

  var engine, world, canvas, ctx, theme, scale;
  var score = 0, best = 0;
  var currentLevel = 0, nextLevel = 0;
  var dropX = W / 2;
  var canDrop = true, gameOver = false, aiming = false;
  var overSince = null;
  var cb = {};
  var outlines = {}; // convex sprite contours for approximate collision
  var emojiSprites = {}; // Twemoji SVG sprite per emoji; native font fallback
  var images = {};          // imágenes precargadas del tema (opcional)
  var raf = null, lastTime = 0;

  function radiusOf(level) { return theme.levels[level].radius * scale; }
  function randomDrop() { return 0; }

  function makeFruit(level, x, y) {
    var r = radiusOf(level);
    var options = {
      label: 'fruit',
      restitution: 0.18,
      friction: 0.12,
      frictionStatic: 0.4,
      density: 0.0018,
      slop: 0.02
    };
    var outline = outlines[theme.levels[level].emoji];
    var body = outline ? Matter.Bodies.fromVertices(x, y, outline.map(function (p) {
      return { x: p.x * r * 1.82, y: p.y * r * 1.82 };
    }), options, true) : Matter.Bodies.circle(x, y, r * 0.86, options);
    body.plugin.fruitLevel = level;
    body.plugin.born = performance.now();
    return body;
  }

  function addWalls() {
    var opts = { isStatic: true, label: 'wall', friction: 0.1 };
    Matter.Composite.add(world, [
      Matter.Bodies.rectangle(W / 2, H + WALL / 2 - 2, W + WALL * 4, WALL, opts),              // suelo
      Matter.Bodies.rectangle(-WALL / 2 + 2, H / 2, WALL, H * 2, opts),                        // izquierda
      Matter.Bodies.rectangle(W + WALL / 2 - 2, H / 2, WALL, H * 2, opts)                      // derecha
    ]);
  }

  function onCollide(ev) {
    if (gameOver) return;
    var pairs = ev.pairs;
    for (var i = 0; i < pairs.length; i++) {
      var a = pairs[i].bodyA, b = pairs[i].bodyB;
      if (a.label !== 'fruit' || b.label !== 'fruit') continue;
      var la = a.plugin.fruitLevel, lb = b.plugin.fruitLevel;
      if (la !== lb) continue;
      if (a.plugin.merging || b.plugin.merging) continue;
      a.plugin.merging = b.plugin.merging = true;
      merge(a, b, la);
    }
  }

  function merge(a, b, level) {
    var mx = (a.position.x + b.position.x) / 2;
    var my = (a.position.y + b.position.y) / 2;
    var vx = (a.velocity.x + b.velocity.x) / 2;
    var vy = (a.velocity.y + b.velocity.y) / 2;
    Matter.Composite.remove(world, a);
    Matter.Composite.remove(world, b);

    if (level + 1 >= theme.levels.length) {
      // Dos piezas máximas se funden: desaparecen con bonus grande
      score += theme.levels[level].points * 2;
      if (cb.onMaxMerge) cb.onMaxMerge();
    } else {
      var nl = level + 1;
      // No salirse de las paredes al nacer la pieza nueva
      var r = radiusOf(nl);
      mx = Math.max(r + 4, Math.min(W - r - 4, mx));
      var nb = makeFruit(nl, mx, my);
      Matter.Body.setVelocity(nb, { x: vx, y: vy - 1.5 });
      Matter.Composite.add(world, nb);
      score += theme.levels[nl].points;
      if (cb.onMerge) cb.onMerge(nl);
    }
    updateBest();
    if (cb.onScore) cb.onScore(score);
  }

  function updateBest() {
    if (score > best) {
      best = score;
      try { localStorage.setItem('fusion-best-' + theme.name, String(best)); } catch (e) {}
    }
  }

  function drop() {
    if (!canDrop || gameOver) return;
    canDrop = false;
    var r = radiusOf(currentLevel);
    var x = Math.max(r + 4, Math.min(W - r - 4, dropX));
    Matter.Composite.add(world, makeFruit(currentLevel, x, DROP_Y));
    currentLevel = nextLevel;
    nextLevel = randomDrop();
    if (cb.onNext) cb.onNext(nextLevel);
    setTimeout(function () { canDrop = true; }, DROP_COOLDOWN);
  }

  function checkGameOver(now) {
    if (gameOver) return;
    var bodies = Matter.Composite.allBodies(world);
    var over = false;
    for (var i = 0; i < bodies.length; i++) {
      var b = bodies[i];
      if (b.label !== 'fruit') continue;
      if (now - b.plugin.born < 1000) continue;             // recién caída, ignórala
      if (b.speed > 0.6) continue;                          // aún se está moviendo
      var r = radiusOf(b.plugin.fruitLevel);
      if (b.position.y - r < LINE_Y) { over = true; break; }
    }
    if (over) {
      if (overSince === null) overSince = now;
      else if (now - overSince > OVER_TIME) {
        gameOver = true;
        updateBest();
        if (cb.onGameOver) cb.onGameOver(score);
      }
    } else {
      overSince = null;
    }
  }

  /* ---------- render ---------- */

  function drawNeonCircle(x, y, r, color, alphaFill) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = hexToRgba(color, alphaFill);
    ctx.shadowColor = color;
    ctx.shadowBlur = 22;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = hexToRgba(color, 0.9);
    ctx.stroke();
    ctx.restore();
  }

  function hexToRgba(hex, a) {
    var n = parseInt(hex.slice(1), 16);
    return 'rgba(' + (n >> 16 & 255) + ',' + (n >> 8 & 255) + ',' + (n & 255) + ',' + a + ')';
  }

  function drawFruit(body) {
    var level = body.plugin.fruitLevel;
    var def = theme.levels[level];
    var r = radiusOf(level);
    var x = body.position.x, y = body.position.y;
    // Sprite silhouette replaces the generic circle; a subtle sprite halo remains.

    var img = (def.image && images[def.image] && images[def.image].complete && images[def.image].naturalWidth) ? images[def.image] : emojiSprites[def.emoji];
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(body.angle);
    if (img && img.complete && img.naturalWidth) {
      ctx.shadowColor = def.color; ctx.shadowBlur = 12;
      ctx.drawImage(img, -r * 0.92, -r * 0.92, r * 1.84, r * 1.84);
    } else {
      ctx.font = (r * 1.25) + 'px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.fillText(def.emoji, 0, r * 0.06);
    }
    ctx.restore();
  }

  function drawBoard() {
    // fondo
    ctx.fillStyle = '#05060a';
    ctx.fillRect(0, 0, W, H);

    // resplandor ambiental muy tenue
    var g = ctx.createRadialGradient(W / 2, H, 40, W / 2, H, H);
    g.addColorStop(0, 'rgba(0,245,255,0.07)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // paredes neón
    ctx.save();
    ctx.strokeStyle = '#00f5ff';
    ctx.shadowColor = '#00f5ff';
    ctx.shadowBlur = 14;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(3, H); ctx.lineTo(3, 8);
    ctx.moveTo(W - 3, H); ctx.lineTo(W - 3, 8);
    ctx.moveTo(3, H - 3); ctx.lineTo(W - 3, H - 3);
    ctx.stroke();
    ctx.restore();

    // línea de peligro
    ctx.save();
    var danger = overSince !== null && !gameOver;
    ctx.strokeStyle = danger ? '#ff2e63' : 'rgba(255,46,99,0.45)';
    ctx.shadowColor = '#ff2e63';
    ctx.shadowBlur = danger ? 16 : 6;
    ctx.setLineDash([8, 8]);
    ctx.lineWidth = danger ? 2.5 : 1.5;
    ctx.beginPath();
    ctx.moveTo(8, LINE_Y); ctx.lineTo(W - 8, LINE_Y);
    ctx.stroke();
    ctx.restore();
  }

  function drawGhost() {
    if (gameOver) return;
    var def = theme.levels[currentLevel];
    var r = radiusOf(currentLevel);
    var x = Math.max(r + 4, Math.min(W - r - 4, dropX));

    // guía vertical
    ctx.save();
    ctx.strokeStyle = hexToRgba(def.color, 0.35);
    ctx.setLineDash([4, 8]);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x, DROP_Y + r);
    ctx.lineTo(x, H - 6);
    ctx.stroke();
    ctx.restore();

    // pieza fantasma
    ctx.save();
    ctx.globalAlpha = canDrop ? 0.85 : 0.3;
    // The aim preview uses the emoji silhouette, not a circle.
    ctx.font = (r * 1.25) + 'px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = def.color;
    ctx.shadowBlur = 16;
    var sprite = emojiSprites[def.emoji];
    if (sprite && sprite.complete && sprite.naturalWidth) {
      ctx.shadowColor = def.color; ctx.shadowBlur = 12;
      ctx.drawImage(sprite, x - r * 0.92, DROP_Y - r * 0.92, r * 1.84, r * 1.84);
    } else {
      ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0;
      ctx.fillText(def.emoji, x, DROP_Y + r * 0.06);
    }
    ctx.restore();
  }

  function frame(now) {
    raf = requestAnimationFrame(frame);
    Matter.Engine.update(engine, Math.min(now - lastTime, 33));
    lastTime = now;
    checkGameOver(now);

    ctx.setTransform(canvas.width / W, 0, 0, canvas.height / H, 0, 0);
    drawBoard();
    var bodies = Matter.Composite.allBodies(world);
    for (var i = 0; i < bodies.length; i++) {
      if (bodies[i].label === 'fruit') drawFruit(bodies[i]);
    }
    drawGhost();
  }

  /* ---------- entrada ---------- */

  function toBoardX(clientX) {
    var rect = canvas.getBoundingClientRect();
    return (clientX - rect.left) * (W / rect.width);
  }

  function bindInput() {
    canvas.addEventListener('pointermove', function (ev) {
      dropX = toBoardX(ev.clientX);
    });
    canvas.addEventListener('pointerdown', function (ev) {
      aiming = true;
      dropX = toBoardX(ev.clientX);
      if (canvas.setPointerCapture) { try { canvas.setPointerCapture(ev.pointerId); } catch (e) {} }
      ev.preventDefault();
    });
    canvas.addEventListener('pointerup', function (ev) {
      if (!aiming) return;
      aiming = false;
      dropX = toBoardX(ev.clientX);
      drop();
      ev.preventDefault();
    });
    canvas.addEventListener('pointercancel', function () { aiming = false; });
  }

  function emojiFile(emoji) {
    // Twemoji accepts codepoints with FE0F omitted except keycap sequences.
    var chars = Array.from(emoji);
    if (chars.indexOf('\u20e3') < 0) chars = chars.filter(function (c) { return c !== '\ufe0f'; });
    return chars.map(function (c) { return c.codePointAt(0).toString(16); }).join('-');
  }

  function traceOutline(img, emoji) {
    try {
      var c = document.createElement('canvas'); c.width = c.height = 80;
      var cx = c.getContext('2d', { willReadFrequently: true });
      cx.drawImage(img, 0, 0, 80, 80);
      var data = cx.getImageData(0, 0, 80, 80).data;
      var points = [];
      for (var y = 0; y < 80; y += 3) for (var x = 0; x < 80; x += 3) {
        if (data[(y * 80 + x) * 4 + 3] > 80) points.push({ x: (x - 40) / 40, y: (y - 40) / 40 });
      }
      if (points.length >= 12) outlines[emoji] = Matter.Vertices.hull(points);
    } catch (e) { /* Canvas tainted or unavailable: circle physics fallback. */ }
  }

  function preloadImages() {
    theme.levels.forEach(function (l) {
      if (!l.emoji || emojiSprites[l.emoji]) return;
      var img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = function () { traceOutline(img, l.emoji); };
      img.src = 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/' + emojiFile(l.emoji) + '.svg';
      emojiSprites[l.emoji] = img;
    });
    theme.levels.forEach(function (l) {
      if (l.image) {
        var img = new Image();
        img.src = l.image;
        images[l.image] = img;
      }
    });
  }

  function start(options) {
    canvas = options.canvas;
    cb = options;
    theme = window.FUSION_THEME;
    if (!theme || !theme.levels || theme.levels.length < 2) {
      throw new Error('FUSION_THEME no definido o sin niveles suficientes');
    }
    scale = W / (theme.scaleBase || W);
    ctx = canvas.getContext('2d');

    try { best = parseInt(localStorage.getItem('fusion-best-' + theme.name) || '0', 10) || 0; } catch (e) {}

    engine = Matter.Engine.create({ enableSleeping: false });
    engine.gravity.y = 1.05;
    world = engine.world;
    addWalls();
    Matter.Events.on(engine, 'collisionStart', onCollide);
    Matter.Events.on(engine, 'collisionActive', onCollide);

    currentLevel = randomDrop();
    nextLevel = randomDrop();
    if (cb.onNext) cb.onNext(nextLevel);
    if (cb.onScore) cb.onScore(0);

    preloadImages();
    bindInput();
    lastTime = performance.now();
    raf = requestAnimationFrame(frame);
    return { getScore: function () { return score; }, getBest: function () { return best; } };
  }

  function restart() {
    var bodies = Matter.Composite.allBodies(world);
    for (var i = 0; i < bodies.length; i++) {
      if (bodies[i].label === 'fruit') Matter.Composite.remove(world, bodies[i]);
    }
    score = 0;
    gameOver = false;
    overSince = null;
    canDrop = true;
    currentLevel = randomDrop();
    nextLevel = randomDrop();
    if (cb.onNext) cb.onNext(nextLevel);
    if (cb.onScore) cb.onScore(0);
  }

  return { start: start, restart: restart };
})();
