
const DAILY_GIFT_KEY = "kings-casino-daily-gift";
const DAILY_GIFT_STREAK_KEY = "kings-casino-daily-gift-streak";
const DAILY_GIFT_REWARDS = [100, 200, 300, 400, 500, 750, 1200];

function getDayStart(ts = Date.now()) {
    const d = new Date(ts);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
}

function getDailyGiftState() {
    let state = localStorage.getItem(DAILY_GIFT_KEY);
    let streak = localStorage.getItem(DAILY_GIFT_STREAK_KEY);
    state = state ? JSON.parse(state) : null;
    streak = streak ? Number(streak) : 0;
    return { state, streak };
}

function setDailyGiftState(state, streak) {
    localStorage.setItem(DAILY_GIFT_KEY, JSON.stringify(state));
    localStorage.setItem(DAILY_GIFT_STREAK_KEY, String(streak));
}

function getDailyGiftStatus() {
    const { state, streak } = getDailyGiftState();
    const todayStart = getDayStart();
    if (!state || !state.lastClaim) {
        return { canClaim: true, day: 1, nextGiftTime: todayStart + 86400000, streak: 0 };
    }
    const last = state.lastClaim;
    const lastDay = getDayStart(last);
    if (todayStart > lastDay) {
        if (todayStart - lastDay > 86400000) {
            return { canClaim: true, day: 1, nextGiftTime: todayStart + 86400000, streak: 0 };
        } else {
            return {
                canClaim: true,
                day: Math.min(7, streak + 1),
                nextGiftTime: todayStart + 86400000,
                streak
            };
        }
    }
    return {
        canClaim: false,
        day: Math.min(7, streak),
        nextGiftTime: lastDay + 86400000,
        streak
    };
}

function claimDailyGift() {
    const status = getDailyGiftStatus();
    if (!status.canClaim) return null;
    const newStreak = status.day;
    const reward = DAILY_GIFT_REWARDS[newStreak - 1] || 100;
    setDailyGiftState({ lastClaim: Date.now() }, newStreak);
    const bal = typeof getBalance === 'function' ? getBalance() : 0;
    if (typeof setBalance === 'function') setBalance(bal + reward);
    if (window.updateLobbyBalanceDisplay) window.updateLobbyBalanceDisplay();
    return { reward, newStreak, newDay: newStreak };
}

function createDailyGiftPopup() {
    if (document.getElementById("daily-gift-popup")) return;

    if (!document.getElementById('daily-gift-popup-styles')) {
        const s = document.createElement('style');
        s.id = 'daily-gift-popup-styles';
        s.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;800&display=swap');

        #daily-gift-popup {
            position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 10000;
            background: rgba(11, 12, 16, 0.85);
            backdrop-filter: blur(8px);
            display: flex; align-items: center; justify-content: center;
            animation: fadeInPop 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
            font-family: 'Montserrat', sans-serif;
            user-select: none;
        }
        .daily-gift-canvas-box {
            position: relative;
            width: 90%;
            max-width: 480px;
        }
        .daily-gift-content {
            position: relative;
            padding: 40px 30px;
            background: linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.8) 100%);
            border: 1px solid rgba(212, 175, 55, 0.3);
            border-top: 2px solid #D4AF37;
            border-radius: 20px;
            color: #fff;
            text-align: center;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.9), inset 0 0 20px rgba(212, 175, 55, 0.05);
        }
        .daily-gift-close {
            position: absolute; top: 15px; right: 20px;
            background: none; border: none; color: rgba(255,255,255,0.4);
            font-size: 2rem; cursor: pointer; transition: color 0.2s ease;
            line-height: 1;
        }
        .daily-gift-close:hover { color: #D4AF37; }
        .daily-gift-title {
            font-size: 2.2rem;
            font-weight: 800;
            margin-bottom: 30px;
            letter-spacing: 2px;
            text-transform: uppercase;
            background: linear-gradient(to right, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .daily-streak-bar {
            display: flex; justify-content: center; gap: 8px; margin-bottom: 35px; flex-wrap: wrap;
        }
        .daily-streak-cell {
            flex: 1; min-width: 48px; max-width: 60px; height: 75px;
            background: rgba(11, 12, 16, 0.6);
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.08);
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        .daily-streak-cell.past {
            opacity: 0.8;
            border-color: rgba(212, 175, 55, 0.4);
        }
        .daily-streak-cell.active {
            background: linear-gradient(145deg, rgba(212,175,55,0.15) 0%, rgba(0,0,0,0.7) 100%);
            border: 1px solid #D4AF37;
            box-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
            transform: scale(1.15);
            z-index: 1;
        }
        .daily-streak-cell.future {
            opacity: 0.4;
        }
        .daily-streak-cell img { width: 26px; height: 26px; margin-bottom: 5px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5)); }
        .daily-streak-cell .day-label { font-size: 0.75rem; color: rgba(255,255,255,0.5); font-weight: 600; margin-bottom: 2px; }
        .daily-streak-cell .reward-val { font-size: 0.95rem; font-weight: 800; color: #F2D06B; }
        
        .daily-claim-btn {
            background: linear-gradient(90deg, #F2D06B 0%, #D4AF37 100%);
            color: #000; font-size: 1.1rem; border: none; border-radius: 8px;
            box-shadow: 0 4px 15px rgba(212, 175, 55, 0.4);
            padding: 12px 35px; font-weight: 800; text-transform: uppercase;
            letter-spacing: 1px; cursor: pointer; transition: all 0.2s ease;
            display: inline-flex; align-items: center; justify-content: center; gap: 10px;
        }
        .daily-claim-btn:active {
            box-shadow: 0 2px 5px rgba(212, 175, 55, 0.4); transform: translateY(2px);
        }
        .daily-claim-btn[disabled] { filter: grayscale(1); opacity: 0.6; cursor: not-allowed; }
        
        .daily-claim-wait {
            font-size: 1rem; font-weight: 600; color: #F2D06B;
            display: inline-flex; align-items: center; justify-content: center; gap: 10px;
            background: rgba(0,0,0,0.5); padding: 12px 25px; border-radius: 8px; border: 1px solid rgba(212,175,55,0.2);
        }
        .daily-gift-info {
            margin-top: 25px; font-size: 0.85rem; color: rgba(255,255,255,0.5); line-height: 1.5; font-weight: 600;
        }
        .daily-gift-info b { color: #D4AF37; }

        @media (max-width: 450px) {
            .daily-streak-bar { gap: 5px; }
            .daily-streak-cell { min-width: 40px; height: 65px; }
            .daily-gift-title { font-size: 1.8rem; }
            .daily-gift-content { padding: 30px 20px; }
        }
        `;
        document.head.appendChild(s);
    }

    const overlay = document.createElement("div");
    overlay.id = "daily-gift-popup";

    const box = document.createElement('div');
    box.className = 'daily-gift-canvas-box';

    const content = document.createElement('div');
    content.className = 'daily-gift-content';

    const close = document.createElement('button');
    close.className = 'daily-gift-close';
    close.innerHTML = '&times;';
    close.onclick = () => overlay.remove();

    const title = document.createElement('h2');
    title.className = 'daily-gift-title';
    title.innerText = "Daily Bonus";

    const status = getDailyGiftStatus();

    const streakBar = document.createElement('div');
    streakBar.className = 'daily-streak-bar';
    for (let i = 0; i < 7; i++) {
        const cell = document.createElement('div');
        cell.className = 'daily-streak-cell';
        let cellState = '';
        if (i <= status.streak - 1) {
            cellState = 'past';
        } else if (i + 1 === status.day && status.canClaim) {
            cellState = 'active';
        } else {
            cellState = 'future';
        }
        cell.classList.add(cellState);

        const reward = DAILY_GIFT_REWARDS[i];
        cell.innerHTML = `
            <img src="resources/items/chip.png" alt="Chip">
            <div class="day-label">Day ${i + 1}</div>
            <div class="reward-val">+${reward}</div>
        `;
        streakBar.appendChild(cell);
    }

    const claimArea = document.createElement('div');
    claimArea.className = "daily-claim-area";
    
    if (status.canClaim) {
        const claimBtn = document.createElement('button');
        claimBtn.className = 'daily-claim-btn';
        claimBtn.innerHTML = `Claim <img src="resources/items/chip.png" alt="Chip" style="width:24px;height:24px;"> +${DAILY_GIFT_REWARDS[status.day - 1]}`;
        claimBtn.onclick = function () {
            const result = claimDailyGift();
            claimBtn.disabled = true;
            claimBtn.innerHTML = `Claimed! <img src="resources/items/chip.png" style="width:20px;height:20px;"> +${result.reward}`;
            setTimeout(() => overlay.remove(), 1200);
        };
        claimArea.appendChild(claimBtn);
    } else {
        const wait = document.createElement('div');
        wait.className = 'daily-claim-wait';
        let t = Math.max(0, status.nextGiftTime - Date.now());
        let hrs = Math.floor(t / 3600000);
        let min = Math.floor((t % 3600000) / 60000);
        let sec = Math.floor((t % 60000) / 1000);
        wait.innerHTML = `<img src="resources/items/chip.png" style="width:22px;"> ${hrs}h ${min}m ${sec}s`;
        claimArea.appendChild(wait);
        const timer = setInterval(() => {
            let t = Math.max(0, status.nextGiftTime - Date.now());
            let hrs = Math.floor(t / 3600000);
            let min = Math.floor((t % 3600000) / 60000);
            let sec = Math.floor((t % 60000) / 1000);
            wait.innerHTML = `<img src="resources/items/chip.png" style="width:22px;"> ${hrs}h ${min}m ${sec}s`;
            if (t <= 0) {
                clearInterval(timer);
                overlay.remove();
            }
        }, 1000);
    }

    const info = document.createElement('div');
    info.className = 'daily-gift-info';
    info.innerHTML = `<b>Tip:</b> Login each day to keep your streak going!<br>
    If you miss a day, your streak resets to day 1.`;

    content.appendChild(close);
    content.appendChild(title);
    content.appendChild(streakBar);
    content.appendChild(claimArea);
    content.appendChild(info);

    box.appendChild(content);
    overlay.appendChild(box);

    document.body.appendChild(overlay);
}

function attachDailyGiftIconHandler() {
    const btns = document.querySelectorAll('.nav-btn');
    for (const btn of btns) {
        const img = btn.querySelector('img[alt="Gift"]');
        if (!img) continue;
        btn.style.position = "relative";
        btn.addEventListener('click', ev => {
            ev.preventDefault();
            createDailyGiftPopup();
        });
        const status = getDailyGiftStatus();
        let badge = btn.querySelector('.daily-gift-badge');
        if (status.canClaim && !badge) {
            badge = document.createElement('div');
            badge.className = 'daily-gift-badge';
            badge.style.cssText = `
                position: absolute; top: -2px; right: -2px;
                background: #FF2A55;
                color: #fff;
                font-weight: 800; font-size: 0.75rem;
                width: 18px; height: 18px;
                display: flex; justify-content: center; align-items: center;
                border-radius: 50%;
                border: 2px solid #0B0C10;
                box-shadow: 0 0 10px rgba(255, 42, 85, 0.5);
            `;
            badge.innerText = "!";
            btn.appendChild(badge);
        } else if (!status.canClaim && badge) {
            badge.remove();
        }
    }
}

if (document.readyState === "complete" || document.readyState === "interactive") {
    setTimeout(attachDailyGiftIconHandler, 0);
} else {
    window.addEventListener('DOMContentLoaded', attachDailyGiftIconHandler);
}

(function injectPopupAnimCss() {
    if (document.getElementById('daily-popup-anim-css')) return;
    const s = document.createElement('style');
    s.id = 'daily-popup-anim-css';
    s.textContent = `
    @keyframes fadeInPop {
        0% { transform: scale(0.9); opacity: 0; }
        100% { transform: scale(1); opacity: 1; }
    }
    `;
    document.head.appendChild(s);
})();