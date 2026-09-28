/* Shareable emoji themes: URL contains only the ordered emoji list. No server or repo edit. */
(function () {
  'use strict';
  var copy = {
    es: ['Crea tu tema', 'Pon de 3 a 11 emojis, uno por línea, de menor a mayor. Genera un enlace para jugar y compartir.', 'Generar enlace', 'Copiar enlace', 'Jugar con este tema', 'Enlace copiado', 'Pon de 3 a 11 emojis válidos, uno por línea.', 'No repitas emojis.', 'Fusiona tus emojis hasta llegar al último.', 'Apunta y suelta. Dos emojis iguales se fusionan.', '¡ÚLTIMO NIVEL!', 'El enlace no es válido. Jugando con frutas.'],
    en: ['Create your theme', 'Enter 3 to 11 emojis, one per line, smallest to largest. Generate a link to play and share.', 'Generate link', 'Copy link', 'Play this theme', 'Link copied', 'Enter 3 to 11 valid emojis, one per line.', 'Do not repeat emojis.', 'Merge your emojis to reach the last one.', 'Aim and release. Matching emojis merge.', 'FINAL LEVEL!', 'Invalid theme link. Playing with fruits.'],
    fr: ['Crée ton thème', 'Saisis 3 à 11 emojis, un par ligne, du plus petit au plus grand. Crée un lien à partager.', 'Créer le lien', 'Copier le lien', 'Jouer avec ce thème', 'Lien copié', 'Saisis 3 à 11 emojis valides, un par ligne.', 'Ne répète pas les emojis.', 'Fusionne tes emojis jusqu’au dernier.', 'Vise et relâche. Deux emojis identiques fusionnent.', 'DERNIER NIVEAU !', 'Lien invalide. Retour aux fruits.'],
    de: ['Eigenes Thema erstellen', 'Gib 3 bis 11 Emojis ein, eins pro Zeile, von klein nach groß. Erstelle einen Link zum Spielen und Teilen.', 'Link erstellen', 'Link kopieren', 'Dieses Thema spielen', 'Link kopiert', 'Gib 3 bis 11 gültige Emojis ein, eins pro Zeile.', 'Keine Emojis doppelt eingeben.', 'Verbinde deine Emojis bis zum letzten.', 'Zielen und loslassen. Gleiche Emojis verbinden sich.', 'LETZTES LEVEL!', 'Ungültiger Link. Früchte werden geladen.'],
    it: ['Crea il tuo tema', 'Inserisci da 3 a 11 emoji, una per riga, dalla più piccola alla più grande. Crea un link da condividere.', 'Crea link', 'Copia link', 'Gioca con questo tema', 'Link copiato', 'Inserisci da 3 a 11 emoji valide, una per riga.', 'Non ripetere le emoji.', "Unisci le tue emoji fino all’ultima.", 'Mira e rilascia. Due emoji uguali si fondono.', 'ULTIMO LIVELLO!', 'Link non valido. Si gioca con la frutta.'],
    pt: ['Cria o teu tema', 'Escreve de 3 a 11 emojis, um por linha, do menor para o maior. Cria um link para jogar e partilhar.', 'Criar link', 'Copiar link', 'Jogar com este tema', 'Link copiado', 'Escreve de 3 a 11 emojis válidos, um por linha.', 'Não repitas emojis.', 'Junta os teus emojis até chegares ao último.', 'Aponta e larga. Dois emojis iguais juntam-se.', 'ÚLTIMO NÍVEL!', 'Link inválido. A jogar com frutas.'],
    tr: ['Kendi temanı oluştur', 'Küçükten büyüğe, her satıra bir tane olmak üzere 3-11 emoji gir. Oynamak ve paylaşmak için bağlantı oluştur.', 'Bağlantı oluştur', 'Bağlantıyı kopyala', 'Bu temayla oyna', 'Bağlantı kopyalandı', 'Her satıra bir tane olmak üzere 3-11 geçerli emoji gir.', 'Aynı emojiyi tekrar etme.', 'Emojilerini birleştirip sonuncuya ulaş.', 'Nişan al ve bırak. Aynı iki emoji birleşir.', 'SON SEVİYE!', 'Geçersiz bağlantı. Meyvelerle oynanıyor.']
  };
  var keys = ['customTitle','customIntro','customGenerate','customCopy','customOpen'];
  function lang() { var el = document.getElementById('lang'); return (el && copy[el.value]) ? el.value : 'es'; }
  function t(i) { return copy[lang()][i]; }
  function valid(items) {
    if (!Array.isArray(items) || items.length < 3 || items.length > 11) return 6;
    var segmenter = typeof Intl.Segmenter === 'function' ? new Intl.Segmenter(undefined, { granularity: 'grapheme' }) : null;
    if (items.some(function (e) {
      return typeof e !== 'string' || e.length > 24 || !/\p{Extended_Pictographic}/u.test(e) || /[<>\x00-\x1f]/u.test(e) ||
        (segmenter && Array.from(segmenter.segment(e)).length !== 1);
    })) return 6;
    if (new Set(items).size !== items.length) return 7;
    return 0;
  }
  var param = new URLSearchParams(location.search).get('emojis');
  var custom = false, bad = false, parsed;
  if (param !== null) {
    try {
      if (param.length > 300) throw Error('long');
      parsed = JSON.parse(param);
      if (valid(parsed)) throw Error('invalid');
      var colors = ['#ff4d6d','#00f5ff','#b26bff','#ff9f1c','#ffe600','#00ff87','#ff2e88','#7dffce','#ff3131','#ffd23f','#8dff57'];
      var hash = 2166136261, serialized = JSON.stringify(parsed);
      for (var i = 0; i < serialized.length; i++) hash = Math.imul(hash ^ serialized.charCodeAt(i), 16777619);
      window.FUSION_THEME = {
        name: 'Custom-' + (hash >>> 0).toString(16), scaleBase: 420,
        maxDropLevel: 0,
        levels: parsed.map(function (emoji, index) {
          return { emoji: emoji, radius: Math.round(17 + 101 * index / (parsed.length - 1)),
            color: colors[index], points: (index + 1) * (index + 2) / 2 };
        })
      };
      custom = true;
    } catch (e) { bad = true; }
  }
  window.FUSION_CUSTOM = { enabled: custom, text: function () { return t(10); } };
  document.addEventListener('DOMContentLoaded', function () {
    var panel = document.getElementById('creator');
    var area = document.getElementById('emoji-list');
    var status = document.getElementById('create-status');
    var output = document.getElementById('created-link');
    if (custom) area.value = parsed.join('\n');
    else {
      var samples = ['🐣🐤🐔🦅🐉', '🐛🐝🦋🦜🦚', '🐠🐟🐡🐬🐳', '🚲🛵🏍️🚗🚀'];
      area.value = Array.from(samples[Math.floor(Math.random() * samples.length)]).join('\n');
      // Some emoji sequences contain variation selectors: use grapheme segmentation instead.
      if (typeof Intl.Segmenter === 'function') area.value = Array.from(new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(samples[Math.floor(Math.random() * samples.length)]), function (x) { return x.segment; }).join('\n');
    }
    function translate() {
      document.querySelectorAll('[data-custom]').forEach(function (node) {
        node.textContent = t(keys.indexOf(node.getAttribute('data-custom')));
      });
      if (custom) {
        document.querySelector('.tagline').textContent = t(8);
        document.querySelector('.howto').textContent = t(9);
      }
      if (bad) document.getElementById('theme-error').textContent = t(11);
    }
    document.getElementById('lang').addEventListener('change', function () { setTimeout(translate, 0); });
    translate();
    document.getElementById('generate').addEventListener('click', function () {
      var items = area.value.split(/[\n,]+/).map(function (s) { return s.trim(); }).filter(Boolean);
      var issue = valid(items);
      output.hidden = true;
      if (issue) { status.textContent = t(issue); return; }
      status.textContent = '';
      var url = new URL(location.pathname, location.origin);
      url.searchParams.set('emojis', JSON.stringify(items));
      document.getElementById('share-url').value = url.href;
      document.getElementById('play-custom').href = url.href;
      output.hidden = false;
    });
    document.getElementById('copy-url').addEventListener('click', function () {
      var input = document.getElementById('share-url');
      navigator.clipboard.writeText(input.value).then(function () { status.textContent = t(5); })
        .catch(function () { input.focus(); input.select(); });
    });
  });
})();
