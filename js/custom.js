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
  var keys = ['customTitle','customIntro','customGenerate','customCopy','customOpen',
    'customModeEmoji','customModePng','customUpload','customUrls','customLimit'];
  var extra = {
    es:['Emojis','PNG','Sube PNG en orden','O pega URL públicas de PNG (una por línea)','3 a 11 PNG. Archivos pequeños se meten en el enlace (máximo 18.000 caracteres); las URL externas necesitan CORS. No uses imágenes privadas.'],
    en:['Emojis','PNG','Upload PNGs in order','Or paste public PNG URLs (one per line)','3 to 11 PNGs. Small files go into the link (18,000-character limit); external URLs need CORS. Do not use private images.'],
    fr:['Emojis','PNG','Importe les PNG dans l’ordre','Ou colle des URL publiques de PNG (une par ligne)','3 à 11 PNG. Les petits fichiers sont intégrés au lien (18 000 caractères maximum) ; les URL externes nécessitent CORS. Évite les images privées.'],
    de:['Emojis','PNG','PNG-Dateien der Reihe nach hochladen','Oder öffentliche PNG-URLs einfügen (eine pro Zeile)','3 bis 11 PNGs. Kleine Dateien werden im Link gespeichert (höchstens 18.000 Zeichen); externe URLs benötigen CORS. Keine privaten Bilder verwenden.'],
    it:['Emoji','PNG','Carica i PNG in ordine','Oppure incolla URL pubblici di PNG (uno per riga)','Da 3 a 11 PNG. I file piccoli sono inclusi nel link (massimo 18.000 caratteri); gli URL esterni richiedono CORS. Non usare immagini private.'],
    pt:['Emojis','PNG','Carrega os PNG por ordem','Ou cola URL públicas de PNG (uma por linha)','3 a 11 PNG. Ficheiros pequenos entram na ligação (máximo 18.000 caracteres); URL externas precisam de CORS. Não uses imagens privadas.'],
    tr:['Emojiler','PNG','PNG dosyalarını sırayla yükle','Veya herkese açık PNG URL’leri yapıştır (her satıra bir tane)','3-11 PNG. Küçük dosyalar bağlantıya eklenir (en fazla 18.000 karakter); dış URL’ler CORS gerektirir. Özel görsel kullanma.']
  };
  var errors = {
    es:['Pon de 3 a 11 PNG válidos.', 'Las imágenes superan el límite de 18.000 caracteres. Usa PNG más pequeños o URL públicas.', 'No se pudo leer un PNG. Usa PNG de menos de 1 MB.', 'Las URL deben ser HTTPS y terminar en .png.', 'Las imágenes externas deben permitir CORS para calcular la hitbox.'],
    en:['Enter 3 to 11 valid PNGs.','Images exceed the 18,000-character link limit. Use smaller PNGs or public URLs.','Could not read a PNG. Use PNGs under 1 MB.','URLs must use HTTPS and end in .png.','External images must allow CORS to calculate hitboxes.']
  };
  function lang() { var el = document.getElementById('lang'); return (el && copy[el.value]) ? el.value : 'es'; }
  function t(i) { return copy[lang()][i]; }
  function trError(i) { return (errors[lang()] || errors.en)[i]; }
  function safeImage(s) { return typeof s === 'string' && (s.startsWith('data:image/png;base64,') && s.length < 18000 || /^https:\/\/[^\s]+\.png(?:\?[^\s]*)?$/i.test(s) && s.length < 500); }
  function normalize(items) { return items.map(function (s) { return typeof s === 'string' ? {emoji:s} : s; }); }
  function imageValid(items) { return Array.isArray(items) && items.length >= 3 && items.length <= 11 && items.every(function(x) { return x && typeof x==='object' && safeImage(x.image) && (!x.emoji || typeof x.emoji==='string' && x.emoji.length<=24); }); }
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
  var params = new URLSearchParams(location.search);
  var param = params.get('emojis'), pngParam = params.get('pngs');
  var custom = false, bad = false, parsed;
  if (param !== null || pngParam !== null) {
    try {
      if (param !== null && pngParam !== null) throw Error('ambiguous');
      var raw = pngParam !== null ? pngParam : param;
      if (raw.length > 18000) throw Error('long');
      parsed = JSON.parse(raw);
      if (pngParam !== null ? !imageValid(parsed) : !!valid(parsed)) throw Error('invalid');
      var levels = normalize(parsed);
      var colors = ['#ff4d6d','#00f5ff','#b26bff','#ff9f1c','#ffe600','#00ff87','#ff2e88','#7dffce','#ff3131','#ffd23f','#8dff57'];
      var hash = 2166136261, serialized = JSON.stringify(parsed);
      for (var i = 0; i < serialized.length; i++) hash = Math.imul(hash ^ serialized.charCodeAt(i), 16777619);
      window.FUSION_THEME = {
        name: 'Custom-' + (hash >>> 0).toString(16), scaleBase: 420,
        maxDropLevel: 0,
        levels: levels.map(function (entry, index) {
          return { emoji: entry.emoji || '', image: entry.image || '', radius: Math.round(17 + 101 * index / (levels.length - 1)),
            color: colors[index], points: (index + 1) * (index + 2) / 2 };
        })
      };
      custom = true;
    } catch (e) { bad = true; }
  }
  window.FUSION_CUSTOM = { enabled: custom, text: function () { return t(10); },
    imageError: function () { return ({es:'No se puede cargar o leer el PNG para su hitbox. Usa otro archivo o una URL con CORS.',en:'Cannot load or read the PNG for its hitbox. Use another file or a CORS-enabled URL.',fr:'Impossible de lire le PNG pour la collision. Utilise un autre fichier ou une URL avec CORS.',de:'PNG für die Trefferfläche nicht lesbar. Andere Datei oder URL mit CORS verwenden.',it:'PNG non leggibile per la collisione. Usa un altro file o URL con CORS.',pt:'Não é possível ler o PNG para a colisão. Usa outro ficheiro ou URL com CORS.',tr:'PNG çarpışma alanı için okunamıyor. Başka dosya veya CORS destekli URL kullan.'})[lang()]; } };
  document.addEventListener('DOMContentLoaded', function () {
    var panel = document.getElementById('creator');
    var area = document.getElementById('emoji-list');
    var status = document.getElementById('create-status');
    var output = document.getElementById('created-link');
    if (custom && param !== null) area.value = parsed.join('\n');
    if (custom && pngParam !== null) { document.querySelector('[name=theme-mode][value=png]').checked=true; document.getElementById('png-urls').value=parsed.filter(function(x){return x.image.startsWith('https:');}).map(function(x){return x.image;}).join('\n'); }
    if (!custom) {
      var samples = ['🐣🐤🐔🦅🐉', '🐛🐝🦋🦜🦚', '🐠🐟🐡🐬🐳', '🚲🛵🏍️🚗🚀'];
      var chosen = samples[Math.floor(Math.random() * samples.length)];
      area.value = typeof Intl.Segmenter === 'function'
        ? Array.from(new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(chosen), function (x) { return x.segment; }).join('\n')
        : Array.from(chosen).filter(function (x) { return x !== '\ufe0f'; }).join('\n');
    }
    function translate() {
      document.querySelectorAll('[data-custom]').forEach(function (node) {
        var idx=keys.indexOf(node.getAttribute('data-custom'));
        node.textContent = idx < 5 ? t(idx) : extra[lang()][idx-5];
      });
      if (custom) {
        document.querySelector('.tagline').textContent = t(8);
        document.querySelector('.howto').textContent = t(9);
      }
      if (bad) document.getElementById('theme-error').textContent = t(11);
    }
    document.getElementById('lang').addEventListener('change', function () { setTimeout(translate, 0); });
    setTimeout(translate, 0);
    var pngFiles = document.getElementById('png-files');
    var pngUrls = document.getElementById('png-urls');
    function mode() { return document.querySelector('[name=theme-mode]:checked').value; }
    function switchMode() {
      var isPng = mode() === 'png';
      document.getElementById('png-tools').hidden = !isPng;
      area.hidden = isPng;
      output.hidden = true; status.textContent = '';
    }
    document.querySelectorAll('[name=theme-mode]').forEach(function(r) { r.addEventListener('change', switchMode); });
    switchMode();
    document.getElementById('generate').addEventListener('click', async function () {
      output.hidden = true; status.textContent = '';
      var items, key;
      if (mode() === 'emoji') {
        items = area.value.split(/[\n,]+/).map(function(s){return s.trim();}).filter(Boolean);
        var issue = valid(items); if (issue) { status.textContent=t(issue); return; }
        key='emojis';
      } else {
        items=[]; key='pngs';
        try {
          var files=Array.from(pngFiles.files);
          for(var i=0;i<files.length;i++) {
            if(files[i].type!=='image/png'||files[i].size>1024*1024) throw Error('file');
            var imgUrl=await new Promise(function(resolve,reject) {
              var reader=new FileReader(); reader.onload=function(){resolve(reader.result);}; reader.onerror=reject; reader.readAsDataURL(files[i]);
            });
            items.push({image:imgUrl});
          }
        } catch(e) { status.textContent=trError(2); return; }
        pngUrls.value.split(/[\n,]+/).map(function(s){return s.trim();}).filter(Boolean).forEach(function(url){items.push({image:url});});
        if (!imageValid(items)) { status.textContent=trError(0); return; }
      }
      var url = new URL(location.pathname, location.origin);
      url.searchParams.set(key, JSON.stringify(items));
      if(url.href.length>18000) { status.textContent=trError(1); return; }
      document.getElementById('share-url').value=url.href;
      document.getElementById('play-custom').href=url.href;
      output.hidden=false;
    });
    document.getElementById('copy-url').addEventListener('click', function () {
      var input = document.getElementById('share-url');
      navigator.clipboard.writeText(input.value).then(function () { status.textContent = t(5); })
        .catch(function () { input.focus(); input.select(); });
    });
  });
})();
