(function () {
    const RAIN_ACTIVE_KEY = 'kings-casino-rain-active';
    const CHIP_KEY = 'kings-casino-chips';

    let lastRainActive = false;
    let lastChipsValue = parseInt(localStorage.getItem(CHIP_KEY), 10) || 100;
    let starFieldElement = null;

    function playHorseRaceSFX(result) {
        let audio;
        if (result === "win") {
            audio = new Audio('sfx/hr-win.mp3');
            audio.volume = 0.42;
        } else if (result === "lose") {
            audio = new Audio('sfx/hr-lose.mp3');
            audio.volume = 0.24;
        }
        if (audio) audio.play();
    }
    window.playHorseRaceSFX = playHorseRaceSFX;

    function injectVisualStyles() {
        if (document.getElementById('bc-screen-vfx-styles')) return;
        const style = document.createElement('style');
        style.id = 'bc-screen-vfx-styles';
        style.textContent = `
            .starfield-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: radial-gradient(circle at 50% 30%, #0b112c 0%, #02040a 90%);
                z-index: 2;
                opacity: 0;
                pointer-events: none;
                transition: opacity 1.5s ease-in-out;
            }
            .starfield-overlay.active {
                opacity: 1;
            }
            .vfx-star {
                position: absolute;
                background-color: #ffffff;
                border-radius: 50%;
                pointer-events: none;
                box-shadow: 0 0 5px #ffffff;
            }
            @keyframes starTwinkle {
                0%, 100% { opacity: 0.2; transform: scale(0.7); }
                50% { opacity: 1; transform: scale(1.2); }
            }
            .rush-popup-banner {
                position: fixed;
                top: 45%;
                left: 50%;
                transform: translate(-50%, -50%) scale(0.3);
                z-index: 10000;
                font-family: 'Fredoka', sans-serif;
                font-size: 3.5rem;
                font-weight: 900;
                text-align: center;
                text-transform: uppercase;
                letter-spacing: 2px;
                background: linear-gradient(to bottom, #ffffff 15%, #f1c40f 45%, #d35400 85%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                filter: drop-shadow(0 0 12px rgba(241, 196, 15, 0.6)) 
                        drop-shadow(0 6px 0 #7e5109) 
                        drop-shadow(0 15px 20px rgba(0,0,0,0.8));
                pointer-events: none;
                opacity: 0;
                animation: rushAnimateInAndOut 3.2s cubic-bezier(0.175, 0.885, 0.32, 1.25) forwards;
            }
            @keyframes rushAnimateInAndOut {
                0% { transform: translate(-50%, -50%) scale(0.3); opacity: 0; }
                8% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
                12% { transform: translate(-50%, -50%) scale(1.0); opacity: 1; }
                85% { transform: translate(-50%, -50%) scale(1.0); opacity: 1; filter: brightness(1); }
                92% { filter: brightness(1.6); opacity: 1; }
                100% { transform: translate(-50%, -35%) scale(0.8); opacity: 0; }
            }
            .vfx-coin {
                position: fixed;
                top: -50px;
                z-index: 10001;
                pointer-events: none;
                animation: coinFallAnimation 1.4s linear forwards;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .vfx-coin-img {
                width: 100%;
                height: 100%;
                object-fit: contain;
                display: block;
                pointer-events: none;
                user-select: none;
            }
            @keyframes coinFallAnimation {
                0% {
                    transform: translateY(0) rotate(0deg);
                    opacity: 1;
                }
                80% {
                    opacity: 1;
                }
                100% {
                    transform: translateY(112vh) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    function createStarField() {
        const viewport = document.querySelector('.game-viewport');
        if (!viewport || document.querySelector('.starfield-overlay')) return;

        starFieldElement = document.createElement('div');
        starFieldElement.className = 'starfield-overlay';

        const STAR_COUNT = 45;
        for (let i = 0; i < STAR_COUNT; i++) {
            const star = document.createElement('div');
            star.className = 'vfx-star';

            const size = Math.random() * 2 + 1;
            const xCoord = Math.random() * 100;
            const yCoord = Math.random() * 100;
            const animDuration = Math.random() * 2.5 + 1.2;
            const animDelay = Math.random() * 2;

            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.left = `${xCoord}%`;
            star.style.top = `${yCoord}%`;
            star.style.animation = `starTwinkle ${animDuration}s infinite ease-in-out ${animDelay}s`;

            starFieldElement.appendChild(star);
        }
        viewport.insertBefore(starFieldElement, viewport.firstChild);
    }

    function triggerRushPopup() {
        const oldPopup = document.querySelector('.rush-popup-banner');
        if (oldPopup) oldPopup.remove();

        const banner = document.createElement('div');
        banner.className = 'rush-popup-banner';
        banner.innerText = 'RUSH MINUTE';
        document.body.appendChild(banner);

        setTimeout(() => { if (banner) banner.remove(); }, 3200);
    }

    function triggerCoinFall() {
        const COIN_COUNT = 30;
        for (let i = 0; i < COIN_COUNT; i++) {
            setTimeout(() => {
                const coin = document.createElement('div');
                coin.className = 'vfx-coin';

                const img = document.createElement('img');
                img.src = 'resources/items/chip.png';
                img.className = 'vfx-coin-img';

                const size = Math.random() * 12 + 18;
                img.style.width = `${size}px`;
                img.style.height = `${size}px`;

                coin.appendChild(img);

                const leftPos = Math.random() * 100;
                const duration = Math.random() * 0.6 + 0.8;

                coin.style.left = `${leftPos}vw`;
                coin.style.animationDuration = `${duration}s`;
                coin.style.width = `${size}px`;
                coin.style.height = `${size}px`;

                document.body.appendChild(coin);

                setTimeout(() => {
                    coin.remove();
                }, duration * 1000);
            }, Math.random() * 300);
        }
    }

    function checkChipExchange() {
        const currentChips = parseInt(localStorage.getItem(CHIP_KEY), 10) || 100;

        if (currentChips > lastChipsValue) {
            const isShopOpen =
                document.querySelector('.fullscreen-shop.active') ||
                document.querySelector('#casino-shop-overlay.active');
            if (isShopOpen) {
                triggerCoinFall();
            }
        }
        lastChipsValue = currentChips;
    }

    function syncScreenVFX() {
        const isRainActive = localStorage.getItem(RAIN_ACTIVE_KEY) === 'true';

        if (!starFieldElement) createStarField();

        if (isRainActive) {
            if (starFieldElement) starFieldElement.classList.add('active');
            if (!lastRainActive) {
                triggerRushPopup();
            }
        } else {
            if (starFieldElement) starFieldElement.classList.remove('active');
        }

        lastRainActive = isRainActive;

        checkChipExchange();
    }

    function initializeController() {
        injectVisualStyles();
        createStarField();
        syncScreenVFX();

        window.addEventListener('storage', (e) => {
            if (!e.key || e.key === RAIN_ACTIVE_KEY || e.key === CHIP_KEY) {
                syncScreenVFX();
            }
        });

        setInterval(syncScreenVFX, 200);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeController);
    } else {
        initializeController();
    }
})();