'use strict';
/* PODNav — contexto compartido entre las 4 vistas (Taller, Editor de bancos,
   Motor de lenguajes, Sistema matriz). Funciona en local y en Vercel porque
   las 4 páginas viven en la misma origin y comparten el mismo localStorage.
   Clave única: POD2|ui|context (mismo prefijo que js/memoria-local.js).
   La barra de navegación va escrita en cada HTML (sin depender de JS). */
(function () {
  var CTX_KEY = 'POD2|ui|context';

  function read() {
    try {
      var raw = window.localStorage.getItem(CTX_KEY);
      var o = raw ? JSON.parse(raw) : null;
      return (o && typeof o === 'object') ? o : {};
    } catch (e) {
      return {};
    }
  }

  function write(patch) {
    var cur = read();
    if (patch && typeof patch === 'object') {
      Object.keys(patch).forEach(function (k) {
        if (patch[k] !== undefined) cur[k] = patch[k];
      });
    }
    try {
      cur.updatedAt = new Date().toISOString();
    } catch (e) { /* sin fecha, igual se guarda */ }
    try {
      window.localStorage.setItem(CTX_KEY, JSON.stringify(cur));
    } catch (e) { /* almacenamiento lleno o bloqueado: no rompe la página */ }
    return cur;
  }

  /* Clave de contexto -> ids de campo según la página (solo se toca si existe). */
  var FIELDS = [
    ['market', ['market', 'selMarket']],
    ['region', ['region']],
    ['concepto', ['concepto', 'concept']],
    ['mensaje', ['mensaje', 'message']],
    ['audiencia', ['audiencia']],
    ['serie', ['serie']]
  ];

  function fieldValue(id) {
    var el = document.getElementById(id);
    if (!el || typeof el.value !== 'string') return undefined;
    return el.value;
  }

  /* Guarda el estado visible actual. Enganchado a pagehide: cubre TODAS las salidas.
     Los selects mandan; MOTOR_STATE solo respalda cuando no hay campo visible. */
  function capture() {
    var patch = {};
    var fromDom = {};
    FIELDS.forEach(function (pair) {
      for (var i = 0; i < pair[1].length; i++) {
        var v = fieldValue(pair[1][i]);
        if (v !== undefined && v !== '') { fromDom[pair[0]] = v; patch[pair[0]] = v; break; }
      }
    });
    if (window.MOTOR_STATE) {
      if (MOTOR_STATE.market && !fromDom.market) patch.market = MOTOR_STATE.market;
      if (MOTOR_STATE.region && !fromDom.region) patch.region = MOTOR_STATE.region;
    }
    return write(patch);
  }

  /* Rellena solo campos VACÍOS desde el contexto. Nunca pisa trabajo del usuario. */
  function prefill() {
    var ctx = read();
    FIELDS.forEach(function (pair) {
      var cv = ctx[pair[0]];
      if (cv === undefined || cv === null || cv === '') return;
      for (var i = 0; i < pair[1].length; i++) {
        var el = document.getElementById(pair[1][i]);
        if (!el || typeof el.value !== 'string' || el.value !== '') continue;
        if (el.tagName === 'SELECT') {
          var ok = false;
          for (var j = 0; j < el.options.length; j++) {
            if (el.options[j].value === String(cv)) { ok = true; break; }
          }
          if (!ok) continue;
        }
        el.value = cv;
        try {
          el.dispatchEvent(new Event('change', { bubbles: true }));
        } catch (e) { /* evento no crítico */ }
        break;
      }
    });
    return ctx;
  }

  function arm() {
    window.addEventListener('pagehide', function () { capture(); });
  }

  if (typeof document !== 'undefined' && document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', arm);
  } else if (typeof document !== 'undefined') {
    arm();
  }

  window.PODNav = {
    CTX_KEY: CTX_KEY,
    loadContext: read,
    saveContext: write,
    capture: capture,
    prefill: prefill
  };
})();
