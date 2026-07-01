(function (global) {

    function ensureChipFallAndJackpotStyles() {
        if (!document.getElementById('vip-chip-fall-dark-style')) {
            const style = document.createElement('style');
            style.id = 'vip-chip-fall-dark-style';
            style.textContent = `
                body.vip-chip-fall-dark,
                html.vip-chip-fall-dark {
                    transition: background 0.36s cubic-bezier(.42,0,1,1), background-color 0.36s cubic-bezier(.42,0,1,1);
                    background: rgb(5, 5, 8) !important;
                    background-color: rgb(5, 5, 8) !important;
                }
                body.vip-chip-fall-silver,
                html.vip-chip-fall-silver {
                    transition: background 0.36s cubic-bezier(.42,0,1,1), background-color 0.36s cubic-bezier(.42,0,1,1);
                    background: linear-gradient(135deg, #e6e7e8 0%, #dadada 27%, #e7e9ed 53%, #b0b2b7 77%, #f8f9fa 100%) !important;
                    background-color: #d5d7db !important;
                    background-image: linear-gradient(
                        120deg, 
                        #f4f5f6 17%,
                        #dee1e3 33%,
                        #d0d3d6 60%,
                        #b9bbbe 65%,
                        #f1f2f3 99%
                    ) !important;
                    box-shadow: 0 0 28px 7px #d6d8da77 inset;
                }
            `;
            document.head.appendChild(style);
        }
    }

    function enableChipFallDarkener(options = {}) {
        if (!window.document) return;
        ensureChipFallAndJackpotStyles();
        const chipShower = document.getElementById('chip-shower');
        if (!chipShower) return;

        let jackpotFallActive = false;

        const observer = new MutationObserver(function(mutations) {
            let chipsAdded = false, chipsRemoved = false;
            mutations.forEach(m => {
                if (Array.from(m.addedNodes).some(n => n.classList && n.classList.contains('falling-chip'))) {
                    chipsAdded = true;
                }
                if (Array.from(m.removedNodes).some(n => n.classList && n.classList.contains('falling-chip'))) {
                    chipsRemoved = true;
                }
            });

            if (chipsAdded) {
                let isJackpot = false;
                if (typeof options.isJackpotActive === "function") {
                    isJackpot = options.isJackpotActive();
                }
                jackpotFallActive = !!isJackpot;

                if (jackpotFallActive) {
                    document.body.classList.remove('vip-chip-fall-dark');
                    document.documentElement.classList.remove('vip-chip-fall-dark');
                    document.body.classList.add('vip-chip-fall-silver');
                    document.documentElement.classList.add('vip-chip-fall-silver');
                } else {
                    document.body.classList.remove('vip-chip-fall-silver');
                    document.documentElement.classList.remove('vip-chip-fall-silver');
                    document.body.classList.add('vip-chip-fall-dark');
                    document.documentElement.classList.add('vip-chip-fall-dark');
                }
            }

            if (chipShower.querySelectorAll('.falling-chip').length === 0 && chipsRemoved) {
                setTimeout(() => {
                    document.body.classList.remove('vip-chip-fall-dark', 'vip-chip-fall-silver');
                    document.documentElement.classList.remove('vip-chip-fall-dark', 'vip-chip-fall-silver');
                    jackpotFallActive = false;
                }, 180);
            }
        });

        observer.observe(chipShower, { childList: true });
    }

    function triggerJackpotShake(duration = 800) {
        const target = document.querySelector('.machine-container') || document.body;
        if (!target) return;

        if (!document.getElementById('vip-jackpot-shake-style')) {
            const style = document.createElement('style');
            style.id = 'vip-jackpot-shake-style';
            style.textContent = `
                @keyframes vip-jackpot-circle-shake {
                    0%    { transform: translate(0,0) rotate(0deg);}
                    5%    { transform: translate(-5px, 4px) rotate(-1.3deg);}
                    10%   { transform: translate(-10px,12px) rotate(-2.6deg);}
                    15%   { transform: translate(-5px,16px) rotate(-1.3deg);}
                    20%   { transform: translate(0px,20px) rotate(0deg);}
                    25%   { transform: translate(8px,16px) rotate(1.3deg);}
                    30%   { transform: translate(14px,12px) rotate(2.6deg);}
                    35%   { transform: translate(8px,4px) rotate(1.3deg);}
                    40%   { transform: translate(0px, 0px) rotate(0deg);}
                    45%   { transform: translate(-8px,-4px) rotate(-1.3deg);}
                    50%   { transform: translate(-14px,-12px) rotate(-2.6deg);}
                    55%   { transform: translate(-8px,-16px) rotate(-1.3deg);}
                    60%   { transform: translate(0px,-20px) rotate(0deg);}
                    65%   { transform: translate(5px,-16px) rotate(1.3deg);}
                    70%   { transform: translate(10px,-12px) rotate(2.6deg);}
                    75%   { transform: translate(5px,-4px) rotate(1.3deg);}
                    80%   { transform: translate(0px,0px) rotate(0deg);}
                    100%  { transform: translate(0,0) rotate(0deg);}
                }
                .vip-jackpot-shake {
                    animation: vip-jackpot-circle-shake 0.7s cubic-bezier(.35,1.3,.62,1.02) both;
                    will-change: transform;
                }
            `;
            document.head.appendChild(style);
        }

        document.body.classList.remove('vip-chip-fall-dark');
        document.documentElement.classList.remove('vip-chip-fall-dark');
        document.body.classList.add('vip-chip-fall-silver');
        document.documentElement.classList.add('vip-chip-fall-silver');

        target.classList.remove('vip-jackpot-shake');
        void target.offsetWidth;
        target.classList.add('vip-jackpot-shake');
        
        setTimeout(() => {
            target.classList.remove('vip-jackpot-shake');
            document.body.classList.remove('vip-chip-fall-silver');
            document.documentElement.classList.remove('vip-chip-fall-silver');
        }, duration + 150);
    }

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = { triggerJackpotShake };
    } else {
        global.triggerJackpotShake = triggerJackpotShake;
    }

    if (typeof window !== 'undefined' && window.document) {
        window.addEventListener('DOMContentLoaded', function() {
            enableChipFallDarkener();

            const winMessageEl = document.getElementById('win-message');
            if (winMessageEl) {
                const observer = new MutationObserver(function() {
                    const text = (winMessageEl.textContent || winMessageEl.innerText || "")
                        .trim().toLowerCase();

                    const isJackpot =
                        winMessageEl.classList.contains('show') &&
                        text.includes('jackpot');
                    const isWin =
                        winMessageEl.classList.contains('show') &&
                        (text.includes('win') || text.includes('nice'));

                    if (isJackpot) {
                        setTimeout(() => triggerJackpotShake(900), 40);
                    } else if (isWin) {
                        setTimeout(() => triggerJackpotShake(800), 40);
                    }
                });

                observer.observe(winMessageEl, {
                    childList: true,
                    subtree: true,
                    characterData: true,
                    attributes: true,
                    attributeFilter: ['class']
                });
            }
        });
    }
})(typeof window !== 'undefined' ? window : this);