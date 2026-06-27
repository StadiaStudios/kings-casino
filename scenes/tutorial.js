(function () {
    const GUIDE_KEY = 'kings-casino-welcome-guide-shown';
    if (localStorage.getItem(GUIDE_KEY)) return;

    const sfx = {
        next: new Audio('sfx/menu-ui.mp3'),
        back: new Audio('sfx/menu-ui.mp3'),
        skip: new Audio('sfx/piggybank-open.mp3'),
    };
    Object.values(sfx).forEach(a => { a.volume = 0.23; a.preload = 'auto'; });

    function playSfx(name) {
        try {
            if (!sfx[name]) return;
            sfx[name].currentTime = 0;
            sfx[name].play();
        } catch (e) {}
    }

    const style = document.createElement('style');
    style.textContent = `
    @import url('https://fonts.googleapis.com/css?family=Outfit:wght@400;700;900&display=swap');
    .kc-guide-backdrop {
        position: fixed; z-index: 999999; inset: 0;
        display: flex; align-items: center; justify-content: center;
        background: rgba(10, 5, 20, 0.85);
        backdrop-filter: blur(8px);
        font-family: 'Outfit', sans-serif;
    }
    .kc-guide-modal {
        width: 90vw; 
        max-width: 440px;
        max-height: 85vh; /* Restricts the modal box from exceeding device height */
        overflow-y: auto; /* Activates vertical scrollbar if layout runs long */
        -webkit-overflow-scrolling: touch; /* Leverages smooth kinetic scroll engine on iOS platforms */
        background: linear-gradient(180deg, #251a35 0%, #1a1226 100%);
        border-radius: 24px;
        color: #fff;
        box-shadow: 0 20px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1);
        padding: 30px 20px; /* Slightly slimmed down padding for enhanced mobile breathing room */
        position: relative;
        text-align: center;
        border: 1px solid rgba(255, 215, 0, 0.2);
        animation: kcModalPop 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes kcModalPop {
        0% { transform: scale(0.95); opacity: 0; }
        100% { transform: scale(1); opacity: 1; }
    }
    .kc-guide-modal h2 {
        font-size: 1.8rem;
        margin-bottom: 20px;
        color: #ffd700;
        letter-spacing: -0.5px;
        font-weight: 900;
    }
    .kc-guide-img {
        margin: 0 auto 20px;
        width: 90px; height: 90px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 20px;
        display: flex; align-items: center; justify-content: center;
        border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .kc-guide-img img { width: 60px; height: 60px; object-fit: contain; }
    .kc-guide-modal p { color: #d1c4e9; font-size: 1.05rem; line-height: 1.6; }
    .kc-guide-btns {
        display: flex; flex-direction: column-reverse;
        gap: 12px; margin-top: 30px;
    }
    .kc-guide-btn {
        background: #ffd700;
        border: none;
        border-radius: 12px;
        color: #1a1226;
        font-weight: 700;
        font-size: 1rem;
        padding: 14px;
        cursor: pointer;
        transition: transform 0.2s, background 0.2s;
    }
    .kc-guide-btn:hover { transform: translateY(-2px); background: #ffed4a; }
    .kc-guide-btn.kc-guide-btn-alt {
        background: transparent;
        color: #d1c4e9;
        border: 1px solid rgba(209, 196, 233, 0.3);
    }
    .kc-guide-btn.kc-guide-btn-alt:hover { background: rgba(255,255,255,0.05); }
    .kc-guide-username-bar { margin: 20px auto; display: flex; gap: 8px; justify-content: center; }
    .kc-guide-username-bar input {
        background: rgba(255,255,255,0.05);
        border: 1px solid rgba(255,255,255,0.2);
        border-radius: 12px;
        padding: 12px;
        color: #fff;
        width: 180px;
    }
    .kc-guide-skip {
        position: absolute; top: 20px; right: 20px;
        background: transparent; border: none; color: rgba(255,255,255,0.4);
        cursor: pointer; font-size: 0.9rem;
    }
    .kc-guide-skip:hover { color: #fff; }
    .kc-guide-err { color: #ff6b6b; font-size: 0.85rem; margin-top: 5px; }
    `;
    document.head.appendChild(style);

    const guidePages = [
        {
            title: "🎰 Welcome to King's Casino!",
            image: 'resources/title-ico.png',
            content: `<p><strong style="font-size:1.17em;">Step inside the glimmering halls of fun!</strong><br>
            <span style="color:#ffe27a;text-shadow:0 1.5px 0 #944ef988;">Slots, Wheels, Bud Clicker, and more await.</span> <br><br>
            Play for <span style="font-weight: 800; color:#ffef55;">Casino Chips</span>.<br>
            Climb the <b>Leaderboard</b>, unlock <span style="color:#ffd304">Epic Rewards</span>, and claim free gifts.<br>
            <br>🎉 <i style="color:#fff7;">Tap <b>Next</b> to begin your adventure!</i></p>`
        },
        {
            title: '🎮 How to Play',
            image: 'resources/ui/slots.png',
            content: `<p>
            <strong>💰 Casino Chips</strong> are your ticket to glory.<br>
            <strong>Games:</strong> Slots, Wheel, Bud Clicker, Derby Dash & more!<br>
            <span style="color:#ffe401;">Try them all, stack up chips, unlock prizes!</span>
            </p>
            <p style="font-size:.98em;margin-top:1em;color:#fff9;text-shadow:0 1px 0 #4d2a8682">Spin big, win bigger!</p>`
        },
        {
            title: '👤 Your Profile',
            image: 'resources/items/chip.png',
            content: `<p>
            Check your <b>profile</b> & <span style="color:#ffe871">balance</span> at the top.<br>
            <span style="color:#e0eafb">Earn <strong>bonus chips</strong> & gifts every day!</span><br>
            <span style="color:#fdde52;font-weight:700;">Build your legacy.</span>
            </p>`
        },
        {
            title: '✏️ Choose Your Username',
            image: 'resources/ui/guest.png',
            content: 
                `<p>Make your mark on the leaderboard!</p>
                <div class="kc-guide-username-bar">
                  <input type="text" id="kc-guide-username-input" maxlength="14" placeholder="Enter a username"/>
                  <button class="kc-guide-btn kc-guide-btn-alt" id="kc-guide-username-gen" type="button" tabindex="0">🎲</button>
                </div>
                <div style="font-size:.99em;color:#ffe27a;margin-bottom:2px;">Or leave blank to stay <strong>Guest</strong></div>
                <div class="kc-guide-err" id="kc-guide-username-err"></div>
                `
        },
        {
            title: '⬇️ Install as an App!',
            image: 'resources/ui/download.png',
            content: `<p>
                <strong style="color:#ffe45c;font-size:1.1em;">Enjoy lightning-fast access from your home screen.</strong>
                <br><br>
                <span style="color:#ffe87a;font-weight:600;">How to install King's Casino as an app:</span>
                <div style="text-align:left;font-size:1em;color:#fff9;margin:12px 0 0 0;">
                    <u>On <b>Mobile</b>:</u>
                    <ul style="margin-top:4px;margin-bottom:8px;">
                        <li><b>Chrome / Edge (Android):</b> Tap <b>⋮</b> menu &rarr; <b>Add to Home screen</b></li>
                        <li><b>Safari (iOS):</b> Tap <b>Share</b> <span style="font-size:1.03em;">&#x2197;</span> &rarr; <b>Add to Home Screen</b></li>
                    </ul>
                    <u>On <b>Desktop PC</b>:</u>
                    <ul>
                        <li><b>Chrome / Edge:</b> Click <b>Install</b> icon <span style="color:#ffd700">[↓]</span> in address bar or menu <b>&rarr; Install App</b></li>
                        <li><b>Safari (Mac):</b> File &rarr; Add to Dock</li>
                    </ul>
                </div>
                <span style="color:#ffd455;font-size:1em;">You’ll get the real app experience and things will work out better!</span>
            </p>`
        },
        {
            title: '🎁 Ready to Play?',
            image: 'resources/ui/gift.png',
            content: `<p>
            <span style="font-size:1.19em;font-weight:bold;color:#fffde4e1;text-shadow:0 2px 0 #ffcf54;">
            You’re all set!<br>Let the games begin…</span>
            <br><br>
            <span style="color:#ffd500ac;">Good luck & have fun!</span>
            </p>`
        }
    ];

    let currentPage = 0;
    let userName = '';

    function createParticles(backdrop) {
        const particleHolder = document.createElement('div');
        particleHolder.className = 'kc-guide-particles';
        for (let i = 0; i < 16; ++i) {
            const p = document.createElement('div');
            p.className = 'kc-guide-particle';
            const sz = Math.floor(Math.random() * 30 + 16) + 'px';
            p.style.width = sz;
            p.style.height = sz;
            p.style.left = Math.random() * 98 + '%';
            p.style.bottom = (-Math.random() * 130) + 'px';
            p.style.animationDuration = (Math.random() * 1.1 + 2.5) + "s";
            p.style.animationDelay = (Math.random() * 2.5).toFixed(2) + 's';
            particleHolder.appendChild(p);
        }
        backdrop.appendChild(particleHolder);
    }

    function makeGuideModal() {
        const backdrop = document.createElement('div');
        backdrop.className = 'kc-guide-backdrop';
        backdrop.tabIndex = -1;
        createParticles(backdrop);

        function updateGuide() {
            modal.innerHTML = '';

            if (currentPage < guidePages.length - 1) {
                const skipBtn = document.createElement('button');
                skipBtn.className = 'kc-guide-skip';
                skipBtn.type = 'button';
                skipBtn.textContent = 'Skip Tutorial';
                skipBtn.onclick = function() {
                    playSfx('skip');
                    skipGuide();
                };
                modal.appendChild(skipBtn);
            }

            const h2 = document.createElement('h2');
            h2.innerHTML = guidePages[currentPage].title;

            const imgDiv = document.createElement('div');
            imgDiv.className = 'kc-guide-img';
            const img = document.createElement('img');
            img.src = guidePages[currentPage].image;
            img.alt = '';
            img.draggable = false;
            imgDiv.appendChild(img);

            const contentDiv = document.createElement('div');
            contentDiv.innerHTML = guidePages[currentPage].content;

            modal.appendChild(h2);
            modal.appendChild(imgDiv);
            modal.appendChild(contentDiv);

            const btns = document.createElement('div');
            btns.className = 'kc-guide-btns';

            if (currentPage < guidePages.length - 1) {
                const nextBtn = document.createElement('button');
                nextBtn.className = 'kc-guide-btn';
                nextBtn.type = 'button';
                nextBtn.textContent = 'Next';
                nextBtn.onclick = function() {
                    playSfx('next');
                    nextPage();
                };
                btns.appendChild(nextBtn);
            } else {
                const playBtn = document.createElement('button');
                playBtn.className = 'kc-guide-btn';
                playBtn.textContent = '🎲 Play Now!';
                playBtn.onclick = finishGuide;
                btns.appendChild(playBtn);
            }

            if (currentPage > 0 && currentPage < guidePages.length - 1) {
                const prevBtn = document.createElement('button');
                prevBtn.className = 'kc-guide-btn kc-guide-btn-alt';
                prevBtn.type = 'button';
                prevBtn.textContent = 'Back';
                prevBtn.onclick = function() {
                    playSfx('back');
                    prevPage();
                };
                btns.appendChild(prevBtn);
            }

            if (currentPage === guidePages.length - 1 && guidePages.length > 1) {
                const prevBtn = document.createElement('button');
                prevBtn.className = 'kc-guide-btn kc-guide-btn-alt';
                prevBtn.type = 'button';
                prevBtn.textContent = 'Back';
                prevBtn.onclick = function() {
                    playSfx('back');
                    prevPage();
                };
                btns.appendChild(prevBtn);
            }

            modal.appendChild(btns);

            if (currentPage === 3) {
                const uInput = modal.querySelector('#kc-guide-username-input');
                const randBtn = modal.querySelector('#kc-guide-username-gen');
                const errDiv = modal.querySelector('#kc-guide-username-err');
                const reserved = ['guest', 'admin', 'player'];
                function validateName(val) {
                    if (!val) return '';
                    if (/[^a-zA-Z0-9_-]/.test(val)) return 'Only A-Z, 0-9, _ and -.';
                    if (val.length < 3) return 'At least 3 characters.';
                    if (reserved.includes(val.toLowerCase())) return 'Name not available.';
                    return '';
                }
                uInput.addEventListener('input', function () {
                    const msg = validateName(uInput.value.trim());
                    errDiv.textContent = msg;
                    userName = msg ? '' : uInput.value.trim();
                });
                randBtn.onclick = function () {
                    const names = [
                        'LuckyStar', 'ChipChamp', 'SlotKing', 'RoyalAce', 'Goldie', 'SpinFlash', 'CasinoPro',
                        'DashRider', 'BigWinz', 'NeonChips', 'ZestyQueen', 'BudMaster', 'JadeJackpot', 'WheelHero', 'MegaSpin',
                        'AceMachine', 'MaxBetta', 'DiamondDust', 'ChaseChips', 'JokerBet', 'BuddyBanker', 'VivaSpin', 'JazzyJack',
                        'GlamourReel', 'SassySpinner', 'FlashFortune', 'PrizePirate', 'WinWagon', 'GrinChipper', 'CashMaven',
                        'CherryChip', 'SparkleKing', 'WheelWarrior', 'ReelNova', 'RoyalFlash', 'GemmyBear', 'LuckyBud',
                        'DoubleDealer', 'BlitzQueen', 'GlitzGuru', 'BigPatron', 'CashZilla', 'MagicPot', 'GrandJack',
                        'StardustSpin', 'VegasVibes', 'RingSpinner', 'QuickQueen', 'CosmoJack', 'GoldThrill', 'MarvelBet',
                        'BudJet', 'AcePulse', 'ChipperKid', 'Spinnerella', 'GroovyChips', 'EpicReeler', 'Coinzilla',
                        'TurboJack', 'MidnightAce', 'CasinoKit', 'LuxChip', 'ReelRio', 'KingCookie', 'FunkyWin', 
                        'DapperDealer', 'PrimeChipper', 'PixieChips', 'MightyReel', 'TurboSpin', 'NovaShuffler', 'ZingyZebra',
                        'StreakMaster', 'BetRocket', 'BankBud', 'CrimsonChip', 'Supremo', 'LivelyLuck', 'DiscoDice', 'RitzSpin',
                        'JackpotJade', 'GigaChip', 'FortuneFly', 'MysticReel', 'BoldBanker', 'RadiantReel', 'GhostWager', 
                        'SpinPixie', 'BettyBlitz', 'RollRoyale', 'SnazzySpin', 'BigTimer', 'JazzJackpot', 'BlingRider',
                        'ChaseRoyale', 'ChipperFox', 'GoldRush', 'SpinBreeze', 'DaisyDealer', 'EpicAce', 'WildPapa',
                        'DashGem', 'WagerWizard', 'QueenQuartz', 'PartyChip', 'Winnerette', 'SlotRover', 'SnappySpin',
                        'DiceWiz', 'Crownster', 'PulsePlayer', 'DreamDealer', 'CoinJockey', 'NeonNova', 'JollyJuggler',
                        'MetroMixer', 'EliteEnt', 'ZestBet', 'VivaVault', 'MangoChip', 'ClubClassic'
                    ];
               
                    let pick, tries = 0;
                    do {
                        pick = names[Math.floor(Math.random() * names.length)] +
                            (Math.random() < 0.3 ? Math.floor(Math.random() * 90 + 10) : '');
                    } while (reserved.includes(pick.toLowerCase()) && tries++ < 4);
                    uInput.value = pick;
                    let msg = validateName(pick);
                    errDiv.textContent = msg;
                    userName = msg ? '' : pick;
                };
                uInput.value = userName;
                btns.querySelector('.kc-guide-btn').onclick = function () {
                    let msg = validateName(uInput.value.trim());
                    errDiv.textContent = msg;
                    userName = msg ? '' : uInput.value.trim();
                    if (msg) return;
                    playSfx('next');
                    nextPage();
                };
            }
        }

        function nextPage() {
            if (currentPage < guidePages.length - 1) {
                currentPage++;
                updateGuide();
            }
        }

        function prevPage() {
            if (currentPage > 0) {
                currentPage--;
                updateGuide();
            }
        }

        function skipGuide() {
            localStorage.setItem(GUIDE_KEY, "1");
            backdrop.remove();
        }

        function finishGuide() {
            let clean = userName && userName.trim();
            if (currentPage === 3) {
                const uInput = modal.querySelector('#kc-guide-username-input');
                const errDiv = modal.querySelector('#kc-guide-username-err');
                if (uInput) {
                    const val = uInput.value.trim();
                    if (
                        val &&
                        (/[^a-zA-Z0-9_-]/.test(val) || val.length < 3 || ['guest', 'admin', 'player'].includes(val.toLowerCase()))
                    ) {
                        errDiv.textContent = "Please pick a valid username or leave blank.";
                        return;
                    }
                    userName = val;
                }
                currentPage++;
                updateGuide();
                return;
            }
            if (clean) {
                localStorage.setItem('kings-casino-username', clean);
                const pname = document.querySelector('.player-name');
                if (pname) pname.textContent = clean;
            }
            localStorage.setItem(GUIDE_KEY, "1");
            backdrop.remove();
        }

        const modal = document.createElement('div');
        modal.className = 'kc-guide-modal';
        backdrop.appendChild(modal);
        updateGuide();

        document.body.style.overflow = "hidden";
        backdrop.addEventListener('click', function (e) {
            if (e.target === backdrop) {
                modal.style.animation = "kcModalPop 0.7s reverse";
                setTimeout(() => modal.style.animation = "kcModalPop 0.44s cubic-bezier(.46,1.46,.7,1)", 900);
            }
        });
        document.body.appendChild(backdrop);

        backdrop.addEventListener('remove', function () {
            document.body.style.overflow = "";
        });
        const mutation = new MutationObserver(function (muts) {
            muts.forEach(m => {
                if (![...document.body.children].includes(backdrop)) {
                    document.body.style.overflow = "";
                    mutation.disconnect();
                }
            });
        });
        mutation.observe(document.body, { childList: true });
    }

    window.addEventListener('DOMContentLoaded', function () {
        const name = localStorage.getItem('kings-casino-username');
        if (name && document.querySelector('.player-name')) {
            document.querySelector('.player-name').textContent = name;
        }
        if (!localStorage.getItem(GUIDE_KEY)) setTimeout(makeGuideModal, 140);
    });
})();