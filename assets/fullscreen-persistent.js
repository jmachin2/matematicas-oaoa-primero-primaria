(() => {
  'use strict';

  const BTN_ID = 'globalFullscreenBtn';
  const OVERLAY_ID = 'persistentFullscreenOverlay';
  const MESSAGE_READY = 'oaoa-fullscreen-route';
  const MESSAGE_EXIT = 'oaoa-fullscreen-exit';
  let currentFrameRoute = location.pathname + location.search + location.hash;
  let overlay = null;
  let iframe = null;

  function isFramed() {
    return window.self !== window.top;
  }

  function buttonText() {
    return (isFramed() || document.fullscreenElement) ? '⛶ Salir de pantalla completa' : '⛶ Pantalla completa';
  }

  function ensureStyles() {
    if (document.getElementById('persistentFullscreenStyles')) return;
    const style = document.createElement('style');
    style.id = 'persistentFullscreenStyles';
    style.textContent = `
      .global-fs-button{
        border:2px solid #b9cedb;background:#fff;color:#17384e;border-radius:13px;
        font:900 14px/1 Arial,Helvetica,sans-serif;min-height:40px;padding:8px 12px;
        cursor:pointer;white-space:nowrap;display:inline-flex;align-items:center;justify-content:center;
      }
      .global-fs-button:hover{border-color:#469ac7;background:#eef8fc}
      #${OVERLAY_ID}{position:fixed;inset:0;z-index:2147483000;background:#fff;display:block}
      #${OVERLAY_ID} iframe{border:0;width:100%;height:100%;display:block;background:#fff}
    `;
    document.head.appendChild(style);
  }

  function findOrCreateButton() {
    ensureStyles();
    let btn = document.getElementById('fullscreenBtn') || document.getElementById(BTN_ID);
    if (!btn) {
      btn = document.createElement('button');
      btn.type = 'button';
      btn.id = BTN_ID;
      btn.className = 'global-fs-button';
      const preferredHost = document.querySelector('.brand-row') || document.querySelector('.controls') || document.body;
      preferredHost.appendChild(btn);
    }
    if (!btn.classList.contains('global-fs-button') && btn.id === BTN_ID) btn.classList.add('global-fs-button');
    btn.textContent = buttonText();
    btn.setAttribute('aria-label', buttonText().replace('⛶ ', ''));
    return btn;
  }

  function updateAllButtons() {
    const candidates = [document.getElementById('fullscreenBtn'), document.getElementById(BTN_ID)].filter(Boolean);
    candidates.forEach(btn => {
      btn.textContent = buttonText();
      btn.setAttribute('aria-label', buttonText().replace('⛶ ', ''));
    });
  }

  function normalizeRouteFromFrame() {
    try {
      return iframe?.contentWindow?.location.pathname + iframe.contentWindow.location.search + iframe.contentWindow.location.hash;
    } catch (_) {
      return currentFrameRoute;
    }
  }

  function mountFullscreenFrame() {
    if (isFramed() || overlay) return;
    currentFrameRoute = location.pathname + location.search + location.hash;
    overlay = document.createElement('div');
    overlay.id = OVERLAY_ID;
    iframe = document.createElement('iframe');
    iframe.setAttribute('title', 'Matemáticas OAOA en pantalla completa');
    iframe.setAttribute('allow', 'fullscreen');
    iframe.src = currentFrameRoute;
    overlay.appendChild(iframe);
    document.body.appendChild(overlay);
  }

  async function enterPersistentFullscreen() {
    if (isFramed()) {
      window.parent.postMessage({type: MESSAGE_EXIT}, location.origin === 'null' ? '*' : location.origin);
      return;
    }
    if (document.fullscreenElement) {
      try { await document.exitFullscreen(); } catch (_) {}
      return;
    }
    try {
      await document.documentElement.requestFullscreen();
      mountFullscreenFrame();
      updateAllButtons();
    } catch (err) {
      console.warn('No se pudo activar la pantalla completa:', err);
    }
  }

  async function exitFromFrame() {
    if (isFramed()) {
      window.parent.postMessage({type: MESSAGE_EXIT}, location.origin === 'null' ? '*' : location.origin);
      return;
    }
    if (document.fullscreenElement) {
      try { await document.exitFullscreen(); } catch (_) {}
    }
  }

  function cleanupAfterExit() {
    if (!overlay) {
      updateAllButtons();
      return;
    }
    const target = currentFrameRoute || normalizeRouteFromFrame();
    overlay.remove();
    overlay = null;
    iframe = null;
    updateAllButtons();
    const now = location.pathname + location.search + location.hash;
    if (target && target !== now) {
      location.replace(target);
    }
  }

  function onFullscreenChange() {
    if (document.fullscreenElement) {
      if (!isFramed()) mountFullscreenFrame();
    } else {
      cleanupAfterExit();
    }
    updateAllButtons();
  }

  function interceptFullscreenButton(e) {
    const target = e.target && e.target.closest ? e.target.closest('#fullscreenBtn,#' + BTN_ID) : null;
    if (!target) return;
    e.preventDefault();
    e.stopPropagation();
    if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
    if (isFramed()) exitFromFrame();
    else enterPersistentFullscreen();
  }

  function notifyParentRoute() {
    if (!isFramed()) return;
    try {
      window.parent.postMessage({
        type: MESSAGE_READY,
        route: location.pathname + location.search + location.hash
      }, location.origin === 'null' ? '*' : location.origin);
    } catch (_) {}
  }

  function onMessage(e) {
    if (!e.data) return;
    if (location.origin !== 'null' && e.origin !== location.origin) return;
    if (!isFramed() && iframe && e.source !== iframe.contentWindow) return;
    if (e.data.type === MESSAGE_READY && !isFramed()) {
      currentFrameRoute = e.data.route || currentFrameRoute;
      try { history.replaceState(history.state, '', currentFrameRoute); } catch (_) {}
    }
    if (e.data.type === MESSAGE_EXIT && !isFramed()) {
      exitFromFrame();
    }
  }

  function init() {
    ensureStyles();
    findOrCreateButton();
    document.addEventListener('click', interceptFullscreenButton, true);
    document.addEventListener('fullscreenchange', onFullscreenChange);
    window.addEventListener('message', onMessage);
    window.addEventListener('pageshow', notifyParentRoute);
    notifyParentRoute();
    updateAllButtons();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
})();
