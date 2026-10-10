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
    if (!statusEl) return;
    // Compatibilidad con los mensajes heredados (<span class="good|bad|info">),
    // pero nunca interpretar etiquetas o atributos suministrados por datos dinámicos.
    const raw = String(msg == null ? '' : msg);
    const classMatch = raw.match(/<span\s+class=["'](good|bad|info|blue)["'][^>]*>/i);
    statusEl.className = classMatch ? classMatch[1] : '';
    statusEl.textContent = raw.replace(/<\/?span\b[^>]*>/gi, '');
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
      html += '<option value="' + _escapeOptionText(r.id) + '">' + _escapeOptionText(r.label) + '</option>';
    });
    regionSel.innerHTML = html;
    // Reset total al cambiar de mercado (aunque el valor anterior siga válido).
    // Dentro del mismo mercado se preserva la elección manual si sigue válida.
    if (_marketResetPending || ids.indexOf(prev) === -1 || !ids.length) {
      regionSel.value = ids.length ? ids[0] : prev;
    } else {
      regionSel.value = prev;
    }
  }

  function _subnicheOptions(ids) {
    return ids.map(function (id) {
      const label = (typeof getSubnicheLabel === 'function') ? getSubnicheLabel(id, _marketId()) : id;
      return '<option value="' + _escapeOptionText(id) + '">' + _escapeOptionText(label) + '</option>';
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
    // Reset total al cambiar de mercado; si no, se preserva si sigue válido.
    if (!_marketResetPending && prev && Array.prototype.some.call(subSel.options, function (o) { return o.value === prev; })) {
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
      html += '<option value="' + _escapeOptionText(a) + '">' + _escapeOptionText(label) + '</option>';
    });
    audSel.innerHTML = html;
    if (_marketResetPending || prev === 'Auto' || !audiences.includes(prev)) audSel.value = 'Auto';
    else audSel.value = prev;
  }

  let _lastLangAuto = 'auto';

  /* Reset total al cambiar de mercado: TODOS los selectores dependientes
     saltan al idioma/coherencia del mercado nuevo, aunque se hubieran fijado
     a mano. Lo manual solo vale dentro del mercado actual. */
  var _marketResetPending = false;

  function onMarketChange() {
    _marketResetPending = true;
    try { cascadeUpdate(); } finally { _marketResetPending = false; }
  }

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
      html += '<option value="' + _escapeOptionText(id) + '"' + selected + '>' + _escapeOptionText(langs[id]) + '</option>';
    });
    // innerHTML RESETea la selección al primer option: había que restaurar el
    // valor guardado ANTES, no reasignar el valor ya perdido.
    langSel.innerHTML = html;
    if (_marketResetPending) {
      // Reset total: el idioma sigue al mercado nuevo aunque se hubiera fijado a mano.
      if (langs[defaultLang]) langSel.value = defaultLang;
    }
    else if (isAutoChoice && langs['auto']) langSel.value = 'auto';
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
    if (!_marketResetPending && prev && Array.prototype.some.call(pbSel.options, function (o) { return o.value === prev; })) {
      pbSel.value = prev;
    }
  }

  function _escapeOptionText(value) {
    return String(value == null ? '' : value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g, '&quot;');
  }

  function _domainOptionsHTML(list) {
    const groups = [];
    (list || []).forEach(function (item) {
      const group = item.group || '';
      let target = groups.find(function (g) { return g.label === group; });
      if (!target) { target = { label: group, items: [] }; groups.push(target); }
      target.items.push(item);
    });
    return groups.map(function (group) {
      const options = group.items.map(function (d) {
        return '<option value=\"' + _escapeOptionText(d.id) + '\">' + _escapeOptionText(d.label) + '</option>';
      }).join('');
      return group.label ? '<optgroup label=\"' + _escapeOptionText(group.label) + '\">' + options + '</optgroup>' : options;
    }).join('');
  }

  /* Las opciones salen de dominios generales y subnichos con banco real.
     Auto prioriza análisis confirmado; sin él usa concepto y mensaje. */
  function updateDomImagenSelect() {
    const domSel = $('domImagen');
    if (!domSel) return;
    const prev = domSel.value || 'Auto';
    const marketId = _marketId();
    const regionId = normalizeRegionForMarket();
    let list = [];
    try {
      if (typeof getListaDominios === 'function') list = getListaDominios(marketId, regionId) || [];
    } catch (e) { list = []; }
    domSel.innerHTML = '<option value=\"Auto\">Auto - analisis si existe; si no, concepto/mensaje</option>' + _domainOptionsHTML(list);
    const ok = !_marketResetPending && (prev === 'Auto' || list.some(function (d) { return d.id === prev; }));
    domSel.value = ok ? prev : 'Auto';
  }

  function updateDominioSelect() {
    const domSel = $('dominio');
    if (!domSel) return;
    const prev = domSel.value || 'auto';
    const marketId = _marketId();
    const regionId = normalizeRegionForMarket();
    let list = [];
    try {
      if (typeof getListaDominios === 'function') list = getListaDominios(marketId, regionId) || [];
    } catch (e) { list = []; }
    domSel.innerHTML = '<option value=\"auto\">Auto - concepto/mensaje o analisis si hay imagen</option>' + _domainOptionsHTML(list);
    const stillThere = prev === 'auto' || list.some(function (d) { return d.id === prev; });
    domSel.value = (!_marketResetPending && stillThere) ? prev : 'auto';
    updateDominioHelp();
  }

  function updateDominioHelp() {
    const help = $('dominioHelp');
    if (!help) return;
    try {
      const marketId = _marketId();
      const c = $('concept') ? $('concept').value : '';
      const m = $('message') ? $('message').value : '';
      let detectText = '';
      const imageInput = $('imageUpload');
      const file = imageInput && imageInput.files ? imageInput.files[0] : null;
      if ($('workflowMode') && $('workflowMode').value === 'variation' && file && imageInput.dataset) {
        const signature = [file.name, file.size, file.lastModified].join('|');
        if (imageInput.dataset.analysisSignature === signature) {
          try {
            const a = JSON.parse(imageInput.dataset.analysisSummary || 'null');
            if (a) detectText = [a.concepto, a.mensaje_visible, a.simbolo_descripcion, a.funcion_simbolica, a.esencia_a_conservar].filter(Boolean).join(' ');
          } catch (e) {}
        }
      }
      const det = (typeof detectarDominio === 'function') ? detectarDominio(detectText || c, detectText ? '' : m, marketId, normalizeRegionForMarket()) : 'auto';
      const cur = $('dominio') ? $('dominio').value : 'auto';
      if (cur !== 'auto') help.textContent = 'Dominio manual: ' + cur + ' (Auto sugiere: ' + det + '). Tú mandas.';
      else if (det !== 'auto') help.textContent = 'Auto detectó: ' + det + ' por tu concepto/mensaje. Puedes cambiarlo manual.';
      else help.textContent = 'Auto: escribe concepto y mensaje y detecto el dominio solo. O elige manual.';
    } catch (e) {}
  }

  function updatePrintMethodOptions() {
    var product = $('product') ? $('product').value : '';
    var select = $('printMethod');
    var methodField = $('printMethodField');
    var capField = $('capApplicationField');
    var isCap = product === 'GORRA';
    if (methodField) methodField.style.display = isCap ? 'none' : '';
    if (capField) capField.style.display = isCap ? '' : 'none';
    if (!select) return;
    var methods = typeof getPrintMethods === 'function' ? getPrintMethods(product) : ['auto'];
    var labels = typeof PRINT_METHOD_LABELS !== 'undefined' ? PRINT_METHOD_LABELS : {};
    var previous = select.value || 'auto';
    select.innerHTML = '';
    methods.forEach(function (method) {
      var option = document.createElement('option');
      option.value = method;
      option.textContent = labels[method] || method;
      select.appendChild(option);
    });
    select.value = methods.indexOf(previous) !== -1 ? previous : 'auto';
  }

  /* Template activo (banco de templates: mochila/bolso/funda).
     Muestra qué plantilla usará el motor para el producto elegido. */
  function updateTemplateHint() {
    var el = $('tplActiveHint');
    if (!el) return;
    var prod = $('product') ? $('product').value : '';
    var tpl = null;
    try {
      if (typeof getActiveTemplate === 'function') tpl = getActiveTemplate(prod);
    } catch (e) { tpl = null; }
    el.textContent = '';
    if (tpl) {
      el.appendChild(document.createTextNode('Template activo: '));
      var strong = document.createElement('b');
      strong.textContent = String(tpl.nombre || '');
      el.appendChild(strong);
      el.appendChild(document.createTextNode(' (' + String(tpl.producto || prod) + '). El prompt citará sus zonas. '));
      var changeLink = document.createElement('a');
      changeLink.href = 'editor-bancos.html';
      changeLink.target = '_blank';
      changeLink.rel = 'noopener';
      changeLink.textContent = 'Cambiar';
      el.appendChild(changeLink);
    } else if (prod === 'MOCHILA' || prod === 'TOTE BAG' || prod === 'FUNDA MÓVIL') {
      el.appendChild(document.createTextNode('Sin template para ' + prod + '. '));
      var uploadLink = document.createElement('a');
      uploadLink.href = 'editor-bancos.html';
      uploadLink.target = '_blank';
      uploadLink.rel = 'noopener';
      uploadLink.textContent = 'Sube la plantilla';
      el.appendChild(uploadLink);
      el.appendChild(document.createTextNode(' para no generar a ciegas.'));
    }
    updatePrintMethodOptions();
    if (typeof renderDesignToggle === 'function') renderDesignToggle();
  }

  /* Selector de banco destino (general o nombrado, Fase 2). */
  function updatePbBankSelect() {
    const sel = $('pbBank');
    if (!sel) return;
    const marketId = _marketId();
    const prev = sel.value;
    sel.innerHTML = '';
    const common = document.createElement('option');
    common.value = '';
    common.textContent = 'Banco general';
    sel.appendChild(common);
    try {
      if (typeof listPersonalBanks === 'function') {
        listPersonalBanks(marketId).forEach(function (b) {
          const option = document.createElement('option');
          option.value = 'nb:' + String(b.id || '');
          option.textContent = String(b.name || '') + ' (' + ((b.objects || []).length + (b.phrases || []).length) + ')';
          sel.appendChild(option);
        });
      }
    } catch (e) {}
    const still = Array.prototype.some.call(sel.options, function (o) { return o.value === prev; });
    if (still) sel.value = prev;
  }

  function cascadeUpdate() {
    // H1: la región se valida y normaliza ANTES de derivar el resto.
    updateRegionSelect();
    normalizeRegionForMarket();
    updateSubnicheSelect();
    updateAudienceSelect();
    updateLanguageSelect();
    updatePbDomSelect();
    updatePbBankSelect();
    updateDominioSelect();
    updateDomImagenSelect();
    updateTemplateHint();

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

  /* Legacy helper: no se aceptan claves persistidas en localStorage. */
  function getGeminiSlot() {
    try {
      const raw = localStorage.getItem('pod2_ai_slots');
      const slots = JSON.parse(raw || 'null');
      const sessionKeys = (typeof window.sessionStorage !== 'undefined')
        ? JSON.parse(window.sessionStorage.getItem('pod2_ai_session_keys') || 'null')
        : null;
      if (!Array.isArray(slots) || !Array.isArray(sessionKeys)) return null;
      const index = slots.findIndex(function (s) { return s && s.provider === 'Gemini' && s.model; });
      if (index < 0 || !sessionKeys[index]) return null;
      return Object.assign({}, slots[index], { key: String(sessionKeys[index]) });
    } catch (e) {
      return null;
    }
  }

  /* ===== VISIÓN multi-proveedor (verificado 8-oct-2026) =====
     - Gemini directo: tier free vigente; serie 2.5 en retirada (solo usuarios
       previos) → default nuevo gemini-3.5-flash-lite. Defaults de slots intactos.
     - OpenRouter :free: 50 req/día (1000 con $10 crédito), 20 RPM, interfaz
       OpenAI-compatible. Modelos visión verificados oct-2026.
     - Groq: SIN visión free (modelos retirados 2025-04) → no se usa aquí. */
  var VISION_KEY = 'pod2_vision_cfg';
  var VISION_DEAD_MODELS = {
    'llama-3.3-70b-versatile': 'openai/gpt-oss-20b',
    'google/gemini-2.0-flash-exp': 'google/gemini-2.5-flash',
    'gemini-2.0-flash': 'gemini-2.5-flash',
    'gemini-2.0-flash-001': 'gemini-2.5-flash',
    'gemini-2.0-flash-lite': 'gemini-2.5-flash',
    'gemini-2.0-flash-lite-001': 'gemini-2.5-flash',
    'gemini-1.5-flash': 'gemini-2.5-flash',
    'gemini-1.5-flash-001': 'gemini-2.5-flash',
    'gemini-1.5-pro': 'gemini-2.5-flash'
  };
  var VISION_DEFAULTS = {
    provider: 'auto',
    geminiModel: 'gemini-3.5-flash-lite',
    openrouterModel: 'google/gemma-4-31b-it:free',
    timeoutMs: 20000
  };
  var VISION_FALLBACK_OR = ['google/gemma-4-31b-it:free', 'nvidia/nemotron-3-nano-omni-30b:free'];

  function getVisionConfig() {
    try {
      const raw = localStorage.getItem(VISION_KEY);
      if (!raw) return Object.assign({}, VISION_DEFAULTS);
      const c = JSON.parse(raw);
      return {
        provider: ['auto', 'gemini', 'openrouter'].indexOf(c.provider) !== -1 ? c.provider : 'auto',
        geminiModel: String(c.geminiModel || VISION_DEFAULTS.geminiModel),
        openrouterModel: String(c.openrouterModel || VISION_DEFAULTS.openrouterModel),
        timeoutMs: [15000, 20000, 30000].indexOf(c.timeoutMs) !== -1 ? c.timeoutMs : 20000
      };
    } catch (e) { return Object.assign({}, VISION_DEFAULTS); }
  }

  function migrateVisionModel(m) {
    return (m && VISION_DEAD_MODELS[m]) ? VISION_DEAD_MODELS[m] : m;
  }

  /* Lee slots del panel (ia-revisor expone window.getAISlots); fallback a
     lectura directa para no romper si el revisor no cargó. */
  function getVisionSlots() {
    try {
      if (typeof window.getAISlots === 'function') {
        const a = window.getAISlots();
        if (Array.isArray(a)) return a.filter(function (s) { return s && s.key && s.model; });
      }
    } catch (e) {}
    try {
      // Nunca recuperar claves legacy persistidas en localStorage. Si el revisor
      // no está cargado, solo aceptamos claves de la sesión de la pestaña actual.
      const raw = localStorage.getItem('pod2_ai_slots');
      const arr = JSON.parse(raw || 'null');
      const sessionRaw = (typeof window.sessionStorage !== 'undefined')
        ? window.sessionStorage.getItem('pod2_ai_session_keys')
        : null;
      const sessionKeys = JSON.parse(sessionRaw || 'null');
      if (Array.isArray(arr) && Array.isArray(sessionKeys)) {
        return arr.map(function (s, i) {
          return s && s.model && sessionKeys[i]
            ? Object.assign({}, s, { key: String(sessionKeys[i]) })
            : null;
        }).filter(function (s) { return s && s.key && s.model; });
      }
    } catch (e) {}
    return [];
  }

  /* Pura y testeable: elige objetivo según config + alcance real de red.
     auto = Gemini si Google responde; si no, OpenRouter; último recurso Gemini. */
  function pickVisionTarget(slots, cfg, reach) {
    const c = cfg || VISION_DEFAULTS;
    const r = reach || {};
    const g = (slots || []).filter(function (s) { return s.provider === 'Gemini'; })[0] || null;
    const o = (slots || []).filter(function (s) { return s.provider === 'OpenRouter'; })[0] || null;
    function gem() {
      if (!g) return null;
      return { kind: 'gemini', model: migrateVisionModel(c.geminiModel || g.model), key: g.key, timeoutMs: g.timeoutMs || c.timeoutMs };
    }
    function oro() {
      if (!o) return null;
      return { kind: 'openrouter', model: c.openrouterModel, key: o.key, timeoutMs: o.timeoutMs || c.timeoutMs };
    }
    if (c.provider === 'gemini') return gem() || oro();
    if (c.provider === 'openrouter') return oro() || gem();
    if (r.google !== false && gem()) return gem();
    if (oro()) return oro();
    return gem();
  }

  function otherVisionTarget(slots, cfg, current) {
    const c = cfg || VISION_DEFAULTS;
    const g = (slots || []).filter(function (s) { return s.provider === 'Gemini'; })[0] || null;
    const o = (slots || []).filter(function (s) { return s.provider === 'OpenRouter'; })[0] || null;
    if (current && current.kind === 'gemini') {
      if (!o) return null;
      return { kind: 'openrouter', model: c.openrouterModel, key: o.key, timeoutMs: o.timeoutMs || c.timeoutMs };
    }
    if (current && current.kind === 'openrouter') {
      if (!g) return null;
      return { kind: 'gemini', model: migrateVisionModel(c.geminiModel || g.model), key: g.key, timeoutMs: g.timeoutMs || c.timeoutMs };
    }
    return null;
  }

  async function fetchWithTimeout(url, opts, ms) {
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const t = controller ? setTimeout(function () { controller.abort(); }, ms || 20000) : null;
    try {
      const o2 = Object.assign({}, opts);
      if (controller) o2.signal = controller.signal;
      return await fetch(url, o2);
    } finally { if (t) clearTimeout(t); }
  }

  /* Pre-flight 5s: distingue "red bloqueada" de "clave/modelo".
     Un 4xx cuenta como ALCANCE (conecta, pero la clave/modelo falla). */
  async function preflightVision(timeoutMs) {
    const ms = timeoutMs || 5000;
    async function ping(url) {
      const t0 = Date.now();
      try {
        await fetchWithTimeout(url, { method: 'GET' }, ms);
        return { ok: true, ms: Date.now() - t0 };
      } catch (e) { return { ok: false, ms: Date.now() - t0 }; }
    }
    const results = await Promise.all([
      ping('https://generativelanguage.googleapis.com/v1beta/models'),
      ping('https://openrouter.ai/api/v1/models')
    ]);
    return { google: results[0].ok, openrouter: results[1].ok, ms: { google: results[0].ms, openrouter: results[1].ms } };
  }

  /* Reduce a 1024px lado largo, JPEG q0.85: 20MB → ~300-600KB. */
  function downscaleImage(file) {
    return new Promise(function (resolve) {
      try {
        const img = new Image();
        const url = URL.createObjectURL(file);
        img.onload = function () {
          try {
            const max = 1024;
            const w = img.naturalWidth || img.width, h = img.naturalHeight || img.height;
            const sc = Math.min(1, max / Math.max(w, h));
            const cw = Math.max(1, Math.round(w * sc)), ch = Math.max(1, Math.round(h * sc));
            const cv = document.createElement('canvas');
            cv.width = cw; cv.height = ch;
            cv.getContext('2d').drawImage(img, 0, 0, cw, ch);
            URL.revokeObjectURL(url);
            const parts = cv.toDataURL('image/jpeg', 0.85).split(',');
            resolve({ base64: parts[1], mimeType: 'image/jpeg' });
          } catch (e) { resolve(null); }
        };
        img.onerror = function () { try { URL.revokeObjectURL(url); } catch (e) {} resolve(null); };
        img.src = url;
      } catch (e) { resolve(null); }
    });
  }

  function visionHttpMessage(status, provider) {
    if (status === 401 || status === 403) return 'Clave inválida o sin permiso (HTTP ' + status + '). Revisa la clave en la barra IA.';
    if (status === 404) return 'Modelo retirado o inexistente (HTTP 404). Cambia el modelo en la barra IA.';
    if (status === 429) return 'Límite del tier free (HTTP 429). Espera un minuto o sube de tier.';
    if (status >= 500) return 'El proveedor falló (HTTP ' + status + '). Reintenta en un momento.';
    return provider + ' respondió HTTP ' + status + '.';
  }

  function parseVisionJson(text, provider) {
    try { return JSON.parse(text); }
    catch (e) {
      const cleaned = String(text).replace(/```json/gi, '').replace(/```/g, '').trim();
      const start = cleaned.indexOf('{'), end = cleaned.lastIndexOf('}');
      const sliced = (start > -1 && end > start) ? cleaned.slice(start, end + 1) : cleaned;
      try { return JSON.parse(sliced); }
      catch (e2) { throw new Error('Respuesta no-JSON de ' + provider + '. Reintenta.'); }
    }
  }

  async function callGeminiVision(target, fileData, prompt) {
    const body = {
      contents: [{ role: 'user', parts: [{ text: prompt }, { inlineData: { mimeType: fileData.mimeType, data: fileData.base64 } }] }],
      generationConfig: { temperature: 0.2, maxOutputTokens: 2048, responseMimeType: 'application/json' }
    };
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/' +
      encodeURIComponent(target.model) + ':generateContent';
    let lastErr = null;
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await fetchWithTimeout(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-goog-api-key': target.key },
          body: JSON.stringify(body)
        }, target.timeoutMs);
        if (!response.ok) {
          let detail = '';
          try {
            const eb = await response.json();
            detail = eb && eb.error && eb.error.message ? ': ' + eb.error.message : '';
          } catch (e) {}
          const err = new Error(visionHttpMessage(response.status, 'Gemini') + detail);
          err.httpStatus = response.status;
          throw err;
        }
        const data = await response.json();
        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
          throw new Error('Respuesta vacía de Gemini.');
        }
        return parseVisionJson(data.candidates[0].content.parts[0].text, 'Gemini');
      } catch (e) {
        if (e && (e.httpStatus === 401 || e.httpStatus === 403 || e.httpStatus === 404)) throw e;
        lastErr = e;
      }
    }
    if (lastErr && lastErr.name === 'AbortError') {
      throw new Error('Gemini no respondió en ' + Math.round(target.timeoutMs / 1000) + 's (2 intentos). ¿Red bloqueada hacia Google? Prueba OpenRouter en la barra IA.');
    }
    throw lastErr;
  }

  async function callOpenRouterVision(target, fileData, prompt) {
    const url = 'https://openrouter.ai/api/v1/chat/completions';
    const headers = { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + target.key };
    try {
      if (typeof location !== 'undefined' && location.href) {
        headers['HTTP-Referer'] = location.href;
        headers['X-Title'] = 'Taller POD';
      }
    } catch (e) {}
    const body = {
      model: target.model,
      messages: [{
        role: 'user',
        content: [
          { type: 'text', text: prompt },
          { type: 'image_url', image_url: { url: 'data:' + fileData.mimeType + ';base64,' + fileData.base64 } }
        ]
      }],
      temperature: 0.2,
      max_tokens: 2048
    };
    let lastErr = null;
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await fetchWithTimeout(url, {
          method: 'POST', headers: headers, body: JSON.stringify(body)
        }, target.timeoutMs);
        if (!response.ok) {
          let detail = '';
          try {
            const eb = await response.json();
            detail = eb && eb.error && eb.error.message ? ': ' + eb.error.message : '';
          } catch (e) {}
          const err = new Error(visionHttpMessage(response.status, 'OpenRouter') + detail);
          err.httpStatus = response.status;
          throw err;
        }
        const data = await response.json();
        const text = data.choices && data.choices[0] && data.choices[0].message
          ? data.choices[0].message.content : '';
        if (!text) throw new Error('Respuesta vacía de OpenRouter.');
        return parseVisionJson(text, 'OpenRouter');
      } catch (e) {
        if (e && (e.httpStatus === 401 || e.httpStatus === 403 || e.httpStatus === 404)) throw e;
        lastErr = e;
      }
    }
    if (lastErr && lastErr.name === 'AbortError') {
      throw new Error('OpenRouter no respondió en ' + Math.round(target.timeoutMs / 1000) + 's (2 intentos). Revisa tu conexión.');
    }
    throw lastErr;
  }

  /* Ping real mínimo para el botón "Probar conexión": preflight + 1 texto corto. */
  async function testVisionConnection() {
    const cfg = getVisionConfig();
    const slots = getVisionSlots();
    let reach = { google: true, openrouter: true };
    try { reach = await preflightVision(5000); } catch (e) {}
    const target = pickVisionTarget(slots, cfg, reach);
    if (!target) return { ok: false, message: 'Sin claves con modelo. Configura la barra IA.' };
    try {
      if (target.kind === 'gemini') {
        const url = 'https://generativelanguage.googleapis.com/v1beta/models/' +
          encodeURIComponent(target.model) + ':generateContent';
        const r = await fetchWithTimeout(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-goog-api-key': target.key },
          body: JSON.stringify({ contents: [{ parts: [{ text: 'Responde solo: ok' }] }] })
        }, 15000);
        if (!r.ok) return { ok: false, message: visionHttpMessage(r.status, 'Gemini') };
      } else {
        const r = await fetchWithTimeout('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + target.key },
          body: JSON.stringify({ model: target.model, messages: [{ role: 'user', content: 'Responde solo: ok' }], max_tokens: 5 })
        }, 15000);
        if (!r.ok) return { ok: false, message: visionHttpMessage(r.status, 'OpenRouter') };
      }
      return { ok: true, message: target.kind + ' / ' + target.model + ' responde (red OK).' };
    } catch (e) {
      if (e && e.name === 'AbortError') {
        return { ok: false, message: 'Timeout: la red no llega a ' + target.kind + ' (¿bloqueo geográfico?).' };
      }
      return { ok: false, message: String((e && e.message) || e) };
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

    const cfg = getVisionConfig();
    const slots = getVisionSlots();
    if (!slots.length) {
      if (statusEl) {
        statusEl.innerHTML = '<span class="bad">Configura una clave en la barra IA (Gemini u OpenRouter) para usar visión.</span>';
      }
      return;
    }

    // Pre-flight solo en auto: elige el proveedor que SÍ responde en vez de
    // esperar 20s contra un endpoint bloqueado. Fijado manual = directo.
    let reach = { google: true, openrouter: true };
    if (cfg.provider === 'auto') {
      if (statusEl) statusEl.textContent = 'Verificando conexión (Google / OpenRouter)...';
      try { reach = await preflightVision(5000); } catch (e) {}
    }
    const target = pickVisionTarget(slots, cfg, reach);
    if (!target) {
      if (statusEl) {
        statusEl.innerHTML = '<span class="bad">Sin proveedor de visión con clave. Configura la barra IA.</span>';
      }
      return;
    }
    const targetLabel = target.kind === 'openrouter' ? 'OpenRouter' : 'Gemini';

    if (statusEl) statusEl.textContent = 'Analizando imagen con ' + targetLabel + ' Vision (' + target.model + ')...';

    const file = fileInput.files[0];
    if (!file.type || !/^image\/(png|jpeg|webp|gif)$/i.test(file.type)) {
      if (statusEl) statusEl.textContent = 'Formato no compatible para vision. Usa PNG, JPG, WEBP o GIF.';
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      if (statusEl) statusEl.textContent = 'La imagen supera 20 MB. Reduce su tamano e intentalo de nuevo.';
      return;
    }

    try {
      // Downscale primero (20MB → ~400KB); fallback al original si falla canvas.
      let fileData = await downscaleImage(file);
      if (!fileData) fileData = await fileToBase64(file);

      const marketId = $('market') ? $('market').value : 'global_en';
      const regionId = $('region') ? $('region').value : 'global';

      const prompt = 'Eres un director de arte POD. Analiza esta imagen y devuelve SOLO un JSON válido sin markdown ni explicaciones. ' +
        'El mercado objetivo es: ' + marketId + '. La región cultural es: ' + regionId + '. ' +
        'Devuelve exactamente esta estructura: ' +
        '{' +
        '"concepto": "idea central visual en 5-8 palabras", ' +
        '"mensaje_visible": "texto legible en la imagen o null si no hay", ' +
        '"frase_apoyo_sugerida": "frase original de 2-5 palabras, coherente con la imagen y distinta del mensaje; null si no aporta", ' +
        '"simbolo_descripcion": "descripción visual detallada del símbolo principal", ' +
        '"subnicho_sugerido": "el subnicho más probable para esta imagen", ' +
        '"funcion_simbolica": "qué representa o comunica el símbolo", ' +
        '"sugerencias_banco": ["3 ideas de objetos nuevos que cumplan la misma función simbólica pero sean visualmente distintos"], ' +
        '"esencia_a_conservar": "detalles visuales clave que deben mantenerse en una variación"' +
        '}';

      let analysis;
      try {
        analysis = target.kind === 'openrouter'
          ? await callOpenRouterVision(target, fileData, prompt)
          : await callGeminiVision(target, fileData, prompt);
      } catch (e1) {
        // Failover al otro proveedor si tiene clave (no 401/403/404: esos no reintentan).
        const other = otherVisionTarget(slots, cfg, target);
        if (!other) throw e1;
        if (statusEl) {
          statusEl.textContent = 'Reintentando con ' + (other.kind === 'openrouter' ? 'OpenRouter' : 'Gemini') + ' (' + other.model + ')...';
        }
        analysis = other.kind === 'openrouter'
          ? await callOpenRouterVision(other, fileData, prompt)
          : await callGeminiVision(other, fileData, prompt);
      }

      // Vincular el analisis al archivo exacto; cambiar imagen invalida su resultado.
      fileInput.dataset.analysisSignature = [file.name, file.size, file.lastModified].join('|');
      fileInput.dataset.analysisSummary = JSON.stringify({
        concepto: analysis.concepto || '',
        mensaje_visible: analysis.mensaje_visible || '',
        frase_apoyo_sugerida: analysis.frase_apoyo_sugerida || '',
        simbolo_descripcion: analysis.simbolo_descripcion || '',
        funcion_simbolica: analysis.funcion_simbolica || '',
        esencia_a_conservar: analysis.esencia_a_conservar || ''
      });

      // Llenar campos automáticamente
      if ($('concept') && analysis.concepto) {
        $('concept').value = analysis.concepto;
      }
      if ($('message') && analysis.mensaje_visible) {
        $('message').value = analysis.mensaje_visible;
      }
      const supportSuggestion = String(analysis.frase_apoyo_sugerida || '').trim();
      const supportField = $('support');
      let supportSuggestionFilled = false;
      if (supportField && supportSuggestion && !/^(null|none|ninguna|n\/a)$/i.test(supportSuggestion) && !supportField.value.trim()) {
        supportField.value = supportSuggestion;
        supportField.dispatchEvent(new Event('input', { bubbles: true }));
        supportSuggestionFilled = true;
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
        const supportNote = supportSuggestion
          ? (supportSuggestionFilled
            ? ' Frase de apoyo sugerida y puesta en el campo; revísala antes de generar.'
            : ' La IA sugirió «' + supportSuggestion + '», pero se conservó el apoyo que ya habías escrito.')
          : ' No se sugirió una frase de apoyo.';
        statusEl.textContent = 'Imagen analizada. Revisa y ajusta los campos antes de crear.' + supportNote;
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
        const message = e && e.name === 'AbortError'
          ? 'El analisis tardo demasiado y se cancelo. Puedes reintentar o continuar sin analisis.'
          : (e && e.message ? e.message : e);
        statusEl.textContent = 'Error al analizar: ' + message + '. Puedes continuar con los selectores sin bloquear la generacion.';
      }
    }
  }

  /* ============================================================
     GESTIÓN DEL BANCO PERSONAL DESDE LA UI
     ============================================================ */

  function savePersonalBankFromUI() {
    const pbTextEl = $('pbText');
    const pbDomEl = $('pbDom');
    const pbBankEl = $('pbBank');
    const pbBankNameEl = $('pbBankName');
    const pbCountEl = $('pbCount');

    if (!pbTextEl || !pbTextEl.value.trim()) {
      tell('<span class="bad">Escribe al menos un objeto antes de guardar.</span>');
      return;
    }

    const marketId = $('market') ? $('market').value : 'global_en';
    const subniche = pbDomEl ? pbDomEl.value : 'comun';
    const lines = pbTextEl.value.split('\n').map(function (l) { return l.trim(); }).filter(function (l) { return l.length > 3; });
    const newName = pbBankNameEl ? pbBankNameEl.value.trim() : '';
    const dest = pbBankEl ? pbBankEl.value : '';

    // Destino: banco nuevo con nombre > banco nombrado > banco general.
    if (newName && typeof createPersonalBank === 'function' && typeof saveToPersonalBank === 'function') {
      const created = createPersonalBank(marketId, newName, subniche);
      if (!created.ok) { tell('<span class="bad">' + created.error + '</span>'); return; }
      const saved = saveToPersonalBank(marketId, created.id, { objects: lines });
      if (typeof setActivePersonalBank === 'function') setActivePersonalBank(marketId, subniche, created.id);
      if (pbTextEl) pbTextEl.value = '';
      if (pbBankNameEl) pbBankNameEl.value = '';
      updatePbBankSelect();
      if (pbBankEl) pbBankEl.value = 'nb:' + created.id;
      updatePbCount();
      tell('<span class="good">Banco "' + newName.replace(/</g, '&lt;') + '" creado con ' + saved.added + ' objeto(s). Ya alimenta al motor.</span>');
      return;
    }
    if (dest && dest.indexOf('nb:') === 0 && typeof saveToPersonalBank === 'function') {
      const saved = saveToPersonalBank(marketId, dest.slice(3), { objects: lines });
      if (!saved.ok) { tell('<span class="bad">' + (saved.error || 'No se pudo guardar.') + '</span>'); return; }
      if (pbTextEl) pbTextEl.value = '';
      updatePbBankSelect();
      updatePbCount();
      tell('<span class="good">' + saved.added + ' objeto(s) guardado(s) en el banco. Duplicados: ' + saved.duplicates + '.</span>');
      return;
    }

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
      try {
        if (typeof listPersonalBanks === 'function') {
          listPersonalBanks(marketId).forEach(function (b) {
            total += (b.objects || []).length + (b.phrases || []).length;
          });
        }
      } catch (e) {}
      pbCountEl.textContent = 'Banco personal: ' + total + ' objetos guardados.';
    }
  }

  /* ============================================================
     CABLEADO DE BOTONES AL MOTOR
     ============================================================ */

  function useBankPhrase() {
    if (typeof readStateFromDOM === 'function') readStateFromDOM();
    var market = $('market') ? $('market').value : 'global_en';
    var subniche = $('subniche') ? $('subniche').value : 'auto';
    if ((!subniche || subniche === 'auto') && typeof effectiveSubniche === 'function') {
      subniche = effectiveSubniche() || 'auto';
    }
    if (!subniche || subniche === 'auto') {
      tell('<span class="bad">Elige un subnicho o escribe un concepto que permita detectarlo.</span>');
      return;
    }
    if (typeof getPersonalPhrases !== 'function') {
      tell('<span class="bad">No se pudo leer el banco de frases.</span>');
      return;
    }
    var phrases = getPersonalPhrases(market, subniche);
    if (!phrases.length) {
      tell('<span class="info">No hay frases guardadas para este subnicho. Puedes agregarlas desde Editor de bancos.</span>');
      return;
    }
    var input = $('message');
    if (!input) return;
    if (input.value.trim() && !window.confirm('¿Reemplazar el mensaje visible actual por una frase guardada?')) return;
    input.value = phrases[Math.floor(Math.random() * phrases.length)];
    input.dispatchEvent(new Event('input', { bubbles: true }));
    tell('<span class="good">Frase cargada en Mensaje visible. Revísala antes de generar.</span>');
  }

  function wireButtons() {
    // Cascada de selectores
    on('market', 'change', onMarketChange);
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
    on('domImagen', 'change', function () {
      const help = $('domImagenHelp');
      if (!help || !$('domImagen')) return;
      const selected = $('domImagen').value;
      help.textContent = selected === 'Auto'
        ? 'Auto: usa analisis confirmado si existe; si no, concepto/mensaje. La familia guia los objetos.'
        : 'Familia elegida: ' + $('domImagen').selectedOptions[0].textContent + '. Guia los objetos nuevos.';
    });
    on('product', 'change', updateTemplateHint);

    // Análisis de imagen
    on('btnAnalyzeImage', 'click', analyzeImageWithVision);
    on('btnUseBankPhrase', 'click', useBankPhrase);

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

  /* Toggle de modo de diseño: fichas (3 direcciones) vs patrón repetido.
     Solo mochila/bolso/funda tienen banco de templates; el resto usa placement. */
  function renderDesignToggle() {
    const el = $('designToggle');
    const product = $('product') ? $('product').value : '';
    const supportsPattern = ['MOCHILA', 'TOTE BAG', 'FUNDA MÓVIL'].indexOf(product) !== -1;
    if (!supportsPattern && typeof MOTOR_STATE !== 'undefined' && MOTOR_STATE.designMode === 'patron') MOTOR_STATE.designMode = 'contacto';
    if (el) {
      const modes = [{ val: 'contacto', label: 'Fichas (3 direcciones)' }];
      if (supportsPattern) modes.push({ val: 'patron', label: 'Patrón repetido' });
      el.innerHTML = '';
      modes.forEach(function (m) {
        const pill = document.createElement('span');
        pill.className = 'pill' + ((typeof MOTOR_STATE !== 'undefined' && MOTOR_STATE.designMode === m.val) ? ' on' : '');
        pill.textContent = m.label;
        pill.addEventListener('click', function () {
          if (typeof MOTOR_STATE !== 'undefined') {
            MOTOR_STATE.designMode = m.val;
          }
          renderDesignToggle();
        });
        el.appendChild(pill);
      });
    }
    const row = $('repeatRow');
    if (row) row.style.display = (supportsPattern && typeof MOTOR_STATE !== 'undefined' && MOTOR_STATE.designMode === 'patron') ? '' : 'none';
    const help = $('designModeHelp');
    if (help) help.textContent = supportsPattern
      ? 'Patron repetido disponible para mochila, tote bag y funda movil. Adjunta tambien la plantilla al chat de imagen si quieres que la IA respete sus zonas.'
      : 'El modo patron repetido aplica a mochila, tote bag y funda movil. Para este producto se usan fichas de direccion.';
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
    renderDesignToggle();
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
  window.onMarketChange = onMarketChange;
  window.savePersonalBankFromUI = savePersonalBankFromUI;
  window.testVisionConnection = testVisionConnection;
  window.PODVision = {
    getVisionConfig: getVisionConfig,
    migrateVisionModel: migrateVisionModel,
    getVisionSlots: getVisionSlots,
    pickVisionTarget: pickVisionTarget,
    otherVisionTarget: otherVisionTarget,
    preflightVision: preflightVision,
    VISION_DEFAULTS: VISION_DEFAULTS,
    VISION_FALLBACK_OR: VISION_FALLBACK_OR
  };

})();