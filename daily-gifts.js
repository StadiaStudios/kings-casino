(function () {
    const CHIP_KEY = 'kings-casino-chips';
    const AUTO_LVL_KEY = 'kings-casino-auto-level';
    const MULT_LVL_KEY = 'kings-casino-mult-level';
    const MULTIPLIER_VAL_KEY = 'kings-casino-click-multiplier';

    const ICONS = {
        arrow: 'resources/bud-clicker/scissors.png',
        arrowSize: 24
    };

    const BASE_AUTO_COST = 300;
    const BASE_MULT_COST = 1000;
    const PRICE_INCREASE = 300;
    const MAX_AUTO_LEVEL = 100;
    const MAX_MULT_LEVEL = 8;

    function getAutoLevel() {
        let lvl = parseInt(localStorage.getItem(AUTO_LVL_KEY), 10) || 0;
        return Math.min(lvl, MAX_AUTO_LEVEL);
    }

    function getMultLevel() {
        let lvl = parseInt(localStorage.getItem(MULT_LVL_KEY), 10) || 0;
        return Math.min(lvl, MAX_MULT_LEVEL);
    }

    function getAutoCost(lvl) {
        if (lvl >= MAX_AUTO_LEVEL) return 0;
        return BASE_AUTO_COST + (PRICE_INCREASE * lvl);
    }

    function getMultCost(lvl) {
        if (lvl >= MAX_MULT_LEVEL) return 0;
        return BASE_MULT_COST * (lvl + 1);
    }

    function getCPS() {
        return getAutoLevel() * 1.0;
    }

    function calculateMultiplier(lvl) {
        return Math.min(1.0 + (lvl * 0.5), 5.0);
    }

    function getMaxedMultiplier() {
        return getMultLevel() >= MAX_MULT_LEVEL;
    }

    function injectElementsAndStyles() {
        const targetPoint = document.getElementById('upgrades-shop-injection-point');
        if (targetPoint) {
            targetPoint.innerHTML = `
                <div class="fullscreen-shop" id="upgrades-shop-overlay">
                    <div class="shop-header">
                        <h2 class="shop-title" style="background: linear-gradient(to bottom, #3498db, #2980b9); -webkit-background-clip: text;">Lab Upgrades</h2>
                        <button class="shop-close-btn" id="upgrades-close-btn">✕</button>
                    </div>
                    <div class="shop-content">
                        <div class="shop-card" id="card-autoclicker" style="border-color: #3498db;">
                            <div class="shop-card-badge" style="background: #3498db;">Infinite Automaton</div>
                            <div class="exchange-rate">
                                <div class="exchange-unit">
                                    <span style="font-size:2.5rem;vertical-align:middle;">⚡</span>
                                    <span style="font-size:0.9rem;color:#aaa;" id="upgrade-auto-status">Lvl 0</span>
                                </div>
                                <div class="exchange-arrow" style="color: #3498db;">➔</div>
                                <div class="exchange-unit">
                                    <span style="font-size:1.2rem;color:#fff;" id="upgrade-auto-effect">+0 CPS</span>
                                    <span style="font-size:0.8rem;color:#3498db;">+1.0/s each</span>
                                </div>
                            </div>
                            <button class="btn-cashout disabled" id="buy-auto-btn" style="background: linear-gradient(to bottom, #3498db, #2980b9); border-color:#5dade2; box-shadow: 0 6px 0 #1b4f72;">Buy: 80 Chips</button>
                        </div>
                        <div class="shop-card" id="card-multiplier" style="border-color: #af7ac5;">
                            <div class="shop-card-badge purple-badge">Hype Multiplier</div>
                            <div class="exchange-rate">
                                <div class="exchange-unit">
                                    <span style="font-size:2.5rem;vertical-align:middle;">💥</span>
                                    <span style="font-size:0.9rem;color:#aaa;" id="upgrade-mult-status">Lvl 0</span>
                                </div>
                                <div class="exchange-arrow" style="color: #af7ac5;">➔</div>
                                <div class="exchange-unit">
                                    <span style="font-size:1.2rem;color:#fff;" id="upgrade-mult-effect">1.0x Click</span>
                                    <span style="font-size:0.8rem;color:#af7ac5;">+0.5x power each</span>
                                </div>
                            </div>
                            <button class="btn-cashout disabled" id="buy-mult-btn" style="background: linear-gradient(to bottom, #a569bd, #8e44ad); border-color:#bb8fce; box-shadow: 0 6px 0 #5b2c6f;">Buy: 1000 Chips</button>
                        </div>
                    </div>
                </div>
            `;
        }

        const styleElement = document.createElement('style');
        styleElement.textContent = `
            .cursors-ring-layer {
                position: absolute;
                top: 50%;
                left: 50%;
                width: 0;
                height: 0;
                pointer-events: none;
                z-index: 2;
                animation: loopCursorSpin 25s linear infinite;
            }
            .orbiting-cursor-arrow {
                position: absolute;
                width: ${ICONS.arrowSize}px;
                height: ${ICONS.arrowSize}px;
                pointer-events: none;
                background-image: url('${ICONS.arrow}');
                background-size: contain;
                background-repeat: no-repeat;
                transform-origin: center center;
                transition: transform 0.05s ease-out;
            }
            @keyframes loopCursorSpin {
                0% { transform: translate(-50%, -50%) rotate(0deg); }
                100% { transform: translate(-50%, -50%) rotate(360deg); }
            }
            .pulse-clicker-cursor {
                transform: translate(-50%, -50%) scale(0.75) !important;
            }
            button.btn-cashout {
                cursor: pointer;
            }
            button.btn-cashout.disabled, button.btn-cashout[disabled] {
                cursor: not-allowed;
            }
        `;
        document.head.appendChild(styleElement);
    }

    function updateAllUpgradeButtonStates() {
        syncUpgradeUI();
    }

    function syncUpgradeUI() {
        let autoLvl = getAutoLevel();
        let multLvl = getMultLevel();
        const currentChips = parseInt(localStorage.getItem(CHIP_KEY), 10) || 0;

        if (autoLvl > MAX_AUTO_LEVEL) autoLvl = MAX_AUTO_LEVEL;
        if (multLvl > MAX_MULT_LEVEL) multLvl = MAX_MULT_LEVEL;

        const cpsDisplay = document.getElementById('clicker-cps');
        if (cpsDisplay) cpsDisplay.innerText = `${getCPS().toLocaleString()}/s`;

        const autoCostBtn = document.getElementById('buy-auto-btn');
        if (autoCostBtn) {
            document.getElementById('upgrade-auto-status').innerText = `Lvl ${autoLvl}`;
            document.getElementById('upgrade-auto-effect').innerText = `+${getCPS()} CPS`;
            const nextAutoCost = getAutoCost(autoLvl);

            const btn = autoCostBtn;
            const nextCost = nextAutoCost;
            if (autoLvl >= MAX_AUTO_LEVEL) {
                btn.innerText = "MAXED";
                btn.classList.add('disabled');
                btn.setAttribute('disabled', 'true');
            } else {
                btn.innerText = `Buy: ${nextCost.toLocaleString()} Chips`;
                if (currentChips >= nextCost) {
                    btn.classList.remove('disabled');
                    btn.removeAttribute('disabled');
                } else {
                    btn.classList.add('disabled');
                    btn.setAttribute('disabled', 'true');
                }
            }
        }

        const multCostBtn = document.getElementById('buy-mult-btn');
        if (multCostBtn) {
            document.getElementById('upgrade-mult-status').innerText = `Lvl ${multLvl}`;
            document.getElementById('upgrade-mult-effect').innerText = `${calculateMultiplier(multLvl).toFixed(1)}x Click`;
            const nextMultCost = getMultCost(multLvl);

            if (multLvl >= MAX_MULT_LEVEL) {
                multCostBtn.innerText = "MAXED";
                multCostBtn.classList.add('disabled');
                multCostBtn.setAttribute('disabled', 'disabled');
            } else {
                multCostBtn.innerText = `Buy: ${nextMultCost.toLocaleString()} Chips`;
                if (currentChips >= nextMultCost) {
                    multCostBtn.classList.remove('disabled');
                    multCostBtn.removeAttribute('disabled');
                } else {
                    multCostBtn.classList.add('disabled');
                    multCostBtn.setAttribute('disabled', 'disabled');
                }
            }
        }
    }

    function renderOrbitingCursors() {
        const anchor = document.getElementById('clicker-wrapper-anchor');
        if (!anchor) return;

        const oldLayer = anchor.querySelector('.cursors-ring-layer');
        if (oldLayer) oldLayer.remove();

        const totalCursors = getAutoLevel();
        if (totalCursors === 0) return;

        const displayCount = Math.min(totalCursors, 24);
        const newLayer = document.createElement('div');
        newLayer.className = 'cursors-ring-layer';

        const radius = 125;
        for (let i = 0; i < displayCount; i++) {
            const cursor = document.createElement('div');
            cursor.className = 'orbiting-cursor-arrow';

            const currentAngleDegrees = (i * 360) / displayCount;
            const angleRadians = (currentAngleDegrees * Math.PI) / 180;

            const xOffset = Math.cos(angleRadians) * radius;
            const yOffset = Math.sin(angleRadians) * radius;
            const inwardFacingRotation = currentAngleDegrees + 90;

            cursor.style.left = `calc(50% + ${xOffset}px)`;
            cursor.style.top = `calc(50% + ${yOffset}px)`;
            cursor.style.transform = `translate(-50%, -50%) rotate(${inwardFacingRotation}deg)`;

            newLayer.appendChild(cursor);
        }
        anchor.appendChild(newLayer);
    }

    function pulseCursorsAnimation() {
        document.querySelectorAll('.orbiting-cursor-arrow').forEach(cursor => {
            cursor.classList.add('pulse-clicker-cursor');
            setTimeout(() => cursor.classList.remove('pulse-clicker-cursor'), 60);
        });
    }

    function setupLogicTriggers() {
        injectElementsAndStyles();

        const upgradesOverlay = document.getElementById('upgrades-shop-overlay');
        document.getElementById('upgrades-open-btn').addEventListener('click', () => {
            updateAllUpgradeButtonStates();
            upgradesOverlay.classList.add('active');
        });
        document.getElementById('upgrades-close-btn').addEventListener('click', () => {
            upgradesOverlay.classList.remove('active');
        });

        document.getElementById('buy-auto-btn').addEventListener('click', () => {
            let autoLvl = getAutoLevel();
            if (autoLvl >= MAX_AUTO_LEVEL) return;

            const cost = getAutoCost(autoLvl);
            let chips = parseInt(localStorage.getItem(CHIP_KEY), 10) || 0;

            if (chips >= cost) {
                chips -= cost;
                localStorage.setItem(CHIP_KEY, chips);
                autoLvl += 1;
                if (autoLvl > MAX_AUTO_LEVEL) autoLvl = MAX_AUTO_LEVEL;
                localStorage.setItem(AUTO_LVL_KEY, autoLvl);

                updateAllUpgradeButtonStates();
                renderOrbitingCursors();
                window.dispatchEvent(new Event('storage'));
                if (typeof updateUIUpdates === 'function') updateUIUpdates();
            }
        });

        document.getElementById('buy-mult-btn').addEventListener('click', () => {
            let multLvl = getMultLevel();
            if (multLvl >= MAX_MULT_LEVEL) return;

            const cost = getMultCost(multLvl);
            let chips = parseInt(localStorage.getItem(CHIP_KEY), 10) || 0;

            if (chips >= cost) {
                chips -= cost;
                localStorage.setItem(CHIP_KEY, chips);

                const nextLevel = multLvl + 1;
                localStorage.setItem(MULT_LVL_KEY, nextLevel);
                localStorage.setItem(MULTIPLIER_VAL_KEY, calculateMultiplier(nextLevel));

                updateAllUpgradeButtonStates();
                window.dispatchEvent(new Event('storage'));
                if (typeof updateUIUpdates === 'function') updateUIUpdates();
            }
        });

        setInterval(() => {
            const cps = getCPS();
            if (cps > 0) {
                let currentBuds = parseFloat(localStorage.getItem('kings-casino-buds')) || 0;
                currentBuds += cps * 0.1;
                localStorage.setItem('kings-casino-buds', currentBuds);

                if (typeof updateUIUpdates === 'function') updateUIUpdates();

                if (upgradesOverlay && upgradesOverlay.classList.contains('active')) {
                    updateAllUpgradeButtonStates();
                }
            }
        }, 100);

        updateAllUpgradeButtonStates();
        renderOrbitingCursors();

        window.addEventListener('storage', () => {
            updateAllUpgradeButtonStates();
            renderOrbitingCursors();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupLogicTriggers);
    } else {
        setupLogicTriggers();
    }
})();