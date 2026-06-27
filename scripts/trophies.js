(function () {
    const WINS_KEY = 'kings-casino-sm-wins';
    const JACKPOTS_KEY = 'kings-casino-sm-jackpots';
    const UNLOCKED_KEY = 'kings-casino-unlocked-trophies';
    const CHIPS_KEY = 'kings-casino-chips';
    const PLAYTIME_KEY = 'kings-casino-total-playtime';
    const DERBY_DASH_FIRST_PLAY_KEY = 'kings-casino-derbydash-first-play';
    const DERBY_DASH_TOTAL_RACES_KEY = 'kings-casino-derbydash-total-races';
    const AUTOSPINNER_KEY = 'kings-casino-auto-spin-purchased';
    const VIP_UNLOCKED_KEY = 'kings-casino-vip-owned';
    const VIP_WHEEL_DAILY_SPIN_KEY = 'kings-casino-vip-daily-spin';
    const VIP_WHEEL_TOTAL_SPINS_KEY = 'kings-casino-vip-wheel-spins';
    const VIP_HORSE_ALCOHOL_PURCHASE_KEY = 'kings-casino-vip-horse-alcohol-purchased';
    const VIP_FIRST_EXCHANGE_KEY = 'kings-casino-vip-first-exchange';
    const PIGGY_FIRST_BREAK_KEY = 'kings-casino-piggy-first-break';

    const PLAYTIME_TROPHY_ID = 'play_15_min';
    const PLAYTIME_TROPHY_TARGET_SEC = 15 * 60;
    const TROPHY_SFX = new Audio('sfx/trophy-unlock.mp3');

    const TROPHIES = [
        { id: 'sm_jackpot_5', title: '🎰 JACKPOT JUBILEE', desc: 'Hit 5 jackpots in the slot machines', target: 5, type: 'jackpot', icon: '👑', chips: 5000 },
        { id: 'sm_wins_50', title: '✨ CASUAL SPINNER', desc: 'Get 50 wins in the slot machines', target: 50, type: 'win', icon: '🥉', chips: 1500 },
        { id: 'sm_wins_150', title: '💫 REEL ENTHUSIAST', desc: 'Get 150 wins in the slot machines', target: 150, type: 'win', icon: '🥈', chips: 3000 },
        { id: 'sm_wins_500', title: '💎 FORTUNE FINDER', desc: 'Get 500 wins in the slot machines', target: 500, type: 'win', icon: '🥇', chips: 7000 },
        { id: 'sm_wins_1000', title: '🏆 CASINO ELITE', desc: 'Get 1000 wins in the slot machines', target: 1000, type: 'win', icon: '💎', chips: 12000 },
        { id: 'sm_wins_1500', title: '🔥 HIGH ROLLER', desc: 'Get 1500 wins in the slot machines', target: 1500, type: 'win', icon: '🔥', chips: 18000 },
        { id: 'sm_wins_2000', title: '👑 SLOTS OVERLORD', desc: 'Get 2000 wins in the slot machines', target: 2000, type: 'win', icon: '🔮', chips: 25000 },
        { id: 'sm_wins_5000', title: '🌌 ULTIMATE SLOT DEITY', desc: 'Get 5000 wins in the slot machines', target: 5000, type: 'win', icon: '⚡', chips: 50000 },
        {
            id: PLAYTIME_TROPHY_ID,
            title: '🕒 TIME FLIES',
            desc: 'Play for at least 15 minutes in Kings Casino',
            target: PLAYTIME_TROPHY_TARGET_SEC,
            type: 'playtime',
            icon: '⏳',
            chips: 10000
        },
        {
            id: 'derbydash_first_play',
            title: '🐎 FIRST DERBY!',
            desc: 'Play Derby Dash for the first time',
            target: 1,
            type: 'derbydash_first_play',
            icon: '🐎',
            chips: 1500
        },
        {
            id: 'derbydash_30_races',
            title: '🏇 DERBY RUNNER',
            desc: 'Do 30 races in Derby Dash',
            target: 30,
            type: 'derbydash_races',
            icon: '🏇',
            chips: 4000
        },
        {
            id: 'derbydash_50_races',
            title: '🏁 DERBY RACER',
            desc: 'Do 50 races in Derby Dash',
            target: 50,
            type: 'derbydash_races',
            icon: '🏁',
            chips: 7000
        },
        {
            id: 'derbydash_100_races',
            title: '🥇 DERBY LEGEND',
            desc: 'Do over 100 races in Derby Dash',
            target: 100,
            type: 'derbydash_races',
            icon: '🥇',
            chips: 12000
        },
        {
            id: 'autospinner_purchased',
            title: '🔄 AUTO SPIN UNLOCKED',
            desc: 'Purchase the Auto Spinner in the Upgrades Shop',
            target: 1,
            type: 'autospinner',
            icon: '🔄',
            chips: 3000
        },
        {
            id: 'vip_purchased',
            title: '👑 KING OF VIP',
            desc: 'Unlock the VIP Room',
            target: 1,
            type: 'vip_purchased',
            icon: '👑',
            chips: 10000
        },
        {
            id: 'vip_daily_spin',
            title: '🎉 VIP SPINNER',
            desc: 'Do your first daily spin in the VIP Room Casino Wheel',
            target: 1,
            type: 'vip_daily_spin',
            icon: '🎡',
            chips: 2500
        },
        {
            id: 'vip_horse_alcohol',
            title: '🍾 VIP RACING CHEMIST',
            desc: 'Buy Alcohol in horse racing in the VIP Room',
            target: 1,
            type: 'vip_horse_alcohol',
            icon: '🍷',
            chips: 3000
        },
        {
            id: 'vip_first_exchange',
            title: '💎 SILVER VAULT',
            desc: 'Exchange silver for the first time in the VIP Room',
            target: 1,
            type: 'vip_first_exchange',
            icon: '💎',
            chips: 4000
        },
        {
            id: 'piggy_first_break',
            title: '🪙 PIGGY POP',
            desc: 'Break open the Piggy Bank for the first time',
            target: 1,
            type: 'piggy_first_break',
            icon: '🪙',
            chips: 3500
        },
        {
            id: 'vip_wheel_20',
            title: '♾️ VIP WHEEL MASTER',
            desc: 'Spin the VIP Room wheel 20 times in total',
            target: 20,
            type: 'vip_wheel_spins',
            icon: '🎟️',
            chips: 8000
        }
    ];

    const TROPHY_CHIP_REWARD_DEFAULT = 5000;

    function getStat(key) {
        return parseInt(localStorage.getItem(key), 10) || 0;
    }

    function setStat(key, val) {
        localStorage.setItem(key, val);
    }

    function getUnlockedTrophies() {
        try {
            return JSON.parse(localStorage.getItem(UNLOCKED_KEY)) || [];
        } catch (e) {
            return [];
        }
    }

    function saveUnlockedTrophies(unlockedList) {
        localStorage.setItem(UNLOCKED_KEY, JSON.stringify(unlockedList));
    }

    function getTrophyProgress(trophy) {
        if (trophy.type === 'jackpot') return getStat(JACKPOTS_KEY);
        if (trophy.type === 'win') return getStat(WINS_KEY);
        if (trophy.type === 'playtime') return getStat(PLAYTIME_KEY);
        if (trophy.type === 'derbydash_first_play') return getStat(DERBY_DASH_FIRST_PLAY_KEY) ? 1 : 0;
        if (trophy.type === 'derbydash_races') return getStat(DERBY_DASH_TOTAL_RACES_KEY);
        if (trophy.type === 'autospinner') return localStorage.getItem(AUTOSPINNER_KEY) === 'true' ? 1 : 0;
        if (trophy.type === 'vip_purchased') return localStorage.getItem(VIP_UNLOCKED_KEY) === '1' ? 1 : 0;
        if (trophy.type === 'vip_daily_spin') return getStat(VIP_WHEEL_DAILY_SPIN_KEY) ? 1 : 0;
        if (trophy.type === 'vip_wheel_spins') return getStat(VIP_WHEEL_TOTAL_SPINS_KEY);
        if (trophy.type === 'vip_horse_alcohol') return getStat(VIP_HORSE_ALCOHOL_PURCHASE_KEY) ? 1 : 0;
        if (trophy.type === 'vip_first_exchange') return getStat(VIP_FIRST_EXCHANGE_KEY) ? 1 : 0;
        if (trophy.type === 'piggy_first_break') return getStat(PIGGY_FIRST_BREAK_KEY) ? 1 : 0;
        return 0;
    }

    function awardChips(amount) {
        amount = Math.floor(amount);
        if (amount > 0) {
            const prev = getStat(CHIPS_KEY);
            setStat(CHIPS_KEY, prev + amount);
            if (window.updateLobbyBalanceDisplay) window.updateLobbyBalanceDisplay();
            
            const chipToast = document.createElement('div');
            chipToast.className = 'trophy-toast';
            chipToast.innerHTML = `
                <div class="trophy-toast-icon"><img src="resources/items/chip.png" style="width:32px;height:32px;" alt="Chip"></div>
                <div class="trophy-toast-content">
                    <div class="trophy-toast-alert">Bonus Chips!</div>
                    <div class="trophy-toast-title" style="color:#F2D06B;font-size:1.1rem;">+${amount.toLocaleString()}</div>
                </div>
            `;
            document.body.appendChild(chipToast);
            setTimeout(() => chipToast.classList.add('show'), 100);
            setTimeout(() => {
                chipToast.classList.remove('show');
                setTimeout(() => chipToast.remove(), 500);
            }, 3000);
        }
    }

    function checkTrophyUnlocks() {
        const currentWins = getStat(WINS_KEY);
        const currentJackpots = getStat(JACKPOTS_KEY);
        const currentPlaytime = getStat(PLAYTIME_KEY);
        const derbyDashFirstPlay = getStat(DERBY_DASH_FIRST_PLAY_KEY);
        const derbyDashTotalRaces = getStat(DERBY_DASH_TOTAL_RACES_KEY);
        const autospinnerPurchased = localStorage.getItem(AUTOSPINNER_KEY) === 'true' ? 1 : 0;
        const vipPurchased = localStorage.getItem(VIP_UNLOCKED_KEY) === "1" ? 1 : 0;

        let unlocked = getUnlockedTrophies();
        let newlyUnlocked = false;

        TROPHIES.forEach(trophy => {
            if (!unlocked.includes(trophy.id)) {
                const currentProgress = getTrophyProgress(trophy);

                if (currentProgress >= trophy.target) {
                    unlocked.push(trophy.id);
                    triggerTrophyToast(trophy);
                    awardChips(typeof trophy.chips === 'number' ? trophy.chips : TROPHY_CHIP_REWARD_DEFAULT);
                    if (TROPHY_SFX && TROPHY_SFX.play) {
                        TROPHY_SFX.currentTime = 0;
                        TROPHY_SFX.play().catch(() => {});
                    }
                    newlyUnlocked = true;
                }
            }
        });

        if (newlyUnlocked) {
            saveUnlockedTrophies(unlocked);
            updateTrophyBadgeCount();
        }
    }

    function recordSlotResult(isWin, isJackpot) {
        if (isWin) setStat(WINS_KEY, getStat(WINS_KEY) + 1);
        if (isJackpot) setStat(JACKPOTS_KEY, getStat(JACKPOTS_KEY) + 1);
        checkTrophyUnlocks();
    }

    window.recordDerbyDashFirstPlay = function() {
        if (!getStat(DERBY_DASH_FIRST_PLAY_KEY)) {
            setStat(DERBY_DASH_FIRST_PLAY_KEY, 1);
            checkTrophyUnlocks();
        }
    }

    window.recordDerbyDashRace = function() {
        setStat(DERBY_DASH_TOTAL_RACES_KEY, getStat(DERBY_DASH_TOTAL_RACES_KEY) + 1);
        checkTrophyUnlocks();
    }

    window.recordAutospinnerPurchased = function() {
        if (localStorage.getItem(AUTOSPINNER_KEY) !== 'true') {
            localStorage.setItem(AUTOSPINNER_KEY, 'true');
            checkTrophyUnlocks();
        }
    }

    window.recordVipPurchased = function() {
        checkTrophyUnlocks();
    }

    window.recordVipDailySpin = function() {
        if (!getStat(VIP_WHEEL_DAILY_SPIN_KEY)) {
            setStat(VIP_WHEEL_DAILY_SPIN_KEY, 1);
            checkTrophyUnlocks();
        }
    }

    window.recordVipWheelSpin = function() {
        setStat(VIP_WHEEL_TOTAL_SPINS_KEY, getStat(VIP_WHEEL_TOTAL_SPINS_KEY) + 1);
        checkTrophyUnlocks();
    }

    window.recordVipHorseAlcoholPurchase = function() {
        if (!getStat(VIP_HORSE_ALCOHOL_PURCHASE_KEY)) {
            setStat(VIP_HORSE_ALCOHOL_PURCHASE_KEY, 1);
            checkTrophyUnlocks();
        }
    }

    window.recordVipFirstExchange = function() {
        if (!getStat(VIP_FIRST_EXCHANGE_KEY)) {
            setStat(VIP_FIRST_EXCHANGE_KEY, 1);
            checkTrophyUnlocks();
        }
    }

    window.recordPiggyFirstBreak = function() {
        if (!getStat(PIGGY_FIRST_BREAK_KEY)) {
            setStat(PIGGY_FIRST_BREAK_KEY, 1);
            checkTrophyUnlocks();
        }
    }

    window.unlockMaxMultiplierTrophy = function () {};

    function startPlaytimeCounter() {
        let last = Date.now();
        setInterval(() => {
            const now = Date.now();
            const diff = Math.floor((now - last) / 1000);
            last = now;
            if (diff > 0 && diff < 300) {
                setStat(PLAYTIME_KEY, getStat(PLAYTIME_KEY) + diff);
                checkTrophyUnlocks();
            }
        }, 15000);
    }

    window.TrophySystem = {
        recordSlotResult: recordSlotResult,
        openPopup: createTrophiesPopup,
        recordDerbyDashFirstPlay: window.recordDerbyDashFirstPlay,
        recordDerbyDashRace: window.recordDerbyDashRace,
        recordAutospinnerPurchased: window.recordAutospinnerPurchased,
        recordVipDailySpin: window.recordVipDailySpin,
        recordVipWheelSpin: window.recordVipWheelSpin,
        recordVipHorseAlcoholPurchase: window.recordVipHorseAlcoholPurchase,
        recordVipFirstExchange: window.recordVipFirstExchange,
        recordPiggyFirstBreak: window.recordPiggyFirstBreak,
        unlockMaxMultiplierTrophy: window.unlockMaxMultiplierTrophy,
        recordVipPurchased: window.recordVipPurchased
    };
    window.getUnlockedTrophies = getUnlockedTrophies;
    window.TROPHIES = TROPHIES;

    const styles = `
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&display=swap');
        
        .trophy-overlay {
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(11, 12, 16, 0.85); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
            z-index: 10005; display: flex; justify-content: center; align-items: center;
            opacity: 0; pointer-events: none; transition: opacity 0.3s ease;
            font-family: 'Montserrat', sans-serif;
            user-select: none;
        }
        .trophy-overlay.active { opacity: 1; pointer-events: auto; }
        
        .trophy-modal {
            background: linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.8) 100%);
            border: 1px solid rgba(212, 175, 55, 0.3);
            border-top: 2px solid #D4AF37;
            width: 92%; max-width: 480px; height: 82vh; max-height: 700px;
            border-radius: 20px; padding: 30px 20px; display: flex; flex-direction: column;
            transform: scale(0.95); transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
            color: #fff; position: relative; box-sizing: border-box;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.9), inset 0 0 20px rgba(212, 175, 55, 0.05);
        }
        .trophy-overlay.active .trophy-modal { transform: scale(1); }
        
        .trophy-close {
            position: absolute; top: 15px; right: 20px;
            background: none; border: none; color: rgba(255,255,255,0.4);
            font-size: 2rem; cursor: pointer; transition: color 0.2s ease;
            line-height: 1;
        }
        .trophy-close:hover { color: #D4AF37; }
        
        .trophy-header-wrapper {
            text-align: center; margin-bottom: 25px; padding-bottom: 20px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        
        .trophy-title {
            font-size: 2.2rem; font-weight: 800; text-transform: uppercase; letter-spacing: 2px;
            background: linear-gradient(to right, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent;
            margin-bottom: 8px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.8));
        }
        
        .trophy-subtitle {
            font-size: 0.9rem; color: rgba(255, 255, 255, 0.5); font-weight: 600; text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .trophy-list {
    flex: 1; 
    overflow-y: auto; 
    display: flex; 
    flex-direction: column; 
    gap: 15px; 
    padding-right: 8px;
    -webkit-overflow-scrolling: touch; /* Adds momentum scrolling on iOS */
    overscroll-behavior: contain; /* Prevents the background from trying to scroll */
}
        .trophy-list::-webkit-scrollbar { width: 4px; }
        .trophy-list::-webkit-scrollbar-thumb { background: #D4AF37; border-radius: 4px; }
        
        .trophy-row {
            display: flex; align-items: center; padding: 16px 15px; position: relative;
            background: rgba(11, 12, 16, 0.6);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 14px;
            transition: transform 0.2s cubic-bezier(0.25, 0.8, 0.25, 1); box-sizing: border-box;
        }
        .trophy-row.unlocked {
            background: linear-gradient(145deg, rgba(212,175,55,0.1) 0%, rgba(0,0,0,0.7) 100%);
            border: 1px solid #D4AF37;
            box-shadow: 0 0 15px rgba(212, 175, 55, 0.15);
        }
        .trophy-row.locked { opacity: 0.5; filter: grayscale(1); }
        
        .trophy-icon-box {
            font-size: 2rem; margin-right: 18px; width: 54px; height: 54px; min-width: 54px;
            display: flex; justify-content: center; align-items: center;
            background: rgba(0,0,0,0.5);
            border: 1px solid rgba(255,255,255,0.1); border-radius: 50%;
            box-shadow: 0 4px 6px rgba(0,0,0,0.4);
        }
        .trophy-row.unlocked .trophy-icon-box {
            background: rgba(212, 175, 55, 0.1);
            border: 1px solid #D4AF37; box-shadow: 0 0 10px rgba(212, 175, 55, 0.3); text-shadow: 0 0 10px rgba(212, 175, 55, 0.8);
        }
        
        .trophy-info { flex: 1; display: flex; flex-direction: column; min-width: 0; }
        .trophy-row-title { font-size: 1.05rem; font-weight: 700; color: #fff; letter-spacing: 0.5px; margin-bottom: 4px; }
        .trophy-row.unlocked .trophy-row-title { color: #F2D06B; }
        .trophy-row-desc { font-size: 0.85rem; color: rgba(255,255,255,0.6); margin-bottom: 10px; line-height: 1.3; }
        
        .trophy-progress-container { width: 100%; display: flex; align-items: center; gap: 12px; }
        .trophy-progress-bar {
            flex: 1; height: 8px; background: rgba(0,0,0,0.5); border-radius: 20px;
            overflow: hidden; border: 1px solid rgba(255,255,255,0.1);
        }
        .trophy-row.unlocked .trophy-progress-bar { border-color: rgba(212,175,55,0.3); }
        .trophy-progress-fill {
            height: 100%; background: #555; border-radius: 20px;
            width: 0%; transition: width 0.5s ease;
        }
        .trophy-row.unlocked .trophy-progress-fill {
            background: linear-gradient(90deg, #F2D06B 0%, #D4AF37 100%);
            box-shadow: 0 0 8px rgba(212, 175, 55, 0.6);
        }
        
        .trophy-progress-text { font-size: 0.8rem; font-weight: 700; color: rgba(255,255,255,0.5); min-width: 50px; text-align: right; }
        .trophy-row.unlocked .trophy-progress-text { color: #F2D06B; }
        
        .trophy-toast {
            position: fixed; top: -120px; left: 50%; transform: translateX(-50%);
            background: linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.9) 100%);
            border: 1px solid rgba(212, 175, 55, 0.3); border-top: 2px solid #D4AF37;
            box-shadow: 0 15px 30px rgba(0,0,0,0.7), 0 0 20px rgba(212,175,55,0.15);
            border-radius: 14px; padding: 16px 24px; display: flex; align-items: center;
            z-index: 11000; pointer-events: none; width: 92%; max-width: 380px;
            transition: top 0.4s cubic-bezier(0.25, 0.8, 0.25, 1); box-sizing: border-box;
            font-family: 'Montserrat', sans-serif; backdrop-filter: blur(10px);
        }
        .trophy-toast.show { top: 30px; }
        .trophy-toast-icon {
            font-size: 2rem; margin-right: 18px; width: 48px; height: 48px;
            background: rgba(212, 175, 55, 0.1); border-radius: 50%;
            display: flex; justify-content: center; align-items: center; border: 1px solid #D4AF37;
            box-shadow: 0 4px 8px rgba(0,0,0,0.4); text-shadow: 0 0 10px rgba(212, 175, 55, 0.8);
        }
        .trophy-toast-content { display: flex; flex-direction: column; }
        .trophy-toast-alert { font-size: 0.75rem; font-weight: 800; color: #D4AF37; text-transform: uppercase; letter-spacing: 1px; }
        .trophy-toast-title { font-size: 1.1rem; font-weight: 700; color: #fff; margin-top: 4px; }
    `;

    const styleEl = document.createElement('style');
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);

    const overlay = document.createElement('div');
    overlay.className = 'trophy-overlay';
    overlay.id = 'trophyOverlay';
    overlay.innerHTML = `
        <div class="trophy-modal">
            <button class="trophy-close" id="closeTrophyBtn">&times;</button>
            <div class="trophy-header-wrapper">
                <div class="trophy-title">Trophies</div>
                <div class="trophy-subtitle" id="trophySubtitle">0 / 0 Achievements Unlocked</div>
            </div>
            <div class="trophy-list" id="trophyListContainer"></div>
        </div>
    `;
    document.body.appendChild(overlay);

    function createTrophiesPopup() {
        const unlocked = getUnlockedTrophies();
        const listContainer = document.getElementById('trophyListContainer');

        listContainer.innerHTML = '';
        document.getElementById('trophySubtitle').innerText = `${unlocked.length} / ${TROPHIES.length} Completed`;

        TROPHIES.forEach(trophy => {
            const isUnlocked = unlocked.includes(trophy.id);
            const currentProgress = getTrophyProgress(trophy);
            const cappedProgress = Math.min(currentProgress, trophy.target);
            const percent = (cappedProgress / trophy.target) * 100;

            let progressText = "";
            if (trophy.type === 'autospinner' || trophy.type === 'derbydash_first_play' || trophy.type === 'vip_purchased' || trophy.type === 'vip_daily_spin' || trophy.type === 'vip_horse_alcohol' || trophy.type === 'vip_first_exchange' || trophy.type === 'piggy_first_break') {
                progressText = cappedProgress >= 1 ? 'Achieved' : `0/1`;
            } else if (trophy.type === 'playtime') {
                const m = Math.floor(cappedProgress / 60);
                const s = cappedProgress % 60;
                const targetM = Math.floor(trophy.target / 60);
                progressText = `${m}:${s.toString().padStart(2, '0')}/${targetM}:00`;
            } else {
                progressText = `${cappedProgress.toLocaleString()}/${trophy.target.toLocaleString()}`;
            }

            const row = document.createElement('div');
            row.className = `trophy-row ${isUnlocked ? 'unlocked' : 'locked'}`;
            row.innerHTML = `
                <div class="trophy-icon-box">${isUnlocked ? trophy.icon : '🔒'}</div>
                <div class="trophy-info">
                    <div class="trophy-row-title">${trophy.title}</div>
                    <div class="trophy-row-desc">${trophy.desc}</div>
                    <div class="trophy-progress-container">
                        <div class="trophy-progress-bar">
                            <div class="trophy-progress-fill" style="width: ${percent}%"></div>
                        </div>
                        <div class="trophy-progress-text">
                            ${progressText}${isUnlocked && trophy.chips ? ` <span style="color:#D4AF37;">(+${trophy.chips.toLocaleString()})</span>` : ''}
                        </div>
                    </div>
                </div>
            `;
            listContainer.appendChild(row);
        });

        overlay.classList.add('active');
    }

    function closeTrophiesPopup() {
        overlay.classList.remove('active');
    }

    function triggerTrophyToast(trophy) {
        const toast = document.createElement('div');
        toast.className = 'trophy-toast';
        toast.innerHTML = `
            <div class="trophy-toast-icon">${trophy.icon}</div>
            <div class="trophy-toast-content">
                <div class="trophy-toast-alert">Achievement Unlocked!</div>
                <div class="trophy-toast-title">${trophy.title}</div>
            </div>
        `;
        document.body.appendChild(toast);

        if (TROPHY_SFX && TROPHY_SFX.play) {
            TROPHY_SFX.currentTime = 0;
            TROPHY_SFX.play().catch(() => {});
        }

        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 500);
        }, 4000);
    }

    function updateTrophyBadgeCount() {
        const trophyIcon = document.querySelector('.nav-btn img[alt="Trophy"]');
        if (!trophyIcon) return;
        const btn = trophyIcon.closest('.nav-btn');
        if (!btn) return;

        const currentWins = getStat(WINS_KEY);
        const currentJackpots = getStat(JACKPOTS_KEY);
        const currentPlaytime = getStat(PLAYTIME_KEY);
        const derbyDashFirstPlay = getStat(DERBY_DASH_FIRST_PLAY_KEY);
        const derbyDashTotalRaces = getStat(DERBY_DASH_TOTAL_RACES_KEY);
        const autospinnerPurchased = localStorage.getItem(AUTOSPINNER_KEY) === 'true' ? 1 : 0;
        const vipPurchased = localStorage.getItem(VIP_UNLOCKED_KEY) === "1" ? 1 : 0;
        const unlocked = getUnlockedTrophies();

        let pendingAlert = false;
        TROPHIES.forEach(t => {
            const progress = getTrophyProgress(t);

            if (progress >= t.target && !unlocked.includes(t.id)) {
                pendingAlert = true;
            }
        });

        let badge = btn.querySelector('.trophy-gift-badge');
        if (pendingAlert && !badge) {
            badge = document.createElement('div');
            badge.className = 'trophy-gift-badge';
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
            badge.innerText = '!';
            btn.appendChild(badge);
        } else if (!pendingAlert && badge) {
            badge.remove();
        }
    }

    function setupInterceptionEngine() {
        if (typeof window.checkWin === 'function') {
            const originalCheckWin = window.checkWin;
            window.checkWin = function (results) {
                originalCheckWin(results);

                const baseValues = { 0: 0, 1: 20, 2: 50, 3: 100, 4: 10, 5: 300 };
                let totalWin = 0;

                const blueChips = results.filter(idx => idx === 3).length;
                if (blueChips === 3) totalWin += 100;
                else if (blueChips === 2) totalWin += 50;
                else if (blueChips === 1) totalWin += 20;

                const bells = results.filter(idx => idx === 5).length;
                if (bells === 3) totalWin += 300;
                else if (bells === 2) totalWin += 150;
                else if (bells === 1) totalWin += 20;

                results.forEach(idx => {
                    if (idx !== 3 && idx !== 5) {
                        totalWin += (baseValues[idx] || 0);
                    }
                });

                if (totalWin > 0) {
                    const isJackpot = results[0] === results[1] && results[1] === results[2];
                    recordSlotResult(true, isJackpot);
                }
            };
        }
    }

    function init() {
        const trophyIcon = document.querySelector('.nav-btn img[alt="Trophy"]');
        if (trophyIcon) {
            const trophyBtn = trophyIcon.closest('.nav-btn');
            if (trophyBtn) {
                trophyBtn.style.position = "relative";
                trophyBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    createTrophiesPopup();
                });
            }
        }

        document.getElementById('closeTrophyBtn').addEventListener('click', closeTrophiesPopup);
        overlay.addEventListener('click', (e) => { if (e.target === overlay) closeTrophiesPopup(); });

        setupInterceptionEngine();
        updateTrophyBadgeCount();
        checkTrophyUnlocks();
        startPlaytimeCounter();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();