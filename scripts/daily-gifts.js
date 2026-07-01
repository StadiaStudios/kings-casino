
const DAILY_GIFT_KEY = "kings-casino-daily-gift";
const DAILY_GIFT_STREAK_KEY = "kings-casino-daily-gift-streak";
const DAILY_GIFT_REWARDS = [1000, 5000, 10000, 20000, 30000, 40000, 50000];

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
            width: 94%;
            max-width: 570px;
        }
        .daily-gift-content {
            position: relative;
            padding: 48px 34px 36px 34px;
            background: linear-gradient(145deg, rgba(255,255,255,0.07) 0%, rgba(0,0,0,0.88) 100%);
            border: 1.5px solid rgba(212, 175, 55, 0.35);
            border-top: 2px solid #D4AF37;
            border-radius: 24px;
            color: #fff;
            text-align: center;
            box-shadow: 0 24px 60px rgba(0, 0, 0, 0.92), inset 0 0 20px rgba(212, 175, 55, 0.07);
        }
        .daily-gift-close {
            position: absolute; top: 18px; right: 20px;
            background: none; border: none; color: rgba(255,255,255,0.45);
            font-size: 2.2rem; cursor: pointer; transition: color 0.18s ease;
            line-height: 1;
        }
        .daily-gift-close:hover { color: #FFD700; }
        .daily-gift-title {
            font-size: 2.35rem;
            font-weight: 800;
            margin-bottom: 36px;
            letter-spacing: 2.4px;
            text-transform: uppercase;
            background: linear-gradient(to right, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .daily-streak-bar {
            display: flex; justify-content: center; gap: 20px; margin-bottom: 38px; flex-wrap: wrap;
            padding: 8px 0 5px 0;
        }
        .daily-streak-cell {
            flex: 0 1 70px;
            min-width: 64px; max-width: 82px; height: 96px;
            background: rgba(11, 12, 16, 0.63);
            border-radius: 16px;
            border: 1.2px solid rgba(255, 255, 255, 0.11);
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
            margin: 2px 0;
            box-sizing: border-box;
        }
        .daily-streak-cell:not(:last-child) {
            margin-right: 0;
        }
        .daily-streak-cell.past {
            opacity: 0.92;
            border-color: rgba(212, 175, 55, 0.42);
            filter: none;
        }
        .daily-streak-cell.active {
            background: linear-gradient(145deg, rgba(212,175,55,0.25) 0%, rgba(0,0,0,0.84) 100%);
            border: 1.8px solid #FFD700;
            box-shadow: 0 0 34px 0 rgba(212, 175, 55, 0.34);
            transform: scale(1.16);
            z-index: 2;
        }
        .daily-streak-cell.future {
            opacity: 0.31;
        }
        .daily-streak-cell img {
            width: 36px; height: 36px; margin-bottom: 9px;
            filter: drop-shadow(0 2px 7px rgba(0,0,0,0.44));
        }
        .daily-streak-cell .day-label {
            font-size: 1.04rem;
            color: #FFD700;
            font-weight: 700;
            margin-bottom: 4px;
            text-shadow: 0 1px 3px #0007;
            letter-spacing: 0.5px;
        }
        .daily-streak-cell .reward-val {
            font-size: 1.08rem;
            padding: 0 8px;
            font-weight: bold;
            background: linear-gradient(90deg,#fffbb0 0%,#FFD700 50%,#B78E2C 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            color: #FFD700;
            text-shadow: 0 1px 4px #222,0 0 3px #FFE0663d;
            letter-spacing: 1px;
        }
        .daily-claim-area {
            margin-bottom: 0px;
        }
        .daily-claim-btn {
            background: linear-gradient(90deg, #F2D06B 0%, #FFD700 100%);
            color: #3A2C14; font-size: 1.15rem; border: none; border-radius: 10px;
            box-shadow: 0 4px 18px rgba(212, 175, 55, 0.5);
            padding: 17px 44px; font-weight: 850; text-transform: uppercase;
            letter-spacing: 1.2px; cursor: pointer; transition: all 0.2s ease;
            display: inline-flex; align-items: center; justify-content: center; gap: 16px;
        }
        .daily-claim-btn:active {
            box-shadow: 0 2px 6px rgba(212, 175, 55, 0.39); transform: translateY(1.5px);
        }
        .daily-claim-btn[disabled] { filter: grayscale(1); opacity: 0.6; cursor: not-allowed; }
        
        .daily-claim-wait {
            font-size: 1.09rem; font-weight: 800; color: #FFD700;
            display: inline-flex; align-items: center; justify-content: center; gap: 13px;
            background: rgba(0,0,0,0.6); padding: 12px 25px; border-radius: 9px; border: 1px solid rgba(212,175,55,0.22);
        }
        .daily-gift-info {
            margin-top: 32px; font-size: 1.09rem; color: rgba(255,255,255,0.67); line-height: 1.7; font-weight: 700;
            text-shadow: 0 1px 8px #0008;
        }
        .daily-gift-info b { color: #FFD700; }

        @media (max-width: 690px) {
            .daily-gift-canvas-box { max-width: 98vw; }
            .daily-gift-content { padding: 18vw 7vw 12vw 7vw; border-radius: 3.5vw;}
            .daily-streak-bar { gap: 5vw; }
            .daily-streak-cell {
                min-width: 13vw; max-width: 16vw; height: 19vw; border-radius: 3vw;
            }
            .daily-streak-cell img { width: 8vw; height: 8vw; margin-bottom: 1.2vw; }
            .daily-streak-cell .day-label { font-size: 1.9vw;}
            .daily-streak-cell .reward-val { font-size: 2vw; }
        }
        @media (max-width: 480px) {
            .daily-streak-bar { gap: 4vw; margin-bottom: 6vw;}
            .daily-streak-cell {
                min-width: 17vw; max-width: 22vw; height: 25vw; font-size: 2vw;
            }
            .daily-gift-title { font-size: 6vw; margin-bottom: 7vw;}
            .daily-gift-content { padding: 10vw 2vw 8vw 2vw; }
            .daily-claim-btn { font-size: 1.15rem; padding: 13px 6vw;}
            .daily-gift-info { font-size: 0.99rem;}
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
            <div class="reward-val">+${reward.toLocaleString()}</div>
        `;
        streakBar.appendChild(cell);
    }

    const claimArea = document.createElement('div');
    claimArea.className = "daily-claim-area";
    
    if (status.canClaim) {
        const claimBtn = document.createElement('button');
        claimBtn.className = 'daily-claim-btn';
        claimBtn.innerHTML = `Claim <img src="resources/items/chip.png" alt="Chip" style="width:27px;height:27px;"> <b>+${DAILY_GIFT_REWARDS[status.day - 1].toLocaleString()}</b>`;
        claimBtn.onclick = function () {
            const result = claimDailyGift();
            claimBtn.disabled = true;
            claimBtn.innerHTML = `Claimed! <img src="resources/items/chip.png" style="width:22px;height:22px;"> <b>+${result.reward.toLocaleString()}</b>`;
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
        wait.innerHTML = `<img src="resources/items/chip.png" style="width:24px;"> <span style="font-variant-numeric: tabular-nums;">${hrs}h ${min}m ${sec}s</span>`;
        claimArea.appendChild(wait);
        const timer = setInterval(() => {
            let t = Math.max(0, status.nextGiftTime - Date.now());
            let hrs = Math.floor(t / 3600000);
            let min = Math.floor((t % 3600000) / 60000);
            let sec = Math.floor((t % 60000) / 1000);
            wait.innerHTML = `<img src="resources/items/chip.png" style="width:24px;"> <span style="font-variant-numeric: tabular-nums;">${hrs}h ${min}m ${sec}s</span>`;
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
                position: absolute; top: -4px; right: -4px;
                background: #FF2A55;
                color: #fff;
                font-weight: 800; font-size: 0.8rem;
                width: 22px; height: 22px;
                display: flex; justify-content: center; align-items: center;
                border-radius: 50%;
                border: 2px solid #0B0C10;
                box-shadow: 0 0 10px rgba(255, 42, 85, 0.65);
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