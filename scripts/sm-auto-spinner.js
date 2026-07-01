(function () {
    const PURCHASED_KEY = "kings-casino-auto-spin-purchased";
    const ACTIVE_KEY = "kings-casino-auto-spin-active";
    const COOLDOWN_KEY = "kings-casino-auto-spin-cooldown";
    const COOLDOWN_DURATION_MS = 2 * 60 * 1000;
    const MAX_SPINS_BEFORE_COOLDOWN = 10;

    function msToTimeString(ms) {
        const totalSeconds = Math.ceil(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    function initAutoSpinner() {
        if (localStorage.getItem(PURCHASED_KEY) !== "true") return;

        let isActive = localStorage.getItem(ACTIVE_KEY) === "true";
        let spinsInRow = 0;
        let cooldownUntil = parseInt(localStorage.getItem(COOLDOWN_KEY), 10) || 0;
        let cooldownTimer = null;

        const btn = document.createElement('button');
        btn.id = "auto-spin-toggle-btn";
        btn.style.cssText = `
            position: fixed; bottom: 130px; left: 20px; z-index: 500;
            padding: 12px 24px; background: #c0392b;
            color: #fff; border: 3px solid #f1c40f; border-radius: 14px; 
            cursor: pointer; font-family: 'Fredoka', sans-serif; font-weight: bold;
        `;
        document.body.appendChild(btn);

        function updateBtn() {
            localStorage.setItem(ACTIVE_KEY, isActive);
            if (isOnCooldown()) {
                btn.innerText = "AUTO: COOLDOWN";
                btn.style.background = '#7f8c8d';
                btn.disabled = true;
                updateCooldownDisplay();
            } else {
                btn.disabled = false;
                btn.innerText = isActive ? "AUTO SPINNER: ON" : "AUTO SPINNER: OFF";
                btn.style.background = isActive ? '#27ae60' : '#c0392b';
                if (isActive) spinLoop();
            }
        }

        function isOnCooldown() {
            cooldownUntil = parseInt(localStorage.getItem(COOLDOWN_KEY), 10) || 0;
            return Date.now() < cooldownUntil;
        }

        function setCooldown() {
            spinsInRow = 0;
            cooldownUntil = Date.now() + COOLDOWN_DURATION_MS;
            localStorage.setItem(COOLDOWN_KEY, cooldownUntil);
            isActive = false;
            localStorage.setItem(ACTIVE_KEY, isActive);
            updateBtn();
            updateCooldownDisplay();
        }

        function clearCooldown() {
            localStorage.removeItem(COOLDOWN_KEY);
            cooldownUntil = 0;
            updateBtn();
        }

        function updateCooldownDisplay() {
            if (!isOnCooldown()) {
                btn.innerText = "AUTO: OFF";
                btn.disabled = false;
                btn.style.background = '#c0392b';
                if (cooldownTimer) {
                    clearInterval(cooldownTimer);
                    cooldownTimer = null;
                }
                return;
            }
            const updateText = () => {
                const remaining = cooldownUntil - Date.now();
                if (remaining > 0) {
                    btn.innerText = `COOLDOWN: ${msToTimeString(remaining)}`;
                } else {
                    clearCooldown();
                }
            };
            updateText();
            if (!cooldownTimer) {
                cooldownTimer = setInterval(updateText, 500);
            }
        }

        async function spinLoop() {
            if (!isActive || window.isSpinning) return;
            if (isOnCooldown()) {
                updateBtn();
                return;
            }
            if (typeof getBalance === "function" && getBalance() >= 10) {
                spinsInRow++;
                await window.spin();
                if (spinsInRow >= MAX_SPINS_BEFORE_COOLDOWN) {
                    setCooldown();
                    return;
                }
                setTimeout(spinLoop, 1000);
            } else {
                isActive = false;
                updateBtn();
            }
        }

        btn.onclick = () => {
            if (isOnCooldown()) return;
            isActive = !isActive;
            if (isActive) spinsInRow = 0;
            updateBtn();
        };

        if (isOnCooldown()) {
            updateBtn();
        } else {
            spinsInRow = 0;
            updateBtn();
        }

        window.addEventListener("focus", () => {
            if (isOnCooldown()) {
                updateCooldownDisplay();
            } else {
                clearCooldown();
            }
        });
    }

    if (document.readyState === 'complete') {
        initAutoSpinner();
    } else {
        window.addEventListener('load', initAutoSpinner);
    }
})();