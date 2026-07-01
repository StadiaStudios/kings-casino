(function () {
    const style = document.createElement('style');
    style.textContent = `
    .bgm-popup-overlay {
        position: fixed;
        z-index: 99999;
        top: 0; left: 0; right: 0; bottom: 0;
        backdrop-filter: blur(8px);
        background: rgba(10, 10, 12, 0.85);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: opacity 0.3s ease;
    }
    .bgm-popup-box {
        min-width: 320px;
        background: linear-gradient(145deg, #1c1c1c, #0a0a0a);
        padding: 45px 40px 40px 40px;
        border-radius: 12px;
        box-shadow: 0 15px 50px rgba(0, 0, 0, 0.8);
        text-align: center;
        border: 1px solid #333;
        position: relative;
        max-width: 90vw;
    }
    .bgm-popup-box::before {
        content: '';
        position: absolute;
        top: 0; left: 0; right: 0; height: 3px;
        background: linear-gradient(90deg, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c);
        border-top-left-radius: 11px;
        border-top-right-radius: 11px;
    }
    .bgm-popup-title {
        font-family: "Playfair Display", "Times New Roman", serif;
        font-size: 2.2rem;
        margin-bottom: 0.3em;
        background: linear-gradient(to right, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-weight: 700;
        letter-spacing: 1px;
    }
    .bgm-popup-desc {
        font-family: "Inter", "Segoe UI", sans-serif;
        font-size: 1rem;
        color: #a0a0a0;
        margin-bottom: 2.2em;
        font-weight: 400;
        letter-spacing: 0.5px;
    }
    .bgm-popup-btn {
        font-family: "Inter", "Segoe UI", sans-serif;
        background: linear-gradient(135deg, #d4af37 0%, #aa771c 100%);
        color: #000;
        border: none;
        border-radius: 6px;
        padding: 14px 48px;
        font-size: 1.05rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 1.5px;
        box-shadow: 0 4px 15px rgba(212, 175, 55, 0.15);
        transition: all 0.2s ease-in-out;
        cursor: pointer;
    }
    .bgm-popup-btn:hover {
        box-shadow: 0 6px 22px rgba(212, 175, 55, 0.35);
        transform: translateY(-1px);
    }
    .bgm-popup-btn:active {
        transform: translateY(1px);
        box-shadow: 0 2px 10px rgba(212, 175, 55, 0.2);
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
        title.innerHTML = options.title || `King's Casino`;

        const desc = document.createElement('div');
        desc.className = 'bgm-popup-desc';
        desc.innerHTML = options.desc || `Tap anywhere to play and enable audio features.`;

        const btn = document.createElement('button');
        btn.className = 'bgm-popup-btn';
        btn.innerHTML = options.buttonText || 'Enter Casino';

        box.appendChild(title);
        box.appendChild(desc);
        box.appendChild(btn);
        overlay.appendChild(box);
        document.body.appendChild(overlay);

        let triggered = false;
        
        function kickoff() {
            if (triggered) return;
            triggered = true;
            
            overlay.style.opacity = '0';
            setTimeout(() => overlay.remove(), 300);

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