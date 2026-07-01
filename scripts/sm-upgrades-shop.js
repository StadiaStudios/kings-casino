(function () {
    const UPGRADE_STORAGE_KEY = "kings-casino-multiplier";
    const AUTO_SPIN_PURCHASED_KEY = "kings-casino-auto-spin-purchased";
    
    const MAX_MULTIPLIER = 2.5;

    let currentMultiplier = parseFloat(localStorage.getItem(UPGRADE_STORAGE_KEY)) || 1;
    if (currentMultiplier > MAX_MULTIPLIER) {
        currentMultiplier = MAX_MULTIPLIER;
        localStorage.setItem(UPGRADE_STORAGE_KEY, currentMultiplier);
    }

    const styles = `
        .store-overlay {
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0, 0, 0, 0.78); backdrop-filter: blur(5px);
            z-index: 9999; display: flex; justify-content: center; align-items: center;
            opacity: 0; pointer-events: none; transition: opacity 0.25s ease;
        }
        .store-overlay.active { opacity: 1; pointer-events: auto; }
        .store-modal {
            background: linear-gradient(135deg, #2a1035 0%, #110517 100%);
            border: 3px solid #2ecc71; box-shadow: 0 0 25px rgba(46,204,113, 0.25), inset 0 0 15px rgba(0,0,0,0.6);
            width: 90%; max-width: 400px; border-radius: 24px; padding: 32px 25px 28px 25px;
            transform: scale(0.85); transition: transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            color: #fff; text-align: center; position: relative; max-height: 90vh; overflow-y: auto;
        }
        .store-overlay.active .store-modal { transform: scale(1); }
        .store-title {
            font-size: 2.1rem; background: linear-gradient(to bottom, #f1c40f, #2ecc71 90%);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent; text-fill-color: transparent;
            margin-bottom: 8px; text-transform: uppercase; font-weight: 700; letter-spacing: 1px;
        }
        .store-desc { font-size: 1.05rem; color: #bdc3c7; margin-bottom: 10px; letter-spacing: 0.03em; }
        .store-current-mult { font-size: 1.1rem; font-weight: 600; color: #2ecc71; margin-bottom: 15px; margin-top: 6px; }
        .store-btn-purchase {
            padding: 12px 10px; font-size: 1.1rem; font-weight: 700; border-radius: 14px;
            border: 2px solid #58d68d; background: linear-gradient(to bottom,rgb(29, 29, 29),rgb(174, 70, 39));
            color: #fff; cursor: pointer; width: 100%; margin: 10px 0 0 0;
            box-shadow: 0 3px 0 #1e8449, 0 8px 14px rgba(46,204,113,0.08); transition: background 0.1s, transform 0.1s;
        }
        .store-btn-purchase:active {
            background: linear-gradient(to bottom, #27ae60, #219150); transform: translateY(3px);
            box-shadow: 0 0px 0 #1e8449, 0 4px 9px rgba(46,204,113,0.22);
        }
        .store-btn-locked { background: linear-gradient(to bottom, #95a5a6, #7f8c8d); border: 2px solid #bdc3c7; opacity: 0.88; cursor: not-allowed; }
        .store-btn-close { position: absolute; top: 14px; right: 17px; background: none; border: none; color: #fff; font-size: 2rem; font-weight: 700; cursor: pointer; opacity: 0.8; }
        .store-btn-close:hover { opacity: 1; }
        .store-max-msg { margin-top: 10px; color: #f1c40f; font-weight: 700; font-size: 1.06rem; }
    `;
    const storeStyleEl = document.createElement('style');
    storeStyleEl.textContent = styles;
    document.head.appendChild(storeStyleEl);

    const shopBtn = document.createElement('button');
    shopBtn.innerHTML = "UPGRADES";
    shopBtn.style.cssText = `
        position: fixed; bottom: 20px; left: 20px; z-index: 300;
        padding: 10px 20px; background:linear-gradient(to right, #12271c 30%, #213e33 100%);
        color: #fff; border: 3px solid #2ecc71; border-radius: 14px; cursor: pointer;
        font-family: 'Fredoka', sans-serif; font-weight: bold; font-size: 1.09rem;
        box-shadow: 0 1px 9px 0 rgba(34,139,34,0.13);
    `;
    document.body.appendChild(shopBtn);

    const shopBtnSFX = document.createElement('audio');
    shopBtnSFX.src = 'sfx/sm-click.mp3';
    shopBtnSFX.preload = 'auto';
    shopBtnSFX.style.display = 'none';
    document.body.appendChild(shopBtnSFX);

    const overlay = document.createElement('div');
    overlay.className = 'store-overlay';
    overlay.id = 'storeOverlay';
    overlay.innerHTML = `
        <div class="store-modal" id="storeModal">
            <button class="store-btn-close" id="closeStoreBtn" title="Close Shop">&times;</button>
            <div class="store-title">Casino Shop</div>
            <div class="store-desc">Upgrade your payouts!</div>
            <div class="store-current-mult" id="storeCurrentMult"></div>
            <div id="storeUpgradeContent"></div>
        </div>
    `;
    document.body.appendChild(overlay);

    function renderShop() {
        const currentStatsTxt = document.getElementById('storeCurrentMult');
        const content = document.getElementById('storeUpgradeContent');
        
        currentMultiplier = parseFloat(localStorage.getItem(UPGRADE_STORAGE_KEY)) || 1;
        
        currentStatsTxt.innerHTML = `Payout: <span style="color:#f1c40f;">${currentMultiplier}x</span>`;
        content.innerHTML = "";

        if (currentMultiplier < MAX_MULTIPLIER) {
            let nextMult = currentMultiplier + 0.5;
            if (nextMult > MAX_MULTIPLIER) nextMult = MAX_MULTIPLIER;
            nextMult = parseFloat(nextMult.toFixed(1));
            const cost = Math.floor(nextMult * 700);
            
            const multBtn = document.createElement('button');
            multBtn.className = "store-btn-purchase";
            multBtn.innerHTML = `💰 Payout <b>${nextMult}x</b> for <b>${cost.toLocaleString()}</b> chips`;
            multBtn.onclick = () => {
                if (getBalance() >= cost) {
                    updateBalance(-cost);
                    localStorage.setItem(UPGRADE_STORAGE_KEY, nextMult);
                    renderShop();
                } else {
                    multBtn.disabled = true;
                    multBtn.classList.add('store-btn-locked');
                    multBtn.innerHTML = `😢 Not enough chips!`;
                    setTimeout(() => renderShop(), 1300);
                }
            };
            content.appendChild(multBtn);
        } else {
            content.innerHTML += `<div class="store-max-msg">🎉 Max Payout Multiplier Reached!</div>`;
        }

        const autoSpinPurchased = localStorage.getItem(AUTO_SPIN_PURCHASED_KEY) === "true";
        if (!autoSpinPurchased) {
            const autoCost = 2500;
            const autoBtn = document.createElement('button');
            autoBtn.className = "store-btn-purchase";
            autoBtn.innerHTML = `⚙️ Buy <b>Auto-Spinner</b> for <b>${autoCost.toLocaleString()}</b> chips`;
            autoBtn.onclick = () => {
                if (getBalance() >= autoCost) {
                    updateBalance(-autoCost);
                    localStorage.setItem(AUTO_SPIN_PURCHASED_KEY, "true");
                    renderShop();
                }
            };
            content.appendChild(autoBtn);
        } else {
            content.innerHTML += `<div class="store-max-msg">✅ Auto-Spinner Purchased!</div>`;
        }
    }

    shopBtn.onclick = () => {
        shopBtnSFX.currentTime = 0;
        shopBtnSFX.play().catch(()=>{});
        overlay.classList.add('active');
        renderShop();
    };

    document.getElementById('closeStoreBtn').onclick = () => overlay.classList.remove('active');
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.classList.remove('active');
    });
    window.addEventListener('keydown', (e) => {
        if (overlay.classList.contains('active') && (e.key === "Escape" || e.key === "Esc")) {
            overlay.classList.remove('active');
        }
    });
})();