(function() {
    const UPGRADE_COSTS = {
        luck: 100000,
        autospin: 250000
    };
    const LUCK_BOOST_AMOUNT = 0.05;
    const MAX_LUCK_LEVEL = 6;
    const LUCK_COST_GROWTH = 25000;

    const storedLuckValue = parseFloat(localStorage.getItem("kings-casino-vip-luck")) || 0;
    const storedLuckLevel = parseInt(localStorage.getItem("kings-casino-vip-luck-level"), 10) || 0;
    let currentLuckLevel = storedLuckLevel > 0 ? storedLuckLevel : (storedLuckValue > 0 ? Math.min(MAX_LUCK_LEVEL, Math.round(storedLuckValue / LUCK_BOOST_AMOUNT)) : 0);
    let currentLuck = Math.min(MAX_LUCK_LEVEL * LUCK_BOOST_AMOUNT, currentLuckLevel * LUCK_BOOST_AMOUNT);
    let hasAutoSpin = localStorage.getItem("kings-casino-vip-autospin") === "true";
    let autoSpinActive = localStorage.getItem("kings-casino-vip-autospin-active") === "true";
    let autoSpinInterval = null;

    if (currentLuck !== storedLuckValue) {
        localStorage.setItem("kings-casino-vip-luck", currentLuck.toString());
    }

    const style = document.createElement('style');
    style.innerHTML = `
        .shop-btn {
            position: fixed;
            bottom: 24px;
            right: 24px;
            background: rgba(255, 215, 0, 0.14);
            color: #f4efd8;
            border: 1px solid rgba(255, 215, 0, 0.3);
            backdrop-filter: blur(10px);
            padding: 14px 26px;
            border-radius: 28px;
            font-size: 1.05rem;
            font-weight: 800;
            cursor: pointer;
            z-index: 100;
            box-shadow: 0 18px 50px rgba(0, 0, 0, 0.35);
            transition: transform 0.2s ease, filter 0.2s ease, background 0.2s ease;
            letter-spacing: 0.08em;
            text-transform: uppercase;
        }
        .shop-btn:hover {
            transform: translateY(-1px);
            filter: brightness(1.1);
            background: rgba(255, 215, 0, 0.22);
        }
        .shop-modal {
            position: fixed;
            inset: 0;
            display: grid;
            place-items: center;
            background: rgba(6, 8, 15, 0.94);
            backdrop-filter: blur(18px);
            z-index: 200;
            padding: 24px;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.25s ease, transform 0.25s ease;
            transform: translateY(18px);
        }
        .shop-modal.visible {
            opacity: 1;
            pointer-events: auto;
            transform: translateY(0);
        }
        .shop-content {
            width: min(1024px, calc(100% - 48px));
            max-height: min(92vh, 860px);
            overflow-y: auto;
            background: linear-gradient(180deg, rgba(24, 28, 43, 0.98), rgba(10, 12, 19, 0.98));
            border: 1px solid rgba(255, 255, 255, 0.08);
            box-shadow: 0 40px 100px rgba(0, 0, 0, 0.7);
            border-radius: 30px;
            padding: 32px;
            position: relative;
        }
        .shop-modal h2 {
            margin-bottom: 8px;
            color: #f5d251;
            font-size: 2.4rem;
            letter-spacing: 0.14em;
            text-transform: uppercase;
        }
        .shop-modal .subline {
            color: #b6bbc9;
            font-size: 1rem;
            margin-bottom: 24px;
            line-height: 1.7;
            max-width: 760px;
        }
        .shop-grid {
            display: grid;
            gap: 18px;
        }
        .shop-item {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 24px;
            padding: 24px;
            display: grid;
            gap: 14px;
            transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;
        }
        .shop-item:hover {
            transform: translateY(-2px);
            border-color: rgba(245, 210, 81, 0.35);
            background: rgba(255, 255, 255, 0.05);
        }
        .shop-item h3 {
            margin: 0;
            font-size: 1.35rem;
            color: #ffffff;
        }
        .shop-item p {
            margin: 0;
            font-size: 0.98rem;
            color: #bec3d0;
            line-height: 1.7;
        }
        .item-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 16px;
            flex-wrap: wrap;
        }
        .item-meta span {
            color: #f4f5f8;
            font-weight: 700;
            font-size: 1rem;
        }
        .buy-btn,
        .close-shop,
        .auto-spin-toggle {
            border: none;
            border-radius: 18px;
            padding: 12px 20px;
            font-weight: 700;
            cursor: pointer;
            transition: transform 0.18s ease, filter 0.18s ease, background 0.18s ease;
        }
        .buy-btn {
            background: linear-gradient(135deg, #f4b046, #d88d1a);
            color: #09111d;
            min-width: 160px;
            margin-top: 8px;
        }
        .buy-btn:hover:not(:disabled) {
            transform: translateY(-1px);
            filter: brightness(1.05);
        }
        .buy-btn:disabled {
            background: rgba(127, 140, 141, 0.6);
            color: #e6e9ef;
            cursor: not-allowed;
        }
        .close-shop {
            background: rgba(255, 255, 255, 0.08);
            color: #d8dbe5;
            width: 100%;
            max-width: 220px;
            margin: 18px auto 0;
        }
        .close-shop:hover {
            background: rgba(255, 255, 255, 0.14);
        }
        .auto-spin-toggle {
            position: fixed;
            right: 24px;
            bottom: 112px;
            z-index: 110;
            background: linear-gradient(135deg, rgba(78, 130, 201, 0.96), rgba(42, 84, 160, 0.96));
            color: #ffffff;
            border: 1px solid rgba(255, 255, 255, 0.18);
            min-width: 162px;
            box-shadow: 0 16px 45px rgba(0, 0, 0, 0.3);
        }
        .auto-spin-toggle.active {
            background: linear-gradient(135deg, #5ecf7c, #2f9957);
            color: #ffffff;
            border-color: rgba(255, 255, 255, 0.24);
        }
        .auto-spin-toggle:hover {
            transform: translateY(-1px);
            filter: brightness(1.05);
        }
        .modal-close {
            position: absolute;
            top: 22px;
            right: 22px;
            width: 42px;
            height: 42px;
            border-radius: 50%;
            border: 1px solid rgba(255, 255, 255, 0.12);
            background: rgba(255, 255, 255, 0.04);
            color: #e9edf6;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 1.1rem;
            cursor: pointer;
        }
        .modal-close:hover {
            background: rgba(255, 255, 255, 0.1);
        }
        @media (max-width: 700px) {
            .shop-content { padding: 22px; }
            .shop-modal { padding: 16px; }
            .shop-item { padding: 18px; }
            .shop-modal h2 { font-size: 2rem; }
        }
    `;
    document.head.appendChild(style);

    function initShopUI() {
        const openBtn = document.createElement('button');
        openBtn.className = 'shop-btn';
        openBtn.innerText = '🛒 VIP SHOP';
        document.body.appendChild(openBtn);

        const modal = document.createElement('div');
        modal.className = 'shop-modal';
        modal.innerHTML = `
            <div class="shop-content">
                <button class="modal-close" id="close-shop-btn">×</button>
                <h2>VIP Shop</h2>
                <p class="subline">Experience a polished VIP storefront with premium upgrades, gameplay boosts, and a refined dark theme designed for the elite.</p>

                <div class="shop-grid">
                    <div class="shop-item">
                        <div class="item-meta">
                            <div>
                                <h3>Luck Enhancement</h3>
                                <p>Increase your win chance by 5% with each purchase.</p>
                            </div>
                            <span>${UPGRADE_COSTS.luck.toLocaleString()} VIP</span>
                        </div>
                        <button id="buy-luck-btn" class="buy-btn">Purchase</button>
                    </div>

                    <div class="shop-item" id="autospin-container">
                        <div class="item-meta">
                            <div>
                                <h3>Auto-Spinner Module</h3>
                                <p>Keep the reels spinning automatically while you relax.</p>
                            </div>
                            <span>${UPGRADE_COSTS.autospin.toLocaleString()} VIP</span>
                        </div>
                        <button id="buy-autospin-btn" class="buy-btn">Purchase</button>
                    </div>
                </div>

                <button class="close-shop" id="close-shop-secondary">Close</button>
            </div>
        `;
        document.body.appendChild(modal);

        openBtn.addEventListener('click', () => {
            updateShopButtons();
            modal.classList.add('visible');
        });

        document.getElementById('close-shop-btn').addEventListener('click', () => {
            modal.classList.remove('visible');
        });
        document.getElementById('close-shop-secondary').addEventListener('click', () => {
            modal.classList.remove('visible');
        });
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.classList.remove('visible');
            }
        });
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                modal.classList.remove('visible');
            }
        });

        document.getElementById('buy-luck-btn').addEventListener('click', (event) => {
            playShopClick();
            buyLuck();
        });
        document.getElementById('buy-autospin-btn').addEventListener('click', (event) => {
            playShopClick();
            buyAutoSpin();
        });
        document.getElementById('close-shop-secondary').addEventListener('click', playShopClick);
        document.getElementById('close-shop-btn').addEventListener('click', playShopClick);
        openBtn.addEventListener('click', playShopClick);

        updateShopButtons();

        if (hasAutoSpin) {
            setupAutoSpinUI();
        }
    }

    function playShopClick() {
        try {
            const audio = new Audio('sfx/vip-sm-click.mp3');
            audio.volume = 0.65;
            audio.play().catch(() => {});
        } catch (e) {
        }
    }

    function getLuckCost() {
        return UPGRADE_COSTS.luck + currentLuckLevel * LUCK_COST_GROWTH;
    }

    function updateShopButtons() {
        const currentBalance = window.getBalance ? window.getBalance() : 0;

        const luckBtn = document.getElementById('buy-luck-btn');
        if (luckBtn) {
            if (currentLuckLevel >= MAX_LUCK_LEVEL) {
                luckBtn.innerText = 'Maxed';
                luckBtn.disabled = true;
            } else if (currentBalance >= getLuckCost()) {
                luckBtn.innerText = `Purchase (${getLuckCost().toLocaleString()} VIP)`;
                luckBtn.disabled = false;
            } else {
                luckBtn.innerText = `Need ${getLuckCost().toLocaleString()} VIP`;
                luckBtn.disabled = true;
            }
        }

        const autoSpinBtn = document.getElementById('buy-autospin-btn');
        if (autoSpinBtn) {
            if (hasAutoSpin) {
                autoSpinBtn.innerText = 'Owned';
                autoSpinBtn.disabled = true;
            } else if (currentBalance >= UPGRADE_COSTS.autospin) {
                autoSpinBtn.innerText = 'Purchase';
                autoSpinBtn.disabled = false;
            } else {
                autoSpinBtn.innerText = `Need ${UPGRADE_COSTS.autospin.toLocaleString()} VIP`;
                autoSpinBtn.disabled = true;
            }
        }
    }

    function buyLuck() {
        if (currentLuckLevel >= MAX_LUCK_LEVEL) {
            updateShopButtons();
            return;
        }

        const cost = getLuckCost();
        if (window.getBalance() >= cost) {
            window.updateBalance(-cost);
            currentLuckLevel += 1;
            currentLuck = currentLuckLevel * LUCK_BOOST_AMOUNT;
            localStorage.setItem("kings-casino-vip-luck-level", currentLuckLevel.toString());
            localStorage.setItem("kings-casino-vip-luck", currentLuck.toString());
            alert(`Luck increased to ${Math.round(currentLuck * 100)}%!`);
            updateShopButtons();
        }
    }

    function buyAutoSpin() {
        if (!hasAutoSpin && window.getBalance() >= UPGRADE_COSTS.autospin) {
            window.updateBalance(-UPGRADE_COSTS.autospin);
            hasAutoSpin = true;
            localStorage.setItem("kings-casino-vip-autospin", "true");
            alert("Auto-Spinner Unlocked! Use the side toggle to turn it on.");
            updateShopButtons();
            setupAutoSpinUI();
        }
    }

    function updateAutoSpinButtonState(toggleBtn) {
        if (!toggleBtn) return;
        toggleBtn.classList.toggle('active', autoSpinActive);
        toggleBtn.innerText = autoSpinActive ? 'Auto-Spin: ON' : 'Auto-Spin: OFF';
        toggleBtn.setAttribute('aria-pressed', String(autoSpinActive));
    }

    function setAutoSpinState(active) {
        autoSpinActive = active;
        localStorage.setItem("kings-casino-vip-autospin-active", active ? "true" : "false");
        const toggleBtn = document.getElementById('auto-spin-toggle');
        updateAutoSpinButtonState(toggleBtn);
        if (active) {
            startAutoSpin();
        } else {
            stopAutoSpin();
        }
    }

    function setupAutoSpinUI() {
        let toggleBtn = document.getElementById('auto-spin-toggle');
        if (toggleBtn) {
            updateAutoSpinButtonState(toggleBtn);
            if (autoSpinActive) {
                startAutoSpin();
            }
            return;
        }

        toggleBtn = document.createElement('button');
        toggleBtn.id = 'auto-spin-toggle';
        toggleBtn.className = 'auto-spin-toggle';
        document.body.appendChild(toggleBtn);

        toggleBtn.addEventListener('click', () => {
            setAutoSpinState(!autoSpinActive);
        });

        updateAutoSpinButtonState(toggleBtn);
        if (autoSpinActive) {
            startAutoSpin();
        }
    }

    function startAutoSpin() {
        if (autoSpinInterval) clearInterval(autoSpinInterval);
        
        autoSpinInterval = setInterval(() => {
            const currentCost = typeof getSpinCost === "function" ? getSpinCost() : 10;
            
            if (window.getBalance() < currentCost) {
                document.getElementById('auto-spin-toggle').click();
                alert("Auto-Spin stopped: Not enough VIP chips.");
                return;
            }

            if (!window.isSpinning) {
                const insertBtn = document.getElementById('insert-chip-btn');
                if (insertBtn && !insertBtn.classList.contains('disabled')) {
                    insertBtn.click();
                }
            }
        }, 1000);
    }

    function stopAutoSpin() {
        if (autoSpinInterval) {
            clearInterval(autoSpinInterval);
            autoSpinInterval = null;
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initShopUI);
    } else {
        initShopUI();
    }

})();