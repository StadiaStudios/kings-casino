
(function () {
    const bgmPath = 'sfx/hr-bgm.mp3';
    const startClickPath = 'sfx/hr-click.mp3';
    const raceLoopPath = 'sfx/hr-racing.mp3';
    const winSfxPath = 'sfx/hr-win.mp3';
    const loseSfxPath = 'sfx/hr-lose.mp3';

    let bgmAudio = null;
    let raceLoopAudio = null;

    function playSimpleSfx(path, volume = 1.0) {
        try {
            const audio = new Audio(path);
            audio.volume = volume;
            audio.currentTime = 0;
            audio.play().catch(() => {});
            return audio;
        } catch (e) {
            return null;
        }
    }

    function playBgm() {
        if (!bgmAudio) {
            bgmAudio = new Audio(bgmPath);
            bgmAudio.loop = true;
            bgmAudio.volume = 0.3;
        }
        if (bgmAudio.paused) {
            bgmAudio.play().catch(() => {});
        }
    }

    function playRaceLoop() {
        stopRaceLoop();
        if (!raceLoopAudio) {
            raceLoopAudio = new Audio(raceLoopPath);
            raceLoopAudio.loop = true;
            raceLoopAudio.volume = 1.0;
        }
        raceLoopAudio.currentTime = 0;
        raceLoopAudio.play().catch(() => {});
    }
    function stopRaceLoop() {
        if (raceLoopAudio) {
            raceLoopAudio.pause();
            try { raceLoopAudio.currentTime = 0; } catch (e) {}
        }
    }

    window.addEventListener('pointerdown', playBgm, { once: true, passive: true });

    document.addEventListener('DOMContentLoaded', function () {
        const startBtn = document.getElementById('start-btn');
        const horseSelect = document.getElementById('horse-select');
        const betInput = document.getElementById('bet-amount');

        if (startBtn) {
            startBtn.addEventListener('click', () => {
                playSimpleSfx(startClickPath, 1.0);
                stopRaceLoop();
                playRaceLoop();
            });
        }
        if (horseSelect) {
            horseSelect.addEventListener('click', () => playSimpleSfx(startClickPath, 1.0));
        }
        if (betInput) {
            betInput.addEventListener('click', () => playSimpleSfx(startClickPath, 1.0));
        }
    });

    window.playWinSfx = function () {
        stopRaceLoop();
        setTimeout(() => playSimpleSfx(winSfxPath, 1.0), 40);
    };
    window.playLoseSfx = function () {
        stopRaceLoop();
        setTimeout(() => playSimpleSfx(loseSfxPath, 1.0), 40);
    };
})();