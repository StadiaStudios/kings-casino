(function () {
    const THRESHOLD = 2000;

    function getDynamicSpinCost() {
        const bal = typeof getBalance === "function" ? getBalance() : 0;
        return bal > THRESHOLD ? 20 : 10;
    }

    function getPayoutMultiplier() {
        const bal = typeof getBalance === "function" ? getBalance() : 0;
        return bal > THRESHOLD ? 1.5 : 1;
    }

    function updateCostDisplay() {
        const spinCostEls = document.querySelectorAll('.spin-cost');
        const currentCost = getDynamicSpinCost();
        spinCostEls.forEach(el => {
            el.innerHTML = `${currentCost} <img class="chip-icon" src="resources/items/chip.png" alt="chip" /> per spin`;
        });
    }

    window.getSpinCost = getDynamicSpinCost;
    window.getSlotMachinePayoutMultiplier = getPayoutMultiplier;

    let origUpdateBalance = null;
    if (typeof window.updateBalance === "function") {
        origUpdateBalance = window.updateBalance;
        window.updateBalance = function () {
            const result = origUpdateBalance.apply(this, arguments);
            updateCostDisplay();
            return result;
        };
    }

    window.addEventListener("storage", () => setTimeout(updateCostDisplay, 0));

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", updateCostDisplay);
    } else {
        updateCostDisplay();
    }

    window.__updateSlotCostDisplay = updateCostDisplay;
})();