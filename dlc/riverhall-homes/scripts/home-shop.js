(function () {
    const FLOOR_TEXTURES = {
        'penthouse': 'resources/textures/ph1.jpg',
        'diamond-lounge': 'resources/textures/marble.jpg',
        'high-roller-suite': 'resources/textures/cavern.png',
        'the-sovereign-residence': 'resources/textures/sovereign.jpeg',
        'riverhall-city': 'resources/textures/riverhall-city.jpg'
    };

    const homesCatalog = [
        {
            id: 'penthouse',
            name: "Penthouse",
            cost: 50000,
            floorImg: FLOOR_TEXTURES['penthouse'],
            thumb: 'resources/textures/ph1.jpg'
        },
        {
            id: 'diamond-lounge',
            name: "The Diamond Lounge",
            cost: 1000000,
            floorImg: FLOOR_TEXTURES['diamond-lounge'],
            thumb: 'resources/textures/marble.jpg'
        },
        {
            id: 'the-sovereign-residence',
            name: "The Sovereign Residence",
            cost: 3500000,
            floorImg: FLOOR_TEXTURES['the-sovereign-residence'],
            thumb: 'resources/textures/sovereign.jpeg'
        },
        {
            id: 'riverhall-city',
            name: "RiverHall City",
            cost: 500000,
            floorImg: FLOOR_TEXTURES['riverhall-city'],
            thumb: 'resources/textures/riverhall-city.jpg'
        },
        {
            id: 'high-roller-suite',
            name: "High Roller Suite",
            cost: 1000000,
            floorImg: FLOOR_TEXTURES['high-roller-suite'],
            thumb: 'resources/textures/cavern.png'
        }
    ];

    const openHomeShopBtn = document.getElementById('open-home-shop-btn') || (() => {
        const b = document.createElement('div');
        b.className = "floating-shop-btn";
        b.id = 'open-home-shop-btn';
        b.innerHTML = `<img src="resources/ui/home.png" alt="Open Home Shop" style="width:47px;height:47px;vertical-align:middle;margin-top:-2px;">`;
        Object.assign(b.style, {
            bottom: '110px',
            right: '25px',
            background: '#191a1c',
            borderRadius: '10px',
            padding: '7px 13px',
            cursor: 'pointer',
            boxShadow: '0 4px 16px #0005',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid #24252a',
            zIndex: 1010
        });
        b.addEventListener('mouseenter', () => {
            b.style.background = '#232528';
            b.style.borderColor = '#35363d';
        });
        b.addEventListener('mouseleave', () => {
            b.style.background = '#191a1c';
            b.style.borderColor = '#24252a';
        });
        document.body.appendChild(b);
        return b;
    })();

    let homeModal = document.getElementById('home-shop-modal');
    if (!homeModal) {
        homeModal = document.createElement('div');
        homeModal.id = 'home-shop-modal';
        homeModal.className = 'shop-modal-overlay';
        homeModal.innerHTML = `
            <div class="home-shop-fullscreen" id="home-shop-modal-content">
                <div class="home-shop-bar">
                    <h2>RiverHall Homes</h2>
                    <button class="close-shop-btn" id="close-home-shop-btn" aria-label="Close home shop">&times;</button>
                </div>
                <div class="home-shop-announcement">
                  Buy new homes with King's Casino Chips. Equipping a home changes your floor!
                </div>
                <div class="homes-grid" id="homes-grid"></div>
            </div>
        `;
        document.body.appendChild(homeModal);

        let css = document.createElement('style');
        css.innerHTML = `
        html, body {
            max-width: 100vw;
            overflow-x: hidden !important;
        }
        #home-shop-modal,
        .shop-modal-overlay {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: linear-gradient(115deg,rgb(22, 22, 22) 0%,rgb(8, 8, 8) 100%);
            display: none;
            z-index: 3000;
            min-height: 100vh;
            min-width: 100vw;
            width: 100vw;
            height: 100vh;
            overflow-x: hidden;
        }
        .home-shop-fullscreen {
            min-height: 100vh;
            min-width: 100vw;
            width: 100vw;
            height: 100vh;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            position: relative;
            background: transparent;
            box-sizing: border-box;
        }
        .home-shop-bar {
            width: 100%;
            background: rgba(27, 27, 27, 0.98);
            border-bottom: 2px solidrgb(95, 95, 95);
            padding: 0 0 0 0;
            margin: 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
            min-height: 62px;
            z-index: 10;
            position: sticky;
            top: 0;
        }
        .home-shop-bar h2 {
            margin-left: 32px;
            font-size: 2.05rem;
            font-weight: 700;
            color: #ffe16b;
            text-transform: uppercase;
            letter-spacing: 2px;
            flex: 1 1 auto;
            margin-top: 0; margin-bottom: 0;
            min-width: 0;
            overflow-wrap: break-word;
        }
        #close-home-shop-btn, .home-shop-bar .close-shop-btn {
            margin-right: 28px;
            margin-left: 10px;
            background: #181a1e;
            border: 1.5px solid #28292d;
            color: #dacd92;
            border-radius: 7px;
            padding: 9px 22px;
            font-weight: 700;
            font-size: 1.38rem;
            cursor: pointer;
            transition: background 0.17s, color 0.13s, border 0.13s;
            outline: none;
        }
        #close-home-shop-btn:hover, #close-home-shop-btn:focus {
            background: #1f2024;
            color: #ffe16b;
            border: 1.5px solid #ffe16b;
        }
        .home-shop-announcement {
            width: 100%;
            text-align: center;
            font-size: 1.07em;
            color: #ffe16b;
            background: rgba(32,30,18, 0.925);
            margin: 0;
            padding: 19px 0 19px 0;
            border-bottom: 1.5px solid #2d2b39;
            font-family: inherit;
            box-sizing: border-box;
        }
        .homes-grid {
            flex: 1 1 0;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
            gap: 33px 26px;
            padding: 4vh 7vw 7vh 7vw;
            margin: 0;
            overflow-y: auto;
            overflow-x: hidden;
            justify-items: center;
            align-items: start;
            width: 100%;
            box-sizing: border-box;
            max-width: 100vw;
        }
        @media (max-width: 900px) {
            .homes-grid {
                grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
                gap: 20px 8px;
                padding: 2vh 3vw;
                max-width: 100vw;
            }
            .home-shop-bar h2 { margin-left:16px; font-size: 1.27rem; }
            #close-home-shop-btn { margin-right:13px; padding:7px 9px; font-size:1.08rem;}
        }
        @media (max-width: 600px) {
            html, body {
                max-width: 100vw;
                overflow-x: hidden !important;
            }
            .home-shop-bar {
                min-height: 48px;
            }
            .home-shop-bar h2 {
                font-size: 1.05rem;
                margin-left: 10px;
                letter-spacing: 1px;
                min-width: 0;
                white-space: normal;
                overflow-wrap: break-word;
            }
            #close-home-shop-btn {
                margin-right: 6px;
                padding: 5px 13px;
                font-size: 0.97rem;
            }
            .home-shop-fullscreen {
                padding-top: 0 !important;
                min-width: 100vw;
                max-width: 100vw;
                min-height: 100vh;
                box-sizing: border-box;
                overflow-x: hidden;
            }
            .home-shop-announcement {
                font-size:0.94em;
                padding: 11px 2vw;
                box-sizing: border-box;
                word-break: break-word;
            }
            .homes-grid {
                grid-template-columns: 1fr;
                gap: 14px 0px;
                padding: 1.5vh 1vw 2vh 1vw;
                width: 100vw !important;
                max-width: 100vw !important;
                box-sizing: border-box;
                overflow-x: hidden !important;
            }
            .home-card {
                width: 96vw !important;
                max-width: 99vw !important;
                min-width: 0 !important;
                height: auto;
                max-height: none;
                min-height: 170px;
                border-radius: 13px;
                padding: 13px 3vw 15px 3vw;
                box-shadow: 0 3px 14px 0 #0005;
                margin: 0 auto;
                box-sizing: border-box;
                overflow-wrap: break-word;
            }
            .home-card .home-thumb {
                width: 60px;
                height: 60px;
                margin-bottom: 14px;
                border-radius: 7px;
            }
            .home-name {
                font-size: 1em;
                min-height: 2em;
                margin-bottom: 7px;
                word-break: break-word;
            }
            .equip-home-btn, .own-label {
                font-size: 0.97rem;
                min-height: 35px;
                width: 100% !important;
                margin-top: 8px;
                padding: 10px 0;
                box-sizing: border-box;
            }
            .own-label {
                padding: 7px 9px;
            }
        }
        @media (max-width: 410px) {
            .home-card {
                padding: 7px 2vw 12px 2vw;
                border-radius: 8px;
                width: 98vw !important;
                max-width: 100vw !important;
            }
            .home-shop-announcement {
                padding: 6px 1vw;
            }
        }
        .home-card {
            background: #111;
            border: 2px solid #332a13;
            border-radius: 22px;
            padding: 27px 17px 24px 17px;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            box-shadow: 0 5px 22px 0 #0003, 0 0px 0 #e1c2642a inset;
            transition: box-shadow 0.22s, border 0.22s, background 0.2s;
            min-width: 0; min-height: 0;
            max-width: 99vw;
            width: 230px;
            height: 330px;
            box-sizing: border-box;
            justify-content: flex-start;
            position: relative;
        }
        @media (max-width: 900px) {
            .home-card {
                width: 175px;
                height: 280px;
            }
        }
        .home-card:hover, .home-card:focus-within {
            box-shadow: 0 4px 34px 2px #f3e3ad11,  0 0 0 #ffd62e10 inset;
            border-color: #ffe16b;
        }
        .home-card .home-thumb {
            width: 89px;
            height: 89px;
            object-fit: cover;
            border-radius: 13px;
            margin-bottom: 23px;
            border: 2px solid #ffe16b;
            background: #fff;
            box-shadow: 0 1px 13px #12120544;
            transition: border 0.19s;
        }
        .home-card:hover .home-thumb {
            border-color: #fffbe2;
        }
        .home-name {
            color: #f1c40f;
            font-size: 1.18em;
            font-weight: bold;
            margin-bottom: 9px;
            margin-top: 0;
            letter-spacing:1px;
            min-height: 2.6em;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            word-break: break-word;
        }
        .equip-home-btn {
            margin-top: 14px;
            background:rgb(19, 19, 19);
            border: 2px solid #24252a;
            color: #ffe16b;
            padding: 11px 0;
            border-radius: 9px;
            font-weight: bold;
            cursor: pointer;
            font-size: 1.04rem;
            letter-spacing: .05rem;
            width: 98%;
            transition: background 0.17s, color 0.13s, border 0.14s;
            outline: none;
            box-shadow: 0 1px 8px #17181b50;
            min-height: 39px;
            touch-action: manipulation;
            user-select: none;
        }
        .equip-home-btn:active {
            background:rgb(32,32,32);
        }
        .equip-home-btn:hover, .equip-home-btn:focus {
            background:rgb(27, 27, 27);
            border: 2px solid #ffe16b;
            color: #fffed7;
        }
        .own-label {
            background: #222 !important;
            color: #fff !important;
            border-radius: 11px;
            padding: 8px 13px;
            font-size: 1em;
            margin-top: 14px;
            margin-bottom: 5px;
            font-weight: bold;
            width: 95%;
            text-align: center;
            letter-spacing:.8px;
            border: 1.2px solidrgb(17, 17, 17);
            box-shadow:0 1px 5px 0 #ffd26244 inset;
            min-height: 39px;
            display: flex;
            align-items: center;
            justify-content: center;
            touch-action: manipulation;
            user-select: none;
        }
        body, #home-shop-modal, .shop-modal-overlay, .homes-grid, .home-shop-fullscreen {
            max-width: 100vw !important;
            overflow-x: hidden !important;
        }
        .homes-grid::-webkit-scrollbar {width: 8px;}
        .homes-grid::-webkit-scrollbar-thumb {background: #ffe16b55;border-radius:5px;}
        `;
        document.head.appendChild(css);

        let vp = document.querySelector('meta[name="viewport"]');
        if (!vp) {
            let meta = document.createElement('meta');
            meta.name = "viewport";
            meta.content = "width=device-width,initial-scale=1,maximum-scale=1,user-scalable=0";
            document.head.appendChild(meta);
        }
    }
    const closeHomeShopBtn = homeModal.querySelector('#close-home-shop-btn');
    const homesGrid = homeModal.querySelector('#homes-grid');

    function getHomeData() {
        let data = JSON.parse(localStorage.getItem('rrh_homes') || '{"owned":[],"equipped":null,"layouts":{}}');
        if (data.furniture) {
            if (!data.layouts) data.layouts = {};
            let currentHomeId = data.equipped || 'default';
            data.layouts[currentHomeId] = data.furniture;
            delete data.furniture;
            localStorage.setItem('rrh_homes', JSON.stringify(data));
        }
        if (!data.layouts) data.layouts = {};
        return data;
    }

    function setHomeData(d) {
        localStorage.setItem('rrh_homes', JSON.stringify(d));
        window.dispatchEvent(new CustomEvent('rrh-home-data-update'));
    }

    function updateCanvasFloorTexture() {
        let d = getHomeData();
        let equipped = d.equipped;
        let canvas = document.getElementById('home-canvas');
        if (!canvas) return;

        if (equipped) {
            let home = homesCatalog.find(h => h.id === equipped);
            if (home && home.floorImg) {
                canvas.style.backgroundColor = '#e0e0e0';
                canvas.style.backgroundImage = `url('${home.floorImg}')`;
                canvas.style.backgroundSize = '40px 40px';
                canvas.style.backgroundRepeat = 'repeat';
            }
        } else {
            canvas.style.backgroundColor = '#e0e0e0';
            canvas.style.backgroundImage = 'linear-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.5) 1px, transparent 1px)';
            canvas.style.backgroundSize = '40px 40px';
        }
    }

    function equipHome(homeId) {
        let d = getHomeData();
        d.equipped = homeId;
        setHomeData(d);
        updateCanvasFloorTexture();
        loadFurnitureForHome(homeId);
    }

    function ownsHome(homeId) {
        return getHomeData().owned.includes(homeId);
    }

    function buyHome(homeId, cost, btnElement) {
        if (ownsHome(homeId)) return true;
        let bal = typeof getBalance === "function" ? getBalance() : parseInt(localStorage.getItem('kings-casino-chips') || 100);
        if (bal >= cost) {
            localStorage.setItem('kings-casino-chips', bal - cost);
            if (typeof syncBalance === "function") syncBalance();
            else window.dispatchEvent(new Event('storage'));

            let d = getHomeData();
            d.owned.push(homeId);
            setHomeData(d);
            return true;
        } else {
            let originalText = btnElement.innerText;
            btnElement.innerText = "Not Enough!";
            btnElement.style.background = "#2c181a";
            btnElement.style.color = "#ffe16b";
            btnElement.style.borderColor = "#981a2c";
            setTimeout(() => {
                btnElement.innerText = originalText;
                btnElement.style.background = "";
                btnElement.style.color = "";
                btnElement.style.borderColor = "";
            }, 1500);
            return false;
        }
    }

    function loadFurnitureForHome(homeId) {
        let d = getHomeData();
        if (typeof furnitureItems !== 'undefined') {
            furnitureItems.length = 0;
            if (d.layouts && d.layouts[homeId]) {
                d.layouts[homeId].forEach(item => {
                    if (typeof window.ensureChestId === 'function') {
                        window.ensureChestId(item);
                    }
                    furnitureItems.push(item);
                });
            }
            if (typeof draw === 'function') draw();
        }
    }

    const chipsIconHTML = `<img src="resources/items/chip.png" alt="Chips" style="height:1em;width:1em;vertical-align:baseline;margin-right:4px;display:inline-block;">`;

    function renderHomeCatalog() {
        homesGrid.innerHTML = '';
        homesCatalog.forEach(home => {
            let card = document.createElement('div');
            card.className = "home-card";

            card.innerHTML = `
                <img class="home-thumb" src="${home.thumb}" alt="${home.name}" onerror="this.src=''" />
                <div class="home-name">${home.name}</div>
            `;

            let flexSpacer = document.createElement('div');
            flexSpacer.style.flex = "1 1 auto";
            flexSpacer.style.minHeight = "0";
            card.appendChild(flexSpacer);

            if (ownsHome(home.id)) {
                if (getHomeData().equipped === home.id) {
                    let equippedLab = document.createElement('div');
                    equippedLab.className = 'own-label';
                    equippedLab.innerText = "Equipped";
                    equippedLab.style.background = "#222";
                    equippedLab.style.color = "#fff";
                    card.appendChild(equippedLab);
                } else {
                    let equipBtn = document.createElement('button');
                    equipBtn.className = 'equip-home-btn';
                    equipBtn.innerText = "Equip Home";
                    equipBtn.onclick = () => {
                        equipHome(home.id);
                        renderHomeCatalog();
                    };
                    card.appendChild(equipBtn);
                }
            } else {
                let buyBtn = document.createElement('button');
                buyBtn.className = 'equip-home-btn';
                buyBtn.innerHTML = chipsIconHTML + home.cost.toLocaleString();
                buyBtn.onclick = function() {
                    if (buyHome(home.id, home.cost, this)) {
                        equipHome(home.id);
                        renderHomeCatalog();
                    }
                };
                card.appendChild(buyBtn);
            }
            homesGrid.appendChild(card);
        });
    }

    openHomeShopBtn.onclick = () => {
        homeModal.style.display = 'block';
        setTimeout(() => {
            homeModal.style.opacity = "1";
        }, 9);
        renderHomeCatalog();
        setTimeout(() => {
            try { closeHomeShopBtn && closeHomeShopBtn.focus(); } catch (e) {}
        }, 55);
        document.body.style.overflow = 'hidden';
        document.body.style.maxWidth = '100vw';
    };
    closeHomeShopBtn.onclick = () => {
        homeModal.style.opacity = "0";
        setTimeout(() => {
            homeModal.style.display = 'none';
            document.body.style.overflow = '';
            document.body.style.maxWidth = '';
        }, 170);
    };
    homeModal.onclick = (e) => {
        if (e.target === homeModal) {
            homeModal.style.opacity = "0";
            setTimeout(() => {
                homeModal.style.display = 'none';
                document.body.style.overflow = '';
                document.body.style.maxWidth = '';
            }, 170);
        }
    };
    document.addEventListener('keydown', (e) => {
        if (
            (homeModal.style.display === 'block' || homeModal.style.display === 'flex')
            && e.key === 'Escape'
        ) {
            homeModal.style.opacity = "0";
            setTimeout(() => {
                homeModal.style.display = 'none';
                document.body.style.overflow = '';
                document.body.style.maxWidth = '';
            }, 170);
        }
    });

    window.addEventListener('rrh-home-data-update', () => {
        updateCanvasFloorTexture();
        renderHomeCatalog();
    });

    window.addEventListener('DOMContentLoaded', () => {
        updateCanvasFloorTexture();
        let d = getHomeData();
        let currentHomeId = d.equipped || 'default';
        loadFurnitureForHome(currentHomeId);

        setInterval(() => {
            if (typeof furnitureItems !== 'undefined') {
                let currentData = getHomeData();
                let activeHome = currentData.equipped || 'default';
                currentData.layouts[activeHome] = [...furnitureItems];
                localStorage.setItem('rrh_homes', JSON.stringify(currentData));
            }
        }, 1000);
    });
})();