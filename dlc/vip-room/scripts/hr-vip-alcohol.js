(function () {
    const CHIP_KEY = 'kings-casino-vip-chips'; 
    
    const ALCOHOL_COOLDOWN_KEY = 'vip-horse-alcohol-cooldown';
    const ALCOHOL_ACTIVE_KEY = 'vip-horse-alcohol-active';
    const ALCOHOL_ACTIVE_UNTIL_KEY = 'vip-horse-alcohol-active-until';
    
    const ALCOHOL_COST = 50000; 
    const ALCOHOL_EFFECT_MINS = 5;
    const ALCOHOL_COOLDOWN_HOURS = 6;
    let alcoholBtnSfx;

    function createAlcoholPotionButton() {
        if (document.getElementById('hr-vip-alcohol-btn')) return;

        if (!document.getElementById('hr-vip-alcohol-btn-style')) {
            const style = document.createElement('style');
            style.id = 'hr-vip-alcohol-btn-style';
            style.textContent = `
                #hr-vip-alcohol-btn {
                    position: fixed;
                    bottom: 30px;
                    left: 30px;
                    z-index: 3333;
                    width: 64px;
                    height: 64px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #e8e8e8 0%, #c0c0c0 40%, #a0a0a0 100%);
                    border: 3px solid #ffffff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 8px 30px rgba(192, 192, 192, 0.6), 0 0 6px #fff8, 0 2px 0 #7a7a7a;
                    transition: filter 0.2s, transform 0.2s;
                    cursor: pointer;
                    overflow: hidden;
                }
                #hr-vip-alcohol-btn:active {
                    filter: brightness(0.95) drop-shadow(0 0 8px rgba(192, 192, 192, 0.8));
                    transform: scale(0.96);
                }
                #hr-vip-alcohol-btn[disabled], #hr-vip-alcohol-btn.cooldown {
                    pointer-events: none;
                    opacity: 0.4;
                    filter: grayscale(1);
                }
                #hr-vip-alcohol-btn img {
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    display: block;
                    pointer-events: none;
                    z-index: 1;
                }
                #hr-vip-alcohol-btn .alcohol-timer {
                    position: absolute;
                    bottom: 2px;
                    left: 0;
                    width: 100%;
                    text-align: center;
                    font-size: 0.7rem;
                    color: #fff;
                    text-shadow: 0 1px 3px #0009;
                    pointer-events: none;
                    z-index: 2;
                }
            `;
            document.head.appendChild(style);
        }

        if (!alcoholBtnSfx) {
            alcoholBtnSfx = new Audio('../../sfx/hr-click.mp3');
            alcoholBtnSfx.preload = 'auto';
            alcoholBtnSfx.volume = 0.6;
        }

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.id = 'hr-vip-alcohol-btn';
        btn.title = `Buy VIP Alcohol Potion (${ALCOHOL_COST} VIP chips)`;
        btn.innerHTML = `
            <img src="../../resources/horse-racing/alcohol-1.png" alt="Alcohol Potion"/>
            <div class="alcohol-timer"></div>
        `;
        document.body.appendChild(btn);

        btn.addEventListener('click', function () {
            if (alcoholBtnSfx && alcoholBtnSfx.paused) {
                alcoholBtnSfx.currentTime = 0;
                alcoholBtnSfx.play().catch(() => {});
            }
            handlePotionClick();
        });

        setInterval(updateAlcoholButtonState, 1000);
        updateAlcoholButtonState();
    }

    function handlePotionClick() {
        if (!canBuyPotion()) {
            showAlcoholPopup("This VIP potion is cooling down. Try again later!", true);
            return;
        }
        showAlcoholPopup(
            `Buy 1 VIP Alcohol Potion for ${ALCOHOL_COST} VIP chips?<br><br>
            <b>Effect:</b> Your horses win <span style="color:#e380ff">EVERY TIME</span> for <b>5 minutes</b>.<br>Once used, 6h cooldown.`, false, true
        );
    }

    function canBuyPotion() {
        const cooldownEnd = parseInt(localStorage.getItem(ALCOHOL_COOLDOWN_KEY), 10) || 0;
        const activeUntil = parseInt(localStorage.getItem(ALCOHOL_ACTIVE_UNTIL_KEY), 10) || 0;
        const now = Date.now();
        return now >= cooldownEnd && now >= activeUntil;
    }

    function updateAlcoholButtonState() {
        const btn = document.getElementById('hr-vip-alcohol-btn');
        if (!btn) return;
        const now = Date.now();
        const cooldownEnd = parseInt(localStorage.getItem(ALCOHOL_COOLDOWN_KEY), 10) || 0;
        const activeUntil = parseInt(localStorage.getItem(ALCOHOL_ACTIVE_UNTIL_KEY), 10) || 0;
        const timerLabel = btn.querySelector('.alcohol-timer');
        btn.classList.remove('cooldown');

        if (now < activeUntil) {
            let timeLeft = Math.ceil((activeUntil - now) / 1000);
            if (timeLeft < 0) timeLeft = 0;
            timerLabel.textContent = `Active: ${formatDuration(timeLeft)}`;
            btn.classList.add('cooldown');
            if (timeLeft === 0) setTimeout(updateAlcoholButtonState, 1000);
        } else if (now < cooldownEnd) {
            let timeLeft = Math.ceil((cooldownEnd - now) / 1000);
            if (timeLeft < 0) timeLeft = 0;
            timerLabel.textContent = `Cooldown: ${formatDuration(timeLeft)}`;
            btn.classList.add('cooldown');
            if (timeLeft === 0) setTimeout(updateAlcoholButtonState, 1000);
        } else {
            timerLabel.textContent = "";
        }
    }

    function formatDuration(secs) {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        if (m > 0) return `${m}:${s.toString().padStart(2, "0")}`;
        return `${s}s`;
    }

    function showAlcoholPopup(msg, error = false, showConfirm = false) {
        closeAlcoholPopup();

        const overlay = document.createElement('div');
        overlay.id = 'vip-alcohol-popup-overlay';
        overlay.style.cssText = `
            position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(11, 12, 16, 0.85);z-index:4000;display:flex;align-items:center;justify-content:center;
        `;

        const popup = document.createElement('div');
        popup.style.cssText = `
            background: linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.9) 100%);
            backdrop-filter: blur(15px);
            color: #fff;
            border-radius: 18px;
            border: 3px solid #C0C0C0;
            padding: 30px 35px 24px 35px;
            box-shadow: 0 12px 50px rgba(0,0,0,0.85), 0 0 15px rgba(192, 192, 192, 0.4);
            font-size: 1.11rem;
            text-align: center;
            max-width: 96vw;
            min-width: 280px;
        `;
        const alcoholImg = `<img src="../../resources/horse-racing/alcohol-2.png" alt="Alcohol Potion" style="height:2.2rem;width:2.2rem;display:inline-block;margin-bottom:10px;"/>`;
        popup.innerHTML = `<div style="margin-bottom:10px;">${alcoholImg}</div><div>${msg}</div>`;

        const btnRow = document.createElement('div');
        btnRow.style.marginTop = '23px';
        btnRow.style.display = 'flex';
        btnRow.style.justifyContent = 'center';
        btnRow.style.gap = '23px';

        if (showConfirm) {
            const buyBtn = document.createElement('button');
            buyBtn.textContent = "Buy";
            buyBtn.style.cssText = `
                background: linear-gradient(90deg, #812fff 60%, #d359e9 100%);
                color: #fff;
                border-radius: 10px;
                border: none;
                padding: 10px 30px;
                font-size: 0.97rem;
                font-weight: 700;
                cursor: pointer;
                box-shadow: 0 3px 0 #5a1a9b;
            `;
            buyBtn.onclick = buyAlcoholPotion;

            const cancelBtn = document.createElement('button');
            cancelBtn.textContent = "Cancel";
            cancelBtn.style.cssText = `
                background: rgba(192,192,192,0.2);
                color: #fff;
                border-radius: 10px;
                border: 1px solid #C0C0C0;
                padding: 9px 23px;
                font-size: 0.97rem;
                font-weight: 500;
                cursor: pointer;
            `;
            cancelBtn.onclick = closeAlcoholPopup;

            btnRow.appendChild(buyBtn);
            btnRow.appendChild(cancelBtn);
        } else {
            const okBtn = document.createElement('button');
            okBtn.textContent = "OK";
            okBtn.style.cssText = `
                background: rgba(192,192,192,0.2);
                color: #fff;
                border-radius: 10px;
                border: 1px solid #C0C0C0;
                padding: 9px 34px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
            `;
            okBtn.onclick = closeAlcoholPopup;
            btnRow.appendChild(okBtn);
        }

        popup.appendChild(btnRow);
        overlay.appendChild(popup);
        document.body.appendChild(overlay);
    }

    function closeAlcoholPopup() {
        const overlay = document.getElementById('vip-alcohol-popup-overlay');
        if (overlay) overlay.remove();
    }

    function buyAlcoholPotion() {
        closeAlcoholPopup();
        let currentChips = parseInt(localStorage.getItem(CHIP_KEY), 10) || 0;
        if (currentChips < ALCOHOL_COST) {
            showAlcoholPopup("Not enough VIP chips!", true);
            return;
        }

        currentChips -= ALCOHOL_COST;
        localStorage.setItem(CHIP_KEY, currentChips);

        const now = Date.now();
        const effectUntil = now + ALCOHOL_EFFECT_MINS * 60 * 1000;
        const cooldownUntil = now + ALCOHOL_COOLDOWN_HOURS * 60 * 60 * 1000;

        localStorage.setItem(ALCOHOL_ACTIVE_KEY, 'true');
        localStorage.setItem(ALCOHOL_ACTIVE_UNTIL_KEY, effectUntil.toString());
        localStorage.setItem(ALCOHOL_COOLDOWN_KEY, cooldownUntil.toString());

        if (typeof window.recordVipHorseAlcoholPurchase === 'function') window.recordVipHorseAlcoholPurchase();

        showAlcoholPopup(
            `VIP Alcohol Potion activated!<br>Your horses will win every time for 5 minutes.`,
            false
        );

        updateAlcoholButtonState();
        window.dispatchEvent(new Event('storage'));
    }

    window.isHorseAlcoholPotionActive = function () {
        const effectUntil = parseInt(localStorage.getItem(ALCOHOL_ACTIVE_UNTIL_KEY), 10) || 0;
        return Date.now() < effectUntil;
    };

    window.addEventListener('storage', function (e) {
        if (
            e &&
            (
                e.key === ALCOHOL_ACTIVE_UNTIL_KEY ||
                e.key === ALCOHOL_COOLDOWN_KEY ||
                e.key === ALCOHOL_ACTIVE_KEY
            )
        ) {
            updateAlcoholButtonState();
        }
    });

    document.addEventListener('DOMContentLoaded', createAlcoholPotionButton);
})();