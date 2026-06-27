(function() {
    const CHIP_KEY = 'kings-casino-chips';
    const RAIN_PURCHASED_KEY = 'kings-casino-rain-purchased';
    const RAIN_ACTIVE_KEY = 'kings-casino-rain-active';
    const RAIN_PHASE_KEY = 'kings-casino-rain-phase';
    const RAIN_TARGET_KEY = 'kings-casino-rain-target-time';

    const RAIN_COST = 3000;
    const CHARGE_TIME = 180;
    const ACTIVE_TIME = 60;

    let particleInterval = null;
    let rainSfx = null;

    function createRainSfx() {
        if (!rainSfx) {
            rainSfx = document.createElement('audio');
            rainSfx.src = "sfx/bc-rain.mp3";
            rainSfx.loop = true;
            rainSfx.preload = "auto";
            rainSfx.style.display = "none";
            document.body.appendChild(rainSfx);
        }
        if (rainSfx.paused) {
            rainSfx.currentTime = 0;
            rainSfx.volume = 0.40;
            rainSfx.play().catch(() => {});
        }
    }

    function stopRainSfx() {
        if (rainSfx && !rainSfx.paused) {
            rainSfx.pause();
            rainSfx.currentTime = 0;
        }
    }

    function isPurchased() {
        return localStorage.getItem(RAIN_PURCHASED_KEY) === 'true';
    }

    function injectRainStyles() {
        if (document.getElementById('rain-vfx-styles')) return;
        const style = document.createElement('style');
        style.id = 'rain-vfx-styles';
        style.textContent = `
            .rain-hud-container {
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                width: 280px;
                background: rgba(0, 0, 0, 0.85);
                border: 2px solid #f1c40f;
                border-radius: 15px;
                padding: 10px;
                box-shadow: 0 8px 20px rgba(0,0,0,0.7), 0 0 15px rgba(241,196,15,0.2);
                z-index: 99;
                display: none;
                flex-direction: column;
                align-items: center;
                gap: 4px;
                pointer-events: none;
                transition: all 0.3s ease;
            }
            .rain-hud-container.active { display: flex; }
            .rain-hud-label {
                color: #fff;
                font-size: 0.85rem;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                text-shadow: 0 2px 4px rgba(0,0,0,0.8);
            }
            .rain-progress-bg {
                width: 100%;
                height: 12px;
                background: rgba(255,255,255,0.1);
                border-radius: 6px;
                overflow: hidden;
                border: 1px solid rgba(255,255,255,0.2);
            }
            .rain-progress-fill {
                width: 0%;
                height: 100%;
                background: linear-gradient(90deg, #f1c40f, #f39c12);
                box-shadow: 0 0 8px #f1c40f;
                transition: width 0.2s linear;
            }
            .rain-progress-fill.active-glow {
                background: linear-gradient(90deg, #2ecc71, #f1c40f, #2ecc71);
                animation: rainGlowMove 2s infinite linear;
            }
            @keyframes rainGlowMove {
                0% { background-position: 0px; }
                100% { background-position: 200px; }
            }
            .rain-drop-streak {
                position: fixed;
                top: -60px;
                width: 1.5px;
                height: 45px;
                background: linear-gradient(transparent, rgba(241, 196, 15, 0.65));
                pointer-events: none;
                z-index: 9999;
                transform: rotate(15deg);
                animation: fallingRain linear forwards;
            }
            @keyframes fallingRain {
                0% { transform: translateY(0) rotate(15deg); opacity: 0; }
                15% { opacity: 1; }
                90% { opacity: 1; }
                100% { transform: translateY(112vh) rotate(15deg); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    function injectShopCard() {
        const shopContent = document.querySelector('#upgrades-shop-overlay .shop-content');
        if (!shopContent || document.getElementById('card-rain-effect')) return;

        const card = document.createElement('div');
        card.className = 'shop-card';
        card.id = 'card-rain-effect';
        card.style.borderColor = '#f1c40f';
        card.innerHTML = `
            <div class="shop-card-badge gold-badge">⚡ Ultra Rare Blueprint</div>
            <div class="exchange-rate">
                <div class="exchange-unit">
                    <span style="font-size:2.5rem;vertical-align:middle;">🌧️</span>
                    <span style="font-size:0.9rem;color:#aaa;" id="upgrade-rain-status">Locked</span>
                </div>
                <div class="exchange-arrow" style="color: #f1c40f;">➔</div>
                <div class="exchange-unit">
                    <span style="font-size:1.1rem;color:#fff;">Golden Rain</span>
                    <span style="font-size:0.75rem;color:#f1c40f;">3m Wait ➔ 1m 20x Click Multiplier!</span>
                </div>
            </div>
            <button class="btn-cashout disabled" id="buy-rain-btn" style="background: linear-gradient(to bottom, #f1c40f, #d35400); border-color:#f9e79f; box-shadow: 0 6px 0 #935116;">Buy: 3,000 Chips</button>
        `;
        shopContent.appendChild(card);

        document.getElementById('buy-rain-btn').addEventListener('click', purchaseRain);
        syncRainCardUI();
    }

    function syncRainCardUI() {
        const buyBtn = document.getElementById('buy-rain-btn');
        const statusTxt = document.getElementById('upgrade-rain-status');
        if (!buyBtn) return;

        if (isPurchased()) {
            statusTxt.innerText = "OWNED";
            buyBtn.innerText = "UNLOCKED";
            buyBtn.classList.add('disabled');
            buyBtn.style.opacity = "0.6";
        } else {
            const currentChips = parseInt(localStorage.getItem(CHIP_KEY), 10) || 0;
            statusTxt.innerText = "Locked";
            buyBtn.innerText = `Buy: ${RAIN_COST.toLocaleString()} Chips`;
            if (currentChips >= RAIN_COST) {
                buyBtn.classList.remove('disabled');
            } else {
                buyBtn.classList.add('disabled');
            }
        }
    }

    function purchaseRain() {
        if (isPurchased()) return;
        let currentChips = parseInt(localStorage.getItem(CHIP_KEY), 10) || 0;

        if (currentChips >= RAIN_COST) {
            currentChips -= RAIN_COST;
            localStorage.setItem(CHIP_KEY, currentChips);
            localStorage.setItem(RAIN_PURCHASED_KEY, 'true');
            localStorage.setItem(RAIN_PHASE_KEY, 'charging');
            localStorage.setItem(RAIN_TARGET_KEY, (Date.now() + CHARGE_TIME * 1000).toString());
            localStorage.setItem(RAIN_ACTIVE_KEY, 'false');
            syncRainCardUI();
            initRainHUD();
            window.dispatchEvent(new Event('storage'));
            if (typeof updateUIUpdates === 'function') updateUIUpdates();
        }
    }

    function initRainHUD() {
        if (!isPurchased() || document.getElementById('rain-hud')) return;

        const hud = document.createElement('div');
        hud.className = 'rain-hud-container active';
        hud.id = 'rain-hud';
        hud.innerHTML = `
            <div class="rain-hud-label" id="rain-hud-text">Cloud Gathering...</div>
            <div class="rain-progress-bg">
                <div class="rain-progress-fill" id="rain-hud-fill"></div>
            </div>
        `;
        document.body.appendChild(hud);

        updateRainHUDBarOnce();
        startTimerLoop();
    }

    function updateRainHUDBarOnce() {
        let phase = localStorage.getItem(RAIN_PHASE_KEY) || 'charging';
        let targetTime = parseInt(localStorage.getItem(RAIN_TARGET_KEY), 10);
        const fill = document.getElementById('rain-hud-fill');
        const label = document.getElementById('rain-hud-text');

        if (isNaN(targetTime)) {
            targetTime = Date.now() + CHARGE_TIME * 1000;
            localStorage.setItem(RAIN_PHASE_KEY, 'charging');
            localStorage.setItem(RAIN_TARGET_KEY, targetTime.toString());
            localStorage.setItem(RAIN_ACTIVE_KEY, 'false');
            phase = 'charging';
        }

        let now = Date.now();
        let timeRemaining = Math.max(0, Math.floor((targetTime - now) / 1000));

        if (phase === 'raining') {
            const percentage = Math.max(0, Math.min(100, (timeRemaining / ACTIVE_TIME) * 100));
            if (fill) {
                fill.style.width = `${percentage}%`;
                fill.classList.add('active-glow');
            }
            if (label) label.innerText = `⚡ GOLDEN RAIN: ${timeRemaining}s (20x CLICKS!)`;
        } else {
            const timeCharged = Math.max(0, CHARGE_TIME - timeRemaining);
            const percentage = Math.max(0, Math.min(100, (timeCharged / CHARGE_TIME) * 100));
            if (fill) {
                fill.style.width = `${percentage}%`;
                fill.classList.remove('active-glow');
            }
            const mins = Math.floor(timeRemaining / 60);
            const secs = timeRemaining % 60;
            if (label) label.innerText = `Gathering Storm: ${mins}:${secs.toString().padStart(2, '0')}`;
        }
    }

    function startTimerLoop() {
        if (window.casinoRainTimerInterval) clearInterval(window.casinoRainTimerInterval);

        window.casinoRainTimerInterval = setInterval(() => {
            let phase = localStorage.getItem(RAIN_PHASE_KEY) || 'charging';
            let targetTime = parseInt(localStorage.getItem(RAIN_TARGET_KEY), 10);

            if (isNaN(targetTime)) {
                targetTime = Date.now() + CHARGE_TIME * 1000;
                localStorage.setItem(RAIN_PHASE_KEY, 'charging');
                localStorage.setItem(RAIN_TARGET_KEY, targetTime.toString());
                localStorage.setItem(RAIN_ACTIVE_KEY, 'false');
                phase = 'charging';
            }

            let now = Date.now();
            let timeRemaining = Math.max(0, Math.floor((targetTime - now) / 1000));

            const fill = document.getElementById('rain-hud-fill');
            const label = document.getElementById('rain-hud-text');

            let previousIsRaining = !!window._lastRainActive;
            let currentIsRaining = (phase === 'raining');

            if (currentIsRaining && !previousIsRaining) {
                createRainSfx();
            } else if (!currentIsRaining && previousIsRaining) {
                stopRainSfx();
            }
            window._lastRainActive = currentIsRaining;

            if (timeRemaining <= 0) {
                if (phase === 'charging') {
                    phase = 'raining';
                    targetTime = now + ACTIVE_TIME * 1000;
                    localStorage.setItem(RAIN_PHASE_KEY, 'raining');
                    localStorage.setItem(RAIN_TARGET_KEY, targetTime.toString());
                    localStorage.setItem(RAIN_ACTIVE_KEY, 'true');
                } else {
                    phase = 'charging';
                    targetTime = now + CHARGE_TIME * 1000;
                    localStorage.setItem(RAIN_PHASE_KEY, 'charging');
                    localStorage.setItem(RAIN_TARGET_KEY, targetTime.toString());
                    localStorage.setItem(RAIN_ACTIVE_KEY, 'false');
                }
                window.dispatchEvent(new Event('storage'));
                now = Date.now();
                timeRemaining = Math.max(0, Math.floor((targetTime - now) / 1000));
            }

            if (phase === 'raining') {
                startRainVisuals();
                const percentage = Math.max(0, Math.min(100, (timeRemaining / ACTIVE_TIME) * 100));
                if (fill) {
                    fill.style.width = `${percentage}%`;
                    fill.classList.add('active-glow');
                }
                if (label) label.innerText = `⚡ GOLDEN RAIN: ${timeRemaining}s (20x CLICKS!)`;
            } else {
                stopRainVisuals();
                const timeCharged = Math.max(0, CHARGE_TIME - timeRemaining);
                const percentage = Math.max(0, Math.min(100, (timeCharged / CHARGE_TIME) * 100));
                if (fill) {
                    fill.style.width = `${percentage}%`;
                    fill.classList.remove('active-glow');
                }
                const mins = Math.floor(timeRemaining / 60);
                const secs = timeRemaining % 60;
                if (label) label.innerText = `Gathering Storm: ${mins}:${secs.toString().padStart(2, '0')}`;
            }

            if (phase !== 'raining') {
                stopRainSfx();
            }
        }, 200);
    }

    function startRainVisuals() {
        if (particleInterval) return;

        particleInterval = setInterval(() => {
            const drop = document.createElement('div');
            drop.className = 'rain-drop-streak';

            const dropLeftOffset = Math.random() * 110 - 5;
            const dropScaleHeight = Math.random() * 25 + 30;
            const dropOpacity = Math.random() * 0.5 + 0.4;
            const dropVelocity = Math.random() * 0.4 + 0.6;

            drop.style.left = `${dropLeftOffset}vw`;
            drop.style.height = `${dropScaleHeight}px`;
            drop.style.opacity = dropOpacity;
            drop.style.animationDuration = `${dropVelocity}s`;

            document.body.appendChild(drop);
            setTimeout(() => drop.remove(), 1200);
        }, 35);
    }

    function stopRainVisuals() {
        if (particleInterval) {
            clearInterval(particleInterval);
            particleInterval = null;
        }
        document.querySelectorAll('.rain-drop-streak').forEach(el => el.remove());
        stopRainSfx();
    }

    function setupHooks() {
        injectRainStyles();

        document.getElementById('upgrades-open-btn').addEventListener('click', () => {
            setTimeout(() => {
                injectShopCard();
                syncRainCardUI();
            }, 10);
        });

        if (isPurchased()) {
            initRainHUD();
        }

        window.addEventListener('storage', () => {
            syncRainCardUI();
            if (document.getElementById('rain-hud')) {
                updateRainHUDBarOnce();
            }
            const phase = localStorage.getItem(RAIN_PHASE_KEY) || 'charging';
            if (phase !== 'raining') {
                stopRainSfx();
            }
        });

        document.addEventListener('visibilitychange', function() {
            if (document.hidden && rainSfx) stopRainSfx();
        });
        window.addEventListener('pagehide', function() {
            stopRainSfx();
        });
        window.addEventListener('beforeunload', function() {
            stopRainSfx();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupHooks);
    } else {
        setupHooks();
    }
})();