(function () {
    const VIP_INTRO_KEY = 'kings-casino-vip-intro-shown';
    if (localStorage.getItem(VIP_INTRO_KEY)) return;

    localStorage.setItem(VIP_INTRO_KEY, '1');

    const overlay = document.createElement('div');
    overlay.id = 'vip-intro-overlay';
    Object.assign(overlay.style, {
        position: 'fixed',
        inset: 0,
        zIndex: '1000000',
        background: 'radial-gradient(circle at center, #1b1b28 0%, #050508 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'opacity 1.5s ease-in-out',
        opacity: '1',
        cursor: 'pointer'
    });

    const clickText = document.createElement('div');
    clickText.style.color = '#b5b5cc';
    clickText.style.fontSize = '1.25rem';
    clickText.style.fontFamily = "'Fredoka',sans-serif";
    clickText.style.fontWeight = '600';
    clickText.style.letterSpacing = '0.12em';
    clickText.style.opacity = '0.8';
    clickText.style.textShadow = '0 1px 8px #19192988';
    clickText.textContent = 'Tap or click to enter VIP room...';
    overlay.appendChild(clickText);

    document.body.appendChild(overlay);

    const sfx = new Audio('sfx/introduction-sound.mp3');
    sfx.preload = "auto";

    const style = document.createElement('style');
    style.textContent = `
    @keyframes vipSmoothFade {
        from { opacity: 0; transform: translateY(15px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes vipChipReveal {
        0% { 
            opacity: 0; 
            transform: scale(0.85) translateY(10px); 
            filter: brightness(0.5); 
        }
        100% { 
            opacity: 1; 
            transform: scale(1) translateY(0); 
            filter: brightness(1.15) drop-shadow(0 0 25px rgba(200, 200, 218, 0.3)); 
        }
    }
    .vip-sub-text {
        color: #c8c8da;
        font-size: 1.1rem;
        font-family: 'Fredoka', sans-serif;
        font-weight: 600;
        letter-spacing: 5px;
        text-transform: uppercase;
        margin-bottom: 35px;
        opacity: 0;
        animation: vipSmoothFade 1.8s ease-out 0.5s forwards;
    }
    .vip-main-text {
        color: #ffffff;
        font-size: 3rem;
        font-family: 'Fredoka', sans-serif;
        font-weight: 700;
        letter-spacing: 2px;
        text-shadow: 0 4px 20px rgba(255, 255, 255, 0.15);
        text-align: center;
        opacity: 0;
        animation: vipSmoothFade 1.8s ease-out 2.8s forwards;
    }
    .vip-chip-logo {
        width: 130px;
        height: 130px;
        margin-bottom: 30px;
        opacity: 0;
        animation: vipChipReveal 2.2s cubic-bezier(0.25, 1, 0.5, 1) 1.5s forwards;
    }
    `;

    function startIntroAnimation() {
        clickText.remove();

        document.head.appendChild(style);

        const subText = document.createElement('div');
        subText.className = 'vip-sub-text';
        subText.textContent = 'Exclusive Access Granted';

        const logo = document.createElement('img');
        logo.className = 'vip-chip-logo';
        logo.src = 'resources/items/silver-chip.png';
        logo.alt = 'VIP Chip Emblem';

        const mainText = document.createElement('div');
        mainText.className = 'vip-main-text';
        mainText.textContent = 'Welcome to the VIP Room';

        overlay.appendChild(subText);
        overlay.appendChild(logo);
        overlay.appendChild(mainText);

        sfx.currentTime = 0;
        sfx.play().catch(()=>{});

        setTimeout(() => {
            overlay.style.opacity = '0';
        }, 6000);

        setTimeout(() => {
            overlay.remove();
            style.remove();
        }, 7500);

        overlay.removeEventListener('pointerdown', handlePointer);
        overlay.removeEventListener('keydown', handlePointer);
    }

    function handlePointer(e) {
        if (e.type === 'keydown' && e.key !== ' ' && e.key !== 'Enter') return;
        startIntroAnimation();
    }

    overlay.addEventListener('pointerdown', handlePointer);
    overlay.addEventListener('keydown', handlePointer);
    overlay.tabIndex = 0;
    setTimeout(() => overlay.focus(), 50);
})();