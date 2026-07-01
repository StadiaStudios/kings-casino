(function () {
    const bgmPath = "sfx/bgm.mp3";
    const furnitureBuyPath = "sfx/buy-furniture.mp3";
    const homeBuyPath = "sfx/buy-furniture.mp3";
    const homeEquipPath = "sfx/equip-home.mp3";
    const rotatePath = "sfx/rotate.mp3";
    const removePath = "sfx/remove.mp3";

    function playSfx(path, volume = 1.0) {
        try {
            const audio = new Audio(path);
            audio.volume = volume;
            audio.play().catch(() => {});
            return audio;
        } catch {
            return null;
        }
    }

    let bgmAudio = null;
    function startBgm() {
        if (bgmAudio) return;
        bgmAudio = new Audio(bgmPath);
        bgmAudio.volume = 0.28;
        bgmAudio.loop = true;
        bgmAudio.play().catch(() => {
            bgmAudio = null;
        });
    }

    function stopBgm() {
        if (bgmAudio) {
            bgmAudio.pause();
            bgmAudio.currentTime = 0;
            bgmAudio = null;
        }
    }

    window.addEventListener('pointerdown', startBgm, { once: true, passive: true });
    window.addEventListener('keydown', startBgm, { once: true, passive: true });

    if (window.document && typeof window.MutationObserver !== 'undefined') {
        Object.defineProperty(window, '__furnShopSfxPatched', { value: true, configurable: false });

        setTimeout(() => {
            document.addEventListener(
                'click',
                function (e) {
                    const btn =
                        e.target.closest && e.target.closest('.buy-furniture-btn');
                    if (
                        btn &&
                        !btn.disabled &&
                        btn.innerText &&
                        !/Not Enough!/i.test(btn.innerText)
                    ) {
                        playSfx(furnitureBuyPath, 0.8);
                    }

                    const catBtn =
                        e.target.closest &&
                        (e.target.closest('.shop-category-btn') ||
                            e.target.closest('.shop-category-btn-mobile'));
                    if (catBtn) {
                        playSfx(rotatePath, 0.9);
                    }

                    const closeBtn =
                        e.target.closest &&
                        e.target.closest('.close-shop-btn');
                    if (closeBtn) {
                        playSfx(rotatePath, 0.9);
                    }
                },
                true
            );
        }, 500);
    }

    setTimeout(() => {
        document.addEventListener(
            'click',
            function (e) {
                const btn =
                    e.target.closest && e.target.closest('.equip-home-btn');
                if (
                    btn &&
                    btn.innerText &&
                    /^C\s?[\d,]+$/i.test(btn.innerText.trim())
                ) {
                    playSfx(homeBuyPath, 0.85);
                }
            },
            true
        );

        document.addEventListener(
            'click',
            function (e) {
                const btn =
                    e.target.closest && e.target.closest('.equip-home-btn');
                if (
                    btn &&
                    btn.innerText &&
                    btn.innerText.trim() === "Equip Home"
                ) {
                    playSfx(homeEquipPath, 0.95);
                }
            },
            true
        );
    }, 500);

    setTimeout(() => {
        document.addEventListener(
            'click',
            function (e) {
                if (
                    e.target.classList &&
                    e.target.classList.contains('rotate-btn')
                ) {
                    playSfx(rotatePath, 0.9);
                }
                if (
                    e.target.classList &&
                    e.target.classList.contains('action-btn') &&
                    /remove/i.test(e.target.innerText)
                ) {
                    playSfx(removePath, 0.85);
                }
            },
            true
        );
    }, 400);

    window.rhSfx = {
        playFurnitureBuy: () => playSfx(furnitureBuyPath, 0.8),
        playHomeBuy: () => playSfx(homeBuyPath, 0.85),
        playHomeEquip: () => playSfx(homeEquipPath, 0.95),
        playRotate: () => playSfx(rotatePath, 0.9),
        playRemove: () => playSfx(removePath, 0.85),
        startBgm,
        stopBgm,
    };
})();