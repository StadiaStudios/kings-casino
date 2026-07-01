(function () {
    const AUDIO_ASSETS = {
        bgm: 'sfx/bc-bgm.mp3',
        budClick: 'sfx/bc-click.mp3',
        uiButton: 'sfx/bc-ui.mp3',
        purchase: 'sfx/bc-payout.mp3'
    };

    const CHIP_KEY = 'kings-casino-chips';
    const AUTO_LVL_KEY = 'kings-casino-auto-level';
    const MULT_LVL_KEY = 'kings-casino-mult-level';

    let lastChips = parseInt(localStorage.getItem(CHIP_KEY), 10) || 100;
    let lastAutoLvl = parseInt(localStorage.getItem(AUTO_LVL_KEY), 10) || 0;
    let lastMultLvl = parseInt(localStorage.getItem(MULT_LVL_KEY), 10) || 0;

    let bgmAudio = null;
    let audioInitialized = false;

    const clickPool = [];
    const POOL_SIZE = 15;
    let currentPoolIndex = 0;

    function initAudioPools() {
        for (let i = 0; i < POOL_SIZE; i++) {
            const audio = new Audio(AUDIO_ASSETS.budClick);
            audio.volume = 0.65;
            clickPool.push(audio);
        }

        bgmAudio = new Audio(AUDIO_ASSETS.bgm);
        bgmAudio.loop = true;
        bgmAudio.volume = 0.40;
    }

    function playBudClickSFX() {
        if (!audioInitialized) return;
        const channel = clickPool[currentPoolIndex];
        channel.currentTime = 0;
        channel.play().catch(err => console.log("Audio playback blocked:", err));
        currentPoolIndex = (currentPoolIndex + 1) % POOL_SIZE;
    }

    function playSFX(srcPath, volume = 0.8) {
        if (!audioInitialized) return;
        const sfx = new Audio(srcPath);
        sfx.volume = volume;
        sfx.play().catch(() => {});
    }

    function triggerUserInteractionUnlock() {
        if (audioInitialized) return;
        audioInitialized = true;

        if (bgmAudio) {
            bgmAudio.play().catch(err => console.log("BGM autoplay context pending:", err));
        }

        document.removeEventListener('click', triggerUserInteractionUnlock);
        document.removeEventListener('pointerdown', triggerUserInteractionUnlock);
    }

    function setupGameHooks() {
        const budClickTarget = document.getElementById('bud-click-target');
        if (budClickTarget) {
            budClickTarget.addEventListener('pointerdown', () => {
                playBudClickSFX();
            });
        }

        document.addEventListener('click', (e) => {
            const buttonElement = e.target.closest('button, .btn, #shop-open-btn, #shop-close-btn, .close-store-btn');
            if (buttonElement) {
                if (buttonElement.id === 'bud-click-target') return;
                playSFX(AUDIO_ASSETS.uiButton, 0.7);
            }
        });

        setInterval(() => {
            const currentChips = parseInt(localStorage.getItem(CHIP_KEY), 10) || 100;
            const currentAutoLvl = parseInt(localStorage.getItem(AUTO_LVL_KEY), 10) || 0;
            const currentMultLvl = parseInt(localStorage.getItem(MULT_LVL_KEY), 10) || 0;

            if (currentAutoLvl > lastAutoLvl || currentMultLvl > lastMultLvl) {
                playSFX(AUDIO_ASSETS.purchase, 0.9);
            } else if (currentChips > lastChips) {
                const shopActive =
                    document.querySelector('.fullscreen-shop.active') ||
                    document.getElementById('casino-shop-overlay')?.classList.contains('active');
                if (shopActive) {
                    playSFX(AUDIO_ASSETS.purchase, 0.95);
                }
            }

            lastChips = currentChips;
            lastAutoLvl = currentAutoLvl;
            lastMultLvl = currentMultLvl;
        }, 150);
    }

    function runEngineInitializer() {
        initAudioPools();
        setupGameHooks();

        document.addEventListener('click', triggerUserInteractionUnlock);
        document.addEventListener('pointerdown', triggerUserInteractionUnlock);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runEngineInitializer);
    } else {
        runEngineInitializer();
    }
})();