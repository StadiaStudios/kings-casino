(function(){
    const VIP_GIFT_REWARDS = [5000, 7500, 10000, 35000, 50000, 85000, 180000, 100000, 120000, 10000, 100000, 200000];
    const VIP_STORAGE_PREFIX = 'kings-casino-vip-daily-gift';
    const VIP_CHIPS_KEY = 'kings-casino-vip-chips';

    function getVipGiftState() {
        try { return JSON.parse(localStorage.getItem(VIP_STORAGE_PREFIX)) || {lastClaim: 0, streak: 0}; }
        catch { return {lastClaim: 0, streak: 0}; }
    }

    function getVipGiftStatus() {
        const state = getVipGiftState();
        const today = Math.floor(Date.now() / 86400000);
        const last = Math.floor(state.lastClaim / 86400000);

        if (last === 0 || last < today - 1) return { canClaim: true, streak: 0 };
        if (last < today) return { canClaim: true, streak: state.streak };
        return { canClaim: false, streak: state.streak, wait: (86400000 - (Date.now() % 86400000)) };
    }

    function claimVipDailyGift() {
        const status = getVipGiftStatus();
        if (!status.canClaim) return null;

        const newStreak = (status.streak >= VIP_GIFT_REWARDS.length) ? 1 : status.streak + 1;
        const reward = VIP_GIFT_REWARDS[status.streak % VIP_GIFT_REWARDS.length];

        localStorage.setItem(VIP_STORAGE_PREFIX, JSON.stringify({lastClaim: Date.now(), streak: newStreak}));

        let currentBal = parseInt(localStorage.getItem(VIP_CHIPS_KEY) || 0, 10);
        localStorage.setItem(VIP_CHIPS_KEY, currentBal + reward);

        if (window.updateLobbyBalances) window.updateLobbyBalances();
        return { reward, newStreak };
    }

    function createVipGiftPopup() {
        if (document.getElementById('vip-gift-modal')) return;

        const status = getVipGiftStatus();
        const modal = document.createElement('div');
        modal.id = 'vip-gift-modal';
        modal.innerHTML = `
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&display=swap');
                
                #vip-gift-modal {
                    position: fixed; inset: 0; z-index: 100;
                    background: rgba(11, 12, 16, 0.85);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    backdrop-filter: blur(10px);
                    font-family: 'Montserrat', sans-serif;
                }
                .vip-modal-box {
                    background: linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.8) 100%);
                    border-radius: 20px;
                    border: 1px solid rgba(192, 192, 192, 0.4);
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8), 0 0 20px rgba(192, 192, 192, 0.15);
                    padding: 35px 20px 25px 20px;
                    width: 95vw; max-width: 420px; min-width: 0;
                    text-align: center;
                    position: relative;
                }
                .vip-modal-title {
                    font-size: 2.2rem;
                    font-weight: 800;
                    margin-bottom: 12px;
                    letter-spacing: 2px;
                    background: linear-gradient(to right, #C0C0C0, #FFFFFF, #E8E8E8);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    text-transform: uppercase;
                    text-shadow: 0 2px 10px rgba(192, 192, 192, 0.2);
                }
                .vip-chip-icon {
                    margin-bottom: 20px;
                    display: flex;
                    justify-content: center;
                }
                .vip-chip-icon img {
                    width: 70px;
                    height: 70px;
                    background: radial-gradient(circle, #ffffff, #a8a8a8);
                    border-radius: 50%;
                    border: 2px solid #fff;
                    box-shadow: 0 0 20px rgba(192, 192, 192, 0.6);
                }
                .vip-subtitle {
                    font-size: 1.05rem;
                    font-weight: 600;
                    color: #E8E8E8;
                    margin-bottom: 20px;
                    letter-spacing: 0.5px;
                }
                .vip-subtitle span {
                    color: #D4AF37;
                    font-weight: 800;
                    text-shadow: 0 0 10px rgba(212, 175, 55, 0.4);
                }
                .vip-streak-grid {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;
                    justify-content: center;
                    margin: 20px 0;
                    background: rgba(11, 12, 16, 0.6);
                    border-radius: 16px;
                    padding: 15px 10px;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }
                .streak-box {
                    background: rgba(255, 255, 255, 0.03);
                    padding: 8px 4px;
                    border-radius: 12px;
                    font-size: 0.97rem;
                    font-weight: 600;
                    color: #C0C0C0;
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    width: 48px;
                    flex: none;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 4px;
                    position: relative;
                    transition: transform 0.2s ease;
                    cursor: default;
                }
                .streak-box.active {
                    border: 1px solid #D4AF37;
                    background: linear-gradient(145deg, rgba(212, 175, 55, 0.15) 0%, rgba(192, 192, 192, 0.1) 100%);
                    color: #FFF;
                    transform: scale(1.1) translateY(-2px);
                    z-index: 2;
                    box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
                    animation: streakHighlight 2s infinite; 
                }
                @keyframes streakHighlight {
                    0% { box-shadow: 0 0 5px rgba(212, 175, 55, 0.2); }
                    50% { box-shadow: 0 0 20px rgba(212, 175, 55, 0.6); }
                    100% { box-shadow: 0 0 5px rgba(212, 175, 55, 0.2); }
                }
                .streak-box .day-lbl {
                    font-size: 0.8rem;
                    font-weight: 700;
                    opacity: 0.9;
                    color: #D4AF37;
                }
                .streak-box .amount {
                    font-size: 0.95rem;
                    font-weight: 800;
                }
                .btn-claim {
                    display: block;
                    width: 100%;
                    max-width: 320px;
                    margin: 25px auto 0 auto;
                    border: 2px solid #FFF;
                    background: linear-gradient(90deg, #D4AF37, #F2D06B);
                    color: #0B0C10;
                    font-size: 1.2rem;
                    font-weight: 800;
                    border-radius: 16px;
                    padding: 16px 0;
                    box-shadow: 0 4px 15px rgba(212, 175, 55, 0.5);
                    cursor: pointer;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                    outline: none;
                    transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
                }
                .btn-claim:active {
                    transform: scale(0.97);
                    box-shadow: 0 2px 8px rgba(212, 175, 55, 0.4);
                }
                .vip-modal-msg {
                    margin-top: 20px;
                    color: #C0C0C0;
                    font-size: 1rem;
                    font-weight: 600;
                    letter-spacing: 0.5px;
                }
                .vip-close-btn {
                    margin-top: 25px;
                    background: none;
                    border: none;
                    color: #888;
                    font-weight: 700;
                    letter-spacing: 1px;
                    font-size: 0.9rem;
                    text-transform: uppercase;
                    cursor: pointer;
                    transition: color 0.2s;
                    outline: none;
                }
                .vip-close-btn:hover, .vip-close-btn:focus {
                    color: #FFF;
                }
            </style>
            <div class="vip-modal-box">
                <div class="vip-modal-title">VIP Dailies</div>
                <div class="vip-chip-icon">
                    <img src="resources/items/silver-chip.png" alt="VIP Chip">
                </div>
                <div class="vip-subtitle">
                    Claim your <span>FREE</span> daily VIP chips!
                </div>

                <div class="vip-streak-grid">
                    ${VIP_GIFT_REWARDS.map((r, i) => `
                        <div class="streak-box${i === status.streak ? ' active' : ''}">
                            <span class="day-lbl">D${i+1}</span>
                            <span class="amount">${(r/1000)}k</span>
                        </div>
                    `).join('')}
                </div>
                ${status.canClaim ? `<button class="btn-claim" id="claim-btn">Claim ${VIP_GIFT_REWARDS[status.streak].toLocaleString()}</button>`
                   : `<div class="vip-modal-msg">Come back tomorrow for more VIP bonuses!</div>`}
                <button class="vip-close-btn" onclick="this.closest('#vip-gift-modal').remove()">Close</button>
            </div>
        `;
        document.body.appendChild(modal);

        const btn = document.getElementById('claim-btn');
        if(btn) btn.onclick = () => {
            btn.disabled = true;
            btn.textContent = 'Claimed!';

            const rewardData = claimVipDailyGift();

            btn.style.background = 'linear-gradient(145deg, rgba(255,255,255,0.05), rgba(0,0,0,0.5))';
            btn.style.color = '#C0C0C0';
            btn.style.borderColor = 'rgba(192,192,192,0.3)';
            btn.style.boxShadow = 'none';

            setTimeout(() => {
                modal.remove();
            }, 800);
        };
    }

    document.addEventListener('DOMContentLoaded', () => {
        const btn = document.getElementById('daily-bonus-btn');
        if (btn) btn.onclick = createVipGiftPopup;
    });
})();