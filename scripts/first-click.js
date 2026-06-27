(function () {
    const style = document.createElement('style');
    style.textContent = `
    .bgm-popup-overlay {
        position: fixed;
        z-index: 99999;
        top: 0; left: 0; right: 0; bottom: 0;
        backdrop-filter: blur(2px);
        background: rgba(23, 48, 92, 0.70);
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .bgm-popup-box {
        min-width: 280px;
        background: linear-gradient(104deg, #37a8ef 0%, #2778c8 53%, #8cd2ff 100%);
        padding: 38px 36px 32px 36px;
        border-radius: 30px;
        box-shadow: 0 8px 32px #12496955;
        text-align: center;
        border: 3px solid #cfeaff;
        position: relative;
        max-width: 94vw;
    }
    .bgm-popup-title {
        font-family: inherit;
        font-size: 2.1rem;
        margin-bottom: 0.45em;
        color: #157be3;
        text-shadow: 0 2px 8px #daf3fff7, 0 5px 22px #2778c855;
        font-weight: bold;
    }
    .bgm-popup-desc {
        font-size: 1.07rem;
        color: #164a81;
        margin-bottom: 1.3em;
        font-weight: bold;
        letter-spacing: 0.01em;
    }
    .bgm-popup-btn {
        font-family: inherit;
        background: linear-gradient(to right, #8bd3ff, #368ee7 75%, #c3ebff);
        color: #164a81;
        border: none;
        border-radius: 50px;
        padding: 16px 66px;
        font-size: 1.25rem;
        font-weight: bold;
        box-shadow: 0 4px 14px #59b3fd44;
        transition: box-shadow 0.11s, transform 0.10s;
        cursor: pointer;
    }
    .bgm-popup-btn:active {
        transform: translateY(2px) scale(0.96);
        box-shadow: 0 2px 7px #bde5ff88;
    }
    `;
    document.head.appendChild(style);

    function showBGMInteractionPopup(options = {}) {
        if (document.querySelector('.bgm-popup-overlay')) return;

        const overlay = document.createElement('div');
        overlay.className = 'bgm-popup-overlay';

        const box = document.createElement('div');
        box.className = 'bgm-popup-box';

        const title = document.createElement('div');
        title.className = 'bgm-popup-title';
        title.innerHTML = options.title || `Let's Play!`;

        const desc = document.createElement('div');
        desc.className = 'bgm-popup-desc';
        desc.innerHTML = options.desc || `Tap or click to start the background music.`;

        const btn = document.createElement('button');
        btn.className = 'bgm-popup-btn';
        btn.innerHTML = options.buttonText || 'Begin';

        box.appendChild(title);
        box.appendChild(desc);
        box.appendChild(btn);
        overlay.appendChild(box);

        document.body.appendChild(overlay);

        let triggered = false;
        function kickoff() {
            if (triggered) return;
            triggered = true;
            overlay.remove();

            let success = false;
            const audio = document.getElementById('bgm-audio');
            if (audio && typeof audio.play === 'function') {
                audio.volume = 0.68;
                audio.play().catch(() => {});
                success = true;
            }
            if (!success && typeof window.tryPlayBGM === 'function') {
                window.tryPlayBGM();
            }
            if (typeof options.onStart === 'function') {
                options.onStart();
            }
        }

        btn.addEventListener('click', kickoff);
        btn.addEventListener('touchend', kickoff);

        overlay.addEventListener('click', e => {
            if (e.target === overlay) kickoff();
        });

        overlay.addEventListener('touchmove', e => e.preventDefault(), { passive: false });
        document.body.style.overflow = 'hidden';
        overlay.addEventListener('remove', () => {
            document.body.style.overflow = '';
        });
    }

    function interactionNeeded() {
        const audio = document.getElementById('bgm-audio');
        if (!audio) return true;
        return audio.paused;
    }

    window.showBGMInteractionPopup = showBGMInteractionPopup;

    document.addEventListener("DOMContentLoaded", function () {
        setTimeout(function () {
            if (interactionNeeded()) showBGMInteractionPopup();
        }, 90);
    });
})();