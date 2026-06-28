(function () {
    const PIGGY_LAST_CLAIM = "kings-casino-piggy-last-claim";
    const PIGGY_PLAYTIME = "kings-casino-piggy-playtime";
    const PIGGY_LAST_COLLECTED_PLAYTIME = "kings-casino-piggy-last-collected-playtime";

    function getPiggyMaxCapacity() {
        const level = parseInt(localStorage.getItem('kings-casino-piggy-stage'), 10);
        if (level === 2) return 20000;
        if (level >= 3) return 100000;
        return 10000;
    }

    const INCREMENT_MS = 60 * 1000;
    const COOLDOWN_MS = 12 * 60 * 60 * 1000;

    const CLICK_SFX = new Audio('sfx/piggybank-open.mp3');
    const COLLECT_SFX = new Audio('sfx/piggy-bank.mp3');
    const HAMMER_SFX = new Audio('sfx/piggy-bank-hammer.mp3');

    function startPlaytimeTimer() {
        let playStart = Date.now();
        let playtime = parseInt(localStorage.getItem(PIGGY_PLAYTIME) || "0", 10);

        function savePlaytime() {
            const now = Date.now();
            playtime += now - playStart;
            localStorage.setItem(PIGGY_PLAYTIME, playtime.toString());
            playStart = now;
        }

        window.addEventListener('beforeunload', savePlaytime);
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                savePlaytime();
            } else {
                playStart = Date.now();
            }
        });
    }

    function availableBankChips() {
        const playtime = parseInt(localStorage.getItem(PIGGY_PLAYTIME) || "0", 10);
        const lastCollectedPlaytime = parseInt(localStorage.getItem(PIGGY_LAST_COLLECTED_PLAYTIME) || "0", 10);
        const effectivePlay = Math.max(playtime - lastCollectedPlaytime, 0);
        const increments = Math.floor(effectivePlay / INCREMENT_MS);

        let level = parseInt(localStorage.getItem('kings-casino-piggy-stage'), 10);
        if (isNaN(level)) level = 1;

        let currentChipsPerIncrement = 100;
        if (level === 2) currentChipsPerIncrement = 200;
        if (level >= 3) currentChipsPerIncrement = 300;

        return Math.min(increments * currentChipsPerIncrement, getPiggyMaxCapacity());
    }

    function getCooldownRemainingMs() {
        const lastClaim = parseInt(localStorage.getItem(PIGGY_LAST_CLAIM) || "0", 10);
        const now = Date.now();

        let level = parseInt(localStorage.getItem('kings-casino-piggy-stage'), 10) || 1;

        let currentCooldown = 12 * 60 * 60 * 1000;
        if (level === 2) currentCooldown = 6 * 60 * 60 * 1000;
        if (level >= 3) currentCooldown = 3 * 60 * 60 * 1000;

        const cooldownPassed = now - lastClaim;
        if (!lastClaim || cooldownPassed >= currentCooldown) return 0;
        return currentCooldown - cooldownPassed;
    }

    function formatTime(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return [
            hours.toString().padStart(2, '0'),
            minutes.toString().padStart(2, '0'),
            seconds.toString().padStart(2, '0')
        ].join(':');
    }

    function randBetween(min, max) {
        return Math.random() * (max - min) + min;
    }

    function spawnFallingCoin(container, coinImgUrl) {
        const coin = document.createElement('img');
        coin.src = coinImgUrl;
        coin.style.position = "absolute";
        coin.style.left = randBetween(5, 95) + "%";
        coin.style.top = "-60px";

        const size = randBetween(36, 64);
        coin.style.width = `${size}px`;
        coin.style.pointerEvents = "none";
        coin.style.opacity = randBetween(0.7, 1).toFixed(2);
        coin.style.filter = `brightness(0.24) sepia(1) hue-rotate(${randBetween(-25, 25)}deg)`;

        const duration = randBetween(2.3, 3.6);
        coin.style.transition = `top ${duration}s linear, opacity 0.8s`;

        container.appendChild(coin);

        setTimeout(() => {
            coin.style.top = "calc(100% + 70px)";
            coin.style.opacity = "0.25";
        }, 30);

        setTimeout(() => {
            if (coin.parentNode) coin.parentNode.removeChild(coin);
        }, duration * 1000 + 1200);
    }

    function getPiggyImgSrc(chipsToClaim, brokenStage = 0) {
        if (brokenStage === 1) {
            if (chipsToClaim >= 5000) return "resources/ui/piggybank-stage/piggy-bank-gold-crack1.png";
            if (chipsToClaim >= 100) return "resources/ui/piggybank-stage/piggy-bank-crack1.png";
            return "resources/ui/piggy-bank-empty.png";
        } else if (brokenStage === 2) {
            if (chipsToClaim >= 5000) return "resources/ui/piggybank-stage/piggy-bank-gold-crack2.png";
            if (chipsToClaim >= 100) return "resources/ui/piggybank-stage/piggy-bank-crack2.png";
            return "resources/ui/piggy-bank-empty.png";
        } else if (brokenStage === 3) {
            if (chipsToClaim >= 5000) return "resources/ui/piggybank-stage/piggy-bank-gold-broken.png";
            if (chipsToClaim >= 100) return "resources/ui/piggybank-stage/piggy-bank-broken.png";
            return "resources/ui/piggy-bank-empty.png";
        } else {
            if (chipsToClaim >= 5000) {
                return "resources/ui/piggy-bank-gold.png";
            } else if (chipsToClaim >= 100) {
                return "resources/ui/piggy-bank.png";
            } else {
                return "resources/ui/piggy-bank-empty.png";
            }
        }
    }

    function createPiggyPopup() {
        CLICK_SFX.play().catch(() => {});

        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes slideIn {
                from { transform: translateY(100%); }
                to { transform: translateY(0); }
            }
            .piggy-fullscreen {
                animation: slideIn 0.3s ease-out forwards;
            }
            .piggy-popup-coinfall {
                position: absolute;
                pointer-events: none;
                top: 0; left: 0; width: 100%; height: 100%; z-index: 0;
                overflow: hidden;
            }
            .piggy-popup-content {
                position: relative;
                z-index: 1;
                text-align: center;
                width: 90%;
            }
            .piggy-cooldown-info {
                color:#faa600;font-size:1.4rem;font-weight:bold;margin-bottom:22px;
                letter-spacing:1px;
            }
            .piggy-claim-btn:disabled, #claim-btn:disabled {
                background: #aaa !important;
                color: #888 !important;
                cursor: not-allowed !important;
                opacity: 0.7;
            }
            .piggy-break-anim {
                animation: piggy-break-pop 0.17s cubic-bezier(.57,2.2,.79,.74);
            }
            @keyframes piggy-break-pop {
                0% { transform: scale(1) rotate(0deg);}
                50% { transform: scale(1.15) rotate(-5deg);}
                100% { transform: scale(1) rotate(0deg);}
            }
        `;
        document.head.appendChild(style);

        const overlay = document.createElement('div');
        overlay.className = "piggy-fullscreen";
        overlay.style.cssText =
            "position:fixed;top:0;left:0;width:100vw;height:100vh;background:#110517;z-index:9999;display:flex;justify-content:center;align-items:center;color:#f1c40f;font-family:'Arial Black',sans-serif;overflow:hidden;";

        const fallingCoinLayer = document.createElement('div');
        fallingCoinLayer.className = "piggy-popup-coinfall";

        const coinImgUrl = "resources/items/100-chip.png";

        let coinTimerActive = true;
        function spawnCoinLoop() {
            if (!coinTimerActive) return;
            spawnFallingCoin(fallingCoinLayer, coinImgUrl);
            if (Math.random() > 0.7) spawnFallingCoin(fallingCoinLayer, coinImgUrl);
            setTimeout(spawnCoinLoop, randBetween(280, 500));
        }
        setTimeout(spawnCoinLoop, 120);

        const chipsToClaim = availableBankChips();
        const remainingCooldownMs = getCooldownRemainingMs();
        let cooldownHtml = "";
        let claimInfoHtml = "";

        let breakStage = 0;
        let piggyImgSrc = getPiggyImgSrc(chipsToClaim);

        if (remainingCooldownMs > 0) {
            cooldownHtml = `<div class="piggy-cooldown-info" id="piggy-cooldown-timer">will be ready in<br><span id="piggy-cooldown-countdown" style="font-size:2.3rem;color:#fff;display:block;margin-top:5px;">${formatTime(remainingCooldownMs)}</span></div>`;
        }
        claimInfoHtml =
            `<button id="claim-btn" class="piggy-claim-btn" style="background:#e74c3c;border:none;color:white;padding:20px 50px;font-size:2rem;cursor:pointer;border-radius:10px;">BREAK OPEN</button>`;

        overlay.innerHTML = `
            <div class="piggy-popup-content">
                <img id="piggy-anim-img" src="${piggyImgSrc}" alt="Piggy Bank" style="width:209px;height:193px;margin-bottom:8px;filter:drop-shadow(0 7px 22px #0008);user-drag:none;user-select:none;">
                <h1 style="font-size:3rem;text-transform:uppercase;">PIGGY BANK</h1>
                ${cooldownHtml}
                <div style="font-size:5rem;margin:40px 0;color:blue;">
                    <img style="width:60px;vertical-align:middle;" src="resources/items/100-chip.png"> ${chipsToClaim}
                </div>
                ${claimInfoHtml}
                <br><br>
                <button id="close-btn" style="background:transparent;border:2px solid #555;color:#fff;padding:15px 30px;cursor:pointer;font-size:1.2rem;">BACK TO GAME</button>
            </div>
        `;

        overlay.appendChild(fallingCoinLayer);

        document.body.appendChild(overlay);

        document.getElementById('close-btn').onclick = () => {
            coinTimerActive = false;
            overlay.remove();
            style.remove();
        };

        const claimBtn = document.getElementById('claim-btn');
        const piggyImg = document.getElementById('piggy-anim-img');

        function updateClaimButton() {
            const cooldown = getCooldownRemainingMs();
            const chips = availableBankChips();
            claimBtn.disabled = cooldown > 0 || chips < 100 || breakStage === 3;
        }
        updateClaimButton();

        let intervalIdCooldown = null;
        if (remainingCooldownMs > 0) {
            let intervalId;
            function updateCountdown() {
                const ms = getCooldownRemainingMs();
                const el = document.getElementById('piggy-cooldown-countdown');
                if (el) el.textContent = formatTime(Math.max(ms, 0));
                updateClaimButton();
                if (ms <= 0) {
                    clearInterval(intervalId);
                    overlay.remove();
                    style.remove();
                    setTimeout(createPiggyPopup, 100);
                }
            }
            intervalId = setInterval(updateCountdown, 1000);
            intervalIdCooldown = intervalId;
        }

        if (claimBtn && piggyImg) {
            let breakClicks = 0;
            claimBtn.onclick = () => {
                if (claimBtn.disabled) return;
                if (getCooldownRemainingMs() > 0 || availableBankChips() < 100 || breakStage === 3) return;

                try {
                    HAMMER_SFX.currentTime = 0;
                    HAMMER_SFX.play();
                } catch (e) {}

                breakClicks++;
                breakStage = Math.min(breakClicks, 3);

                COLLECT_SFX.currentTime = 0;
                COLLECT_SFX.play().catch(() => {});

                piggyImg.classList.remove('piggy-break-anim');
                void piggyImg.offsetWidth;
                piggyImg.classList.add('piggy-break-anim');

                piggyImg.src = getPiggyImgSrc(chipsToClaim, breakStage);

                if (breakClicks < 3) {
                    claimBtn.innerText = `BREAK (${3 - breakClicks} more)`;
                    updateClaimButton();
                    return;
                }

                claimBtn.innerText = "SHATTERED!";
                claimBtn.disabled = true;
                piggyImg.classList.remove('piggy-break-anim');
                piggyImg.classList.add('piggy-break-anim');
                piggyImg.src = getPiggyImgSrc(chipsToClaim, 3);

                setTimeout(() => {
                    const chipsAdded = availableBankChips();
                    const bal = parseInt(localStorage.getItem("kings-casino-chips") || "0", 10);
                    localStorage.setItem("kings-casino-chips", (bal + chipsAdded).toString());

                    const playtime = parseInt(localStorage.getItem(PIGGY_PLAYTIME) || "0", 10);
                    localStorage.setItem(PIGGY_LAST_COLLECTED_PLAYTIME, playtime.toString());

                    const now = Date.now();
                    localStorage.setItem(PIGGY_LAST_CLAIM, now.toString());

                    if (typeof window.recordPiggyFirstBreak === 'function') {
                        window.recordPiggyFirstBreak();
                    }

                    alert(`${chipsAdded} chips added!`);
                    coinTimerActive = false;
                    if (intervalIdCooldown) clearInterval(intervalIdCooldown);
                    overlay.remove();
                    style.remove();
                }, 750);
            };
        }
    }

    function updatePiggyIcon() {
    let icon = document.getElementById('piggy-btn');
    
    const isHidden = localStorage.getItem('kings-casino-piggy-hidden') === 'true';

    function getPiggyIconSrc() {
        const chipsToClaim = availableBankChips();
        if (chipsToClaim >= 5000) return "resources/ui/piggy-bank-gold.png";
        if (chipsToClaim >= 100) return "resources/ui/piggy-bank.png";
        return "resources/ui/piggy-bank-empty.png";
    }

    if (!icon) {
        icon = document.createElement('img');
        icon.id = 'piggy-btn';
        icon.src = getPiggyIconSrc();
        icon.style.cssText = "position:fixed;bottom:20px;right:20px;width:80px;cursor:pointer;z-index:9998;";
        icon.onclick = createPiggyPopup;
        document.body.appendChild(icon);
    } else {
        icon.src = getPiggyIconSrc();
    }

    icon.style.display = isHidden ? 'none' : '';
}

document.addEventListener('DOMContentLoaded', updatePiggyIcon);

    (function initialize_collected_playtime() {
        const playtime = parseInt(localStorage.getItem(PIGGY_PLAYTIME) || "0", 10);
        const lastCollectedPlaytime = localStorage.getItem(PIGGY_LAST_COLLECTED_PLAYTIME);
        if (lastCollectedPlaytime === null) {
            const lastClaim = localStorage.getItem(PIGGY_LAST_CLAIM);
            if (lastClaim) {
                const old = localStorage.getItem(`${PIGGY_PLAYTIME}_${lastClaim}`);
                if (old !== null) {
                    localStorage.setItem(PIGGY_LAST_COLLECTED_PLAYTIME, old);
                } else {
                    localStorage.setItem(PIGGY_LAST_COLLECTED_PLAYTIME, playtime.toString());
                }
            } else {
                localStorage.setItem(PIGGY_LAST_COLLECTED_PLAYTIME, "0");
            }
        }
    })();

    startPlaytimeTimer();
    updatePiggyIcon();
})();