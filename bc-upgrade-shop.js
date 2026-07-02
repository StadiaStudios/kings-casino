(function () {
    const CHIP_KEY = 'kings-casino-chips';
    const BUD_KEY = 'kings-casino-buds';

    function injectShopStyles() {
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            .fullscreen-shop {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: radial-gradient(circle at 50% 30%, #2e113c 0%, #110517 80%);
                z-index: 100;
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 20px;
                transform: translateY(100%);
                transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1);
            }
            .fullscreen-shop.active {
                transform: translateY(0);
            }
            .shop-header {
                width: 100%;
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 25px;
                max-width: 500px;
                flex-shrink: 0;
            }
            .shop-title {
                font-size: 2.2rem;
                text-transform: uppercase;
                font-weight: 700;
                background: linear-gradient(to bottom, #2ecc71, #27ae60);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                filter: drop-shadow(0 4px 2px rgba(0,0,0,0.6));
            }
            .shop-close-btn {
                color: #fff;
                background: rgba(255,255,255,0.1);
                border: 2px solid #fff;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                font-size: 1.2rem;
                font-weight: 700;
                cursor: pointer;
                display: flex;
                justify-content: center;
                align-items: center;
                box-shadow: 0 4px 8px rgba(0,0,0,0.3);
                transition: transform 0.1s;
            }
            .shop-close-btn:active {
                transform: scale(0.9);
            }
            .shop-content {
                flex: 1;
                width: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                max-width: 450px;
                gap: 25px;
                overflow-y: auto;
                padding: 15px 5px 40px 5px;
                scrollbar-width: none;
            }
            .shop-content::-webkit-scrollbar {
                display: none;
            }
            .shop-card {
                background: rgba(0, 0, 0, 0.5);
                border: 3px solid #2ecc71;
                border-radius: 24px;
                padding: 25px 20px;
                text-align: center;
                box-shadow: 0 15px 25px rgba(0,0,0,0.6), inset 0 0 15px rgba(46,204,113,0.1);
                width: 100%;
                position: relative;
                flex-shrink: 0;
            }
            .shop-card-badge {
                position: absolute;
                top: -15px;
                left: 50%;
                transform: translateX(-50%);
                background: #2ecc71;
                color: #fff;
                padding: 4px 15px;
                border-radius: 20px;
                font-size: 0.85rem;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 1px;
                box-shadow: 0 4px 8px rgba(0,0,0,0.3);
                white-space: nowrap;
            }
            .gold-badge {
                background: linear-gradient(135deg, #f1c40f, #f39c12) !important;
                border: 1px solid #fff;
            }
            .purple-badge {
                background: linear-gradient(135deg, #9b59b6, #8e44ad) !important;
                border: 1px solid #fff;
            }
            .rainbow-badge {
                background: linear-gradient(90deg, #e74c3c, #f1c40f, #2ecc71, #3498db) !important;
                animation: rainbowWave 3s infinite linear;
                border: 1px solid #fff;
            }
            @keyframes rainbowWave {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }
            .exchange-rate {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 15px;
                margin: 15px 0 25px 0;
            }
            .exchange-unit {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 5px;
            }
            .exchange-unit img {
                width: 55px;
                height: 55px;
                filter: drop-shadow(0 5px 5px rgba(0,0,0,0.4));
            }
            .exchange-unit span {
                color: #fff;
                font-size: 1.2rem;
                font-weight: 700;
            }
            .exchange-arrow {
                font-size: 1.8rem;
                color: #2ecc71;
                text-shadow: 0 0 10px rgba(46,204,113,0.4);
                font-weight: 700;
            }
            .btn-cashout {
                background: linear-gradient(to bottom, #2ecc71, #27ae60);
                border: 3px solid #58d68d;
                border-radius: 18px;
                color: white;
                padding: 14px 20px;
                font-size: 1.2rem;
                font-weight: 700;
                cursor: pointer;
                width: 100%;
                box-shadow: 0 6px 0 #196f3d, 0 10px 15px rgba(0,0,0,0.4);
                transition: transform 0.1s, box-shadow 0.1s;
            }
            .btn-cashout:active {
                transform: translateY(6px);
                box-shadow: 0 0 0 #196f3d, 0 4px 5px rgba(0,0,0,0.4);
            }
            .btn-cashout.disabled {
                background: #444 !important;
                border-color: #666 !important;
                box-shadow: 0 6px 0 #222 !important;
                cursor: not-allowed;
                opacity: 0.5;
            }
            .btn-cashout.disabled:active {
                transform: none;
            }
        `;
        document.head.appendChild(styleElement);
    }

    function initShopLogic() {
        injectShopStyles();

        document.querySelectorAll('.shop-card').forEach(card => {
            const cashoutBtn = card.querySelector('.btn-cashout');
            if (!cashoutBtn) return;

            cashoutBtn.addEventListener('click', () => {
                const cost = parseInt(card.getAttribute('data-cost'), 10);
                let currentBuds = parseInt(localStorage.getItem(BUD_KEY), 10) || 0;

                if (currentBuds >= cost) {
                    currentBuds -= cost;
                    localStorage.setItem(BUD_KEY, currentBuds);

                    const baseChips = parseInt(card.getAttribute('data-base'), 10);
                    const fixedBonus = parseInt(card.getAttribute('data-bonus'), 10) || 0;
                    const dealType = card.getAttribute('data-type');

                    let earnedChips = baseChips + fixedBonus;
                    let alertMsg = `Successfully traded ${cost.toLocaleString()} Buds for ${earnedChips.toLocaleString()} Chips!`;

                    if (dealType === 'random') {
                        const randomMultiplier = Math.floor(Math.random() * 20) + 1;
                        const baseBonusPool = 100;
                        const calculatedRandomBonus = randomMultiplier * baseBonusPool;

                        earnedChips = baseChips + calculatedRandomBonus;
                        alertMsg = `🎲 HIGH ROLLER RESULTS! 🎲\n\nBase Return: +${baseChips} Chips\nMultiplier Roll: ${randomMultiplier}x (+${calculatedRandomBonus} Bonus Chips!)\n\nTotal Awarded: ${earnedChips.toLocaleString()} Chips!`;
                    }

                    let currentChips = parseInt(localStorage.getItem(CHIP_KEY), 10) || 100;
                    currentChips += earnedChips;
                    localStorage.setItem(CHIP_KEY, currentChips);

                    alert(alertMsg);

                    window.dispatchEvent(new Event('storage'));
                    if (typeof updateUIUpdates === 'function') {
                        updateUIUpdates();
                    }
                }
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initShopLogic);
    } else {
        initShopLogic();
    }
})();