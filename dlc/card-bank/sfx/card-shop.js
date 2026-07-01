const SOUND_ASSETS = {
    bgm: 'sfx/bgm.mp3',
    sellAll: 'sfx/purchase.mp3',
    purchaseCrate: 'sfx/purchase.mp3'
};

const SfxManager = (function() {
    let bgm, sfx = {};
    let muted = false;

    function setupBgm() {
        bgm = document.createElement('audio');
        bgm.src = SOUND_ASSETS.bgm;
        bgm.loop = true;
        bgm.volume = 0.13;
        bgm.preload = 'auto';
        bgm.setAttribute('data-role', 'cardshop-bgm');
        document.body.appendChild(bgm);

        function tryPlay() {
            if (!bgm.paused) return;
            bgm.play().catch(() => {});
            window.removeEventListener('pointerdown', tryPlay);
            window.removeEventListener('keydown', tryPlay);
        }
        window.addEventListener('pointerdown', tryPlay);
        window.addEventListener('keydown', tryPlay);
    }

    function loadSfxKeys(keys) {
        keys.forEach(k => {
            let a = document.createElement('audio');
            a.src = SOUND_ASSETS[k];
            a.preload = 'auto';
            a.setAttribute('data-role', 'cardshop-sfx-'+k);
            sfx[k] = a;
            document.body.appendChild(a);
        });
    }

    function playSfx(key) {
        if (muted) return;
        let a = sfx[key];
        if (a) {
            try {
                a.currentTime = 0;
                a.play();
            } catch(e){}
        }
    }

    function stopBgm() {
        if (bgm) { bgm.pause(); bgm.currentTime = 0; }
    }
    function mute(toggle) {
        muted = toggle;
        if (bgm) bgm.muted = muted;
        Object.values(sfx).forEach(a => a.muted = muted);
    }

    return {
        setup: function() {
            setupBgm();
            loadSfxKeys(['sellAll', 'purchaseCrate']);
        },
        play: playSfx,
        mute: mute,
        stopBgm: stopBgm
    }
})();

document.addEventListener('DOMContentLoaded', function() {
    SfxManager.setup();

    let crateBtn = document.querySelector('.buy-crate-btn');
    if (crateBtn) {
        crateBtn.addEventListener('click', () => SfxManager.play('purchaseCrate'));
    }
    let crateBox = document.querySelector('.crate-box');
    if (crateBox) {
        crateBox.addEventListener('click', () => SfxManager.play('purchaseCrate'));
    }

    let sellAllBtn = document.querySelector('.sell-all-btn,[data-action="sell-all"]');
    if (sellAllBtn) {
        sellAllBtn.addEventListener('click', () => SfxManager.play('sellAll'));
    }
});

window.SfxManager = SfxManager;