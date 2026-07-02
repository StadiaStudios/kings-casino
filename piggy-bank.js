(function() {
  const LOADING_SESSION_KEY = '__casino_loading_seen';

  const LOADING_DURATION = 2400;

  const style = document.createElement('style');
  style.innerHTML = `
    .casino-loading-overlay {
      position: fixed;
      inset: 0;
      background: url('resources/snapshots/banner2-pc.png') center center/cover no-repeat;
      z-index: 99999;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: flex-end;
      animation: fadeInCasinoOverlay 0.5s;
      transition: opacity 0.5s;
      min-height: 100vh;
      min-width: 100vw;
    }

    .casino-loading-banner {
      width: 100%;
      text-align: left;
      padding: 2rem 2rem 0 2rem;
      font-size: 2.2rem;
      font-weight: 700;
      color: #ffd700;
      text-shadow: 0 2px 8px #260808ad;
      letter-spacing: 2px;
      font-family: 'Fredoka', 'Arial Rounded MT Bold', Arial, sans-serif;
      display: none;
      opacity: 0.93;
    }

    .casino-loading-text {
      padding: 0 2rem 2.2rem 2rem;
      font-size: 1.2rem;
      font-family: inherit;
      color: #ffd700;
      text-shadow: 0 0 8px #26080876;
      font-weight: 600;
      opacity: 0.93;
      align-self: flex-end;
      animation: casino-blink 1.5s infinite;
    }

    @keyframes fadeInCasinoOverlay {
      from { opacity: 0 }
      to   { opacity: 1 }
    }

    @keyframes casino-blink {
      0%, 100% { opacity: .85; }
      50% { opacity: .25; }
    }

    @media (max-width: 700px) {
      .casino-loading-overlay {
        background: url('resources/snapshots/banner2-mobile.png') center center/cover no-repeat;
      }
      .casino-loading-banner {
        display: block;
        font-size: 1.28rem;
        padding-top: .8rem;
        padding-bottom: .4rem;
      }
      .casino-loading-text {
        font-size: 1.02rem;
        padding-right: 1.1rem;
        padding-bottom: 1.15rem;
      }
    }
  `;

  const desktopBanner = '♠️ KING’S CASINO ♠️';
  const mobileBanner = 'KING’S CASINO - STADIA STUDIOS';

  function createCasinoLoadingScreen() {
    if (sessionStorage.getItem(LOADING_SESSION_KEY)) return;

    const overlay = document.createElement('div');
    overlay.className = 'casino-loading-overlay';

    const banner = document.createElement('div');
    banner.className = 'casino-loading-banner';
    banner.textContent = mobileBanner;
    overlay.appendChild(banner);

    const loadingText = document.createElement('div');
    loadingText.className = 'casino-loading-text';
    loadingText.textContent = 'Loading…';
    overlay.appendChild(loadingText);

    document.body.appendChild(style);
    document.body.appendChild(overlay);

    overlay.tabIndex = -1;
    overlay.focus();

    if (window.innerWidth > 700) {
      banner.style.display = 'none';
    } else {
      banner.style.display = 'block';
    }

    overlay.addEventListener('keydown', e => {
      if (e.key === 'Escape') e.preventDefault();
    });

    setTimeout(() => {
      overlay.style.opacity = '0';
      setTimeout(() => {
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        if (style.parentNode) style.parentNode.removeChild(style);
      }, 500);
      sessionStorage.setItem(LOADING_SESSION_KEY, '1');
    }, LOADING_DURATION);
  }

  window.attachCasinoLoadingScreen = function() {
    createCasinoLoadingScreen();
  };

  if (!sessionStorage.getItem(LOADING_SESSION_KEY)) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', createCasinoLoadingScreen);
    } else {
      createCasinoLoadingScreen();
    }
  }
})();