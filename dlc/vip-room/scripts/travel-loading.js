(function () {
  const LOADING_DURATION = 2400;

  const style = document.createElement('style');
  style.innerHTML = `
    .casino-loading-overlay {
      position: fixed; inset: 0; z-index: 99999;
      background-size: cover; background-position: center;
      display: flex; flex-direction: column; justify-content: flex-end;
      animation: fadeInCasinoOverlay 0.5s; transition: opacity 0.5s;
    }
    @media (min-width: 701px) { .casino-loading-overlay { background-image: url('resources/banners/banner1.jpg'); } }
    @media (max-width: 700px) { .casino-loading-overlay { background-image: url('resources/banners/banner2-mobile.png'); } }

    .casino-loading-banner {
      width: 100%; padding: 2rem; font-size: 2.2rem; font-weight: 700;
      color: #ffd700; text-shadow: 0 2px 8px #260808ad;
    }
    .casino-loading-text {
      padding: 0 2rem 2.2rem 2rem; font-size: 1.2rem; color: #ffd700;
      font-weight: 600; animation: casino-blink 1.5s infinite;
    }
    @keyframes fadeInCasinoOverlay { from { opacity: 0 } to { opacity: 1 } }
    @keyframes casino-blink { 0%, 100% { opacity: .85; } 50% { opacity: .25; } }
  `;

  function createCasinoLoadingScreen() {
    const overlay = document.createElement('div');
    overlay.className = 'casino-loading-overlay';

    const banner = document.createElement('div');
    banner.className = 'casino-loading-banner';
    banner.textContent =
      window.innerWidth > 700
        ? '♠️ KING’S CASINO ♠️'
        : 'KING’S CASINO - VIP ROOM';

    const loadingText = document.createElement('div');
    loadingText.className = 'casino-loading-text';
    loadingText.textContent = 'Loading VIP Room DLC…';

    overlay.appendChild(banner);
    overlay.appendChild(loadingText);
    document.body.appendChild(style);
    document.body.appendChild(overlay);

    setTimeout(() => {
      overlay.style.opacity = '0';
      setTimeout(() => {
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        if (style.parentNode) style.parentNode.removeChild(style);
      }, 500);
    }, LOADING_DURATION);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createCasinoLoadingScreen);
  } else {
    createCasinoLoadingScreen();
  }
})();