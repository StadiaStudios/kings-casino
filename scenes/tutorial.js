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
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&display=swap');
    
    .kc-guide-backdrop {
        position: fixed; z-index: 10005; inset: 0;
        display: flex; align-items: center; justify-content: center;
        background: rgba(11, 12, 16, 0.85);
        backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
        font-family: 'Montserrat', sans-serif;
        user-select: none;
    }
    
    .kc-guide-modal *, .kc-guide-modal *::before, .kc-guide-modal *::after {
        box-sizing: border-box;
    }

    .kc-guide-modal {
        width: 92%; 
        max-width: 440px;
        max-height: 85vh;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        background: linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.8) 100%);
        border: 1px solid rgba(212, 175, 55, 0.3);
        border-top: 2px solid #D4AF37;
        border-radius: 20px;
        color: #fff;
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.9), inset 0 0 20px rgba(212, 175, 55, 0.05);
        padding: 30px 24px;
        position: relative;
        text-align: center;
        animation: kcModalPop 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
    }
    
    @keyframes kcModalPop {
        0% { transform: scale(0.95); opacity: 0; }
        100% { transform: scale(1); opacity: 1; }
    }
    
    .kc-guide-modal::-webkit-scrollbar { width: 4px; }
    .kc-guide-modal::-webkit-scrollbar-thumb { background: #D4AF37; border-radius: 4px; }

    .kc-guide-modal h2 {
        font-size: 1.8rem;
        margin-bottom: 20px;
        text-transform: uppercase;
        letter-spacing: 1px;
        font-weight: 800;
        background: linear-gradient(to right, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C);
        -webkit-background-clip: text; 
        -webkit-text-fill-color: transparent;
        filter: drop-shadow(0 2px 4px rgba(0,0,0,0.8));
    }

    .kc-guide-img {
        margin: 0 auto 20px;
        width: 80px; height: 80px;
        background: rgba(212, 175, 55, 0.1);
        border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        border: 1px solid rgba(212, 175, 55, 0.3);
        box-shadow: 0 4px 10px rgba(0,0,0,0.4);
    }

    .kc-guide-img img { width: 50px; height: 50px; object-fit: contain; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5)); }
    
    .kc-guide-modal p { 
        color: rgba(255,255,255,0.8); 
        font-size: 1rem; 
        line-height: 1.6; 
        font-weight: 400;
    }
    
    .kc-guide-modal strong, .kc-guide-modal b {
        color: #F2D06B;
        font-weight: 700;
    }

    .kc-guide-btns {
        display: flex; flex-direction: column-reverse;
        gap: 12px; margin-top: 30px;
    }

    .kc-guide-btn {
        background: linear-gradient(90deg, #F2D06B 0%, #D4AF37 100%);
        border: none;
        border-radius: 12px;
        color: #0b0c10;
        font-weight: 800;
        font-size: 1rem;
        padding: 14px;
        cursor: pointer;
        text-transform: uppercase;
        letter-spacing: 1px;
        transition: all 0.2s ease;
        box-shadow: 0 4px 15px rgba(212, 175, 55, 0.2);
    }

    .kc-guide-btn:hover { 
        transform: translateY(-2px); 
        box-shadow: 0 6px 20px rgba(212, 175, 55, 0.35); 
    }
    
    .kc-guide-btn:active { transform: translateY(1px); }

    .kc-guide-btn.kc-guide-btn-alt {
        background: rgba(255, 255, 255, 0.08);
        color: rgba(255, 255, 255, 0.8);
        border: 1px solid rgba(255, 255, 255, 0.05);
        box-shadow: none;
    }

    .kc-guide-btn.kc-guide-btn-alt:hover { 
        background: rgba(255,255,255,0.15); 
        color: #fff; 
    }

    .kc-guide-username-bar { margin: 20px auto; display: flex; gap: 8px; justify-content: center; width: 100%; }
    
    .kc-guide-username-bar input {
        flex: 1;
        background: rgba(0, 0, 0, 0.5);
        border: 1px solid rgba(255,255,255,0.15);
        border-radius: 12px;
        padding: 14px 16px;
        color: #fff;
        font-family: 'Montserrat', sans-serif;
        font-size: 1rem;
        outline: none;
        transition: all 0.25s ease;
    }
    
    .kc-guide-username-bar input:focus {
        border-color: #D4AF37; box-shadow: 0 0 12px rgba(212, 175, 55, 0.25);
    }
    
    .kc-guide-username-bar button {
        width: 50px;
        flex-shrink: 0;
        font-size: 1.2rem;
        padding: 0;
        display: flex; justify-content: center; align-items: center;
    }

    .kc-guide-skip {
        position: absolute; top: 15px; right: 20px;
        background: transparent; border: none; color: rgba(255,255,255,0.4);
        cursor: pointer; font-size: 1.5rem; line-height: 1;
        transition: color 0.2s ease;
        padding: 0;
    }

    .kc-guide-skip:hover { color: #D4AF37; }
    
    .kc-guide-err { color: #ff7675; font-size: 0.85rem; margin-top: 6px; font-weight: 600; }
    
    .kc-guide-particle {
        position: absolute;
        background: radial-gradient(circle, #F2D06B 0%, rgba(212, 175, 55, 0) 70%);
        opacity: 0.3;
        border-radius: 50%;
        animation: floatUp infinite linear;
        pointer-events: none;
    }
    
    @keyframes floatUp {
        0% { transform: translateY(0) scale(0.8); opacity: 0; }
        20% { opacity: 0.4; }
        80% { opacity: 0.2; }
        100% { transform: translateY(-100vh) scale(1.2); opacity: 0; }
    }
    `;
    document.head.appendChild(style);

    const guidePages = [
        {
            title: "Welcome!",
            image: 'resources/title-ico.png',
            content: `<p><strong style="font-size:1.1rem; color: #fff;">Step inside the glimmering halls of fun!</strong><br>
            Slots, Wheels, Bud Clicker, and more await. <br><br>
            Play for <strong>Casino Chips</strong>.<br>
            Climb the Leaderboard, unlock Epic Rewards, and claim free gifts.<br>
            <br><i style="color: rgba(255,255,255,0.5); font-size: 0.9rem;">Tap <b>Next</b> to begin your adventure!</i></p>`
        },
        {
            title: 'How to Play',
            image: 'resources/ui/slots.png',
            content: `<p>
            <strong>Casino Chips</strong> are your ticket to glory.<br><br>
            <strong>Games:</strong> Slots, Casino Wheel, Bud Clicker, Derby Dash & more!<br>
            Try them all, stack up chips, and unlock the VIP Room.
            </p>
            <p style="font-size:0.9rem; margin-top:1rem; color: rgba(255,255,255,0.5);">Spin big, win bigger!</p>`
        },
        {
            title: 'Your Profile',
            image: 'resources/items/chip.png',
            content: `<p>
            Check your profile & balance at the top of the lobby.<br><br>
            Earn <strong>bonus chips</strong> & daily gifts every time you log in.<br>
            Build your legacy and collect every trophy.
            </p>`
        },
        {
            title: 'Choose a Name',
            image: 'resources/ui/guest.png',
            content: 
                `<p>Make your mark on the leaderboard!</p>
                <div class="kc-guide-username-bar">
                  <input type="text" id="kc-guide-username-input" maxlength="14" placeholder="Enter username..."/>
                  <button class="kc-guide-btn kc-guide-btn-alt" id="kc-guide-username-gen" type="button" tabindex="0" title="Randomize Name">🎲</button>
                </div>
                <div style="font-size:0.85rem; color: rgba(255,255,255,0.5); margin-bottom:2px;">Or leave blank to stay <strong>Guest</strong></div>
                <div class="kc-guide-err" id="kc-guide-username-err"></div>
                `
        },
        {
            title: 'Install App',
            image: 'resources/ui/download.png',
            content: `<p>
                <strong>Enjoy lightning-fast access from your home screen.</strong>
                <br><br>
                <div style="text-align:left; font-size:0.9rem; background: rgba(0,0,0,0.3); padding: 15px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); margin-bottom: 10px;">
                    <b style="color: #fff;">📱 Mobile:</b>
                    <ul style="margin: 8px 0 15px 20px; color: rgba(255,255,255,0.7);">
                        <li><b>Android:</b> Tap <b>⋮</b> menu &rarr; <b>Add to Home screen</b></li>
                        <li><b>iOS:</b> Tap <b>Share</b> &rarr; <b>Add to Home Screen</b></li>
                    </ul>
                    <b style="color: #fff;">💻 Desktop:</b>
                    <ul style="margin: 8px 0 0 20px; color: rgba(255,255,255,0.7);">
                        <li><b>Chrome/Edge:</b> Click <b>Install</b> icon [↓] in address bar</li>
                    </ul>
                </div>
                <span style="color: #D4AF37; font-size: 0.85rem; font-weight: 600;">For the best experience, play as an installed app!</span>
            </p>`
        },
        {
            title: 'Ready to Play?',
            image: 'resources/ui/gift.png',
            content: `<p>
            <strong style="font-size:1.2rem; color: #fff;">You’re all set!</strong><br><br>
            Let the games begin...<br>
            <span style="color: #D4AF37;">Good luck & have fun!</span>
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
                skipBtn.innerHTML = '&times;';
                skipBtn.title = 'Skip Tutorial';
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
                playBtn.textContent = 'Play Now';
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
                    if (/[^a-zA-Z0-9_-]/.test(val)) return 'Only A-Z, 0-9, _ and - allowed.';
                    if (val.length < 3) return 'Must be at least 3 characters.';
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
                        'CherryChip', 'SparkleKing', 'WheelWarrior', 'ReelNova', 'RoyalFlash', 'GemmyBear', 'LuckyBud'
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
                setTimeout(() => modal.style.animation = "kcModalPop 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)", 400);
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