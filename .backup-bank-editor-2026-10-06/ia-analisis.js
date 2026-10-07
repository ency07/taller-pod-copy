(function () {
  'use strict';

  /* ============================================================
     IA ANÁLISIS — Gemini Vision + Cableado UI + Cascada Multi-Mercado
     Integra: análisis de imagen, cascada de selectores, banco personal.
     NO contiene datos. NO genera prompts. NO toca el motor de scoring.
     ============================================================ */

  /* --- Helpers de acceso seguro al DOM --- */
  function $(id) {
    return document.getElementById(id);
  }

  function on(id, ev, fn) {
    const el = $(id);
    if (el) {
      el.addEventListener(ev, fn);
    } else {
      console.warn('[IA-Analisis] Elemento no encontrado: #' + id);
    }
  }

  function tell(msg) {
    const statusEl = $('status');
    if (statusEl) statusEl.innerHTML = msg;
  }

  /* --- Referencias a funciones globales (de otros scripts) --- */
  function _getMarket() {
    return (typeof POD_MARKETS !== 'undefined') ? POD_MARKETS : {};
  }
  function _getSubniches() {
    return (typeof POD_SUBNICHES !== 'undefined') ? POD_SUBNICHES : {};
  }
  function _getAudProfiles() {
    return (typeof AUD_PROFILES !== 'undefined') ? AUD_PROFILES : {};
  }

  /* ============================================================
     CASCADA DE SELECTORES MULTI-MERCADO
     ============================================================ */

  function _marketId() {
    return $('market') ? $('market').value : 'global_en';
  }

  /* Regiones válidas del mercado = fuente única POD_MARKET_REGIONS (data-mercados).
     Evita el mapa duplicado MARKET_REGIONS que dejaba fuera latam/spain/custom. */
  function _marketRegionIds(marketId) {
    if (typeof POD_MARKET_REGIONS !== 'undefined' && POD_MARKET_REGIONS[marketId]) {
      return POD_MARKET_REGIONS[marketId].map(function (r) { return r.id; });
    }
    return null;
  }

  /* Garantiza que #region tenga una región válida ANTES de calcular el resto.
     Ejecuta al inicio de la cascada (H1): antes, la corrección venía después
     del subnicho y éste se calculaba con la región vieja. */
  function normalizeRegionForMarket() {
    const rSel = $('region');
    if (!rSel) return rSel ? rSel.value : 'global';
    const ids = _marketRegionIds(_marketId());
    if (!ids || !ids.length) return rSel.value;
    if (ids.indexOf(rSel.value) === -1) rSel.value = ids[0];
    return rSel.value;
  }

  function updateRegionSelect() {
    const marketId = _marketId();
    const regionSel = $('region');
    if (!regionSel) return;

    const prev = regionSel.value;
    const regions = (typeof POD_MARKET_REGIONS !== 'undefined')
      ? (POD_MARKET_REGIONS[marketId] || POD_MARKET_REGIONS.global_en || [])
      : [];
    const ids = regions.map(function (r) { return r.id; });

    let html = '';
    regions.forEach(function (r) {
      html += '<option value="' + r.id + '">' + r.label + '</option>';
    });
    regionSel.innerHTML = html;
    // Preservar elección manual si sigue siendo válida en el nuevo mercado
    regionSel.value = (ids.indexOf(prev) !== -1) ? prev : ids[0];
  }

  function _subnicheOptions(ids) {
    return ids.map(function (id) {
      const label = (typeof getSubnicheLabel === 'function') ? getSubnicheLabel(id, _marketId()) : id;
      return '<option value="' + id + '">' + label + '</option>';
    }).join('');
  }

  /* Devuelve { ever, temp } sin duplicados entre grupos.
     Mercados de un solo subnicho (gospel_es/gospel_en) devuelven el mismo id
     para evergreen y temporada: sin este filtro salía repetido en dos <optgroup>. */
  function _subnicheGroups(marketId, regionId) {
    let ever = [], temp = [];
    try {
      if (typeof getSubnicheIdsForMarket === 'function') {
        ever = getSubnicheIdsForMarket(marketId, 'evergreen', regionId) || [];
        temp = getSubnicheIdsForMarket(marketId, 'temporada', regionId) || [];
      }
    } catch (e) { ever = []; temp = []; }
    temp = temp.filter(function (id) { return ever.indexOf(id) === -1; });
    return { ever: ever, temp: temp };
  }

  function updateSubnicheSelect() {
    const marketId = _marketId();
    const regionId = normalizeRegionForMarket();
    const subSel = $('subniche');
    if (!subSel) return;
    const prev = subSel.value;

    let html = '<option value="auto">Auto — según concepto y mercado</option>';

    if (typeof getSubnicheIdsForMarket === 'function') {
      // H2: nunca quemar un solo grupo. Evergreen y Temporada visibles.
      const g = _subnicheGroups(marketId, regionId);
      if (g.ever.length) html += '<optgroup label="Todo el año">' + _subnicheOptions(g.ever) + '</optgroup>';
      if (g.temp.length) html += '<optgroup label="Temporada / fechas">' + _subnicheOptions(g.temp) + '</optgroup>';
    } else if (typeof getSubnicheOptionsHTML === 'function') {
      html = getSubnicheOptionsHTML(marketId, 'evergreen', regionId, 'auto');
    }

    subSel.innerHTML = html;
    if (prev && Array.prototype.some.call(subSel.options, function (o) { return o.value === prev; })) {
      subSel.value = prev;
    }
  }

  function updateAudienceSelect() {
    const marketId = _marketId();
    const effRegion = normalizeRegionForMarket();
    const audSel = $('audienceSet');
    if (!audSel) return;
    const prev = audSel.value;

    let html = '<option value="Auto">Auto — según ' + marketId + ' + ' + effRegion + '</option>';

    // Fuente única por mercado (corrige spain/latam mostrando costeños = H3)
    let audiences = typeof getAudiencesForMarketRegion === 'function'
      ? getAudiencesForMarketRegion(marketId, effRegion)
      : (typeof getAudiencesForRegion === 'function' ? getAudiencesForRegion(effRegion) : (typeof AUD_NAMES !== 'undefined' ? AUD_NAMES.slice() : []));
    const subniche = $('subniche') ? $('subniche').value : 'auto';
    if (subniche !== 'auto' && typeof getAudiencesForSubniche === 'function') {
      const subPool = getAudiencesForSubniche(subniche, effRegion) || [];
      const compatible = audiences.filter(function (a) { return subPool.indexOf(a) !== -1; });
      if (compatible.length) audiences = compatible;
    }
    audiences.forEach(function (a) {
      const label = (typeof getAudienceLabel === 'function') ? getAudienceLabel(a) : a;
      html += '<option value="' + a + '">' + label + '</option>';
    });
    audSel.innerHTML = html;
    if (prev === 'Auto' || !audiences.includes(prev)) audSel.value = 'Auto';
    else audSel.value = prev;
  }

  let _lastLangAuto = 'auto';

  function updateLanguageSelect() {
    const marketId = _marketId();
    const langSel = $('language');
    if (!langSel) return;

    const market = _getMarket()[marketId] || {};
    const defaultLang = market.language || 'auto';

    const langs = (typeof POD_LANGUAGES !== 'undefined') ? POD_LANGUAGES : {};
    // Si el usuario no había tocado el idioma (sigue en el default anterior),
    // lo llevo al default del nuevo mercado. Si lo fijó a mano, respeto su elección.
    const prevVal = langSel.value;
    // 'auto' es una elección del usuario ("según mercado"): hay que conservarla,
    // no confundirla con el default resuelto del mercado.
    const isAutoChoice = prevVal === 'auto';
    const keepManual = !isAutoChoice && prevVal && prevVal !== _lastLangAuto && langs[prevVal];

    let html = '';
    Object.keys(langs).forEach(function (id) {
      const selected = (!keepManual && !isAutoChoice && id === defaultLang) ? ' selected' : '';
      html += '<option value="' + id + '"' + selected + '>' + langs[id] + '</option>';
    });
    // innerHTML RESETea la selección al primer option: había que restaurar el
    // valor guardado ANTES, no reasignar el valor ya perdido.
    langSel.innerHTML = html;
    if (isAutoChoice && langs['auto']) langSel.value = 'auto';
    else if (keepManual && langs[prevVal]) langSel.value = prevVal;
    _lastLangAuto = defaultLang;
  }

  function updatePbDomSelect() {
    const pbSel = $('pbDom');
    if (!pbSel) return;

    const marketId = _marketId();
    const regionId = normalizeRegionForMarket();
    const prev = pbSel.value;

    let html = '<option value="comun">Común (todos los subnichos)</option>';

    if (typeof getSubnicheIdsForMarket === 'function') {
      const g = _subnicheGroups(marketId, regionId);
      if (g.ever.length) html += '<optgroup label="Todo el año">' + _subnicheOptions(g.ever) + '</optgroup>';
      if (g.temp.length) html += '<optgroup label="Temporada / fechas">' + _subnicheOptions(g.temp) + '</optgroup>';
    }

    pbSel.innerHTML = html;
    if (prev && Array.prototype.some.call(pbSel.options, function (o) { return o.value === prev; })) {
      pbSel.value = prev;
    }
  }

  /* #domImagen ("Familia de la imagen") estaba muerto: 0 referencias en todo
     js/*.js, así que siempre quedaba en Auto. Ahora se puebla con los dominios
     del mercado activo y se lee en el motor (MOTOR_STATE.domImagen). */
  function updateDomImagenSelect() {
    const domSel = $('domImagen');
    if (!domSel) return;
    const prev = domSel.value || 'Auto';
    let list = [];
    try {
      if (typeof getListaDominios === 'function') list = getListaDominios(_marketId()) || [];
    } catch (e) { list = []; }

    let html = '<option value="Auto">Auto — detectar de la imagen</option>';
    list.forEach(function (d) {
      html += '<option value="' + d.id + '">' + d.label + '</option>';
    });
    domSel.innerHTML = html;
    const ok = prev === 'Auto' || list.some(function (d) { return d.id === prev; });
    domSel.value = ok ? prev : 'Auto';
  }

  function updateDominioSelect() {
    const domSel = $('dominio');
    if (!domSel) return;
    const prev = domSel.value || 'auto';
    const marketId = _marketId();
    let list = [];
    try {
      if (typeof getListaDominios === 'function') list = getListaDominios(marketId) || [];
    } catch (e) { list = []; }
    let html = '<option value="auto">Auto — detectar del concepto y mensaje</option>';
    list.forEach(function (d) {
      html += '<option value="' + d.id + '">' + d.label + '</option>';
    });
    domSel.innerHTML = html;
    // Preservar elección manual si sigue existiendo
    const stillThere = prev === 'auto' || list.some(function (d) { return d.id === prev; });
    domSel.value = stillThere ? prev : 'auto';
    updateDominioHelp();
  }

  function updateDominioHelp() {
    const help = $('dominioHelp');
    if (!help) return;
    try {
      const marketId = _marketId();
      const c = $('concept') ? $('concept').value : '';
      const m = $('message') ? $('message').value : '';
      const det = (typeof detectarDominio === 'function') ? detectarDominio(c, m, marketId) : 'auto';
      const cur = $('dominio') ? $('dominio').value : 'auto';
      if (cur !== 'auto') help.textContent = 'Dominio manual: ' + cur + ' (Auto sugiere: ' + det + '). Tú mandas.';
      else if (det !== 'auto') help.textContent = 'Auto detectó: ' + det + ' por tu concepto/mensaje. Puedes cambiarlo manual.';
      else help.textContent = 'Auto: escribe concepto y mensaje y detecto el dominio solo. O elige manual.';
    } catch (e) {}
  }

  function cascadeUpdate() {
    // H1: la región se valida y normaliza ANTES de derivar el resto.
    updateRegionSelect();
    normalizeRegionForMarket();
    updateSubnicheSelect();
    updateAudienceSelect();
    updateLanguageSelect();
    updatePbDomSelect();
    updateDominioSelect();
    updateDomImagenSelect();

    if (typeof window !== 'undefined' && window.PODNav) {
      try {
        var mEl = document.getElementById('market');
        var rEl = document.getElementById('region');
        var mVal = mEl && mEl.value ? mEl.value
          : (window.MOTOR_STATE && window.MOTOR_STATE.market);
        var rVal = rEl && rEl.value ? rEl.value
          : (window.MOTOR_STATE && window.MOTOR_STATE.region);
        window.PODNav.saveContext({ market: mVal, region: rVal });
      } catch (e) { /* sincronización no crítica */ }
    }
  }

  /* ============================================================
     ANÁLISIS DE IMAGEN CON GEMINI VISION
     ============================================================ */

  function fileToBase64(file) {
    return new Promise(function (resolve, reject) {
      const reader = new FileReader();
      reader.onload = function () {
        const base64 = reader.result.split(',')[1];
        resolve({ base64: base64, mimeType: file.type });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function getGeminiSlot() {
    try {
      const raw = localStorage.getItem('pod_u_ai_slots');
      if (!raw) return null;
      const slots = JSON.parse(raw);
      return slots.find(function (s) {
        return s.provider === 'Gemini' && s.key && s.model;
      }) || null;
    } catch (e) {
      return null;
    }
  }

  async function analyzeImageWithVision() {
    const fileInput = $('imageUpload');
    const statusEl = $('imageAnalysisStatus');
    const previewEl = $('imagePreview');

    if (!fileInput || !fileInput.files || !fileInput.files[0]) {
      if (statusEl) statusEl.textContent = 'Selecciona una imagen primero.';
      return;
    }

    const slot = getGeminiSlot();
    if (!slot) {
      if (statusEl) {
        statusEl.innerHTML = '<span class="bad">Configura una clave de Gemini en la barra IA para usar visión.</span>';
      }
      return;
    }

    if (statusEl) statusEl.textContent = 'Analizando imagen con Gemini Vision...';

    const file = fileInput.files[0];

    try {
      const fileData = await fileToBase64(file);

      const marketId = $('market') ? $('market').value : 'global_en';
      const regionId = $('region') ? $('region').value : 'global';

      const prompt = 'Eres un director de arte POD. Analiza esta imagen y devuelve SOLO un JSON válido sin markdown ni explicaciones. ' +
        'El mercado objetivo es: ' + marketId + '. La región cultural es: ' + regionId + '. ' +
        'Devuelve exactamente esta estructura: ' +
        '{' +
        '"concepto": "idea central visual en 5-8 palabras", ' +
        '"mensaje_visible": "texto legible en la imagen o null si no hay", ' +
        '"simbolo_descripcion": "descripción visual detallada del símbolo principal", ' +
        '"subnicho_sugerido": "el subnicho más probable para esta imagen", ' +
        '"funcion_simbolica": "qué representa o comunica el símbolo", ' +
        '"sugerencias_banco": ["3 ideas de objetos nuevos que cumplan la misma función simbólica pero sean visualmente distintos"], ' +
        '"esencia_a_conservar": "detalles visuales clave que deben mantenerse en una variación"' +
        '}';

      const body = {
        contents: [{
          role: 'user',
          parts: [
            { text: prompt },
            { inlineData: { mimeType: fileData.mimeType, data: fileData.base64 } }
          ]
        }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 2048,
          responseMimeType: 'application/json'
        }
      };

      const url = 'https://generativelanguage.googleapis.com/v1beta/models/' +
        encodeURIComponent(slot.model) + ':generateContent?key=' + encodeURIComponent(slot.key);

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        throw new Error('HTTP ' + response.status);
      }

      const data = await response.json();

      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error('Respuesta vacía de Gemini');
      }

      const text = data.candidates[0].content.parts[0].text;
      let analysis;

      try {
        analysis = JSON.parse(text);
      } catch (parseErr) {
        const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
        const start = cleaned.indexOf('{');
        const end = cleaned.lastIndexOf('}');
        const sliced = (start > -1 && end > start) ? cleaned.slice(start, end + 1) : cleaned;
        analysis = JSON.parse(sliced);
      }

      // Llenar campos automáticamente
      if ($('concept') && analysis.concepto) {
        $('concept').value = analysis.concepto;
      }
      if ($('message') && analysis.mensaje_visible) {
        $('message').value = analysis.mensaje_visible;
      }
      if ($('essence') && analysis.esencia_a_conservar) {
        $('essence').value = analysis.esencia_a_conservar;
      }

      // Mostrar preview
      if (previewEl) {
        previewEl.src = URL.createObjectURL(file);
        previewEl.style.display = 'block';
      }

      // Estado de éxito
      if (statusEl) {
        statusEl.innerHTML = '<span class="good">Imagen analizada. Campos llenados automáticamente. Revisa y ajusta antes de crear.</span>';
      }

      // Mostrar sugerencias de banco
      if (analysis.sugerencias_banco && analysis.sugerencias_banco.length > 0) {
        const suggestionsText = analysis.sugerencias_banco.join('\n');
        if ($('pbText')) {
          $('pbText').value = suggestionsText;
        }
        tell('<span class="good">Análisis completo. Sugerencias de banco cargadas en el campo de banco personal. Revisa y guarda si te gustan.</span>');
      }

    } catch (e) {
      console.error('[IA-Analisis] Error:', e);
      if (statusEl) {
        statusEl.textContent = 'Error al analizar: ' + (e && e.message ? e.message : e);
      }
    }
  }

  /* ============================================================
     GESTIÓN DEL BANCO PERSONAL DESDE LA UI
     ============================================================ */

  function savePersonalBankFromUI() {
    const pbTextEl = $('pbText');
    const pbDomEl = $('pbDom');
    const pbCountEl = $('pbCount');

    if (!pbTextEl || !pbTextEl.value.trim()) {
      tell('<span class="bad">Escribe al menos un objeto antes de guardar.</span>');
      return;
    }

    const marketId = $('market') ? $('market').value : 'global_en';
    const subniche = pbDomEl ? pbDomEl.value : 'comun';
    const lines = pbTextEl.value.split('\n').map(function (l) { return l.trim(); }).filter(function (l) { return l.length > 3; });

    if (typeof addPersonalObjects === 'function') {
      const result = addPersonalObjects(marketId, subniche, lines);
      if (pbTextEl) pbTextEl.value = '';
      if (pbCountEl) {
        pbCountEl.textContent = result.added + ' objeto(s) guardado(s). Total: ' + result.total + '. Duplicados: ' + result.duplicates + '.';
      }
      tell('<span class="good">' + result.added + ' objeto(s) guardado(s) en el banco personal.</span>');
    } else {
      tell('<span class="bad">Función de banco personal no disponible.</span>');
    }
  }

  function updatePbCount() {
    const pbCountEl = $('pbCount');
    if (!pbCountEl) return;

    const marketId = $('market') ? $('market').value : 'global_en';

    if (typeof loadPersonalBank === 'function') {
      const bank = loadPersonalBank(marketId);
      let total = 0;
      Object.keys(bank).forEach(function (key) {
        if (Array.isArray(bank[key])) {
          total += bank[key].length;
        }
      });
      pbCountEl.textContent = 'Banco personal: ' + total + ' objetos guardados.';
    }
  }

  /* ============================================================
     CABLEADO DE BOTONES AL MOTOR
     ============================================================ */

  function wireButtons() {
    // Cascada de selectores
    on('market', 'change', cascadeUpdate);
    on('region', 'change', function () {
      updateSubnicheSelect();
      updateAudienceSelect();
      updatePbDomSelect();
    });
    on('subniche', 'change', function () {
      updateAudienceSelect();
      updatePbDomSelect();
    });
    on('concept', 'input', updateDominioHelp);
    on('message', 'input', updateDominioHelp);
    on('dominio', 'change', updateDominioHelp);

    // Análisis de imagen
    on('btnAnalyzeImage', 'click', analyzeImageWithVision);

    // Banco personal
    on('btnSavePB', 'click', savePersonalBankFromUI);

    // Botones del motor
    on('btnDirector', 'click', function () {
      if (typeof crearLos3Disenos === 'function') {
        crearLos3Disenos();
      } else {
        tell('<span class="bad">Motor no cargado. Verifica que motor-nucleo.js esté incluido.</span>');
      }
    });

    on('btnCopy', 'click', function () {
      if (typeof copiarPrompt === 'function') {
        copiarPrompt();
      }
    });

    on('btnBuild', 'click', function () {
      // Proposito real: valida estado + muestra dominio detectado + genera los 3. Nada de mensaje falso.
      if (typeof crearLos3Disenos === 'function') {
        crearLos3Disenos();
      } else if (typeof readStateFromDOM === 'function') {
        readStateFromDOM();
        tell('<span class="bad">Motor no cargado. Verifica que motor-nucleo.js esté incluido.</span>');
      }
    });

    // btnAI abre el panel de claves IA (revisor). Antes estaba muerto.
    on('btnAI', 'click', function () {
      try {
        if (typeof window.openAIPanel === 'function') { window.openAIPanel(); return; }
        const bar = document.getElementById('aiBar');
        if (bar) bar.scrollIntoView({ behavior: 'smooth', block: 'end' });
        tell('<span class="info">Configura tus claves IA abajo en la barra IA (Groq / OpenRouter / Gemini).</span>');
      } catch (e) {}
    });

    on('btnNewSet', 'click', function () {
      if (typeof limpiarFichas === 'function') {
        limpiarFichas();
      }
    });

    on('btnReset', 'click', function () {
      if (typeof borrarMemoria === 'function') {
        borrarMemoria();
      }
    });

    // Toggle de formato denso/extenso
    on('btnFmt', 'click', function () {
      if (typeof MOTOR_STATE !== 'undefined') {
        MOTOR_STATE.fmtDense = !MOTOR_STATE.fmtDense;
        const btn = $('btnFmt');
        if (btn) {
          btn.textContent = MOTOR_STATE.fmtDense ? 'Ver formato extenso' : 'Ver formato denso';
        }
      }
    });

    // Toggle de modo de variación: mostrar/ocultar panel de variación
    on('workflowMode', 'change', function () {
      const varPanel = $('varPanel');
      if (varPanel) {
        const isVariation = this.value === 'variation';
        varPanel.open = isVariation;
      }
    });
  }

  /* ============================================================
     RENDER DE PILLS DE MEZCLAS
     ============================================================ */

  function renderModeToggle() {
    const el = $('modeToggle');
    if (!el) return;

    const modes = [
      { val: 'distintos', label: 'Tres estilos distintos' },
      { val: 'mismo', label: 'Un mismo estilo' },
      { val: 'mixto', label: 'Permitir mezclas' }
    ];

    el.innerHTML = '';
    modes.forEach(function (m) {
      const pill = document.createElement('span');
      pill.className = 'pill' + ((typeof MOTOR_STATE !== 'undefined' && MOTOR_STATE.groupMode === m.val) ? ' on' : '');
      pill.textContent = m.label;
      pill.addEventListener('click', function () {
        if (typeof MOTOR_STATE !== 'undefined') {
          MOTOR_STATE.groupMode = m.val;
        }
        renderModeToggle();
      });
      el.appendChild(pill);
    });
  }

  function renderObjectModeToggle() {
    const el = $('objectModeToggle');
    if (!el) return;

    const modes = [
      { val: 'simple', label: 'Un objeto por diseño' },
      { val: 'mixto', label: 'A veces combinar dos' },
      { val: 'forzar_combinacion', label: 'Siempre combinar dos' }
    ];

    el.innerHTML = '';
    modes.forEach(function (m) {
      const pill = document.createElement('span');
      pill.className = 'pill' + ((typeof MOTOR_STATE !== 'undefined' && MOTOR_STATE.objectMode === m.val) ? ' on' : '');
      pill.textContent = m.label;
      pill.addEventListener('click', function () {
        if (typeof MOTOR_STATE !== 'undefined') {
          MOTOR_STATE.objectMode = m.val;
        }
        renderObjectModeToggle();
      });
      el.appendChild(pill);
    });
  }

  /* ============================================================
     INICIALIZACIÓN
     ============================================================ */

  function init() {
    var navCtx = (typeof window !== 'undefined' && window.PODNav)
      ? window.PODNav.loadContext() || {}
      : {};
    var mSel = document.getElementById('market');
    if (navCtx.market && mSel) {
      for (var mi = 0; mi < mSel.options.length; mi++) {
        if (mSel.options[mi].value === navCtx.market) { mSel.value = navCtx.market; break; }
      }
    }
    cascadeUpdate();
    if (typeof window !== 'undefined' && window.PODNav) {
      try {
        var rSel = document.getElementById('region');
        if (navCtx.region && rSel) {
          for (var ri = 0; ri < rSel.options.length; ri++) {
            if (rSel.options[ri].value === navCtx.region) { rSel.value = navCtx.region; break; }
          }
        }
        window.PODNav.prefill();
        cascadeUpdate();
      } catch (e) { /* sincronización no crítica */ }
    }
    wireButtons();
    renderModeToggle();
    renderObjectModeToggle();
    updatePbCount();

    // Si el modo es variación, abrir el panel
    const wfMode = $('workflowMode');
    if (wfMode && wfMode.value === 'variation') {
      const varPanel = $('varPanel');
      if (varPanel) varPanel.open = true;
    }

    console.log('[IA-Analisis] Inicializado correctamente.');
  }

  // Ejecutar al cargar el DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* ============================================================
     EXPOSICIÓN GLOBAL
     ============================================================ */
  window.analyzeImageWithVision = analyzeImageWithVision;
  window.cascadeUpdate = cascadeUpdate;
  window.savePersonalBankFromUI = savePersonalBankFromUI;

})();