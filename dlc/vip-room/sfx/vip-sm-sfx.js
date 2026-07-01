(function () {
    const jackpotAudioPath = 'sfx/vip-sm-jackpot.mp3';
    const specialBellJackpotPath = 'sfx/vip-sm-3-bells.mp3';
    const insertCoinAudioPath = 'sfx/vip-sm-click.mp3';
    const reelSpinAudioPath = 'sfx/vip-sm-falling.mp3';
    const bgMusicAudioPath = 'sfx/vip-sm-bgm.mp3';

    let sharedAudioCtx = null;
    function getAudioCtx() {
        if (!sharedAudioCtx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            sharedAudioCtx = AudioCtx ? new AudioCtx() : null;
        }
        return sharedAudioCtx;
    }

    function playSimpleSfx(path, volume = 1.0) {
        try {
            const audio = new Audio(path);
            audio.volume = volume;
            audio.play().catch(() => {});
            return audio;
        } catch (e) {
            return null;
        }
    }

    let bgMusicAudio = null;
    function startBgMusic() {
        if (bgMusicAudio) return;
        bgMusicAudio = new Audio(bgMusicAudioPath);
        bgMusicAudio.volume = 0.35;
        bgMusicAudio.loop = true;
        bgMusicAudio.play().catch(() => {
            bgMusicAudio = null;
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        const isSlotMachinePage =
            window.location.pathname.endsWith('vip-slot-machines.html') ||
            window.location.pathname.endsWith('/vip-slot-machines.html');
        if (isSlotMachinePage) {
            window.addEventListener('pointerdown', startBgMusic, { once: true, passive: true });
            window.addEventListener('keydown', startBgMusic, { once: true, passive: true });
        }
    });

    const originalTriggerWinEffects = window.triggerWinEffects;
    window.triggerWinEffects = function (amount, type) {
        if (amount >= 300 && type === 'WIN!') {
            playSimpleSfx(specialBellJackpotPath, 1.0);
        } else {
            playSimpleSfx(jackpotAudioPath, 1.0);
        }
        if (originalTriggerWinEffects) originalTriggerWinEffects(amount, type);
    };

    (function () {
        let reelAudioElement = null;

        function stopReelAudio() {
            if (reelAudioElement) {
                reelAudioElement.pause();
                reelAudioElement.currentTime = 0;
                reelAudioElement = null;
            }
        }

        function patchSpin() {
            if (!window.spin || window.spin._vipSfxPatched) return;
            const originalSpin = window.spin;
            window.spin = async function (...args) {
                reelAudioElement = new Audio(reelSpinAudioPath);
                reelAudioElement.volume = 0.55;
                reelAudioElement.loop = true;
                reelAudioElement.play().catch(() => {});

                try {
                    await originalSpin.apply(this, args);
                } finally {
                    stopReelAudio();
                }
            };
            window.spin._vipSfxPatched = true;
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', patchSpin);
        } else {
            patchSpin();
        }
    })();
})();