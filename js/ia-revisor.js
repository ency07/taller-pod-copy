(function () {
  'use strict';

  /* ============================================================
     IA REVISOR — Barra flotante de auditoría textual
     Revisa fichas antes de generar imagen. Multi-proveedor con failover.
     NO ve imágenes. NO genera prompts. Solo audita coherencia textual.
     ============================================================ */

  var LS = window.POD_LS || {
    getItem: function () { return null; },
    setItem: function () { },
    removeItem: function () { }
  };

  var SLOTS_KEY = 'pod2_ai_slots';
  var SESSION_KEYS_KEY = 'pod2_ai_session_keys';
  var AUTO_KEY = 'pod2_ai_auto';
  var APPLY_KEY = 'pod2_ai_apply';

  var bar = null;
  var panel = null;

  /* --- Slots por defecto (modelos verificados vivos, oct-2026) --- */
  function defSlots() {
    return [
      { provider: 'Groq', model: 'openai/gpt-oss-20b', key: '', timeoutMs: 15000 },
      { provider: 'OpenRouter', model: 'google/gemini-2.5-flash', key: '', timeoutMs: 15000 },
      { provider: 'Gemini', model: 'gemini-2.5-flash', key: '', timeoutMs: 15000 }
    ];
  }

  /* Modelos muertos -> reemplazo vivo. Se aplica a slots guardados con
     modelos retirados (ej. gemini-2.0-flash, apagado el 2026-06-01). */
  var DEAD_MODELS = {
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

  function readSessionKeys() {
    try {
      if (typeof window.sessionStorage === 'undefined') return [];
      var keys = JSON.parse(window.sessionStorage.getItem(SESSION_KEYS_KEY) || 'null');
      return Array.isArray(keys) ? keys : [];
    } catch (e) { return []; }
  }

  function writeSessionKeys(slots) {
    if (typeof window.sessionStorage === 'undefined') return false;
    try {
      window.sessionStorage.setItem(SESSION_KEYS_KEY, JSON.stringify((slots || []).map(function (s) {
        return String(s && s.key || '');
      })));
      return true;
    } catch (e) { return false; }
  }

  function migrateSlots(a) {
    var changed = false;
    (a || []).forEach(function (s) {
      if (s && DEAD_MODELS[s.model]) { s.model = DEAD_MODELS[s.model]; changed = true; }
    });
    if (changed) {
      try { LS.setItem(SLOTS_KEY, JSON.stringify(a.map(function (s) { return Object.assign({}, s, { key: '' }); }))); } catch (e) { /* no crítico */ }
    }
    return a;
  }

  function getSlots() {
    try {
      var raw = LS.getItem(SLOTS_KEY);
      var a = JSON.parse(raw || 'null');
      if (!Array.isArray(a) || a.length !== 3) a = defSlots();
      // Limpia claves heredadas que se hubieran guardado antes en localStorage.
      var hasPersistedKeys = a.some(function (slot) { return !!(slot && slot.key); });
      var nonSecretSlots = a.map(function (slot) { return Object.assign({}, slot, { key: '' }); });
      nonSecretSlots = migrateSlots(nonSecretSlots);
      if (hasPersistedKeys || !raw) {
        try { LS.setItem(SLOTS_KEY, JSON.stringify(nonSecretSlots)); } catch (e) { /* preferencias pueden no persistir */ }
      }
      var sessionKeys = readSessionKeys();
      return nonSecretSlots.map(function (slot, i) {
        return Object.assign({}, slot, { key: String(sessionKeys[i] || '') });
      });
    } catch (e) {
      return defSlots();
    }
  }

  function activeSlots() {
    return getSlots().filter(function (s) {
      return s.key && s.provider && s.model;
    });
  }

  function isAuto() {
    return LS.getItem(AUTO_KEY) === '1';
  }

  function autoApply() {
    return LS.getItem(APPLY_KEY) === '1';
  }

  /* --- Endpoints --- */
  function ep(p, m) {
    if (p === 'Groq') return 'https://api.groq.com/openai/v1/chat/completions';
    if (p === 'OpenRouter') return 'https://openrouter.ai/api/v1/chat/completions';
    if (p === 'Gemini') return 'https://generativelanguage.googleapis.com/v1beta/models/' + encodeURIComponent(m) + ':generateContent';
    return '';
  }

  function pJSON(t) {
    var s = String(t || '').trim();
    if (s.indexOf('```') === 0) {
      s = s.slice(3);
      var e = s.lastIndexOf('```');
      if (e > -1) s = s.slice(0, e);
    }
    if (s.slice(0, 4).toLowerCase() === 'json') s = s.slice(4);
    return JSON.parse(s.trim());
  }

  /* --- Construcción del prompt de auditoría --- */
  function vPrompt(v, label) {
    if (!v) return label + ': SIN GENERAR';

    var market = (typeof MOTOR_STATE !== 'undefined') ? MOTOR_STATE.market : 'global_en';
    var product = (typeof MOTOR_STATE !== 'undefined') ? MOTOR_STATE.product : 'CAMISETA SOFT';

    return label + ':\n' +
      'mercado: ' + market + '\n' +
      'producto: ' + product + '\n' +
      'estilo: ' + (v.estilo || '') + '\n' +
      'audiencia: ' + (v.audiencia || '') + '\n' +
      'jerarquia_texto_imagen: ' + (v.jerarquiaVisual || '') + '\n' +
      'objeto: ' + (v.objeto || '') + '\n' +
      'arquitectura: ' + (v.arquitectura || '') + '\n' +
      'layout: ' + (v.layout || '') + '\n' +
      'composicion: ' + (v.composicion || '') + '\n' +
      'forma_simbolo: ' + (v.formaSimbolo || '') + '\n' +
      'tipografia: ' + (v.tipografia || '') + '\n' +
      'tratamiento: ' + (v.tratamiento || '') + '\n' +
      'texto_principal: ' + (v.textoPrincipal || '') + '\n' +
      'texto_apoyo: ' + (v.textoApoyo || '') + '\n' +
      'texto_terciario: ' + (v.textoTerciario || '') + '\n' +
      'jerarquia: ' + (v.jerarquia || '') + '\n' +
      'distribucion_texto: ' + (v.distribucionTexto || '') + '\n' +
      'integracion_texto: ' + (v.integracionTexto || '') + '\n' +
      'paleta: ' + (v.paleta || '') + '\n' +
      'familia_color: ' + (v.familiaColor || '') + '\n' +
      'negative_space: ' + (v.negativeSpace || '') + '\n' +
      'relacion: ' + (v.relacion || '') + '\n' +
      'placement: ' + (v.placement || '') + '\n' +
      'escala_producto: ' + (v.escalaProducto || '') + '\n' +
      'funcion_simbolica: ' + (v.funcionSimbolica || '') + '\n' +
      'intencion_emocional: ' + (v.intencionEmocional || '') + '\n' +
      'fit_audiencia: ' + (v.fitAudiencia || 0) + '/100\n' +
      'fit_producto: ' + (v.fitProducto || 0) + '/100';
  }

  function sysPrompt() {
    var market = (typeof MOTOR_STATE !== 'undefined') ? MOTOR_STATE.market : 'global_en';
    var product = (typeof MOTOR_STATE !== 'undefined') ? MOTOR_STATE.product : 'CAMISETA SOFT';

    return 'Eres revisor de dirección de arte POD antes de generar la imagen. ' +
      'Solo recibes la ficha textual; NO ves la imagen final y nunca afirmes que la imagen cumple. ' +
      'Mercado activo: ' + market + '. Producto: ' + product + '. ' +
      'Evalúa por separado: concepto/ADN, audiencia, producto, relación objeto-concepto y composición texto-imagen. ' +
      'La audiencia debe notarse en decisiones de estilo, tipografía, forma, layout, densidad y tono. ' +
      'El producto en escala, superficie, densidad, layout, jerarquía y placement. ' +
      'Rechaza contradicciones directas con los rechazos/contexto de audiencia. ' +
      'Rechaza el patrón título arriba + símbolo centrado + texto abajo cuando no lo justifique la arquitectura. ' +
      'No dictamines impacto visual de una imagen que no has visto. ' +
      'No cambies concepto, mensaje central, mercado, audiencia, producto, dominio, función simbólica ni intención emocional. ' +
      'Puedes proponer cambios concretos para los campos editables, incluido otro objeto solo si expresa la misma función/concepto y es compatible con la audiencia. ' +
      'En variaciones respeta literalmente la opción de conservar texto, conservar mensaje o escribir texto nuevo. ' +
      'Si los datos no permiten juzgar, declara PARCIAL y explica qué falta. ' +
      'Correcciones breves, accionables y en el registro narrativo del campo. ' +
      'No inventes referencias ni datos. ' +
      'Responde SOLO JSON: {"veredicto":"COHERENTE|PARCIAL|INCOHERENTE","problemas":["..."],"correcciones":{"campo":"valor nuevo"}}';
  }

  /* --- Llamada a un solo proveedor --- */
  async function callOne(s, sys, user) {
    var c = new AbortController();
    var t = setTimeout(function () { c.abort(); }, s.timeoutMs || 12000);

    try {
      var body;

      if (s.provider === 'Gemini') {
        body = {
          contents: [{
            role: 'user',
            parts: [{ text: sys + '\n' + user }]
          }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 4096,
            responseMimeType: 'application/json'
          }
        };

        var r = await fetch(ep(s.provider, s.model), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-goog-api-key': s.key },
          body: JSON.stringify(body),
          signal: c.signal
        });

        if (!r.ok) throw new Error('HTTP ' + r.status);
        var d = await r.json();
        var txt = d.candidates && d.candidates[0] && d.candidates[0].content &&
          d.candidates[0].content.parts && d.candidates[0].content.parts[0] &&
          d.candidates[0].content.parts[0].text;
        if (!txt) throw new Error('respuesta vacía');
        return pJSON(txt);

      } else {
        body = {
          model: s.model,
          messages: [
            { role: 'system', content: sys },
            { role: 'user', content: user }
          ],
          max_tokens: 4096,
          temperature: 0.2,
          response_format: { type: 'json_object' }
        };

        var r2 = await fetch(ep(s.provider, s.model), {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + s.key,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body),
          signal: c.signal
        });

        if (!r2.ok) throw new Error('HTTP ' + r2.status);
        var d2 = await r2.json();
        var t2 = d2.choices && d2.choices[0] && d2.choices[0].message && d2.choices[0].message.content;
        if (!t2) throw new Error('respuesta vacía');
        return pJSON(t2);
      }
    } finally {
      clearTimeout(t);
    }
  }

  /* --- Failover entre proveedores --- */
  async function failover(sys, user) {
    var slots = activeSlots();
    if (!slots.length) throw new Error('sin claves configuradas');

    var last = null;
    for (var i = 0; i < slots.length; i++) {
      try {
        return { res: await callOne(slots[i], sys, user), via: slots[i].provider };
      } catch (e) {
        last = e;
        console.warn('[IA-Revisor] ' + slots[i].provider + ' falló:', e.message);
      }
    }
    throw last || new Error('todos fallaron');
  }

  /* --- Campos corregibles --- */
  var CORR = [
    'objeto', 'disposicionObjetos', 'arquitectura', 'composicion', 'layout',
    'formaSimbolo', 'tipografia', 'textoPrincipal', 'textoApoyo', 'textoTerciario',
    'jerarquia', 'densidad', 'distribucionTexto', 'negativeSpace', 'relacion',
    'integracionTexto', 'tratamiento', 'placement', 'escalaProducto'
  ];

  /* --- Auditoría principal --- */
  async function runAudit() {
    var V = (typeof window.V !== 'undefined') ? window.V : null;
    var K = ['A', 'B', 'C'];
    var N = ['01A', '01B', '01C'];

    if (!V || !V.A || !V.B || !V.C) {
      tellStatus('Primero crea los 3 diseños.');
      return;
    }

    if (!activeSlots().length) {
      openPanel();
      tellStatus('Configura al menos una clave de IA para usar el revisor.');
      return;
    }

    var apply = autoApply();
    var fixes = 0;
    var verds = [];

    tellStatus('Revisando fichas con IA...');

    for (var i = 0; i < 3; i++) {
      var v = V[K[i]];
      if (!v) continue;

      try {
        var concept = document.getElementById('concept') ? document.getElementById('concept').value : '';
        var message = document.getElementById('message') ? document.getElementById('message').value : '';

        var out = await failover(
          sysPrompt(),
          'CONCEPTO: ' + concept + '\nMENSAJE: ' + message + '\nAudita:\n' + vPrompt(v, N[i]) + '\nDevuelve el JSON. Si es COHERENTE, correcciones vacías.'
        );

        var res = out.res;
        verds.push((res.veredicto || '?') + '·' + out.via);

        v._ia = { verdict: res.veredicto || 'SIN_DATOS', via: out.via };
        v._iafix = v._iafix || {};

        if (res.correcciones) {
          Object.entries(res.correcciones).forEach(function (en) {
            var f = en[0], val = en[1];

            if (CORR.indexOf(f) > -1 && typeof val === 'string' && val.length > 3 && v[f] !== val) {
              if (apply) {
                if (!v._iafix[f]) v._iafix[f] = { old: v[f] };
                v[f] = val;
                fixes++;
              } else {
                if (!v._ia.sug) v._ia.sug = [];
                v._ia.sug.push({ campo: f, val: val });
              }
            }
          });
        }
      } catch (e) {
        console.error('[IA-Revisor] Auditoría ' + N[i] + ':', e.message);
      }
    }

    // Re-renderizar si existe la función
    if (typeof render === 'function') render();

    var done = (fixes > 0 ? ' · ' + fixes + ' ajuste(s) aplicado(s)' : '') +
      (verds.length ? ' · veredictos: ' + verds.join(' / ') : '');

    tellStatus('Auditoría completada' + done);
  }

  function tellStatus(msg) {
    var st = document.getElementById('status');
    if (st) {
      st.textContent = String(msg == null ? '' : msg);
      st.className = 'blue';
    }
  }

  /* --- Panel de configuración --- */
  function escA(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function slotHTML(s, i) {
    var pr = ['Groq', 'OpenRouter', 'Gemini'].map(function (p) {
      return '<option' + (s.provider === p ? ' selected' : '') + '>' + p + '</option>';
    }).join('');

    return '<div class="aiSlot" data-i="' + i + '">' +
      '<div class="sh"><span>Prioridad ' + (i + 1) + (i === 0 ? ' · principal' : ' · respaldo') + '</span>' +
      '<div style="display:flex;gap:4px">' +
      '<button class="ghost" data-move="up" data-i="' + i + '"' + (i === 0 ? ' disabled' : '') + ' title="Subir prioridad" style="font-size:11px;padding:3px 8px">↑</button>' +
      '<button class="ghost" data-move="down" data-i="' + i + '"' + (i === 2 ? ' disabled' : '') + ' title="Bajar prioridad" style="font-size:11px;padding:3px 8px">↓</button>' +
      '<button class="ghost" data-clear="' + i + '" style="font-size:11px;padding:3px 8px">Vaciar clave</button>' +
      '</div></div>' +
      '<div class="frow"><div><label>Proveedor</label><select data-f="provider">' + pr + '</select></div>' +
      '<div><label>Modelo</label><input data-f="model" value="' + escA(s.model) + '"></div></div>' +
      '<div class="frow"><div><label>Clave API (solo esta pestaña)</label><input data-f="key" type="password" autocomplete="off" value="' + escA(s.key) + '" placeholder="pegar clave…"></div>' +
      '<div><label>Espera</label><select data-f="timeoutMs">' +
      [8000, 10000, 12000, 15000].map(function (t) {
        return '<option value="' + t + '"' + (s.timeoutMs === t ? ' selected' : '') + '>' + (t / 1000) + 's</option>';
      }).join('') +
      '</select></div></div></div>';
  }

  function readPanelSlots() {
    return Array.prototype.map.call(panel.querySelectorAll('.aiSlot'), function (b) {
      var q = function (f) { return b.querySelector('[data-f="' + f + '"]'); };
      return {
        provider: q('provider').value,
        model: q('model').value.trim(),
        key: q('key').value.trim(),
        timeoutMs: parseInt(q('timeoutMs').value, 10) || 10000
      };
    });
  }

  function bindSlotActions() {
    panel.querySelectorAll('[data-move]').forEach(function (b) {
      b.onclick = function () {
        var arr = readPanelSlots();
        var i = parseInt(b.getAttribute('data-i'), 10);
        var j = b.getAttribute('data-move') === 'up' ? i - 1 : i + 1;
        if (j < 0 || j >= arr.length) return;
        var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
        panel.querySelector('#aiSlots').innerHTML = arr.map(slotHTML).join('');
        bindSlotActions();
      };
    });

    panel.querySelectorAll('[data-clear]').forEach(function (b) {
      b.onclick = function () {
        panel.querySelector('.aiSlot[data-i="' + b.getAttribute('data-clear') + '"] [data-f="key"]').value = '';
      };
    });
  }

  function openPanel() {
    if (panel) {
      panel.style.display = 'block';
      return;
    }

    panel = document.createElement('div');
    panel.id = 'aiPanel';
    panel.className = 'fpanel';

    var sl = getSlots();

    // Config de visión (la lee/escribe ia-analisis.js; defaults si no cargó).
    var vcfg = { provider: 'auto', geminiModel: 'gemini-3.5-flash-lite', openrouterModel: 'google/gemma-4-31b-it:free', timeoutMs: 20000 };
    try {
      if (typeof window.PODVision !== 'undefined' && window.PODVision.getVisionConfig) {
        vcfg = window.PODVision.getVisionConfig();
      } else {
        const vraw = LS.getItem('pod2_vision_cfg');
        if (vraw) vcfg = Object.assign(vcfg, JSON.parse(vraw));
      }
    } catch (e) {}
    var vprov = vcfg.provider, vtimeoutMs = vcfg.timeoutMs;
    var vgmodel = vcfg.geminiModel, vomodel = vcfg.openrouterModel;

    panel.innerHTML =
      '<div style="font-weight:700;margin-bottom:4px">Revisor con IA (opcional)</div>' +
      '<div class="hint" style="margin:0 0 6px">La IA revisa la ficha escrita antes de generar; no ve ni califica la imagen final. Prioridad 1 es el modelo principal; los demás son respaldo si el proveedor falla.</div>' +
      '<div id="aiSlots">' + sl.map(slotHTML).join('') + '</div>' +
      '<div style="font-weight:700;margin:10px 0 4px">Visión — analizar imagen</div>' +
      '<div class="hint" style="margin:0 0 6px">OpenRouter :free verificado oct-2026 (50/día). Gemini directo: serie 3.x para proyectos nuevos. Groq no tiene visión free.</div>' +
      '<div class="frow"><div><label>Proveedor visión</label><select id="ai-vprov">' +
      ['auto', 'openrouter', 'gemini'].map(function (p) {
        return '<option value="' + p + '"' + (vprov === p ? ' selected' : '') + '>' +
          (p === 'auto' ? 'Automático (el que responda)' : p === 'openrouter' ? 'OpenRouter' : 'Gemini directo') + '</option>';
      }).join('') + '</select></div>' +
      '<div><label>Espera visión</label><select id="ai-vtimeout">' +
      [15000, 20000, 30000].map(function (t) {
        return '<option value="' + t + '"' + (vtimeoutMs === t ? ' selected' : '') + '>' + (t / 1000) + 's</option>';
      }).join('') + '</select></div></div>' +
      '<div class="frow"><div><label>Modelo Gemini</label><input id="ai-vgmodel" value="' + escA(vgmodel) + '"></div>' +
      '<div><label>Modelo OpenRouter</label><input id="ai-vomodel" value="' + escA(vomodel) + '"></div></div>' +
      '<div style="display:flex;gap:6px;align-items:center;margin:0 0 8px"><button id="ai-vtest" class="ghost">Probar conexión</button><span id="ai-vstatus" class="hint" style="margin:0"></span></div>' +
      '<label style="display:flex;align-items:center;gap:6px;margin:10px 0 4px"><input type="checkbox" id="ai-auto"' + (isAuto() ? ' checked' : '') + '> Revisar automáticamente al crear</label>' +
      '<label style="display:flex;align-items:center;gap:6px;margin:0 0 8px"><input type="checkbox" id="ai-apply"' + (autoApply() ? ' checked' : '') + '> Permitir que la IA cambie fichas automáticamente</label>' +
      '<div style="display:flex;gap:6px"><button id="ai-save" class="primary" style="flex:1;padding:8px">Guardar</button><button id="ai-close" class="ghost">Cerrar</button></div>';

    document.body.appendChild(panel);
    bindSlotActions();

    panel.querySelector('#ai-save').onclick = function () {
      var arr = readPanelSlots();
      // Las claves API solo se guardan en sessionStorage; localStorage conserva configuración no secreta.
      var sessionSaved = writeSessionKeys(arr);
      LS.setItem(SLOTS_KEY, JSON.stringify(arr.map(function (s) { return Object.assign({}, s, { key: '' }); })));
      if (!sessionSaved && arr.some(function (s) { return !!s.key; })) {
        tellStatus('No se pudieron conservar las claves en esta pestaña. Revisa los permisos de almacenamiento del navegador.');
        return;
      }
      LS.setItem(AUTO_KEY, panel.querySelector('#ai-auto').checked ? '1' : '0');
      LS.setItem(APPLY_KEY, panel.querySelector('#ai-apply').checked ? '1' : '0');
      LS.setItem('pod2_vision_cfg', JSON.stringify({
        provider: panel.querySelector('#ai-vprov').value,
        geminiModel: panel.querySelector('#ai-vgmodel').value.trim() || 'gemini-3.5-flash-lite',
        openrouterModel: panel.querySelector('#ai-vomodel').value.trim() || 'google/gemma-4-31b-it:free',
        timeoutMs: parseInt(panel.querySelector('#ai-vtimeout').value, 10) || 20000
      }));

      var b = document.getElementById('aiCfgB');
      if (b) b.textContent = activeSlots().length + ' activos';
      panel.style.display = 'none';
    };

    panel.querySelector('#ai-vtest').onclick = function () {
      var st = panel.querySelector('#ai-vstatus');
      var btn = panel.querySelector('#ai-vtest');
      if (st) st.textContent = 'Probando...';
      if (btn) btn.disabled = true;
      function done(msg) {
        if (st) st.textContent = msg;
        if (btn) btn.disabled = false;
      }
      try {
        if (typeof window.testVisionConnection !== 'function') { done('Visión no cargada (ia-analisis.js).'); return; }
        window.testVisionConnection().then(function (r) {
          done((r.ok ? 'OK: ' : 'FALLO: ') + r.message);
        }).catch(function (e) {
          done('FALLO: ' + ((e && e.message) || e));
        });
      } catch (e) { done('FALLO: ' + e.message); }
    };

    panel.querySelector('#ai-close').onclick = function () {
      panel.style.display = 'none';
    };
  }

  /* --- Construcción de la barra flotante --- */
  function build() {
    bar = document.createElement('div');
    bar.id = 'aiBar';

    bar.innerHTML =
      '<div id="aiBarBody">' +
      '<button id="aiRevB" class="primary" style="font-size:12.5px;padding:8px 13px">Revisar con IA</button>' +
      '<button id="aiCfgB" class="ghost" style="font-size:12px;padding:8px 11px">' + activeSlots().length + ' activos</button>' +
      '<button id="aiMinB" class="ghost" style="font-size:12px;padding:8px 11px" title="Minimizar">—</button>' +
      '</div>' +
      '<button id="aiChipB" class="primary" style="font-size:13px;padding:8px 12px" title="Expandir">IA</button>';

    document.body.appendChild(bar);

    bar.querySelector('#aiRevB').onclick = function () {
      this.disabled = true;
      runAudit().catch(function (e) {
        tellStatus('IA: ' + e.message);
      }).finally(function () {
        var b2 = bar.querySelector('#aiRevB');
        if (b2) b2.disabled = false;
      });
    };

    bar.querySelector('#aiCfgB').onclick = openPanel;

    bar.querySelector('#aiMinB').onclick = function () {
      bar.classList.add('min');
    };

    bar.querySelector('#aiChipB').onclick = function () {
      bar.classList.remove('min');
    };

    // Auto-revisión al crear si está activada
    if (isAuto()) {
      var d = document.getElementById('btnDirector');
      if (d) {
        d.addEventListener('click', function () {
          setTimeout(function () {
            var V = (typeof window.V !== 'undefined') ? window.V : null;
            if (V && V.A && isAuto()) runAudit();
          }, 150);
        });
      }
    }
  }

  /* --- Inicialización --- */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }

  /* --- Exposición global --- */
  window.runAudit = runAudit;
  window.openAIPanel = openPanel;
  window.getAISlots = getSlots;

})();