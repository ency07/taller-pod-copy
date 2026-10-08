'use strict';

/* ============================================================
   MOTOR NÚCLEO — Orquestación Multi-Mercado POD
   Integra: mercados, audiencias, bancos, estilos, productos, memoria.
   Genera prompt denso con locks, anti-repetición y reglas legales.
   NO contiene datos. Solo lógica de orquestación.
   ============================================================ */

/* --- Referencias a módulos externos (cargados antes) --- */
const _MARKETS = typeof POD_MARKETS !== 'undefined' ? POD_MARKETS : {};
const _AUD_PROFILES = typeof AUD_PROFILES !== 'undefined' ? AUD_PROFILES : {};
const _AUD_NAMES = typeof AUD_NAMES !== 'undefined' ? AUD_NAMES : Object.keys(_AUD_PROFILES);
const _SUBNICHES = typeof POD_SUBNICHES !== 'undefined' ? POD_SUBNICHES : {};
const _ESTILOS_LIST = typeof ESTILOS_LIST !== 'undefined' ? ESTILOS_LIST : [];
const _STYLE_POOLS = typeof STYLE_POOLS !== 'undefined' ? STYLE_POOLS : {};
const _STYLE_CANDIDATES = typeof STYLE_CANDIDATES !== 'undefined' ? STYLE_CANDIDATES : {};
const _STYLE_COLOR_PREF = typeof STYLE_COLOR_PREF !== 'undefined' ? STYLE_COLOR_PREF : {};
const _STYLE_TIPO_PREF = typeof STYLE_TIPO_PREF !== 'undefined' ? STYLE_TIPO_PREF : {};
const _COLOR_FAMILIES = typeof COLOR_FAMILIES !== 'undefined' ? COLOR_FAMILIES : {};
const _COLOR_MODES = typeof COLOR_MODES !== 'undefined' ? COLOR_MODES : [];
const _HEX_DE_PALETA = typeof HEX_DE_PALETA !== 'undefined' ? HEX_DE_PALETA : {};
const _LAYOUTS = typeof LAYOUTS !== 'undefined' ? LAYOUTS : [];
const _TIPOS = typeof TIPOS !== 'undefined' ? TIPOS : [];
const _TRATAMIENTOS = typeof TRATAMIENTOS !== 'undefined' ? TRATAMIENTOS : [];
const _FORMAS = typeof FORMAS !== 'undefined' ? FORMAS : [];
const _INTEGRACION = typeof INTEGRACION !== 'undefined' ? INTEGRACION : [];
const _POOLS = typeof POOLS !== 'undefined' ? POOLS : {};
const _PRODUCT_BIAS = typeof PRODUCT_BIAS !== 'undefined' ? PRODUCT_BIAS : {};
const _PLACEMENT = typeof PLACEMENT !== 'undefined' ? PLACEMENT : {};
const _PRODUCT_RULES = typeof PRODUCT_RULES !== 'undefined' ? PRODUCT_RULES : {};
const _SATURACION = typeof SATURACION !== 'undefined' ? SATURACION : {};
const _OBJECT_BANK_COMMON = typeof OBJECT_BANK_COMMON !== 'undefined' ? OBJECT_BANK_COMMON : [];
const _OBJECT_BANK_COMMON_EN = typeof OBJECT_BANK_COMMON_EN !== 'undefined' ? OBJECT_BANK_COMMON_EN : [];
const _TEXTO_FALLBACK_SECULAR = typeof TEXTO_FALLBACK_SECULAR !== 'undefined' ? TEXTO_FALLBACK_SECULAR : {};

/* --- Helpers de memoria (de memoria-local.js) --- */
const _memGetJSON = typeof getJSON === 'function' ? getJSON : function () { return null; };
const _memSetJSON = typeof setJSON === 'function' ? setJSON : function () { return false; };
const _memKey = typeof memKey === 'function' ? memKey : function (p) { return 'POD2|' + (p || []).join('|'); };
const _loadLocks = typeof loadLocks === 'function' ? loadLocks : function () { return { estilo: { A: 'Auto', B: 'Auto', C: 'Auto' }, audiencia: { A: 'Auto', B: 'Auto', C: 'Auto' }, jerarquia: { A: 'Auto', B: 'Auto', C: 'Auto' } }; };
const _saveLocks = typeof saveLocks === 'function' ? saveLocks : function () { };
const _setLockValue = typeof setLockValue === 'function' ? setLockValue : function () { };
const _loadPatternMemory = typeof loadPatternMemory === 'function' ? loadPatternMemory : function () { return []; };
const _recordPattern = typeof recordPattern === 'function' ? recordPattern : function () { };
const _findPatternConflicts = typeof findPatternConflicts === 'function' ? findPatternConflicts : function () { return { ok: true, conflicts: [], maxMatches: 0 }; };
const _getPersonalObjects = typeof getPersonalObjects === 'function' ? getPersonalObjects : function () { return []; };
const _addUsedObjects = typeof addUsedObjects === 'function' ? addUsedObjects : function () { };
const _makeHistoryKey = typeof makeHistoryKey === 'function' ? makeHistoryKey : function () { return ''; };
const _loadSetHistory = typeof loadSetHistory === 'function' ? loadSetHistory : function () { return { history: [], usedObjects: [], prevPicks: null }; };
const _saveSetHistory = typeof saveSetHistory === 'function' ? saveSetHistory : function () { };
const _confirmDestructive = typeof confirmDestructive === 'function' ? confirmDestructive : function () { return window.confirm(arguments[0]); };

/* --- Utilidades internas --- */
function _pick(arr) {
  if (!arr || !arr.length) return '';
  return arr[Math.floor(Math.random() * arr.length)];
}

function _pickDistinct(keys, pool) {
  const shuffled = (pool || []).slice().sort(function () { return Math.random() - 0.5; });
  const out = {};
  const used = new Set();
  keys.forEach(function (k) {
    const available = shuffled.filter(function (x) { return !used.has(x); });
    const pick = available.length ? available[0] : shuffled[0] || '';
    out[k] = pick;
    used.add(pick);
  });
  return out;
}

function _getStyleBase(s) {
  return String(s || '').split(' × ')[0].trim();
}

function _matchesPreference(preferences, value) {
  return (preferences || []).some(function (pref) {
    return String(value || '').startsWith(String(pref));
  });
}

function _hexScheme(palStr, mode) {
  if (typeof hexScheme === 'function') return hexScheme(palStr, mode);
  const sw = _HEX_DE_PALETA[palStr] || ['#14141A', '#3E424A', '#8A8578', '#F2ECDD'];
  return { bg: sw[0], dom: sw[1], acc: sw[2], ink: sw[3] };
}

/* --- Estado global del motor --- */
let MOTOR_STATE = {
  market: 'global_en',
  language: 'auto',
  marketplace: 'generic',
  region: 'global',
  subniche: 'auto',
  product: 'CAMISETA SOFT',
  serie: '',
  concept: '',
  message: '',
  support: '',
  audienceSet: 'Auto',
  audienceMulti: 'no',
  dominio: 'auto',
  dominioDetectado: 'auto',
  domImagen: 'Auto',
  workflowMode: 'new',
  groupMode: 'distintos',
  objectMode: 'simple',
  designMode: 'contacto',
  repeatType: 'medio salto',
  fmtDense: true,
  variationOptions: {
    simbolo: 'sustituir',
    textos: 'conservar_palabras',
    paleta: 'renovar',
    esencia: ''
  },
  capApplication: 'auto',
  imageReference: null,
  imageAnalysis: null
};

const K = ['A', 'B', 'C'];
const N = ['01A', '01B', '01C'];

/* --- Lectura de estado desde el DOM --- */
function readStateFromDOM() {
  const g = function (id) { return document.getElementById(id); };
  const v = function (id, fallback) { const el = g(id); return el ? el.value : fallback; };

  MOTOR_STATE.market = v('market', 'global_en');
  MOTOR_STATE.language = v('language', 'auto');
  MOTOR_STATE.marketplace = v('marketplace', 'generic');
  MOTOR_STATE.region = v('region', 'global');
  MOTOR_STATE.subniche = v('subniche', 'auto');
  MOTOR_STATE.product = v('product', 'CAMISETA SOFT');
  MOTOR_STATE.serie = v('serie', '');
  MOTOR_STATE.concept = v('concept', '');
  MOTOR_STATE.message = v('message', '');
  MOTOR_STATE.support = v('support', '');
  MOTOR_STATE.audienceSet = v('audienceSet', 'Auto');
  MOTOR_STATE.audienceMulti = v('audienceMulti', 'no');
  MOTOR_STATE.dominio = v('dominio', 'auto');
  // "Familia de la imagen" (#domImagen): antes no se leía en ningún lado.
  MOTOR_STATE.domImagen = v('domImagen', 'Auto');
  // Detección auto solo si el usuario deja Auto: lee estructura de bancos, no quemado en motor
  try {
    if (typeof detectarDominio === 'function') {
      MOTOR_STATE.dominioDetectado = detectarDominio(MOTOR_STATE.concept, MOTOR_STATE.message, MOTOR_STATE.market);
    }
  } catch (e) { MOTOR_STATE.dominioDetectado = 'auto'; }
  MOTOR_STATE.workflowMode = v('workflowMode', 'new');
  MOTOR_STATE.repeatType = v('repeatType', 'medio salto');
  MOTOR_STATE.variationOptions.simbolo = v('simboloVar', 'sustituir');
  MOTOR_STATE.variationOptions.textos = v('textosVar', 'conservar_palabras');
  MOTOR_STATE.variationOptions.paleta = v('paletaVar', 'renovar');
  MOTOR_STATE.variationOptions.esencia = (g('essence') ? g('essence').value : '').trim();
  MOTOR_STATE.capApplication = v('capApplication', 'auto');
  const imageInput = g('imageUpload');
  const imageFile = imageInput && imageInput.files ? imageInput.files[0] : null;
  MOTOR_STATE.imageReference = imageFile ? {
    name: imageFile.name, size: imageFile.size, lastModified: imageFile.lastModified,
    signature: [imageFile.name, imageFile.size, imageFile.lastModified].join('|')
  } : null;
  MOTOR_STATE.imageAnalysis = null;
  if (imageFile && imageInput.dataset && imageInput.dataset.analysisSignature === MOTOR_STATE.imageReference.signature) {
    try { MOTOR_STATE.imageAnalysis = JSON.parse(imageInput.dataset.analysisSummary || 'null'); }
    catch (e) { MOTOR_STATE.imageAnalysis = null; }
  }
}

/* --- Resolución de audiencias --- */
/* Audiencias permitidas por mercado + region + subnicho. */
function getCurrentAudiencePool() {
  const market = MOTOR_STATE.market;
  const region = MOTOR_STATE.region;
  let pool = typeof getAudiencesForMarketRegion === 'function'
    ? getAudiencesForMarketRegion(market, region)
    : (typeof getAudiencesForRegion === 'function' ? getAudiencesForRegion(region) : _AUD_NAMES.slice());

  if (MOTOR_STATE.subniche !== 'auto' && typeof getAudiencesForSubniche === 'function') {
    const subPool = getAudiencesForSubniche(MOTOR_STATE.subniche, region) || [];
    const compatible = pool.filter(function (aud) { return subPool.indexOf(aud) !== -1; });
    if (compatible.length) pool = compatible;
  }
  return pool.length ? pool : _AUD_NAMES.slice();
}

function resolveAudiences() {
  const base = MOTOR_STATE.audienceSet;
  const multi = MOTOR_STATE.audienceMulti === 'si';
  const market = MOTOR_STATE.market;
  const region = MOTOR_STATE.region;

  const pool = getCurrentAudiencePool();

  const locks = _loadLocks(market, MOTOR_STATE.product);
  const result = {};
  const autos = [];

  K.forEach(function (k) {
    if (locks.audiencia[k] && locks.audiencia[k] !== 'Auto' && pool.indexOf(locks.audiencia[k]) !== -1) {
      result[k] = locks.audiencia[k];
    } else {
      autos.push(k);
    }
  });

  if (!autos.length) return result;

  if (multi) {
    const picks = _pickDistinct(autos, pool);
    autos.forEach(function (k) { result[k] = picks[k]; });
  } else {
    let pick;
    if (base !== 'Auto' && pool.indexOf(base) !== -1) {
      pick = base;
    } else {
      pick = _pick(pool);
    }
    autos.forEach(function (k) { result[k] = pick; });
  }

  return result;
}

/* --- Resolución de estilos --- */
function _styleCandidatesForContext() {
  const subniche = MOTOR_STATE.subniche;
  const recommended = subniche !== 'auto' && _STYLE_CANDIDATES[subniche]
    ? _STYLE_CANDIDATES[subniche].slice() : [];
  let candidates = recommended.concat(_ESTILOS_LIST.filter(function (style) {
    return recommended.indexOf(style) === -1;
  }));
  if (isGospelMarket()) {
    const allow = ["Folk Popular", "Vitral / Mosaico", "Barroco Ornamental", "Grabado / Linóleo", "Hand-Drawn", "Acuarela Suelta", "Sumi-e / Tinta Lavada", "Minimal Modern", "Bordado / Puntada", "Ukiyo-e / Woodblock", "Retro 70s", "Kids Storybook", "Collage Cut-Paper", "Papercraft 3D", "Airbrush Smooth", "Foil Stamp / Metallic", "Vintage Desgastado", "Bohemian"];
    candidates = candidates.filter(function (e) { return allow.indexOf(e) !== -1; });
  }
  return candidates;
}

/**
 * Contador de uso global de estilos para garantizar cobertura de cola larga.
 * Los estilos no usados hace más generaciones suben prioridad.
 * Usa clave dedicada (no interfiere con memoria creativa existente).
 * Delega a memoria-local.js si expone getStyleUsageCounter/recordStyleUse.
 */
function _getStyleUsageScore(style) {
  try {
    if (typeof getStyleUsageCounter === 'function') {
      const c = getStyleUsageCounter(MOTOR_STATE.market, MOTOR_STATE.product) || {};
      const usage = c[style] || 0;
      return Math.max(0, 100 - usage * 15);
    }
    const memKeyFn = typeof memKey === 'function' ? memKey : _memKey;
    const key = memKeyFn(['styleUsage', MOTOR_STATE.market, MOTOR_STATE.region || 'global', MOTOR_STATE.product]);
    const c = _memGetJSON(key, {}) || {};
    const usage = c[style] || 0;
    // Menos uso = score más alto (prioridad). Máx 100, mín 0.
    return Math.max(0, 100 - usage * 15);
  } catch (e) { return 50; }
}

/**
 * Registra el uso de un estilo en memoria local.
 */
function _recordStyleUse(style) {
  try {
    if (typeof recordStyleUse === 'function') { recordStyleUse(MOTOR_STATE.market, MOTOR_STATE.product, style); return; }
    const memKeyFn = typeof memKey === 'function' ? memKey : _memKey;
    const key = memKeyFn(['styleUsage', MOTOR_STATE.market, MOTOR_STATE.region || 'global', MOTOR_STATE.product]);
    const c = _memGetJSON(key, {}) || {};
    c[style] = (c[style] || 0) + 1;
    // Decaimiento: reduce todos ligeramente para que los no usados suban
    Object.keys(c).forEach(function (s) {
      c[s] = Math.max(0, c[s] - 0.1);
    });
    _memSetJSON(key, c);
  } catch (e) {}
}

function _pickWeighted(pool, weights) {
  if (!pool.length) return '';
  const total = pool.reduce(function (sum, _, i) { return sum + (weights[i] || 1); }, 0);
  let r = Math.random() * total;
  for (let i = 0; i < pool.length; i++) {
    r -= (weights[i] || 1);
    if (r <= 0) return pool[i];
  }
  return pool[pool.length - 1];
}

function resolveEstilos(audsPerKey) {
  const locks = _loadLocks(memLocksMarket(), MOTOR_STATE.product);
  const candidates = _styleCandidatesForContext();
  const fixed = {};
  const auto = [];

  K.forEach(function (k) {
    if (locks.estilo[k] && locks.estilo[k] !== 'Auto' && candidates.indexOf(locks.estilo[k]) !== -1) {
      fixed[k] = locks.estilo[k];
    } else {
      auto.push(k);
    }
  });

  if (!auto.length) return fixed;

  if (MOTOR_STATE.groupMode === 'mismo') {
    const baseAud = audsPerKey[K[0]] || 'unisex_nacional';
    const basePref = (typeof AUD_STYLE_PREF !== 'undefined' ? AUD_STYLE_PREF[baseAud] : []) || [];
    const preferred = candidates.filter(function (e) { return basePref.indexOf(_getStyleBase(e)) !== -1; });
    const pool = preferred.length ? preferred : candidates;
    const weights = pool.map(function (e) { return basePref.indexOf(_getStyleBase(e)) !== -1 ? 3 : 1; });
    const base = Object.values(fixed)[0] || _pickWeighted(pool, weights);
    auto.forEach(function (k) { fixed[k] = base; });
    return fixed;
  }

  const used = new Set(Object.values(fixed));
  const autoKeys = auto.slice();
  
  // Cuota: al menos 1 de cada 3 fichas fuera del top-3 de su audiencia
  const quotaNeeded = Math.max(1, Math.ceil(autoKeys.length / 3));
  let quotaUsed = 0;

  autoKeys.forEach(function (k, idx) {
    const aud = audsPerKey[k] || 'unisex_nacional';
    const pref = (typeof AUD_STYLE_PREF !== 'undefined' ? AUD_STYLE_PREF[aud] : []) || [];
    const top3 = pref.slice(0, 3);
    
    const isLast = idx === autoKeys.length - 1;
    const mustExplore = (quotaUsed < quotaNeeded) && (isLast || Math.random() < 0.4);
    
    // Nivel 1: bias fuerte (pref - used) - peso 3
    const biasPool = candidates.filter(function (e) {
      return pref.indexOf(_getStyleBase(e)) !== -1 && !used.has(e);
    });
    // Nivel 2: exploración (candidates - used - bias) - peso 2
    const explorePool = candidates.filter(function (e) {
      return !used.has(e) && biasPool.indexOf(e) === -1;
    });
    // Nivel 3: garantía cola larga (candidates - used) - peso 1 + score uso
    const fallbackPool = candidates.filter(function (e) { return !used.has(e); });

    let pick;
    if (mustExplore && explorePool.length) {
      // Forzar exploración: elegir de explorePool con peso por score de uso
      const weights = explorePool.map(function (e) { return 2 + _getStyleUsageScore(e) / 25; });
      pick = _pickWeighted(explorePool, weights);
      quotaUsed++;
    } else if (biasPool.length && Math.random() < 0.7) {
      // 70% bias hacia pref de audiencia
      const weights = biasPool.map(function (e) { return 3; });
      pick = _pickWeighted(biasPool, weights);
    } else if (explorePool.length) {
      // Exploración normal
      const weights = explorePool.map(function (e) { return 2 + _getStyleUsageScore(e) / 50; });
      pick = _pickWeighted(explorePool, weights);
      if (!biasPool.length) quotaUsed++;
    } else if (fallbackPool.length) {
      // Garantía cola larga
      const weights = fallbackPool.map(function (e) { return 1 + _getStyleUsageScore(e) / 100; });
      pick = _pickWeighted(fallbackPool, weights);
    } else {
      // Fallback total (no debería pasar)
      pick = _pick(candidates);
    }

    fixed[k] = pick;
    used.add(pick);
    _recordStyleUse(pick);
  });
  return fixed;
}
function resolveTextImageModes(estilos, audsPerKey) {
  const locks = _loadLocks(memLocksMarket(), MOTOR_STATE.product);
  const MODES = {
    SOLO_TEXTO: 'TIPO 1 · Solo texto',
    TEXTO_DOMINANTE: 'TIPO 2 · Texto dominante',
    BALANCEADO: 'TIPO 3 · Balanceado',
    OBJETO_DOMINANTE: 'TIPO 4 · Objeto dominante'
  };
  const result = {};
  const auto = [];

  K.forEach(function (k) {
    if (locks.jerarquia[k] && locks.jerarquia[k] !== 'Auto' && MODES[locks.jerarquia[k]]) {
      result[k] = locks.jerarquia[k];
    } else {
      auto.push(k);
    }
  });

  if (!auto.length) return result;

  const words = ((MOTOR_STATE.message || MOTOR_STATE.concept || '').trim().match(/\S+/g) || []).length;

  auto.forEach(function (k) {
    const available = Object.keys(MODES).filter(function (x) {
      return Object.values(result).indexOf(x) === -1;
    });
    if (!available.length) {
      result[k] = 'BALANCEADO';
      return;
    }

    const score = { SOLO_TEXTO: 0, TEXTO_DOMINANTE: 0, BALANCEADO: 0, OBJETO_DOMINANTE: 0 };
    if (words <= 3) { score.SOLO_TEXTO += 2; score.TEXTO_DOMINANTE += 1; }
    else if (words >= 8) { score.OBJETO_DOMINANTE += 2; score.BALANCEADO += 1; score.SOLO_TEXTO -= 4; }

    const productBias = _PRODUCT_BIAS[MOTOR_STATE.product] || {};
    (productBias.hierarchy || []).forEach(function (x, i) { score[x] = (score[x] || 0) + (i === 0 ? 3 : 1); });
    const audHierarchy = (typeof AUD_HIERARCHY_PREF !== 'undefined' ? AUD_HIERARCHY_PREF[audsPerKey[k]] : []) || [];
    audHierarchy.forEach(function (x, i) { score[x] = (score[x] || 0) + (i === 0 ? 2 : 1); });

    const ranked = available.map(function (x) {
      return { x: x, s: (score[x] || 0) + Math.random() * 0.3 };
    }).sort(function (a, b) { return b.s - a.s; });

    result[k] = ranked[0].x;
  });

  return result;
}

/* --- Pool de objetos --- */
function dominioEfectivo() {
  // 1) Dominio fijado a mano manda siempre.
  if (MOTOR_STATE.dominio && MOTOR_STATE.dominio !== 'auto') return MOTOR_STATE.dominio;
  // 2) "Familia de la imagen" elegida a mano en modo variación (#domImagen).
  if (MOTOR_STATE.workflowMode === 'variation' && MOTOR_STATE.domImagen && MOTOR_STATE.domImagen !== 'Auto') {
    return MOTOR_STATE.domImagen;
  }
  // 3) Detección automática del concepto/mensaje.
  return MOTOR_STATE.dominioDetectado && MOTOR_STATE.dominioDetectado !== 'auto' ? MOTOR_STATE.dominioDetectado : null;
}

function isGospelMarket() { return MOTOR_STATE.market === 'gospel_es' || MOTOR_STATE.market === 'gospel_en'; }
function isColombiaMarket() { return MOTOR_STATE.market === 'colombia'; }
function isGlobalMarket() { return MOTOR_STATE.market === 'global_en' || MOTOR_STATE.market === 'global_es' || MOTOR_STATE.market === 'anglo'; }

function _marketSubnicheIds() {
  try {
    if (typeof getSubnicheIdsForMarket !== 'function') return [];
    return getSubnicheIdsForMarket(MOTOR_STATE.market, 'evergreen', MOTOR_STATE.region)
      .concat(getSubnicheIdsForMarket(MOTOR_STATE.market, 'temporada', MOTOR_STATE.region));
  } catch (e) { return []; }
}

function _normalizeTxt(s) {
  return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/* Subnicho elegido por el usuario, o detectado del concepto+mensaje
   RESTRINGIDO a los subnichos del mercado activo.
   Antes, con subnicho 'Auto' el pool era solo OBJECT_BANK_COMMON (20 objetos)
   en todos los mercados: por eso salían siempre los mismos objetos. */
function effectiveSubniche() {
  if (MOTOR_STATE.subniche && MOTOR_STATE.subniche !== 'auto') return MOTOR_STATE.subniche;

  // Mercado de un solo subnicho (gospel): no depende de la detección por
  // keywords. Antes, un concepto en otro idioma devolvía null y el pool
  // quedaba VACÍO (0 objetos) porque gospel no admite el banco común.
  const ids = _marketSubnicheIds();
  const uniq = ids.filter(function (v, i) { return ids.indexOf(v) === i; });
  if (uniq.length === 1) return uniq[0];

  const t = _normalizeTxt(MOTOR_STATE.concept) + ' ' + _normalizeTxt(MOTOR_STATE.message);
  if (!t.trim()) return null;

  let best = null, bestScore = 0;
  ids.forEach(function (id) {
    let kws = [];
    if (typeof getKeywordsForSubniche === 'function') kws = getKeywordsForSubniche(id) || [];
    if (!kws.length && typeof POD_SUBNICHES !== 'undefined' && POD_SUBNICHES[id] && POD_SUBNICHES[id].keywords) {
      kws = POD_SUBNICHES[id].keywords;
    }
    let score = 0;
    kws.forEach(function (kw) { if (kw && t.indexOf(_normalizeTxt(kw)) !== -1) score++; });
    if (score > bestScore) { bestScore = score; best = id; }
  });
  return bestScore > 0 ? best : null;
}

/* Subnicho que corresponde a un dominio elegido, en el idioma/mercado activo.
   dominios.js mapeaba los 9 dominios no-gospel a subnichos colombianos *_col
   (quemado): OFICIO en Global apuntaba a oficios_emprendimiento_col. */
function subnicheForDominio(dom) {
  if (!dom || typeof POD_DOMINIOS_COMERCIAL === 'undefined') return null;
  const d = POD_DOMINIOS_COMERCIAL[dom] || POD_DOMINIOS_STREET[dom];
  if (!d) return null;
  if (isGospelMarket()) return null;
  if (isColombiaMarket() || (!isGlobalMarket() && MOTOR_STATE.market === 'diaspora_col')) {
    return d.subniche_col || d.subniche || null;
  }
  return d.subniche_global || null;
}

/* Regiones cuyo banco (getBankForSubniche usa la REGIÓN) está en inglés.
   Si el mercado no declara idioma ('auto'), hay que inferirlo por la misma
   región o el banco común quedaba en español junto a un subnicho en inglés
   (mercado "custom": pool con 20 objetos ES + 4 EN). */
const _EN_BANK_REGIONS = ['global', 'us', 'uk', 'ca', 'au', 'anglo', 'universal_en'];

function _commonBankForMarket() {
  let lang = null;
  try {
    if (typeof getMarket === 'function') lang = (getMarket(MOTOR_STATE.market) || {}).language || null;
  } catch (e) {}
  if (!lang || lang === 'auto') {
    lang = _EN_BANK_REGIONS.indexOf(MOTOR_STATE.region) !== -1 ? 'en' : 'es';
  }
  if (lang === 'en') return _OBJECT_BANK_COMMON_EN;
  return _OBJECT_BANK_COMMON;
}

function getObjectPool() {
  let pool = [];
  const dom = dominioEfectivo();
  const gospel = isGospelMarket();
  const sub = effectiveSubniche();

  // 1) Dominio: banco propio del mercado. Gospel usa sus 12 dominios doctrinales;
  //    no-gospel usa el subnicho del dominio YA RESUELTO PARA EL MERCADO.
  if (dom) {
    try {
      if (gospel && typeof getDominiosGospel === 'function') {
        const g = getDominiosGospel(MOTOR_STATE.market) || {};
        if (g[dom] && Array.isArray(g[dom].objetos) && g[dom].objetos.length) {
          pool = g[dom].objetos.slice();
        }
      } else if (!gospel) {
        const domSub = subnicheForDominio(dom);
        if (domSub && typeof getBankForSubniche === 'function' && _marketSubnicheIds().indexOf(domSub) !== -1) {
          pool = getBankForSubniche(domSub, MOTOR_STATE.region, MOTOR_STATE.market);
        }
      }
    } catch (e) {}
  }

  // 2) Subnicho (elegido o detectado): solo si pertenece al mercado activo
  if (!pool.length && sub && typeof getBankForSubniche === 'function') {
    let allowed = true;
    const ids = _marketSubnicheIds();
    if (ids.length && ids.indexOf(sub) === -1) allowed = false;
    if (allowed) {
      if (gospel && sub !== 'gospel_es' && sub !== 'gospel_en') allowed = false;
      if (!gospel && (sub === 'gospel_es' || sub === 'gospel_en')) allowed = false;
    }
    if (allowed) pool = getBankForSubniche(sub, MOTOR_STATE.region, MOTOR_STATE.market);
  }

  // Red de seguridad: gospel NO concatena el banco común, así que un pool
  // vacío salía con objetos "—" en las 3 fichas. Siempre queda su banco propio.
  if (gospel && !pool.length && typeof getBankForSubniche === 'function') {
    const gid = MOTOR_STATE.market === 'gospel_en' ? 'gospel_en' : 'gospel_es';
    try { pool = getBankForSubniche(gid, MOTOR_STATE.region, MOTOR_STATE.market) || []; } catch (e) {}
  }

  const personalObjs = _getPersonalObjects(MOTOR_STATE.market, sub || 'auto');
  pool = pool.concat(personalObjs);
  // Banco común genérico: PROHIBIDO en gospel (mezclaba secular con doctrinal y
  // hacía predominar gospel en otros). Y en mercados EN va el común en inglés:
  // OBJECT_BANK_COMMON está íntegramente en español y se filtraba al pool EN.
  if (!gospel) pool = pool.concat(_commonBankForMarket());

  return [...new Set(pool.filter(Boolean))];
}

/* --- Construcción de candidato --- */
/* Elegir un valor de eje sin repetir el de las variantes anteriores de ESTE
   candidato. Las preferencias (sesgo de audiencia/producto) son sesgo, no
   candado: si el sesgo ya se agotó, se amplía al pool completo. Sin esto,
   formaSimbolo salía siempre de los 2 valores de formaPref de una misma
   audiencia compartida â†’ jamás había 3 valores distintos â†’ ejesOk=false
   siempre â†’ generateSet() nunca marcaba passed=true (comprobado: 0/3000). */
function _pickFresh(biasPool, fullPool, used) {
  const bias = (biasPool || []).filter(function (x) { return used.indexOf(x) === -1; });
  if (bias.length) return _pick(bias);
  const full = (fullPool || []).filter(function (x) { return used.indexOf(x) === -1; });
  if (full.length) return _pick(full);
  const fallback = (biasPool && biasPool.length) ? biasPool : (fullPool || []);
  return _pick(fallback);
}

function buildCandidate(audsPerKey) {
  const estilos = resolveEstilos(audsPerKey);
  const hierarchyPerKey = resolveTextImageModes(estilos, audsPerKey);
  const objectPool = getObjectPool();
  const isVar = MOTOR_STATE.workflowMode === 'variation';
  const conservarSimb = isVar && !!MOTOR_STATE.imageReference && MOTOR_STATE.variationOptions.simbolo === 'conservar';
  const conservarPaleta = isVar && !!MOTOR_STATE.imageReference && MOTOR_STATE.variationOptions.paleta === 'conservar';
  const textosImagen = isVar && !!MOTOR_STATE.imageReference && MOTOR_STATE.variationOptions.textos === 'conservar_palabras';
  const textosMensaje = isVar && MOTOR_STATE.variationOptions.textos === 'mismo_mensaje';

  const set = {};
  const usedThisSet = new Set();
  const usedAxes = { layout: [], tipografia: [], formaSimbolo: [], tratamiento: [], integracionTexto: [] };

  K.forEach(function (k) {
    const v = {};
    v.estilo = estilos[k];
    v.audiencia = audsPerKey[k];
    v.jerarquiaVisual = hierarchyPerKey[k];

    // Objeto
    if (v.jerarquiaVisual === 'SOLO_TEXTO') {
      v.objeto = 'SIN OBJETO — composición tipográfica pura';
    } else if (conservarSimb) {
      v.objeto = '(símbolo de la imagen REDIBUJADO: misma función simbólica; prohibido copiar silueta)';
    } else {
      let obj, g = 0;
      do {
        obj = _pick(objectPool);
        g++;
      } while (usedThisSet.has(obj) && g < 30);
      v.objeto = obj || '—';
    }
    usedThisSet.add(v.objeto);

    // Pools de dirección artística
    const styleBase = _getStyleBase(v.estilo);
    const sp = _STYLE_POOLS[styleBase] || {};

    v.arquitectura = _pick(sp.arquitectura || _POOLS.arquitectura || ['composición central']);
    v.composicion = _pick(sp.composicion || _POOLS.composicion || ['central']);
    v.textoPrincipal = _pick(sp.textoPrincipal || ['título principal con peso visual']);

    if (textosImagen) {
      v.textoApoyo = '(conservar literalmente las palabras secundarias de la imagen)';
      v.textoTerciario = '(conservar referencia legible si existe)';
    } else if (textosMensaje) {
      v.textoApoyo = '(mantener la misma idea secundaria; reformular sin añadir)';
      v.textoTerciario = '(conservar referencia si existe; no inventar)';
    } else {
      v.textoApoyo = _pick(sp.textoApoyo || _TEXTO_FALLBACK_SECULAR.textoApoyo || ['texto de apoyo con peso']);
      v.textoTerciario = _pick(sp.textoTerciario || _TEXTO_FALLBACK_SECULAR.textoTerciario || ['dato de serie legible']);
    }

    v.tecnica = _pick(sp.tecnica || ['técnica mixta']);
    v.relacion = _pick(sp.relacion || ['texto y símbolo integrados']);

    // Decisiones estructurales
    const productBias = _PRODUCT_BIAS[MOTOR_STATE.product] || {};
    const _rawAud = _AUD_PROFILES[v.audiencia] || {};
    const _LP = (typeof AUD_LAYOUT_PREF !== 'undefined' ? AUD_LAYOUT_PREF : {})[v.audiencia] || [];
    const _SP = (typeof AUD_STYLE_PREF !== 'undefined' ? AUD_STYLE_PREF : {})[v.audiencia] || [];
    const audProfile = {
      tipoPref: _rawAud.tipoPref || [],
      formaPref: _rawAud.formaPref || [],
      tratPref: _rawAud.tratPref || [],
      layoutPref: _rawAud.layoutPref || _LP,
      modoCol: _rawAud.modoCol || [],
      stylePref: _SP
    };

    const layoutBias = (productBias.layout || []).concat(audProfile.layoutPref || []);
    v.layout = _pickFresh(layoutBias, _LAYOUTS, usedAxes.layout);
    usedAxes.layout.push(v.layout);

    const tipoBias = (audProfile.tipoPref || []).concat(_STYLE_TIPO_PREF[styleBase] || []);
    v.tipografia = _pickFresh(tipoBias, _TIPOS, usedAxes.tipografia);
    usedAxes.tipografia.push(v.tipografia);

    const formaBias = audProfile.formaPref || [];
    v.formaSimbolo = _pickFresh(formaBias, _FORMAS, usedAxes.formaSimbolo);
    usedAxes.formaSimbolo.push(v.formaSimbolo);

    const tratBias = (productBias.trat || []).concat(audProfile.tratPref || []);
    v.tratamiento = _pickFresh(tratBias, _TRATAMIENTOS, usedAxes.tratamiento);
    usedAxes.tratamiento.push(v.tratamiento);

    v.integracionTexto = _pickFresh(_INTEGRACION, _INTEGRACION, usedAxes.integracionTexto);
    usedAxes.integracionTexto.push(v.integracionTexto);
    v.distribucionTexto = _pick(_POOLS.distribucionTexto || ['texto integrado al símbolo']);
    v.jerarquia = _pick(_POOLS.jerarquia || ['Balanceado']);
    const productDensity = productBias.density || [];
    const audienceDensity = (typeof AUD_DENSITY_PREF !== 'undefined' ? AUD_DENSITY_PREF[v.audiencia] : []) || [];
    const compatibleDensity = productDensity.filter(function (x) { return audienceDensity.indexOf(x) !== -1; });
    const densityPool = compatibleDensity.length ? compatibleDensity : (productDensity.length ? productDensity : (audienceDensity.length ? audienceDensity : (_POOLS.densidad || ['Balanced'])));
    v.densidad = _pick(densityPool);
    v.negativeSpace = _pick(_POOLS.negativeSpace || ['aire alrededor del motivo']);
    v.funcionSimbolica = _pick(_POOLS.funcionSimbolica || ['Emblema de identidad']);
    v.intencionEmocional = _pick(_POOLS.intencionEmocional || ['Certeza silenciosa']);

    v.placement = _PLACEMENT[MOTOR_STATE.product] || _PLACEMENT['CAMISETA SOFT'] || 'pecho centrado';
    v.escalaProducto = productBias.scale || 'escala adecuada al producto';

    // Paleta
    if (conservarPaleta) {
      v.paleta = '(conservar tonos de la imagen)';
      v.familiaColor = '(paleta de la imagen)';
      v._esquema = null;
    } else {
      const colorPref = _STYLE_COLOR_PREF[styleBase] || Object.keys(_COLOR_FAMILIES);
      const fam = _pick(colorPref);
      const palList = _COLOR_FAMILIES[fam] || ['#14141A'];
      const pal = _pick(palList);
      const preferredModes = (_AUD_PROFILES[v.audiencia] || {}).modoCol || [];
      const modePool = _COLOR_MODES.filter(function (m) { return preferredModes.indexOf(m) !== -1; });
      const modo = _pick(modePool.length ? modePool : _COLOR_MODES);
      const esquema = _hexScheme(pal, modo);
      v.paleta = pal + ' — fondo ' + esquema.bg + ' · dominante ' + esquema.dom + ' · acento ' + esquema.acc + ' · tinta ' + esquema.ink + ' (modo: ' + modo + ')';
      v.familiaColor = fam;
      v._esquema = esquema;
    }

    // Pertinencia medida con preferencias declaradas de audiencia y producto.
    const audStylePref = (typeof AUD_STYLE_PREF !== 'undefined' ? AUD_STYLE_PREF[v.audiencia] : []) || [];
    const audHierarchy = (typeof AUD_HIERARCHY_PREF !== 'undefined' ? AUD_HIERARCHY_PREF[v.audiencia] : []) || [];
    const audDensity = (typeof AUD_DENSITY_PREF !== 'undefined' ? AUD_DENSITY_PREF[v.audiencia] : []) || [];
    const audChecks = [];
    if (audStylePref.length) audChecks.push(audStylePref.indexOf(styleBase) !== -1);
    if (audProfile.tipoPref.length) audChecks.push(audProfile.tipoPref.indexOf(v.tipografia) !== -1);
    if (audProfile.formaPref.length) audChecks.push(audProfile.formaPref.indexOf(v.formaSimbolo) !== -1);
    if (audProfile.tratPref.length) audChecks.push(audProfile.tratPref.some(function (x) { return String(v.tratamiento).startsWith(x); }));
    if (audProfile.layoutPref.length) audChecks.push(audProfile.layoutPref.some(function (x) { return String(v.layout).startsWith(x); }));
    if (audHierarchy.length) audChecks.push(audHierarchy.indexOf(v.jerarquiaVisual) !== -1);
    if (audDensity.length) audChecks.push(audDensity.indexOf(v.densidad) !== -1);
    const modeMatch = String(v.paleta).match(/\(modo:\s*([^)]+)\)/);
    const preferredModes = audProfile.modoCol || [];
    if (preferredModes.length) audChecks.push(!!modeMatch && preferredModes.indexOf(modeMatch[1]) !== -1);
    v.fitAudiencia = audChecks.length
      ? Math.round(100 * audChecks.filter(Boolean).length / audChecks.length)
      : 0;

    const productChecks = [];
    if ((productBias.layout || []).length) productChecks.push(productBias.layout.some(function (x) { return String(v.layout).startsWith(x); }));
    if ((productBias.trat || []).length) productChecks.push(productBias.trat.some(function (x) { return String(v.tratamiento).startsWith(x); }));
    if ((productBias.density || []).length) productChecks.push(productBias.density.indexOf(v.densidad) !== -1);
    if ((productBias.hierarchy || []).length) productChecks.push(productBias.hierarchy.indexOf(v.jerarquiaVisual) !== -1);
    v.fitProducto = productChecks.length
      ? Math.round(100 * productChecks.filter(Boolean).length / productChecks.length)
      : 0;

    set[k] = v;
  });

  return set;
}

/* --- Scoring y selección --- */
function scoreSet(set) {
  const fields = ['estilo', 'layout', 'tipografia', 'formaSimbolo', 'tratamiento', 'integracionTexto', 'objeto', 'familiaColor'];
  const pairs = [[0, 1], [0, 2], [1, 2]];
  let diversity = 0;

  pairs.forEach(function (pair) {
    let matches = 0;
    fields.forEach(function (f) {
      if (set[K[pair[0]]][f] === set[K[pair[1]]][f]) matches++;
    });
    diversity += (fields.length - matches);
  });

  const maxDiv = pairs.length * fields.length;
  const dPct = Math.round(diversity / maxDiv * 100);

  const estilos = [...new Set(K.map(function (k) { return set[k].estilo; }))];
  const familias = [...new Set(K.map(function (k) { return set[k].familiaColor; }))];
  const objs = K.filter(function (k) { return set[k].jerarquiaVisual !== 'SOLO_TEXTO'; }).map(function (k) { return set[k].objeto; });
  const objUnique = new Set(objs).size === objs.length;

  const fitAudMin = Math.min.apply(null, K.map(function (k) { return set[k].fitAudiencia || 0; }));
  const fitProdMin = Math.min.apply(null, K.map(function (k) { return set[k].fitProducto || 0; }));

  return {
    diversity: dPct,
    estilos: estilos,
    familias: familias,
    objUnique: objUnique,
    fitAudienciaMin: fitAudMin,
    fitProductoMin: fitProdMin,
    total: dPct * 2 + (estilos.length === 3 ? 30 : 0) + (objUnique ? 20 : -50) + fitAudMin * 0.5 + fitProdMin * 0.5
  };
}

/* --- Loop de generación --- */
let LAST_RESULT = null;
function memLocksMarket() {
  try { return MOTOR_STATE.market + '|' + MOTOR_STATE.region; } catch (e) { return MOTOR_STATE.market; }
}
function memPatternMarket() {
  var d = 'auto';
  try { d = dominioEfectivo() || MOTOR_STATE.subniche || 'auto'; } catch (e) {}
  return MOTOR_STATE.market + '|' + MOTOR_STATE.region + '|' + d;
}
/* Conflicto de memoria visual: ¿alguna variante repite un patrón ya usado en
   este mercado/producto? Antes solo se avisaba DESPUÉS de elegir (el anti-
   repetición no servía de nada). Ahora es condición de aceptación y solo se
   evalúa cuando el resto de controles ya pasó. */
function _patternConflictsOf(cand) {
  let bad = 0;
  K.forEach(function (k) {
    const pattern = {
      estilo: _getStyleBase(cand[k].estilo),
      formaSimbolo: cand[k].formaSimbolo,
      tratamiento: String(cand[k].tratamiento).split(':')[0].trim(),
      layout: String(cand[k].layout).split(':')[0].trim(),
      familiaColor: cand[k].familiaColor
    };
    const c = _findPatternConflicts(pattern, memPatternMarket(), MOTOR_STATE.product);
    if (!c || !c.ok) bad++;
  });
  return bad;
}

function generateSet() {
  readStateFromDOM();
  const audsPerKey = resolveAudiences();

  let best = null, bestScore = null, bestTotal = -1e9;          // mejor de todos (fallback)
  let bestOk = null, bestOkScore = null, bestOkTotal = -1e9;    // mejor que pasa TODOS los controles

  for (let i = 0; i < 3000; i++) {
    const cand = buildCandidate(audsPerKey);
    const m = scoreSet(cand);

    const ejesOk = new Set(K.map(function (k) { return cand[k].layout; })).size === 3
      && new Set(K.map(function (k) { return cand[k].tipografia; })).size === 3
      && new Set(K.map(function (k) { return cand[k].formaSimbolo; })).size === 3
      && new Set(K.map(function (k) { return cand[k].integracionTexto; })).size === 3
      && new Set(K.map(function (k) { return cand[k].tratamiento; })).size === 3;

    const pertinenciaOk = m.fitAudienciaMin >= 50 && m.fitProductoMin >= 40;
    const estilosOk = MOTOR_STATE.groupMode === 'mismo'
      ? m.estilos.length === 1
      : m.estilos.length === 3;
    const ok = m.diversity >= 55 && estilosOk && m.objUnique && ejesOk && pertinenciaOk
      && _patternConflictsOf(cand) === 0;

    // Rankings SEPARADOS: antes un candidato rechazado subía bestTotal y
    // bloqueaba a los válidos (passed quedaba false aunque hubiera válidos).
    if (m.total > bestTotal) { bestTotal = m.total; best = cand; bestScore = m; }
    if (ok && m.total > bestOkTotal) { bestOkTotal = m.total; bestOk = cand; bestOkScore = m; }
  }

  let passed = !!bestOk;
  if (bestOk) { best = bestOk; bestScore = bestOkScore; }

  if (!best) {
    const statusEl = document.getElementById('status');
    if (statusEl) statusEl.innerHTML = '<span class="bad">No se logró ningún candidato válido. Reintenta.</span>';
    return null;
  }

  // Anti-repetición por patrón visual
  K.forEach(function (k) {
    const pattern = {
      estilo: _getStyleBase(best[k].estilo),
      formaSimbolo: best[k].formaSimbolo,
      tratamiento: String(best[k].tratamiento).split(':')[0].trim(),
      layout: String(best[k].layout).split(':')[0].trim(),
      familiaColor: best[k].familiaColor
    };
    const conflict = _findPatternConflicts(pattern, memPatternMarket(), MOTOR_STATE.product);
    if (!conflict.ok) {
      // Si hay conflicto, intentar regenerar esa ficha (simplificado: aceptar con advertencia)
      console.warn('[Motor] Conflicto de patrón en ' + N[K.indexOf(k)] + ': ' + conflict.maxMatches + ' ejes coincidentes');
    }
    _recordPattern(best[k], memPatternMarket(), MOTOR_STATE.product, { serie: MOTOR_STATE.serie, subniche: MOTOR_STATE.subniche });
  });

  // Guardar objetos usados
  const historyKey = _makeHistoryKey({
    market: MOTOR_STATE.market + '|' + MOTOR_STATE.region + '|' + (dominioEfectivo() || 'auto'),
    subniche: MOTOR_STATE.subniche,
    product: MOTOR_STATE.product,
    mode: MOTOR_STATE.workflowMode,
    serie: MOTOR_STATE.serie,
    concept: MOTOR_STATE.concept
  });
  const usedObjs = K.filter(function (k) { return best[k].jerarquiaVisual !== 'SOLO_TEXTO'; }).map(function (k) { return best[k].objeto; });
  _addUsedObjects(historyKey, usedObjs);

  LAST_RESULT = { set: best, score: bestScore, passed: passed };
  try { window.LAST_RESULT = LAST_RESULT; } catch (e) {}
  try { window.V = best; } catch (e) {} // Puente para el revisor IA (ia-revisor.js lee window.V con fichas A/B/C).
  return LAST_RESULT;
}

/* --- Patrón repetido por producto (solo mochila/bolso/funda con template) --- */
function _activeTemplateSafe() {
  try {
    if (typeof getActiveTemplate === 'function') return getActiveTemplate(MOTOR_STATE.product);
  } catch (e) {}
  return null;
}

function _patronScale() {
  const map = {
    'MOCHILA': 'motivo pequeño-mediano (panel y bolsillo)',
    'TOTE BAG': 'motivo mediano (cara frontal amplia)',
    'FUNDA MÓVIL': 'motivo pequeño (trasera reducida)'
  };
  return map[MOTOR_STATE.product] || 'motivo mediano';
}

function _patronAplicacion(tpl, placementFallback) {
  if (tpl) {
    const usar = (tpl.zonas || []).filter(function (z) { return z.uso === 'usar' || z.uso === 'opcional'; }).map(function (z) { return z.label; }).join(', ');
    const excluir = (tpl.zonas || []).filter(function (z) { return z.uso === 'excluir'; }).map(function (z) { return z.label; }).join(', ');
    let s = 'repetir en ' + (usar || 'zonas de uso');
    if (excluir) s += '; excluir ' + excluir;
    s += ' (template ' + tpl.nombre + ')';
    return s;
  }
  return 'repetir en ' + (placementFallback || MOTOR_STATE.product) + ' (sin template; sube la plantilla en el editor para mochila/bolso/funda)';
}

/* --- Formateo de prompt --- */
function formatPrompt(result) {
  if (!result || !result.set) return '';
  const set = result.set;
  const dense = MOTOR_STATE.fmtDense;
  const isVar = MOTOR_STATE.workflowMode === 'variation';

  // Directivas de idioma y cultura
  let langDir = '';
  if (typeof getLanguageDirective === 'function') {
    langDir = getLanguageDirective(MOTOR_STATE.market, MOTOR_STATE.language);
  }
  let cultDir = '';
  if (typeof getCulturalDirective === 'function') {
    cultDir = getCulturalDirective(MOTOR_STATE.market);
  }
  let legalDir = '';
  if (typeof getLegalDirective === 'function') {
    legalDir = getLegalDirective(MOTOR_STATE.market, MOTOR_STATE.marketplace);
  }

  // Product-specific rules
  let productRule = _PRODUCT_RULES[MOTOR_STATE.product] || '';
  if (MOTOR_STATE.product === 'GORRA') {
    const capRules = {
      auto: 'Auto: usa silueta simple y pocos detalles; no afirmes que el arte esta validado para produccion.',
      bordado: 'ACABADO: BORDADO. Usa formas solidas, contornos gruesos, pocos colores, espacios amplios; evita degradados, lineas finas y microtexto. La viabilidad final depende de la plantilla del proveedor.',
      parche: 'ACABADO: PARCHE. Usa silueta compacta, contorno claro y areas separables; evita microtexto y detalles finos.',
      impresion: 'ACABADO: IMPRESION. Permite mas detalle que el bordado, manteniendo contraste y lectura en el panel curvo.'
    };
    productRule += ' ' + capRules[MOTOR_STATE.capApplication || 'auto'];
  }
  const mockupRule = typeof getMockupRule === 'function' ? getMockupRule(MOTOR_STATE.product) : '';
  const supportsPattern = ['MOCHILA', 'TOTE BAG', 'FUNDA MÓVIL'].indexOf(MOTOR_STATE.product) !== -1;
  const isPatron = MOTOR_STATE.designMode === 'patron' && !isVar && supportsPattern;
  const tplActive = _activeTemplateSafe();
  let o = '';
  if (isVar) {
    const image = MOTOR_STATE.imageReference;
    const analysis = MOTOR_STATE.imageAnalysis;
    const hasAnalysis = !!(image && analysis);
    o += '/VARIATION - TRES DIRECCIONES NUEVAS (01A · 01B · 01C)\n';
    o += 'MODO: variacion guiada | MERCADO: ' + MOTOR_STATE.market + ' | PRODUCTO: ' + MOTOR_STATE.product + '\n';
    o += 'ESTILOS: ' + K.map(function (k) { return N[K.indexOf(k)] + ' ' + set[k].estilo; }).join(' · ') + '\n';
    if (hasAnalysis) {
      o += 'REFERENCIA: imagen analizada en el generador. Este texto no contiene el archivo: adjuntalo tambien en la IA de imagen. No inventes detalles ausentes del analisis.\n';
      o += 'ANALISIS CONFIRMADO: concepto ' + (analysis.concepto || 'sin dato') + '; texto visible ' + (analysis.mensaje_visible || 'no detectado') + '; simbolo ' + (analysis.simbolo_descripcion || 'sin dato') + '; funcion ' + (analysis.funcion_simbolica || 'sin dato') + '; esencia ' + (analysis.esencia_a_conservar || 'sin dato') + '.\n';
    } else if (image) {
      o += 'REFERENCIA: hay un archivo en el generador, pero no analisis confirmado. Adjunta la imagen en la IA de imagen si debe usarse; no supongas su contenido.\n';
    } else {
      o += 'REFERENCIA: NO se cargo imagen. No inventes una imagen fuente. Sigue concepto, audiencia, producto, selectores y fichas; la falta de imagen no bloquea la tarea.\n';
    }
    if (MOTOR_STATE.variationOptions.esencia) o += 'ESENCIA ESCRITA POR EL USUARIO: ' + MOTOR_STATE.variationOptions.esencia + '\n';
    o += 'SELECTORES: simbolo=' + MOTOR_STATE.variationOptions.simbolo + '; color=' + MOTOR_STATE.variationOptions.paleta + '; textos=' + MOTOR_STATE.variationOptions.textos + '.\n';
    if (MOTOR_STATE.variationOptions.simbolo === 'conservar' && !hasAnalysis) o += 'Si se adjunta referencia, conserva funcion y silueta; sin imagen no finjas conocer el simbolo.\n';
    if (MOTOR_STATE.variationOptions.paleta === 'conservar' && !hasAnalysis) o += 'Si se adjunta referencia, conserva sus colores; sin imagen usa la paleta explicita de cada ficha y no afirmes que replica la original.\n';
    if (MOTOR_STATE.variationOptions.textos === 'conservar_palabras') o += 'Conserva literalmente solo texto fuente visible en el analisis o escrito en MENSAJE/CONCEPTO; si no existe, no inventes palabras que deban conservarse.\n';
    else if (MOTOR_STATE.variationOptions.textos === 'mismo_mensaje') o += 'Conserva la idea de MENSAJE/CONCEPTO; permite reformular sin cambiar su sentido.\n';
    else o += 'Crea redaccion nueva desde CONCEPTO/MENSAJE, sin atribuirla a la imagen fuente.\n';
    o += 'ESQUEMAS: aplica las decisiones particulares de cada ficha.\n\n';
  } else if (isPatron) {
    o += '/PATRON REPETIDO — 3 VARIANTES DE TILE · MISMO CONCEPTO\n';
    o += 'MERCADO: ' + MOTOR_STATE.market + ' | PRODUCTO: ' + MOTOR_STATE.product + ' | SERIE: ' + (MOTOR_STATE.serie || '—') + '\n';
    o += 'CONCEPTO: ' + MOTOR_STATE.concept + ' | MENSAJE: ' + MOTOR_STATE.message + '\n';
    o += 'REPETICIÓN: ' + (MOTOR_STATE.repeatType || 'medio salto') + ' | CADA VARIANTE ES UN TILE DISTINTO DEL MISMO CONCEPTO\n\n';
  } else {
    o += '/CONTACTSHEET — 3 DIRECCIONES · MISMO CONCEPTO · NADA CLONADO\n';
    o += 'MERCADO: ' + MOTOR_STATE.market + ' | PRODUCTO: ' + MOTOR_STATE.product + ' | SERIE: ' + (MOTOR_STATE.serie || '—') + '\n';
    o += 'CONCEPTO: ' + MOTOR_STATE.concept + ' | MENSAJE: ' + MOTOR_STATE.message + '\n';
    o += 'ADN IGUAL EN A/B/C: concepto · mensaje · dominio · función simbólica · intención emocional\n\n';
  }

  o += 'REGLAS INQUEBRANTABLES:\n';
  if (langDir) o += 'IDIOMA: ' + langDir + '\n';
  if (cultDir) o += 'CULTURA: ' + cultDir + '\n';
  if (legalDir) o += 'LEGAL: ' + legalDir + '\n';
  if (productRule) o += 'PRODUCTO: ' + productRule + '\n';
  if (mockupRule) o += 'PRESENTACION: ' + mockupRule + '\n';
  // Template activo (banco de templates: mochila/bolso/funda). Ancla el diseño
  // a zonas reales en vez de generar a ciegas.
  if (tplActive) {
    const zones = (tplActive.zonas || []).map(function (z) {
      return z.label + ' [' + z.uso + ']';
    }).join('; ');
    o += 'TEMPLATE: ' + tplActive.nombre + ' (' + tplActive.producto + ') | ZONAS: ' + zones;
    if (tplActive.notas) o += ' | NOTAS: ' + tplActive.notas;
    o += '\n';
    if (isPatron && tplActive.imagen) o += 'REFERENCIA DE PLANTILLA: el archivo guardado en el editor no esta incluido en este texto. Adjuntalo manualmente al chat de la IA de imagen para que pueda usarlo.\n';
  }
  if (MOTOR_STATE.market === 'gospel_es' || MOTOR_STATE.market === 'gospel_en') {
    o += 'DOCTRINA: Trinitario (Padre, Hijo, Espiritu Santo) y cristocentrico. Cruz y resurreccion al centro. PROHIBIDO prosperidad magica, decretos, angeles como centro, santos mediadores, esoterismo, horoscopo, energia. Sin region: universal.\n';
  }
  if (MOTOR_STATE.market === 'colombia') {
    o += 'SANDBOX: solo bancos Colombia de la region ' + MOTOR_STATE.region + '. Prohibidos objetos, simbolos y frases gospel o globales en ingles. Cocina regional separada.\n';
  }
  if (MOTOR_STATE.market === 'global_en' || MOTOR_STATE.market === 'global_es') {
    o += 'SANDBOX: solo bancos globales del idioma del mercado. Prohibidos regionalismos colombianos y simbolismo gospel doctrinal.\n';
  }
  o += 'DIFERENCIA DURA: layout, tipografía, tratamiento, forma del símbolo y fondo NUNCA se repiten entre A/B/C.\n';
  if (isPatron) {
    o += 'PATRON: cada variante es un tile sin costura visible (bordes que empatan al repetirse); motivo y fondo definidos por ficha; repetición ' + (MOTOR_STATE.repeatType || 'medio salto') + ' en toda la superficie aplicable.\n';
    o += 'TEXTO EN TILE: mínimo o nulo; si hay texto debe funcionar repetido (sin lectura lineal, sin frase que se corte entre repeticiones).\n';
  } else {
    o += 'TEXTOS: tres niveles con peso real, todos legibles; PROHIBIDO microtexto decorativo.\n';
  }
  o += 'AUDIENCIA: cada perfil gobierna decisiones visibles. Si al quitarla el diseño no cambia, RECHAZAR.\n\n';

  K.forEach(function (k, i) {
    const v = set[k];
    o += '### ' + N[i] + ' · ' + v.estilo + ' · ' + v.audiencia + '\n';
    o += 'JERARQUÍA: ' + v.jerarquiaVisual + '\n';
    o += 'OBJETO: ' + v.objeto + '\n';
    o += 'DIRECCIÓN: ' + v.arquitectura + '; ' + v.composicion + '; ' + v.layout + '\n';
    o += 'PRODUCTO / UBICACION / ESCALA: ' + MOTOR_STATE.product + '; ' + v.placement + '; ' + v.escalaProducto + '\n';
    o += 'ARTE: ' + v.formaSimbolo + '; ' + v.tecnica + '; ' + v.tratamiento + '\n';
    o += 'TEXTO: ' + v.textoPrincipal + ' / ' + v.textoApoyo + ' / ' + v.textoTerciario + ' · ' + v.tipografia + '\n';
    o += 'PALETA: ' + v.paleta + '\n';
    o += 'COINCIDENCIA DE REGLAS DEL PROMPT (no evalua la imagen final): audiencia ' + (v.fitAudiencia || 0) + '/100; producto ' + (v.fitProducto || 0) + '/100\n';
    if (isPatron) {
      o += 'TILE: motivo (' + v.objeto + ') en estilo ' + v.estilo + ' (' + v.tecnica + ') sobre fondo ' + (v.familiaColor || 'del producto') + '\n';
      o += 'REPETICIÓN: ' + (MOTOR_STATE.repeatType || 'medio salto') + ' | ESCALA MOTIVO: ' + _patronScale() + ' | APLICACIÓN: ' + _patronAplicacion(tplActive, v.placement) + '\n';
    }
    o += '\n';
  });

  return o;
}

/* --- Renderizado de fichas en el DOM --- */
function escHtml(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
function renderCards(result) {
  const root = document.getElementById('cards');
  if (!root || !result || !result.set) return;

  root.innerHTML = '';
  const set = result.set;
  var audPool = [];
  try { audPool = getCurrentAudiencePool(); } catch (e) { audPool = _AUD_NAMES.slice(); }
  var stylePool = _styleCandidatesForContext();
  var styleLocks = _loadLocks(memLocksMarket(), MOTOR_STATE.product).estilo || {};
  var modes = ['SOLO_TEXTO', 'TEXTO_DOMINANTE', 'BALANCEADO', 'OBJETO_DOMINANTE'];

  N.forEach(function (n, i) {
    const k = K[i];
    const v = set[k];
    const card = document.createElement('div');
    card.className = 'vcard';

    let html = '<div class="vhead"><span class="vname">' + n + '</span><span class="vstyle">' + escHtml(v.estilo) + '</span>'
      + '<button class="ghost" style="margin-left:auto;font-size:14px;padding:2px 8px;" title="Re-tirar solo ' + n + '" onclick="rerollSingle(\'' + k + '\')">\u{1F3B2}</button></div>';
    html += '<div class="vbody">';

    html += '<div class="vrow"><span class="vk">Estilo</span><span class="vv"><select data-card="' + k + '" data-lock="estilo" onchange="setCardLock(this)">'
      + '<option value="Auto"' + ((!styleLocks[k] || styleLocks[k] === 'Auto') ? ' selected' : '') + '>Auto (' + escHtml(v.estilo) + ')</option>'
      + stylePool.map(function (e) { return '<option value="' + escHtml(e) + '"' + (styleLocks[k] === e ? ' selected' : '') + '>' + escHtml(e) + '</option>'; }).join('')
      + '</select></span></div>';

    html += '<div class="vrow"><span class="vk">Audiencia</span><span class="vv"><select data-card="' + k + '" data-lock="audiencia" onchange="setCardLock(this)">'
      + '<option value="Auto">Auto (' + escHtml(v.audiencia) + ')</option>'
      + audPool.map(function (a) { return '<option value="' + escHtml(a) + '"' + (a === v.audiencia ? ' selected' : '') + '>' + escHtml(a) + '</option>'; }).join('')
      + '</select></span></div>';
    html += '<div class="vrow"><span class="vk">Jerarquia</span><span class="vv"><select data-card="' + k + '" data-lock="jerarquia" onchange="setCardLock(this)">'
      + '<option value="Auto">Auto (' + escHtml(v.jerarquiaVisual) + ')</option>'
      + modes.map(function (m) { return '<option value="' + m + '"' + (m === v.jerarquiaVisual ? ' selected' : '') + '>' + m + '</option>'; }).join('')
      + '</select></span></div>';

    const rows = [
      ['Objeto', v.objeto],
      ['Dominio', dominioEfectivo() || MOTOR_STATE.subniche],
      ['Tipografia', v.tipografia],
      ['Tratamiento', v.tratamiento],
      ['Layout', String(v.layout).split(':')[0]],
      ['Forma simbolo', v.formaSimbolo],
      ['Integracion', v.integracionTexto]
    ];

    rows.forEach(function (r) {
      html += '<div class="vrow"><span class="vk">' + r[0] + '</span><span class="vv">' + escHtml(r[1]) + '</span></div>';
    });

    html += '</div>';

    if (v._esquema) {
      html += '<div class="sws">';
      ['bg', 'dom', 'acc', 'ink'].forEach(function (c) {
        html += '<span class="sw" style="background:' + v._esquema[c] + '"></span>';
      });
      html += '</div>';
    }

    html += '<div class="fit-bar" title="Compara las reglas del prompt con preferencias configuradas; no revisa la imagen generada ni certifica produccion.">Reglas del prompt: audiencia <span class="val">' + (v.fitAudiencia || 0) + '/100</span> · producto <span class="val">' + (v.fitProducto || 0) + '/100</span></div>';

    card.innerHTML = html;
    root.appendChild(card);
  });
}

function setCardLock(sel) {
  try {
    var k = sel.getAttribute('data-card');
    var field = sel.getAttribute('data-lock');
    _setLockValue(memLocksMarket(), MOTOR_STATE.product, field, k, sel.value);
    if (typeof rerollSingle === 'function') rerollSingle(k);
  } catch (e) { console.warn(e); }
}

function rerollSingle(keyLetter) {
  try {
    if (!LAST_RESULT || !LAST_RESULT.set) { crearLos3Disenos(); return; }
    readStateFromDOM();
    var auds = resolveAudiences();
    var others = K.filter(function (x) { return x !== keyLetter; });
    var best = null, bestScore = -1e9;
    for (var i = 0; i < 600; i++) {
      var cand = buildCandidate(auds);
      var v = cand[keyLetter];
      var clash = others.some(function (o) {
        var w = LAST_RESULT.set[o];
        return w.estilo === v.estilo || w.objeto === v.objeto || w.layout === v.layout || w.tipografia === v.tipografia || w.integracionTexto === v.integracionTexto;
      });
      if (clash) continue;
      var pat = { estilo: _getStyleBase(v.estilo), formaSimbolo: v.formaSimbolo, tratamiento: String(v.tratamiento).split(':')[0].trim(), layout: String(v.layout).split(':')[0].trim(), familiaColor: v.familiaColor };
      var cf = _findPatternConflicts(pat, memPatternMarket(), MOTOR_STATE.product);
      var score = (cf.ok ? 100 : 0) - cf.maxMatches * 20 + Math.random() * 5;
      if (score > bestScore) { bestScore = score; best = v; if (cf.ok) break; }
    }
    if (!best) return;
    LAST_RESULT.set[keyLetter] = best;
    try { window.LAST_RESULT = LAST_RESULT; } catch (e) {}
    try { window.V = LAST_RESULT.set; } catch (e) {}
    _recordPattern(best, memPatternMarket(), MOTOR_STATE.product, { serie: MOTOR_STATE.serie, reroll: keyLetter });
    renderCards(LAST_RESULT);
    renderGates({ score: scoreSet(LAST_RESULT.set) });
    var outEl = document.getElementById('out');
    if (outEl) outEl.value = formatPrompt(LAST_RESULT);
  } catch (e) { console.warn(e); }
}

/* --- Renderizado de gates --- */
function renderGates(result) {
  const gateEl = document.getElementById('gate');
  if (!gateEl || !result || !result.score) return;

  const m = result.score;
  let html = '';
  html += '<span class="badge ' + (m.diversity >= 55 ? 'good' : 'bad') + '">Diferencia: ' + m.diversity + '/100</span>';
  html += '<span class="badge ' + (m.fitAudienciaMin >= 50 ? 'good' : 'bad') + '">Audiencia mín: ' + m.fitAudienciaMin + '/100</span>';
  html += '<span class="badge ' + (m.fitProductoMin >= 40 ? 'good' : 'bad') + '">Producto mín: ' + m.fitProductoMin + '/100</span>';
  html += '<span class="badge ' + (m.estilos.length >= 3 ? 'good' : 'warn') + '">' + m.estilos.length + ' estilos distintos</span>';
  html += '<span class="badge ' + (m.objUnique ? 'good' : 'bad') + '">Objetos únicos</span>';
  html += '<span class="badge ' + (m.familias.length >= 3 ? 'good' : 'warn') + '">Colores distintos</span>';

  gateEl.innerHTML = html;
}

/* --- Función principal: Crear los 3 diseños --- */
function crearLos3Disenos() {
  const statusEl = document.getElementById('status');
  const outEl = document.getElementById('out');

  if (statusEl) statusEl.innerHTML = '<span class="blue">Generando 3 direcciones…</span>';

  try {
    const result = generateSet();
    if (!result) return;

    renderCards(result);
    renderGates(result);

    const prompt = formatPrompt(result);
    if (outEl) outEl.value = prompt;

    if (statusEl) {
      if (result.passed) {
        statusEl.innerHTML = '<span class="good">Listo: los tres pasan el control de diferencia · Prompt armado abajo</span>';
      } else {
        statusEl.innerHTML = '<span class="warn">Listo con advertencia: revisa el control de calidad</span>';
      }
    }
  } catch (e) {
    console.error('[Motor] Error:', e);
    if (statusEl) statusEl.innerHTML = '<span class="bad">Error al generar: ' + e.message + '</span>';
  }
}

/* --- Copiar prompt --- */
async function copiarPrompt() {
  const outEl = document.getElementById('out');
  const statusEl = document.getElementById('status');
  if (!outEl || !outEl.value) {
    if (statusEl) statusEl.innerHTML = '<span class="bad">No hay prompt. Primero crea los 3 diseños.</span>';
    return;
  }
  try {
    await navigator.clipboard.writeText(outEl.value);
    if (statusEl) statusEl.innerHTML = '<span class="good">Prompt copiado. Pégalo en tu IA de imagen.</span>';
  } catch (e) {
    try { outEl.select(); document.execCommand('copy'); if (statusEl) statusEl.innerHTML = '<span class="good">Copiado con fallback.</span>'; }
    catch (e2) { if (statusEl) statusEl.innerHTML = '<span class="bad">No se pudo copiar. Usa Ctrl+C.</span>'; }
  }
}

/* --- Limpiar fichas --- */
function limpiarFichas() {
  const cards = document.getElementById('cards');
  const gate = document.getElementById('gate');
  const out = document.getElementById('out');
  const status = document.getElementById('status');
  if (cards) cards.innerHTML = '<div class="empty-state">Genera los 3 diseños para ver las fichas aquí.</div>';
  if (gate) gate.innerHTML = '<span class="badge">Aún no hay diseños</span>';
  if (out) out.value = '';
  if (status) status.textContent = 'Fichas limpias. La memoria de patrones sigue activa.';
}

/* --- Borrar memoria (con doble confirmación) --- */
function borrarMemoria() {
  if (!_confirmDestructive('¿Borrar toda la memoria de patrones, locks e historial de este mercado/producto?', 'BORRAR')) return;
  if (typeof clearPatternMemory === 'function') clearPatternMemory(memPatternMarket(), MOTOR_STATE.product);
  if (typeof clearLocks === 'function') clearLocks(memLocksMarket(), MOTOR_STATE.product);
  limpiarFichas();
  const status = document.getElementById('status');
  if (status) status.textContent = 'Memoria borrada para este mercado/producto.';
}

/* --- Exponer funciones globales --- */
window.crearLos3Disenos = crearLos3Disenos;
window.copiarPrompt = copiarPrompt;
window.limpiarFichas = limpiarFichas;
window.borrarMemoria = borrarMemoria;
window.rerollSingle = rerollSingle;
window.setCardLock = setCardLock;
window.dominioEfectivo = dominioEfectivo;
window.memPatternMarket = memPatternMarket;
window.memLocksMarket = memLocksMarket;
window.MOTOR_STATE = MOTOR_STATE;
window.readStateFromDOM = readStateFromDOM;