const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

const scriptUrl = (document.currentScript && document.currentScript.src) ? document.currentScript.src : window.location.href;
const audioBaseUrl = new URL('.', scriptUrl);

const spinClickSfx = new Audio(new URL('wheel-click.mp3', audioBaseUrl));
const spinningLoopSfx = new Audio(new URL('wheel-spin.mp3', audioBaseUrl));
spinningLoopSfx.loop = true;

const rewardSfx = new Audio(new URL('wheel-reward.mp3', audioBaseUrl));
const loseSfx = new Audio(new URL('wheel-lose.mp3', audioBaseUrl));
const convertSfx = new Audio(new URL('wheel-convert.mp3', audioBaseUrl));

const bgMusic = new Audio(new URL('shop.mp3', audioBaseUrl));
bgMusic.loop = true;
bgMusic.volume = 0.36;

function tryPlayBgMusic() {
    bgMusic.play().catch(() => {
        const resumeMusic = () => {
            bgMusic.play().catch(() => {});
            window.removeEventListener('pointerdown', resumeMusic, true);
            window.removeEventListener('keydown', resumeMusic, true);
        };
        window.addEventListener('pointerdown', resumeMusic, true);
        window.addEventListener('keydown', resumeMusic, true);
    });
}
tryPlayBgMusic();

const playSfx = audio => {
    try {
        audio.currentTime = 0;
        audio.play().catch(e => {
            console.log("Audio playback blocked:", e);
        });
    } catch (e) {
        console.log("Failed to play sfx:", e);
    }
};

window.playWheelSpinStart = () => {
    playSfx(spinClickSfx);
    spinningLoopSfx.play().catch(() => {});
};

window.stopWheelSpinLoop = () => {
    spinningLoopSfx.pause();
    setTimeout(() => {
        try { spinningLoopSfx.currentTime = 0; } catch {}
    }, 30);
};

window.playWheelRewardSfx = () => {
    window.stopWheelSpinLoop();
    setTimeout(() => playSfx(rewardSfx), 40);
};

window.playWheelLoseSfx = () => {
    window.stopWheelSpinLoop();
    setTimeout(() => playSfx(loseSfx), 40);
};

window.playWheelConvertSfx = () => {
    playSfx(convertSfx);
};