(function() {
    const UPGRADE_COST = 5000000;
    const BASE_TIME_MS = 15 * 60 * 1000;
    const UPGRADED_TIME_MS = 5 * 60 * 1000;
    const EXCHANGE_RATE = 10;
    const DATA_KEY = 'kings-casino-exchanger';
    
    let exchangeData = {
        isUpgraded: false,
        activeExchange: null
    };

    const savedData = localStorage.getItem(DATA_KEY);
    if (savedData) {
        try {
            exchangeData = JSON.parse(savedData);
        } catch(e) { console.error("Error parsing exchange data", e); }
    }

    function saveData() {
        localStorage.setItem(DATA_KEY, JSON.stringify(exchangeData));
    }

    const styles = `
        #exchanger-modal {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(5, 7, 12, 0.86); backdrop-filter: blur(10px);
            display: none; justify-content: center; align-items: center; z-index: 9999;
            padding: 20px; box-sizing: border-box;
        }
        .exchanger-content {
            background: radial-gradient(circle at top, rgba(212, 175, 55, 0.16), rgba(11, 12, 16, 0.98) 70%);
            border: 1px solid rgba(212, 175, 55, 0.48);
            border-radius: 24px; padding: 30px 24px; width: 100%; max-width: 420px;
            text-align: center; color: #f7f1d0; box-shadow: 0 20px 60px rgba(0,0,0,0.55);
            position: relative; overflow: hidden;
        }
        .exchanger-content::before {
            content: ""; position: absolute; inset: 0;
            background: linear-gradient(135deg, rgba(255,255,255,0.04), transparent 40%);
            pointer-events: none;
        }
        .exchanger-close {
            position: absolute; top: 12px; right: 16px; font-size: 26px;
            color: var(--gold-primary); cursor: pointer; font-weight: 700;
            transition: transform 0.2s ease;
        }
        .exchanger-close:hover { transform: scale(1.08); }
        .exchanger-badge {
            display: inline-block; margin-bottom: 8px; padding: 6px 12px;
            border: 1px solid rgba(212, 175, 55, 0.35); border-radius: 999px;
            background: rgba(255,255,255,0.06); font-size: 0.78rem; letter-spacing: 0.24em;
            text-transform: uppercase; color: var(--gold-secondary);
        }
        .exchanger-title {
            color: var(--gold-secondary); font-size: 1.7rem; margin: 0 0 8px;
            text-transform: uppercase; letter-spacing: 0.16em; font-weight: 700;
        }
        .exchanger-subtitle {
            margin: 0 0 18px; color: rgba(247, 241, 208, 0.74); font-size: 0.95rem;
            line-height: 1.5;
        }
        .exchanger-rate {
            display: inline-block; margin-bottom: 12px; padding: 8px 12px;
            border-radius: 999px; background: rgba(212, 175, 55, 0.12);
            color: var(--gold-secondary); font-size: 0.92rem; font-weight: 600;
        }
        .exchanger-input-group {
            margin: 16px 0 10px;
        }
        .exchanger-input {
            background: rgba(0,0,0,0.62); border: 1px solid rgba(192,192,192,0.22);
            color: #fff; padding: 12px 14px; border-radius: 12px; width: 82%;
            font-size: 1.1rem; text-align: center; margin-bottom: 8px; outline: none;
            box-sizing: border-box;
        }
        .exchanger-input:focus {
            border-color: var(--gold-primary); box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.18);
        }
        .exchanger-btn {
            background: linear-gradient(90deg, #D4AF37, #F2D06B);
            color: #0B0C10; border: none; padding: 12px 18px; border-radius: 12px;
            font-size: 1rem; font-weight: 700; cursor: pointer; width: 100%;
            text-transform: uppercase; transition: transform 0.12s ease, box-shadow 0.2s ease;
            margin-top: 10px; letter-spacing: 0.04em; box-shadow: 0 10px 20px rgba(212, 175, 55, 0.18);
        }
        .exchanger-btn:hover { transform: translateY(-1px); box-shadow: 0 12px 24px rgba(212, 175, 55, 0.24); }
        .exchanger-btn:active { transform: scale(0.97); }
        .exchanger-btn:disabled { background: linear-gradient(90deg, #6a6a6a, #8b8b8b); color: #d9d9d9; cursor: not-allowed; box-shadow: none; }
        .exchanger-status {
            margin: 6px 0 4px; color: rgba(247, 241, 208, 0.82); font-size: 0.95rem;
        }
        .upgrade-section {
            margin-top: 22px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.12);
        }
        .exchanger-upgrade-copy {
            font-size: 0.9rem; margin-bottom: 8px; color: rgba(247, 241, 208, 0.78);
        }
        .timer-display {
            font-size: 2.1rem; color: var(--gold-secondary); font-weight: 800; margin: 14px 0 8px;
            letter-spacing: 0.1em;
        }
        .exchanger-note {
            font-size: 0.86rem; color: rgba(247, 241, 208, 0.7); margin: 0 0 8px;
        }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    const modalHTML = `
        <div id="exchanger-modal">
            <div class="exchanger-content">
                <div class="exchanger-close" id="exchanger-close-btn">&times;</div>
                <div class="exchanger-badge">VIP Vault</div>
                <h2 class="exchanger-title">Silver Exchange</h2>
                <p class="exchanger-subtitle">Convert your VIP silver chips into premium normal chips with a polished, high-stakes exchange.</p>
                <div id="exchanger-active-view" style="display: none;">
                    <p class="exchanger-status">Your exchange is currently in progress.</p>
                    <div class="timer-display" id="exchanger-timer">00:00</div>
                    <p class="exchanger-note">The vault will be ready for collection shortly.</p>
                    <button class="exchanger-btn" id="exchanger-claim-btn" style="display: none;">Collect Chips</button>
                </div>
                <div id="exchanger-idle-view">
                    <div class="exchanger-rate">Rate: 1 Silver = ${EXCHANGE_RATE} Chips</div>
                    <div class="exchanger-input-group">
                        <input type="number" class="exchanger-input" id="exchanger-amount" placeholder="Silver amount" min="1">
                        <p id="exchanger-preview" style="color: var(--gold-secondary); font-size: 0.92rem; margin: 4px 0 0;">Projected payout: 0 chips</p>
                    </div>
                    <button class="exchanger-btn" id="exchanger-start-btn">Begin Exchange</button>
                </div>
                <div class="upgrade-section" id="exchanger-upgrade-section">
                    <p class="exchanger-upgrade-copy">Accelerate processing and cut the wait down to just 5 minutes.</p>
                    <button class="exchanger-btn" id="exchanger-upgrade-btn" style="background: linear-gradient(90deg, #C0C0C0, #E8E8E8);">
                        Upgrade for 5,000,000
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modal = document.getElementById('exchanger-modal');
    const closeBtn = document.getElementById('exchanger-close-btn');
    const openBtn = document.getElementById('exchange-btn');
    const activeView = document.getElementById('exchanger-active-view');
    const idleView = document.getElementById('exchanger-idle-view');
    const timerDisplay = document.getElementById('exchanger-timer');
    const claimBtn = document.getElementById('exchanger-claim-btn');
    const startBtn = document.getElementById('exchanger-start-btn');
    const inputAmount = document.getElementById('exchanger-amount');
    const previewText = document.getElementById('exchanger-preview');
    const upgradeSection = document.getElementById('exchanger-upgrade-section');
    const upgradeBtn = document.getElementById('exchanger-upgrade-btn');

    let timerInterval = null;

    function updateUI() {
        if (exchangeData.isUpgraded) {
            upgradeSection.style.display = 'none';
        } else {
            upgradeSection.style.display = 'block';
        }

        if (exchangeData.activeExchange) {
            idleView.style.display = 'none';
            activeView.style.display = 'block';
            checkTimer();
        } else {
            idleView.style.display = 'block';
            activeView.style.display = 'none';
            inputAmount.value = '';
            previewText.innerText = 'Projected payout: 0 chips';
        }
    }

    function checkTimer() {
        if (!exchangeData.activeExchange) return;
        
        const now = Date.now();
        const timeLeft = exchangeData.activeExchange.endTime - now;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerDisplay.innerText = "READY!";
            claimBtn.style.display = 'block';
        } else {
            claimBtn.style.display = 'none';
            const minutes = Math.floor(timeLeft / 60000);
            const seconds = Math.floor((timeLeft % 60000) / 1000);
            timerDisplay.innerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            if (!timerInterval) {
                timerInterval = setInterval(checkTimer, 1000);
            }
        }
    }

    inputAmount.addEventListener('input', () => {
        const val = parseInt(inputAmount.value);
        if (isNaN(val) || val <= 0) {
            previewText.innerText = `Projected payout: 0 chips`;
        } else {
            previewText.innerText = `Projected payout: ${(val * EXCHANGE_RATE).toLocaleString()} chips`;
        }
    });

    startBtn.addEventListener('click', () => {
        const silverToSpend = parseInt(inputAmount.value);
        if (isNaN(silverToSpend) || silverToSpend <= 0) return alert("Please enter a valid silver amount.");

        let currentSilver = parseInt(localStorage.getItem('kings-casino-vip-chips')) || 0;
        
        if (silverToSpend > currentSilver) {
            return alert("Your vault balance is too low for that exchange.");
        }

        localStorage.setItem('kings-casino-vip-chips', currentSilver - silverToSpend);
        window.dispatchEvent(new Event('storage'));

        if (typeof window.recordVipFirstExchange === 'function') {
            window.recordVipFirstExchange();
        }

        const duration = exchangeData.isUpgraded ? UPGRADED_TIME_MS : BASE_TIME_MS;
        
        exchangeData.activeExchange = {
            amountSilver: silverToSpend,
            amountNormal: silverToSpend * EXCHANGE_RATE,
            endTime: Date.now() + duration
        };

        saveData();
        updateUI();
    });

    claimBtn.addEventListener('click', () => {
        if (!exchangeData.activeExchange) return;

        let currentNormal = parseInt(localStorage.getItem('kings-casino-chips')) || 0;
        localStorage.setItem('kings-casino-chips', currentNormal + exchangeData.activeExchange.amountNormal);
        window.dispatchEvent(new Event('storage'));

        exchangeData.activeExchange = null;
        saveData();
        updateUI();
    });

    upgradeBtn.addEventListener('click', () => {
        let currentNormal = parseInt(localStorage.getItem('kings-casino-chips')) || 0;
        
        if (currentNormal < UPGRADE_COST) {
            return alert("You need 5,000,000 chips to unlock this upgrade.");
        }

        if (confirm("Spend 5,000,000 chips to upgrade the exchange and cut the wait to 5 minutes?")) {
            localStorage.setItem('kings-casino-chips', currentNormal - UPGRADE_COST);
            window.dispatchEvent(new Event('storage'));
            
            exchangeData.isUpgraded = true;
            saveData();
            updateUI();
            alert("Vault upgrade complete. Your exchanges will now finish in 5 minutes.");
        }
    });

    if (openBtn) {
        openBtn.addEventListener('click', () => {
            updateUI();
            modal.style.display = 'flex';
        });
    }

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
    });

})();