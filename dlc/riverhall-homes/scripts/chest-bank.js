(function () {
    const CHEST_BANKS_KEY = 'rrh_chest_banks';

    const SFX_OPEN = 'sfx/rotate.mp3';
    const SFX_DEPOSIT = 'sfx/buy-furniture.mp3';
    const SFX_WITHDRAW = 'sfx/remove.mp3';

    function playSfx(url) {
        try {
            const audio = new Audio(url);
            audio.volume = 0.45;
            audio.play();
        } catch (_) {}
    }

    const style = document.createElement('style');
    style.textContent = `
        .chest-menu-overlay {
            position: fixed;
            inset: 0;
            z-index: 5000;
            background: radial-gradient(ellipse at 50% 20%, #1f1a14 0%, #0a0908 70%);
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 24px;
            animation: chestFadeIn 0.22s ease;
        }
        @keyframes chestFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .chest-menu-panel {
            width: min(520px, 100%);
            background: linear-gradient(165deg, #1c1814 0%, #12100e 55%, #0d0b0a 100%);
            border: 1.5px solid #4a3c1a;
            border-radius: 20px;
            padding: 36px 32px 28px;
            box-shadow: 0 24px 80px rgba(0,0,0,0.85), inset 0 1px 0 rgba(241,196,15,0.08);
            position: relative;
            color: #ece6dc;
        }
        .chest-menu-close {
            position: absolute;
            top: 14px;
            right: 16px;
            background: rgba(255,255,255,0.04);
            border: 1px solid #3a3428;
            color: #aaa;
            width: 38px;
            height: 38px;
            border-radius: 10px;
            font-size: 1.5rem;
            cursor: pointer;
            line-height: 1;
        }
        .chest-menu-close:hover { color: #fff; background: rgba(255,255,255,0.08); }
        .chest-menu-header { text-align: center; margin-bottom: 28px; }
        .chest-menu-icon { font-size: 2.4rem; margin-bottom: 8px; filter: drop-shadow(0 4px 12px rgba(0,0,0,0.5)); }
        .chest-menu-header h1 {
            color: #f1c40f;
            font-size: 1.65rem;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            margin: 0 0 6px;
        }
        .chest-menu-subtitle { color: #8a8272; font-size: 0.92rem; margin: 0; }
        .chest-balance-cards {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 14px;
            margin-bottom: 26px;
        }
        .chest-balance-card {
            background: rgba(0,0,0,0.35);
            border: 1.5px solid #2e281c;
            border-radius: 14px;
            padding: 18px 14px;
            text-align: center;
        }
        .chest-card-stored { border-color: #5c4a1f; }
        .chest-card-wallet { border-color: #1f4a3a; }
        .chest-card-label {
            display: block;
            font-size: 0.78rem;
            text-transform: uppercase;
            letter-spacing: 1.2px;
            color: #9a9080;
            margin-bottom: 6px;
        }
        .chest-card-value {
            display: block;
            font-size: 1.85rem;
            font-weight: 700;
            color: #fff;
            line-height: 1.1;
        }
        .chest-card-stored .chest-card-value { color: #f1c40f; }
        .chest-card-wallet .chest-card-value { color: #6ee7b7; }
        .chest-card-unit { font-size: 0.82rem; color: #6a6458; }
        .chest-action-section { margin-bottom: 18px; }
        .chest-field-label {
            display: block;
            font-size: 0.82rem;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #8a8272;
            margin-bottom: 8px;
        }
        .chest-amount-input {
            width: 100%;
            background: #0a0908;
            border: 1.5px solid #3a3428;
            border-radius: 12px;
            padding: 14px 16px;
            color: #fff;
            font-size: 1.2rem;
            font-family: inherit;
            margin-bottom: 12px;
        }
        .chest-amount-input:focus {
            outline: none;
            border-color: #f1c40f;
            box-shadow: 0 0 0 3px rgba(241,196,15,0.12);
        }
        .chest-quick-row {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }
        .chest-quick-btn {
            flex: 1;
            min-width: 58px;
            background: #1a1712;
            border: 1px solid #3a3428;
            color: #c4b896;
            padding: 8px 6px;
            border-radius: 8px;
            font-size: 0.88rem;
            font-weight: 600;
            cursor: pointer;
            font-family: inherit;
        }
        .chest-quick-btn:hover { border-color: #5c4a1f; color: #f1c40f; }
        .chest-action-buttons {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
        }
        .chest-action-btn {
            padding: 14px 10px;
            border-radius: 12px;
            font-size: 1.05rem;
            font-weight: 700;
            cursor: pointer;
            border: 2px solid transparent;
            font-family: inherit;
            letter-spacing: 0.5px;
        }
        .chest-deposit-btn {
            background: linear-gradient(180deg, #2a2218, #151210);
            border-color: #5c4a1f;
            color: #f1c40f;
            box-shadow: 0 4px 0 #2a1f0a;
        }
        .chest-deposit-btn:active { transform: translateY(3px); box-shadow: none; }
        .chest-withdraw-btn {
            background: linear-gradient(180deg, #142820, #0a1510);
            border-color: #1f5c40;
            color: #6ee7b7;
            box-shadow: 0 4px 0 #0a2a1a;
        }
        .chest-withdraw-btn:active { transform: translateY(3px); box-shadow: none; }
        .chest-feedback {
            min-height: 1.4em;
            text-align: center;
            margin-top: 14px;
            font-size: 0.95rem;
            color: transparent;
        }
        .chest-feedback-ok { color: #6ee7b7; }
        .chest-feedback-error { color: #f87171; }
    `;
    document.head.appendChild(style);

    function getChestBanks() {
        try {
            return JSON.parse(localStorage.getItem(CHEST_BANKS_KEY) || '{}');
        } catch (_) {
            return {};
        }
    }

    function saveChestBanks(banks) {
        localStorage.setItem(CHEST_BANKS_KEY, JSON.stringify(banks));
    }

    function getChestBalance(chestId) {
        const banks = getChestBanks();
        return typeof banks[chestId] === 'number' ? banks[chestId] : 0;
    }

    function setChestBalance(chestId, amount) {
        const banks = getChestBanks();
        banks[chestId] = Math.max(0, Math.floor(amount));
        saveChestBanks(banks);
    }

    function getWalletBalance() {
        if (typeof window.getBalance === 'function') return window.getBalance();
        return parseInt(localStorage.getItem('kings-casino-chips'), 10) || 0;
    }

    function setWalletBalance(amount) {
        if (typeof window.setBalance === 'function') {
            window.setBalance(amount);
        } else {
            localStorage.setItem('kings-casino-chips', Math.max(0, Math.floor(amount)));
        }
        if (typeof window.syncBalance === 'function') window.syncBalance();
        else window.dispatchEvent(new Event('storage'));
    }

    function parseAmount(raw) {
        const n = parseInt(String(raw).replace(/[^0-9]/g, ''), 10);
        return isNaN(n) || n <= 0 ? 0 : n;
    }

    let activeOverlay = null;

    function closeChestMenu() {
        if (activeOverlay) {
            activeOverlay.remove();
            activeOverlay = null;
            document.body.style.overflow = '';
        }
    }

    function refreshMenuValues(overlay, chestId) {
        overlay.querySelector('#chest-balance-val').textContent = getChestBalance(chestId).toLocaleString();
        overlay.querySelector('#wallet-balance-val').textContent = getWalletBalance().toLocaleString();
    }

    window.openChestMenu = function (chestId, chestName) {
        if (!chestId) return;
        closeChestMenu();

        const overlay = document.createElement('div');
        overlay.className = 'chest-menu-overlay';
        overlay.innerHTML = `
            <div class="chest-menu-panel" role="dialog" aria-modal="true" aria-labelledby="chest-menu-title">
                <button class="chest-menu-close" aria-label="Close chest">&times;</button>
                <div class="chest-menu-header">
                    <div class="chest-menu-icon">🗃️</div>
                    <h1 id="chest-menu-title">${chestName || 'Storage Chest'}</h1>
                    <p class="chest-menu-subtitle">CHIP STORAGE</p>
                </div>

                <div class="chest-balance-cards">
                    <div class="chest-balance-card chest-card-stored">
                        <span class="chest-card-label">In Chest</span>
                        <span class="chest-card-value" id="chest-balance-val">0</span>
                        <span class="chest-card-unit">Chips</span>
                    </div>
                    <div class="chest-balance-card chest-card-wallet">
                        <span class="chest-card-label">Your Wallet</span>
                        <span class="chest-card-value" id="wallet-balance-val">0</span>
                        <span class="chest-card-unit">Chips</span>
                    </div>
                </div>

                <div class="chest-action-section">
                    <label class="chest-field-label" for="chest-amount-input">Amount</label>
                    <input type="number" id="chest-amount-input" class="chest-amount-input" min="1" placeholder="Enter amount..." inputmode="numeric" />
                    <div class="chest-quick-row">
                        <button type="button" class="chest-quick-btn" data-amt="100">100</button>
                        <button type="button" class="chest-quick-btn" data-amt="500">500</button>
                        <button type="button" class="chest-quick-btn" data-amt="1000">1K</button>
                        <button type="button" class="chest-quick-btn" data-amt="all-deposit">All In</button>
                        <button type="button" class="chest-quick-btn" data-amt="all-withdraw">Empty</button>
                    </div>
                </div>

                <div class="chest-action-buttons">
                    <button type="button" class="chest-action-btn chest-deposit-btn">Deposit</button>
                    <button type="button" class="chest-action-btn chest-withdraw-btn">Withdraw</button>
                </div>

                <p class="chest-feedback" id="chest-feedback" aria-live="polite"></p>
            </div>
        `;

        document.body.appendChild(overlay);
        activeOverlay = overlay;
        document.body.style.overflow = 'hidden';

        playSfx(SFX_OPEN);

        const amountInput = overlay.querySelector('#chest-amount-input');
        const feedback = overlay.querySelector('#chest-feedback');

        function showFeedback(msg, isError) {
            feedback.textContent = msg;
            feedback.className = 'chest-feedback' + (isError ? ' chest-feedback-error' : ' chest-feedback-ok');
            if (msg) {
                setTimeout(() => {
                    if (feedback.textContent === msg) {
                        feedback.textContent = '';
                        feedback.className = 'chest-feedback';
                    }
                }, 2200);
            }
        }

        function doDeposit() {
            let amt = parseAmount(amountInput.value);
            if (!amt) {
                showFeedback('Enter a valid amount to deposit.', true);
                return;
            }
            const wallet = getWalletBalance();
            if (amt > wallet) {
                showFeedback('Not enough chips in your wallet.', true);
                return;
            }
            setWalletBalance(wallet - amt);
            setChestBalance(chestId, getChestBalance(chestId) + amt);
            amountInput.value = '';
            refreshMenuValues(overlay, chestId);
            showFeedback(`Deposited ${amt.toLocaleString()} chips.`, false);
            playSfx(SFX_DEPOSIT);
        }

        function doWithdraw() {
            let amt = parseAmount(amountInput.value);
            if (!amt) {
                showFeedback('Enter a valid amount to withdraw.', true);
                return;
            }
            const stored = getChestBalance(chestId);
            if (amt > stored) {
                showFeedback('Not enough chips in this chest.', true);
                return;
            }
            setChestBalance(chestId, stored - amt);
            setWalletBalance(getWalletBalance() + amt);
            amountInput.value = '';
            refreshMenuValues(overlay, chestId);
            showFeedback(`Withdrew ${amt.toLocaleString()} chips.`, false);
            playSfx(SFX_WITHDRAW);
        }

        overlay.querySelector('.chest-menu-close').addEventListener('click', closeChestMenu);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeChestMenu();
        });
        overlay.querySelector('.chest-deposit-btn').addEventListener('click', doDeposit);
        overlay.querySelector('.chest-withdraw-btn').addEventListener('click', doWithdraw);

        overlay.querySelectorAll('.chest-quick-btn').forEach((btn) => {
            btn.addEventListener('click', () => {
                const tag = btn.getAttribute('data-amt');
                if (tag === 'all-deposit') {
                    amountInput.value = getWalletBalance();
                } else if (tag === 'all-withdraw') {
                    amountInput.value = getChestBalance(chestId);
                } else {
                    amountInput.value = tag;
                }
            });
        });

        amountInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') doDeposit();
            if (e.key === 'Escape') closeChestMenu();
        });

        document.addEventListener('keydown', function escHandler(e) {
            if (e.key === 'Escape' && activeOverlay === overlay) {
                closeChestMenu();
                document.removeEventListener('keydown', escHandler);
            }
        });

        refreshMenuValues(overlay, chestId);
        setTimeout(() => amountInput.focus(), 80);
    };

    const CHEST_NAMES = ['Wooden Chest', 'Luxury Safe'];

    window.isChestFurniture = function (item) {
        if (!item) return false;
        return !!(item.ischest || item.chestId || CHEST_NAMES.includes(item.name));
    };

    window.ensureChestId = function (item) {
        if (!window.isChestFurniture(item)) return null;
        if (!item.chestId) {
            item.chestId = 'chest-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now();
            item.ischest = true;
        }
        return item.chestId;
    };
})();