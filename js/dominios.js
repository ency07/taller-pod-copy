'use strict';
/* ============================================================
   DOMINIOS SEMÁNTICOS — capa de banco, NO quemada en motor.
   Gospel 12 + Comercial 5 + Streetwear 4.
   El motor solo lee esta estructura. El usuario puede elegir
   dominio manualmente o dejar Auto (detección por concepto+mensaje).
   ============================================================ */

/* Cada dominio declara su subnicho POR MERCADO.
   Antes los 9 dominios no-gospel apuntaban a un único subnicho colombiano *_col
   (quemado): en Global, elegir "OFICIO" resolvía a oficios_emprendimiento_col.
   Ahora: subniche_col para Colombia/Diáspora, subniche_global para el resto.
   Los dominios sin equivalente real en el mercado quedan en null y el motor
   cae al subnicho detectado del concepto (no se inventa equivalencia). */
const POD_DOMINIOS_COMERCIAL = {
  OFICIO: { label: 'Oficio', subniche_col: 'oficios_emprendimiento_col', subniche_global: 'professions', desc: 'Trabajo, taller, emprendimiento, manos que producen.', keywords: ['oficio', 'taller', 'trabajo', 'emprende', 'negocio', 'sueldo', 'jefe', 'obrero', 'tienda'] },
  METAS: { label: 'Metas', subniche_col: 'metas_logro_col', subniche_global: 'inspirational_clean', desc: 'Disciplina, logro, constancia, superación.', keywords: ['meta', 'logro', 'disciplina', 'constancia', 'superar', 'ganar', 'esfuerzo', 'cima'] },
  COMUNIDAD: { label: 'Comunidad', subniche_col: 'comunidad_barrio_col', subniche_global: 'family_milestones', desc: 'Barrio, vecinos, ayuda mutua.', keywords: ['barrio', 'vecino', 'comunidad', 'cuadra', 'ayuda', 'junta', 'parche'] },
  VIAJE: { label: 'Viaje', subniche_col: 'viaje_ruta_col', subniche_global: 'travel_adventure', desc: 'Ruta, camino, bus, paseo, destino.', keywords: ['viaje', 'ruta', 'camino', 'bus', 'paseo', 'destino', 'carretera', 'mochila'] },
  CELEBRACION: { label: 'Celebración', subniche_col: 'celebracion_col', subniche_global: 'food_drink', desc: 'Fiesta sana, cumple, grado, reunión familiar.', keywords: ['fiesta', 'celebra', 'cumple', 'grado', 'festejo', 'reunión', 'brindis'] }
};

const POD_DOMINIOS_STREET = {
  CALLE: { label: 'Calle', subniche_col: 'calle_urbano_col', subniche_global: null, desc: 'Urbano, esquina, muro, bus, noche.', keywords: ['calle', 'esquina', 'muro', 'urbano', 'esquina', 'bus', 'noche', 'cuadra'] },
  RESISTENCIA: { label: 'Resistencia', subniche_col: 'resistencia_orgullo_col', subniche_global: null, desc: 'Orgullo, aguante, dignidad, territorio.', keywords: ['resiste', 'aguante', 'orgullo', 'digno', 'territorio', 'lucha'] },
  SONIDO: { label: 'Sonido', subniche_col: 'sonido_ritmo_urbano_col', subniche_global: 'music_fandom', desc: 'Picó, ritmo, baile, música urbana.', keywords: ['picó', 'ritmo', 'baile', 'música', 'sonido', 'perreo sano', 'champeta', 'beat'] },
  CONCRETO: { label: 'Concreto', subniche_col: 'concreto_ciudad_col', subniche_global: null, desc: 'Ciudad, edificio, gris, concreto, caos ordenado.', keywords: ['concreto', 'ciudad', 'edificio', 'gris', 'caos', 'torre', 'avenida'] }
};

function _norm(s) {
  return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function getDominiosGospel(market) {
  if (market === 'gospel_en' && window.GOSPEL_DOMINIOS_EN) return window.GOSPEL_DOMINIOS_EN;
  if (window.GOSPEL_DOMINIOS_ES) return window.GOSPEL_DOMINIOS_ES;
  return {};
}

function _dominiosComercialesParaMercado(market) {
  return market === 'colombia' || !market
    ? Object.assign({}, POD_DOMINIOS_COMERCIAL, POD_DOMINIOS_STREET)
    : Object.assign({}, POD_DOMINIOS_COMERCIAL);
}

function _subnichosYaCubiertosPorDominios(market) {
  const defs = _dominiosComercialesParaMercado(market);
  const field = market === 'colombia' || market === 'diaspora_col' ? 'subniche_col' : 'subniche_global';
  return Object.keys(defs).map(function (id) { return defs[id][field] || null; }).filter(Boolean);
}

function _getSubnichoOptions(market, region) {
  if (market === 'gospel_es' || market === 'gospel_en' || typeof getSubnicheIdsForMarket !== 'function') return [];
  let ids = [];
  try {
    ids = (getSubnicheIdsForMarket(market, 'evergreen', region) || [])
      .concat(getSubnicheIdsForMarket(market, 'temporada', region) || []);
  } catch (e) { ids = []; }
  const covered = _subnichosYaCubiertosPorDominios(market);
  return ids.filter(function (id, index) {
    if (ids.indexOf(id) !== index || covered.indexOf(id) !== -1) return false;
    const hasBank = typeof getBankForSubniche === 'function'
      ? getBankForSubniche(id, region, market).length > 0
      : !!(typeof POD_SUBNICHES !== 'undefined' && POD_SUBNICHES[id] && POD_SUBNICHES[id].bank);
    return hasBank;
  });
}

function getListaDominios(market, region) {
  if (market === 'gospel_es' || market === 'gospel_en') {
    const g = getDominiosGospel(market);
    return Object.keys(g).map(function (id) {
      return { id: id, label: id + ' — ' + (g[id].label || ''), desc: g[id].desc || '', group: 'Dominio teológico' };
    });
  }
  const base = _dominiosComercialesParaMercado(market);
  const domains = Object.keys(base).map(function (id) {
    return { id: id, label: id + ' — ' + base[id].label, desc: base[id].desc, group: 'Familias generales' };
  });
  const families = _getSubnichoOptions(market, region).map(function (id) {
    const label = typeof getSubnicheLabel === 'function' ? getSubnicheLabel(id, market) : id;
    const meta = typeof POD_SUBNICHES !== 'undefined' ? POD_SUBNICHES[id] : null;
    return { id: id, label: label, desc: (meta && meta.descripcion) || '', group: 'Familias con banco propio' };
  });
  return domains.concat(families);
}

/* Detección automática: lee concepto + mensaje, busca keywords en dominios del mercado activo. Nunca decide el motor a ciegas: si el usuario elige manual, manual manda. */
function detectarDominio(concepto, mensaje, market, region) {
  const txt = _norm((concepto || '') + ' ' + (mensaje || ''));
  if (!txt.trim()) return 'auto';

  if (market === 'gospel_es' || market === 'gospel_en') {
    const g = getDominiosGospel(market);
    let best = 'auto', bestHits = 0;
    Object.keys(g).forEach(function (id) {
      const kws = g[id].keywords || [];
      let hits = 0;
      kws.forEach(function (k) { if (txt.indexOf(_norm(k)) > -1) hits++; });
      if (hits > bestHits) { bestHits = hits; best = id; }
    });
    return bestHits > 0 ? best : 'auto';
  }

  const base = _dominiosComercialesParaMercado(market);
  let best = 'auto', bestHits = 0;
  const mappingField = market === 'colombia' || market === 'diaspora_col' ? 'subniche_col' : 'subniche_global';
  Object.keys(base).forEach(function (id) {
    let hits = 0;
    const mapped = typeof POD_SUBNICHES !== 'undefined' ? POD_SUBNICHES[base[id][mappingField]] : null;
    const keywords = (base[id].keywords || []).concat(mapped && mapped.keywords || []);
    keywords.forEach(function (k) { if (k && txt.indexOf(_norm(k)) > -1) hits++; });
    if (hits > bestHits) { bestHits = hits; best = id; }
  });
  _getSubnichoOptions(market, region).forEach(function (id) {
    const kws = typeof getKeywordsForSubniche === 'function' ? getKeywordsForSubniche(id) : [];
    let hits = 0;
    kws.forEach(function (k) { if (k && txt.indexOf(_norm(k)) > -1) hits++; });
    if (hits > bestHits) { bestHits = hits; best = id; }
  });
  return bestHits > 0 ? best : 'auto';
}

window.POD_DOMINIOS_COMERCIAL = POD_DOMINIOS_COMERCIAL;
window.POD_DOMINIOS_STREET = POD_DOMINIOS_STREET;
window.getListaDominios = getListaDominios;
window.detectarDominio = detectarDominio;
window.getDominiosGospel = getDominiosGospel;
