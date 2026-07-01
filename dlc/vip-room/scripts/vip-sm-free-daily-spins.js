(function () {
    const DAILY_KEY = "vip-sm-last-free-spin-date";
    const FREE_SPINS_KEY = "vip-sm-free-spins-count";
    const FREE_SPIN_AMOUNT = 5;

    function grantDailyFreeSpins() {
        const todayStr = new Date().toISOString().slice(0, 10);
        const lastDate = localStorage.getItem(DAILY_KEY);
        let freeSpins = parseInt(localStorage.getItem(FREE_SPINS_KEY) || "0", 10);
        if (lastDate !== todayStr) {
            localStorage.setItem(DAILY_KEY, todayStr);
            freeSpins = FREE_SPIN_AMOUNT;
            localStorage.setItem(FREE_SPINS_KEY, String(freeSpins));
        }
    }

    function getFreeSpins() {
        return parseInt(localStorage.getItem(FREE_SPINS_KEY) || "0", 10);
    }

    function useFreeSpin() {
        let freeSpins = getFreeSpins();
        if (freeSpins > 0) {
            localStorage.setItem(FREE_SPINS_KEY, String(freeSpins - 1));
            return true;
        }
        return false;
    }

    function getNextFreeSpinTime() {
        const now = new Date();
        const next = new Date(now);
        next.setUTCHours(0, 0, 0, 0);
        if (
            now.getUTCHours() !== 0 ||
            now.getUTCMinutes() !== 0 ||
            now.getUTCSeconds() !== 0 ||
            now.getUTCMilliseconds() !== 0
        ) {
            next.setUTCDate(next.getUTCDate() + 1);
        }
        return next;
    }

    function getMsUntilNextFreeSpins() {
        const now = Date.now();
        return getNextFreeSpinTime().getTime() - now;
    }

    function formatDuration(ms) {
        if (ms <= 0) return "now";
        let totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
                .toString()
                .padStart(2, "0")}`;
        }
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }

    function patchSpinButton() {
        document.addEventListener("DOMContentLoaded", () => {
            const spinBtn = document.getElementById("insert-chip-btn");
            if (!spinBtn) return;

            let nextFreeLbl = document.getElementById("next-free-spin-timer-label");
            if (!nextFreeLbl) {
                nextFreeLbl = document.createElement("div");
                nextFreeLbl.id = "next-free-spin-timer-label";
                nextFreeLbl.style.color = "#c8c8da";
                nextFreeLbl.style.fontWeight = "bold";
                nextFreeLbl.style.fontSize = "0.98em";
                nextFreeLbl.style.textAlign = "center";
                nextFreeLbl.style.marginTop = "6px";
                nextFreeLbl.style.textShadow = "0 1px 8px #000d";
                const labels = [
                    spinBtn.parentElement.querySelector(".chip-label"),
                    spinBtn.parentElement.querySelector(".spin-price-label"),
                    spinBtn.nextElementSibling,
                ];
                let placed = false;
                for (const el of labels) {
                    if (el && el.parentElement) {
                        el.parentElement.insertBefore(nextFreeLbl, el.nextSibling);
                        placed = true;
                        break;
                    }
                }
                if (!placed) {
                    spinBtn.parentElement.appendChild(nextFreeLbl);
                }
            }

            const freeSpinIndicator = document.createElement("div");
            freeSpinIndicator.id = "free-spin-indicator";
            freeSpinIndicator.style.position = "absolute";
            freeSpinIndicator.style.top = "-10px";
            freeSpinIndicator.style.right = "-12px";
            freeSpinIndicator.style.background = "#c8c8da";
            freeSpinIndicator.style.color = "#222";
            freeSpinIndicator.style.fontWeight = "bold";
            freeSpinIndicator.style.borderRadius = "10px";
            freeSpinIndicator.style.padding = "2px 8px";
            freeSpinIndicator.style.fontSize = "0.98em";
            freeSpinIndicator.style.zIndex = "100";
            spinBtn.style.position = "relative";
            spinBtn.appendChild(freeSpinIndicator);

            function updateIndicators() {
                const n = getFreeSpins();
                if (n > 0) {
                    freeSpinIndicator.textContent = `🎁 ${n} VIP Free`;
                    freeSpinIndicator.style.display = "block";
                    nextFreeLbl.textContent = "";
                } else {
                    freeSpinIndicator.style.display = "none";
                    const msRem = getMsUntilNextFreeSpins();
                    if (msRem > 0) {
                        nextFreeLbl.textContent = `Next VIP Free Spin: ${formatDuration(msRem)}`;
                    } else {
                        grantDailyFreeSpins();
                        updateIndicators();
                    }
                }
            }

            updateIndicators();
            setInterval(updateIndicators, 1000);

            const origUpdateBalance = window.updateBalance;
            window.updateBalance = function (change) {
                if (typeof change === "number" && change < 0 && getFreeSpins() > 0) {
                    useFreeSpin();
                    updateIndicators();
                    return;
                }
                return origUpdateBalance.apply(this, arguments);
            };

            function maybeGrantAndUpdate() {
                grantDailyFreeSpins();
                updateIndicators();
            }
            spinBtn.addEventListener("click", maybeGrantAndUpdate, true);
            spinBtn.addEventListener("touchstart", maybeGrantAndUpdate, true);
        });
    }

    grantDailyFreeSpins();
    patchSpinButton();

    window.DailyFreeSpins = {
        grantDailyFreeSpins,
        getFreeSpins,
        useFreeSpin,
    };
})();