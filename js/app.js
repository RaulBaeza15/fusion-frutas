/* UI + idiomas. El motor vive en engine.js y el tema en themes/frutas.js. */
(function () {
  'use strict';

  var STRINGS = {
    es: {
      title: 'Fusión Frutal',
      tagline: 'Deja caer frutas, fusiona dos iguales y llega a la sandía.',
      score: 'Puntos', best: 'Récord', next: 'Siguiente',
      restart: 'Reiniciar',
      howto: 'Mueve el dedo o el ratón para apuntar y suelta para dejar caer. Dos frutas iguales se fusionan.',
      gameover: 'Fin de la partida',
      playagain: 'Jugar otra vez',
      finalscore: 'Has hecho {n} puntos',
      watermelon: '¡SANDÍA!',
      credit: 'Hecho por'
    },
    en: {
      title: 'Fruit Fusion',
      tagline: 'Drop fruits, merge two of a kind and reach the watermelon.',
      score: 'Score', best: 'Best', next: 'Next',
      restart: 'Restart',
      howto: 'Move your finger or mouse to aim and release to drop. Two matching fruits merge.',
      gameover: 'Game over',
      playagain: 'Play again',
      finalscore: 'You scored {n} points',
      watermelon: 'WATERMELON!',
      credit: 'Made by'
    },
    fr: {
      title: 'Fusion de Fruits',
      tagline: 'Lâche des fruits, fusionne deux identiques et atteins la pastèque.',
      score: 'Score', best: 'Record', next: 'Suivante',
      restart: 'Recommencer',
      howto: 'Déplace le doigt ou la souris pour viser et relâche pour lâcher. Deux fruits identiques fusionnent.',
      gameover: 'Partie terminée',
      playagain: 'Rejouer',
      finalscore: 'Tu as fait {n} points',
      watermelon: 'PASTÈQUE !',
      credit: 'Créé par'
    },
    de: {
      title: 'Frucht-Fusion',
      tagline: 'Lass Früchte fallen, verschmelze zwei gleiche und erreiche die Wassermelone.',
      score: 'Punkte', best: 'Rekord', next: 'Nächste',
      restart: 'Neustart',
      howto: 'Bewege Finger oder Maus zum Zielen und lass los. Zwei gleiche Früchte verschmelzen.',
      gameover: 'Spiel vorbei',
      playagain: 'Nochmal spielen',
      finalscore: 'Du hast {n} Punkte',
      watermelon: 'WASSERMELONE!',
      credit: 'Erstellt von'
    },
    it: {
      title: 'Fusione di Frutta',
      tagline: "Fai cadere la frutta, fondi due uguali e arriva all'anguria.",
      score: 'Punti', best: 'Record', next: 'Prossimo',
      restart: 'Ricomincia',
      howto: 'Muovi il dito o il mouse per mirare e rilascia per far cadere. Due frutti uguali si fondono.',
      gameover: 'Partita finita',
      playagain: 'Gioca ancora',
      finalscore: 'Hai fatto {n} punti',
      watermelon: 'ANGURIA!',
      credit: 'Creato da'
    },
    pt: {
      title: 'Fusão de Frutas',
      tagline: 'Larga frutas, funde duas iguais e chega à melancia.',
      score: 'Pontos', best: 'Recorde', next: 'Seguinte',
      restart: 'Reiniciar',
      howto: 'Move o dedo ou o rato para apontar e larga para deixar cair. Duas frutas iguais fundem-se.',
      gameover: 'Fim de jogo',
      playagain: 'Jogar de novo',
      finalscore: 'Fizeste {n} pontos',
      watermelon: 'MELANCIA!',
      credit: 'Feito por'
    },
    tr: {
      title: 'Meyve Füzyonu',
      tagline: 'Meyveleri bırak, aynı iki taneyi birleştir ve karpuza ulaş.',
      score: 'Puan', best: 'Rekor', next: 'Sıradaki',
      restart: 'Yeniden başlat',
      howto: 'Nişan almak için parmağını ya da fareyi hareket ettir ve bırak. Aynı iki meyve birleşir.',
      gameover: 'Oyun bitti',
      playagain: 'Tekrar oyna',
      finalscore: '{n} puan aldın',
      watermelon: 'KARPUZ!',
      credit: 'Yapan'
    }
  };

  var LANGS = ['es', 'en', 'fr', 'de', 'it', 'pt', 'tr'];
  var lang = 'es';

  function detect() {
    var saved = null;
    try { saved = localStorage.getItem('fusion-lang'); } catch (e) {}
    if (saved && STRINGS[saved]) return saved;
    var nav = (navigator.language || 'es').slice(0, 2).toLowerCase();
    return STRINGS[nav] ? nav : 'es';
  }

  function t(key) { return STRINGS[lang][key] || STRINGS.es[key]; }

  function apply() {
    document.documentElement.lang = lang;
    document.title = t('title') + ' - ' + t('tagline');
    var nodes = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].textContent = t(nodes[i].getAttribute('data-i18n'));
    }
    var sel = document.getElementById('lang');
    if (sel) sel.value = lang;
    try { localStorage.setItem('fusion-lang', lang); } catch (e) {}
  }

  function fmt(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }

  document.addEventListener('DOMContentLoaded', function () {
    lang = detect();

    var sel = document.getElementById('lang');
    LANGS.forEach(function (l) {
      var o = document.createElement('option');
      o.value = l; o.textContent = l.toUpperCase();
      sel.appendChild(o);
    });
    sel.addEventListener('change', function () { lang = sel.value; apply(); });

    apply();

    var scoreEl = document.getElementById('score');
    var bestEl = document.getElementById('best');
    var nextEl = document.getElementById('next');
    var overlay = document.getElementById('overlay');
    var finalEl = document.getElementById('finalscore');
    var flash = document.getElementById('flash');
    var flashTimer = null;
    var best = 0;

    function showFlash(text) {
      flash.textContent = text;
      flash.classList.add('show');
      clearTimeout(flashTimer);
      flashTimer = setTimeout(function () { flash.classList.remove('show'); }, 1200);
    }

    var game = FruitFusion.start({
      canvas: document.getElementById('board'),
      onScore: function (s) {
        scoreEl.textContent = fmt(s);
        if (s > best) { best = s; bestEl.textContent = fmt(best); }
      },
      onNext: function (level) {
        var def = window.FUSION_THEME.levels[level];
        nextEl.textContent = '';
        if (def.image || def.emoji) {
          var image = document.createElement('img');
          image.src = def.image || ('https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/' +
            Array.from(def.emoji).filter(function(c) { return c !== '\ufe0f'; }).map(function(c) { return c.codePointAt(0).toString(16); }).join('-') + '.png');
          image.alt = def.emoji || '';
          image.width = image.height = 32;
          nextEl.appendChild(image);
        }
      },
      onMerge: function (level) {
        if (level === window.FUSION_THEME.levels.length - 1) showFlash(window.FUSION_CUSTOM.enabled ? window.FUSION_CUSTOM.text() : t('watermelon'));
      },
      onMaxMerge: function () { showFlash(window.FUSION_CUSTOM.enabled ? window.FUSION_CUSTOM.text() : t('watermelon')); },
      onImageError: function () { var warning=document.getElementById('image-error'); warning.hidden=false; warning.textContent=window.FUSION_CUSTOM.imageError(); },
      onGameOver: function (s) {
        finalEl.textContent = t('finalscore').replace('{n}', fmt(s));
        overlay.classList.add('show');
      }
    });
    bestEl.textContent = fmt(game.getBest());
    best = game.getBest();

    document.getElementById('restart').addEventListener('click', function () {
      overlay.classList.remove('show');
      FruitFusion.restart();
    });
    document.getElementById('playagain').addEventListener('click', function () {
      overlay.classList.remove('show');
      FruitFusion.restart();
    });
  });
})();
