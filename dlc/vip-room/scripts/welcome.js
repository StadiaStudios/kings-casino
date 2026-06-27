(function () {
    const GUIDE_KEY = 'kings-casino-vip-room-guide-shown';
    if (localStorage.getItem(GUIDE_KEY)) return;

    const sfx = {
        next: new Audio('sfx/menu-ui.mp3'),
        back: new Audio('sfx/menu-ui.mp3'),
        skip: new Audio('sfx/piggybank-open.mp3'),
    };
    Object.values(sfx).forEach(a => {
        a.volume = 0.23;
        a.preload = 'auto';
    });

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
    .vip-guide-backdrop {
        position: fixed; z-index: 999999; inset: 0;
        display: flex; align-items: center; justify-content: center;
        background: rgba(36, 22, 50, 0.88);
        backdrop-filter: blur(9px);
        font-family: 'Outfit', sans-serif;
    }
    .vip-guide-modal {
        width: 90vw; max-width: 440px;
        background: linear-gradient(180deg, #222 0%, #3a213b 100%);
        border-radius: 24px;
        color: #fff;
        box-shadow: 0 20px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(220,220,220,0.10);
        padding: 44px 32px 36px 32px;
        position: relative;
        text-align: center;
        border: 1px solid #ccb6ff21;
        animation: vipModalPop 0.5s cubic-bezier(.16,1,.3,1);
    }
    @keyframes vipModalPop {
        0% { transform: scale(0.95); opacity: 0; }
        100% { transform: scale(1); opacity: 1; }
    }
    .vip-guide-modal h2 {
        font-size: 1.7rem;
        font-weight: 900;
        margin-bottom: 18px;
        color: #d9bfff;
        letter-spacing: -0.5px;
        text-shadow: 0 2px 10px #4e15b533;
    }
    .vip-guide-img {
        display: none;
    }
    .vip-guide-img img { display: none; }
    .vip-guide-modal p { color: #e5dbff; font-size: 1.04rem; line-height: 1.6; }
    .vip-guide-btns {
        display: flex; flex-direction: column-reverse;
        gap: 12px; margin-top: 28px;
    }
    .vip-guide-btn {
        background: linear-gradient(90deg,#c098f5 0%,#845ec1 100%);
        border: none;
        border-radius: 13px;
        color: #2a133d;
        font-weight: 800;
        font-size: 1rem;
        padding: 13px;
        cursor: pointer;
        transition: transform 0.2s, background 0.2s;
    }
    .vip-guide-btn:hover { transform: translateY(-2px); background: #a786e1; }
    .vip-guide-btn.vip-guide-btn-alt {
        background: transparent;
        color: #b688f7;
        border: 1.5px solid rgba(170,140,220,0.27);
    }
    .vip-guide-btn.vip-guide-btn-alt:hover { background: rgba(246,230,255,0.06); }
    .vip-guide-skip {
        position: absolute; top: 20px; right: 22px;
        background: transparent; border: none;
        color: rgba(230,210,255,0.40); font-weight: 700;
        cursor: pointer; font-size: 0.95rem;
    }
    .vip-guide-skip:hover { color: #fff; }
    `;
    document.head.appendChild(style);

    const guidePages = [
        {
            title: "Welcome to the VIP Room!",
            image: '',
            content: `<p>
                <strong style="font-size:1.13em;">The most exclusive lounge in King's Casino.</strong><br>
                Here, <span style="color:#ffe871">VIPs</span> can win big and unlock special perks.<br><br>
                Only invited guests allowed… <br>
                <span style="color:#f6dfff">Let's take a quick tour!</span>
            </p>`
        },
        {
            title: "VIP Chip Balance",
            image: '',
            content: `<p>
                VIP chips are distinct from regular chips.<br>
                Use your <b style="color:#fffde4;text-shadow:0 2px 0 #cfbbf4a2;">VIP balance</b> to play exclusive games and claim VIP rewards.<br><br>
                <span style="color:#cca4ff">Your balance is always visible at the top.</span>
            </p>`
        },
        {
            title: "Exclusive Games & Rewards",
            image: '',
            content: `<p>
                Play <span style="color:#fcbaff">VIP-only slots</span> and mini games.<br>
                Get access to <b>rare prizes</b>, and more!<br><br>
                <span style="color:#ffe387">Win more, unlock VIP milestones, and show off!</span>
            </p>`
        },
        {
            title: "Claim Gifts & Daily Perks",
            image: '',
            content: `<p>
                Visit daily to <span style="color:#bafeff">claim free VIP gifts</span> and bonuses!<br>
                <b>Check back often</b>—perks are refreshed regularly.
            </p>`
        },
        {
            title: "Welcome & Enjoy!",
            image: '',
            content: `<p>
                <span style="font-size:1.17em;font-weight:bold;color:#fffde4e1;text-shadow:0 2px 0 #cfbbf4;">
                You’re all set for a VIP experience!<br>Good luck & have fun.
                </span>
            </p>`
        }
    ];

    let currentPage = 0;

    function makeVipGuideModal() {
        const backdrop = document.createElement('div');
        backdrop.className = 'vip-guide-backdrop';
        backdrop.tabIndex = -1;

        const modal = document.createElement('div');
        modal.className = 'vip-guide-modal';
        backdrop.appendChild(modal);

        function updateGuide() {
            modal.innerHTML = '';

            if (currentPage < guidePages.length - 1) {
                const skipBtn = document.createElement('button');
                skipBtn.className = 'vip-guide-skip';
                skipBtn.type = 'button';
                skipBtn.textContent = 'Skip';
                skipBtn.onclick = function() {
                    playSfx('skip');
                    finishGuide();
                };
                modal.appendChild(skipBtn);
            }

            const h2 = document.createElement('h2');
            h2.innerHTML = guidePages[currentPage].title;

            const contentDiv = document.createElement('div');
            contentDiv.innerHTML = guidePages[currentPage].content;

            modal.appendChild(h2);
            modal.appendChild(contentDiv);

            const btns = document.createElement('div');
            btns.className = 'vip-guide-btns';

            if (currentPage < guidePages.length - 1) {
                const nextBtn = document.createElement('button');
                nextBtn.className = 'vip-guide-btn';
                nextBtn.type = 'button';
                nextBtn.textContent = 'Next';
                nextBtn.onclick = function() {
                    playSfx('next');
                    currentPage++;
                    updateGuide();
                };
                btns.appendChild(nextBtn);
            } else {
                const playBtn = document.createElement('button');
                playBtn.className = 'vip-guide-btn';
                playBtn.textContent = 'Enter VIP Room!';
                playBtn.onclick = finishGuide;
                btns.appendChild(playBtn);
            }

            if (currentPage > 0) {
                const prevBtn = document.createElement('button');
                prevBtn.className = 'vip-guide-btn vip-guide-btn-alt';
                prevBtn.type = 'button';
                prevBtn.textContent = 'Back';
                prevBtn.onclick = function() {
                    playSfx('back');
                    currentPage--;
                    updateGuide();
                };
                btns.appendChild(prevBtn);
            }

            modal.appendChild(btns);
        }

        function finishGuide() {
            localStorage.setItem(GUIDE_KEY, "1");
            backdrop.remove();
        }

        updateGuide();
        document.body.style.overflow = "hidden";
        backdrop.addEventListener('click', function (e) {
            if (e.target === backdrop) {
                modal.style.animation = "vipModalPop 0.7s reverse";
                setTimeout(() => {
                    modal.style.animation = "vipModalPop 0.44s cubic-bezier(.46,1.46,.7,1)"
                }, 900);
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
        if (!localStorage.getItem(GUIDE_KEY)) setTimeout(makeVipGuideModal, 140);
    });
})();