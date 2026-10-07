(function () {
  'use strict';

  /* ============================================================
     SYNC SUPABASE — Sincronización opcional entre dispositivos
     Usa mergeMemoryObjects de memoria-local.js para fusionar.
     Requiere: tabla pod_project_sync con RLS (SQL al final).
     NO usa service_role. Solo anon key pública.
     ============================================================ */

  var LS = window.POD_LS || {
    getItem: function () { return null; },
    setItem: function () { },
    removeItem: function () { }
  };

  function escAttr(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  var CFG_KEY = 'pod2_supabase_cfg';
  var panel = null;
  var cloudClient = null;
  var cloudUser = null;
  var libPromise = null;

  /* Proyecto por defecto (clave anon PÚBLICA: diseñada para ir en frontend).
     El panel permite sobrescribirla por navegador; si se vacía, se vuelve aquí. */
  var DEFAULT_CFG = {
    url: 'https://vlhidhlnarhbkygauobp.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsaGlkaGxuYXJoYmt5Z2F1b2JwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwMDczMjUsImV4cCI6MjEwNTU4MzMyNX0.NpYRgJA5YJl9T0RDXto_Hb2t63U61RtzbEKomMJ4hKI'
  };

  /* --- Configuración --- */
  function getCfg() {
    var saved = {};
    try {
      saved = JSON.parse(LS.getItem(CFG_KEY) || '{}') || {};
    } catch (e) {
      saved = {};
    }
    return {
      url: saved.url || DEFAULT_CFG.url,
      anonKey: saved.anonKey || DEFAULT_CFG.anonKey
    };
  }

  function saveCfg(cfg) {
    LS.setItem(CFG_KEY, JSON.stringify(cfg || {}));
  }

  function validCfg(cfg) {
    return cfg &&
      String(cfg.url || '').indexOf('https://') === 0 &&
      String(cfg.anonKey || '').length >= 20;
  }

  /* --- Carga dinámica de Supabase JS --- */
  function loadLib() {
    if (window.supabase) return Promise.resolve();
    if (libPromise) return libPromise;

    libPromise = new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
      s.onload = resolve;
      s.onerror = function () {
        reject(new Error('No se pudo cargar Supabase JS. Comprueba tu conexión.'));
      };
      document.head.appendChild(s);
    });

    return libPromise;
  }

  async function getClient() {
    var cfg = getCfg();
    if (!validCfg(cfg)) {
      throw new Error('Configura Project URL y clave anon antes de sincronizar.');
    }
    await loadLib();
    if (!cloudClient) {
      cloudClient = window.supabase.createClient(cfg.url, cfg.anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: false
        }
      });
    }
    return cloudClient;
  }

  /* --- Auth --- */
  async function signIn(email, password) {
    var c = await getClient();
    var r = await c.auth.signInWithPassword({ email: email, password: password });
    if (r.error) throw r.error;
    cloudUser = r.data.user;
    return cloudUser;
  }

  async function signUp(email, password) {
    var c = await getClient();
    var r = await c.auth.signUp({ email: email, password: password });
    if (r.error) throw r.error;
    if (r.data.user && r.data.session) {
      cloudUser = r.data.user;
    }
    return r;
  }

  async function signOut() {
    var c = await getClient();
    await c.auth.signOut();
    cloudUser = null;
  }

  async function getSessionUser() {
    try {
      var c = await getClient();
      var s = await c.auth.getSession();
      cloudUser = (s.data.session && s.data.session.user) || null;
      return cloudUser;
    } catch (e) {
      return null;
    }
  }

  /* --- Sincronización y fusión --- */
  async function mergeAndSync(onStatus) {
    var status = onStatus || function () { };

    var c = await getClient();
    var user = await getSessionUser();
    if (!user) throw new Error('Inicia sesión antes de sincronizar.');

    status('Leyendo copia de nube...');
    var q = await c
      .from('pod_project_sync')
      .select('payload, updated_at')
      .eq('user_id', user.id)
      .maybeSingle();

    if (q.error) throw q.error;

    var remotePayload = (q.data && q.data.payload) || {};
    var localPayload = (typeof exportMemoryObject === 'function')
      ? exportMemoryObject()
      : {};

    status('Fusionando memoria local y nube...');
    var merged = (typeof mergeMemoryObjects === 'function')
      ? mergeMemoryObjects(localPayload, remotePayload)
      : Object.assign({}, remotePayload, localPayload);

    status('Guardando copia fusionada en nube...');
    var up = await c
      .from('pod_project_sync')
      .upsert(
        {
          user_id: user.id,
          payload: merged,
          updated_at: new Date().toISOString()
        },
        { onConflict: 'user_id' }
      );

    if (up.error) throw up.error;

    // Aplicar localmente
    Object.keys(merged).forEach(function (k) {
      if (String(k).indexOf('POD2|') === 0) {
        LS.setItem(k, merged[k]);
      }
    });

    status('Sincronización completada. Memoria fusionada.');
    return merged;
  }

  /* --- UI: Panel de memoria y nube --- */
  function statusMsg(txt, isError) {
    var el = panel ? panel.querySelector('#syncStatus') : null;
    if (el) {
      el.textContent = txt || '';
      el.style.color = isError ? 'var(--bad)' : 'var(--mut)';
    }
  }

  function updateAuthUI() {
    if (!panel) return;
    var loginBox = panel.querySelector('#authBox');
    var userBox = panel.querySelector('#userBox');
    if (loginBox) loginBox.style.display = cloudUser ? 'none' : 'block';
    if (userBox) userBox.style.display = cloudUser ? 'block' : 'none';
    var userEmail = panel.querySelector('#userEmail');
    if (userEmail && cloudUser) userEmail.textContent = cloudUser.email || '';
    var syncBtn = panel.querySelector('#btnSync');
    if (syncBtn) syncBtn.disabled = !cloudUser;
  }

  function buildPanel() {
    if (panel) {
      panel.style.display = 'block';
      updateAuthUI();
      return;
    }

    panel = document.createElement('div');
    panel.className = 'fpanel';
    panel.style.cssText = 'right:20px;bottom:80px;z-index:320;';

    var cfg = getCfg();

    panel.innerHTML =
      '<div style="font-weight:700;margin-bottom:6px;">Memoria y sincronización</div>' +

      '<div class="hint" style="margin-bottom:10px;">Exporta/importa local sin internet, o sincroniza entre dispositivos con Supabase.</div>' +

      '<label>Exportar / Importar local</label>' +
      '<div style="display:flex;gap:6px;margin:6px 0 12px;">' +
      '<button id="btnDownload" class="ghost" style="flex:1;font-size:12px;">Descargar JSON</button>' +
      '<button id="btnCopyJSON" class="ghost" style="flex:1;font-size:12px;">Copiar JSON</button>' +
      '</div>' +
      '<textarea id="importTxt" rows="3" placeholder="Pega aquí un JSON exportado para importarlo..." style="font-size:11px;"></textarea>' +
      '<div style="display:flex;gap:6px;margin:6px 0 14px;">' +
      '<button id="btnImport" class="ghost" style="flex:1;font-size:12px;">Importar y fusionar</button>' +
      '</div>' +

      '<hr style="border:none;border-top:1px solid var(--line);margin:10px 0;">' +

      '<label>Sincronización Supabase (opcional)</label>' +
      '<div class="hint" style="margin:4px 0 6px;">Proyecto ya incluido: solo entra con tu correo. Solo cambia esto si usas otro proyecto.</div>' +
      '<label style="margin-top:6px;">Project URL</label>' +
      '<input id="cfgUrl" placeholder="https://tu-proyecto.supabase.co" value="' + escAttr(cfg.url || '') + '">' +
      '<label style="margin-top:6px;">Clave anon pública</label>' +
      '<input id="cfgKey" type="password" placeholder="Nunca uses service_role" value="' + escAttr(cfg.anonKey || '') + '">' +
      '<div style="display:flex;gap:6px;margin:8px 0;">' +
      '<button id="btnSaveCfg" class="ghost" style="flex:1;font-size:12px;">Guardar config</button>' +
      '</div>' +

      '<div id="authBox">' +
      '<label style="margin-top:8px;">Correo</label>' +
      '<input id="authEmail" type="email" placeholder="tu correo">' +
      '<label style="margin-top:6px;">Contraseña</label>' +
      '<input id="authPass" type="password" placeholder="mínimo 8 caracteres">' +
      '<div style="display:flex;gap:6px;margin:8px 0;">' +
      '<button id="btnLogin" class="primary" style="flex:1;font-size:12px;">Entrar</button>' +
      '<button id="btnSignup" class="ghost" style="flex:1;font-size:12px;">Crear cuenta</button>' +
      '</div>' +
      '</div>' +

      '<div id="userBox" style="display:none;">' +
      '<div class="hint" style="margin:8px 0;">Sesión activa: <span id="userEmail"></span></div>' +
      '<div style="display:flex;gap:6px;margin:8px 0;">' +
      '<button id="btnSync" class="primary" style="flex:1;font-size:12px;">Sincronizar y fusionar</button>' +
      '<button id="btnLogout" class="ghost" style="font-size:12px;">Salir</button>' +
      '</div>' +
      '</div>' +

      '<div id="syncStatus" class="hint" style="margin-top:10px;"></div>' +

      '<div style="margin-top:12px;text-align:right;">' +
      '<button id="btnClosePanel" class="ghost" style="font-size:12px;">Cerrar</button>' +
      '</div>';

    document.body.appendChild(panel);

    // Exportar
    panel.querySelector('#btnDownload').onclick = function () {
      if (typeof downloadMemoryFile === 'function') {
        downloadMemoryFile('taller-pod-memoria.json');
        statusMsg('Archivo descargado.');
      }
    };

    panel.querySelector('#btnCopyJSON').onclick = function () {
      if (typeof exportMemoryJSON === 'function') {
        var txt = exportMemoryJSON();
        try {
          navigator.clipboard.writeText(txt).then(function () {
            statusMsg('JSON copiado al portapapeles.');
          });
        } catch (e) {
          statusMsg('No se pudo copiar. Usa descargar.', true);
        }
      }
    };

    // Importar
    panel.querySelector('#btnImport').onclick = function () {
      var txt = panel.querySelector('#importTxt').value || '';
      if (!txt.trim()) {
        statusMsg('Pega un JSON antes de importar.', true);
        return;
      }
      try {
        var result = importMemoryJSON(txt, 'merge');
        statusMsg('Importado: ' + result.restored + ' claves fusionadas.');
        panel.querySelector('#importTxt').value = '';
        setTimeout(function () { location.reload(); }, 1200);
      } catch (e) {
        statusMsg('JSON inválido: ' + e.message, true);
      }
    };

    // Config
    panel.querySelector('#btnSaveCfg').onclick = function () {
      var url = panel.querySelector('#cfgUrl').value.trim();
      var key = panel.querySelector('#cfgKey').value.trim();
      if (url.indexOf('https://') !== 0 || key.length < 20) {
        statusMsg('URL y clave anon inválidas. No uses service_role.', true);
        return;
      }
      saveCfg({ url: url, anonKey: key });
      cloudClient = null; // reset para usar nueva config
      statusMsg('Configuración guardada en este navegador.');
    };

    // Auth
    panel.querySelector('#btnLogin').onclick = async function () {
      var email = panel.querySelector('#authEmail').value.trim();
      var pass = panel.querySelector('#authPass').value;
      if (!email || !pass) {
        statusMsg('Escribe correo y contraseña.', true);
        return;
      }
      statusMsg('Entrando...');
      try {
        await signIn(email, pass);
        statusMsg('Sesión iniciada.');
        panel.querySelector('#authPass').value = '';
        updateAuthUI();
      } catch (e) {
        statusMsg(e.message || String(e), true);
      }
    };

    panel.querySelector('#btnSignup').onclick = async function () {
      var email = panel.querySelector('#authEmail').value.trim();
      var pass = panel.querySelector('#authPass').value;
      if (!email || pass.length < 8) {
        statusMsg('Correo válido y contraseña de al menos 8 caracteres.', true);
        return;
      }
      statusMsg('Creando cuenta...');
      try {
        var r = await signUp(email, pass);
        if (r.data.user && r.data.session) {
          statusMsg('Cuenta creada y sesión iniciada.');
          panel.querySelector('#authPass').value = '';
          updateAuthUI();
        } else {
          statusMsg('Cuenta creada. Confirma tu correo y luego entra.');
        }
      } catch (e) {
        statusMsg(e.message || String(e), true);
      }
    };

    panel.querySelector('#btnLogout').onclick = async function () {
      try {
        await signOut();
        statusMsg('Sesión cerrada.');
        updateAuthUI();
      } catch (e) {
        statusMsg(e.message || String(e), true);
      }
    };

    // Sync
    panel.querySelector('#btnSync').onclick = async function () {
      this.disabled = true;
      try {
        await mergeAndSync(statusMsg);
        setTimeout(function () { location.reload(); }, 1000);
      } catch (e) {
        statusMsg('Error al sincronizar: ' + (e.message || String(e)) + '. Verifica supabase-sync.sql, RLS y conexión.', true);
        this.disabled = false;
      }
    };

    panel.querySelector('#btnClosePanel').onclick = function () {
      panel.style.display = 'none';
    };

    updateAuthUI();
  }

  function openPanel() {
    buildPanel();
  }

  /* --- Wire al botón de topbar --- */
  function wireTopbar() {
    var btn = document.getElementById('btnMemory');
    if (btn) {
      btn.addEventListener('click', openPanel);
    }
  }

  /* --- Inicialización --- */
  function init() {
    wireTopbar();
    // Intentar recuperar sesión silenciosamente
    getSessionUser().then(function (user) {
      if (user) {
        cloudUser = user;
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* --- Exposición global --- */
  window.openMemoryPanel = openPanel;

  /* ============================================================
     SQL PARA CREAR LA TABLA EN SUPABASE (ejecutar una sola vez)
     Copia esto en Supabase > SQL Editor y ejecuta.
     ============================================================

     create table if not exists public.pod_project_sync (
       user_id uuid primary key references auth.users (id) on delete cascade,
       payload jsonb not null default '{}'::jsonb,
       updated_at timestamptz not null default now()
     );

     alter table public.pod_project_sync enable row level security;

     revoke all on table public.pod_project_sync from anon;
     revoke all on table public.pod_project_sync from authenticated;
     grant select, insert, update on table public.pod_project_sync to authenticated;

     drop policy if exists "POD users read own sync" on public.pod_project_sync;
     create policy "POD users read own sync"
       on public.pod_project_sync for select to authenticated
       using ((select auth.uid()) = user_id);

     drop policy if exists "POD users create own sync" on public.pod_project_sync;
     create policy "POD users create own sync"
       on public.pod_project_sync for insert to authenticated
       with check ((select auth.uid()) = user_id);

     drop policy if exists "POD users update own sync" on public.pod_project_sync;
     create policy "POD users update own sync"
       on public.pod_project_sync for update to authenticated
       using ((select auth.uid()) = user_id)
       with check ((select auth.uid()) = user_id);

     ============================================================ */

})();