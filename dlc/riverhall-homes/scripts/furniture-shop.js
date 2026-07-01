<style>
    .floating-shop-btn {
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: linear-gradient(135deg, #222, #111);
        color: #f1c40f;
        border: 2px solid #222;
        border-radius: 50%;
        width: 68px;
        height: 68px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 2rem;
        cursor: pointer;
        box-shadow: 0 4px 28px rgba(0,0,0,0.75);
        z-index: 1000;
        transition: box-shadow 0.15s, transform 0.08s;
        padding: 0;
    }
    .floating-shop-btn:active {
        transform: scale(0.96);
        box-shadow: 0 2px 10px rgba(0,0,0,0.35);
    }
    .floating-shop-btn img {
        width: 36px;
        height: 36px;
        display: block;
        object-fit: contain;
        user-drag: none;
        user-select: none;
        filter: drop-shadow(0 1px 3px rgba(0,0,0,0.23));
        pointer-events: none;
    }
    .shop-modal-overlay {
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(17,17,17,0.98);
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 2000;
    }
    .shop-modal-content {
        background:rgb(30, 30, 30);
        border: 1.5px solid #444;
        border-radius: 0;
        width: 100vw;
        max-width: none;
        height: 100vh;
        max-height: none;
        overflow-y: auto;
        padding: 0;
        color: #e5e5e5;
        box-shadow: none;
        display: flex;
        flex-direction: column;
        scrollbar-width: thin;
        scrollbar-color: #28231e #181216;
    }
    .shop-modal-content::-webkit-scrollbar {
        width: 9px;
        background: #181216;
        border-radius: 9px;
    }
    .shop-modal-content::-webkit-scrollbar-thumb {
        background: linear-gradient(135deg,#292114,#46371c);
        border-radius: 8px;
        min-height: 48px;
        border: 1.5px solid #232019;
    }
    .shop-modal-content::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(135deg, #49360d, #af984f);
    }
    .shop-modal-content::-webkit-scrollbar-corner {
        background: #181216;
    }
    .shop-modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0;
        border-bottom: 1.5px solid #242424;
        padding: 23px 40px 13px 40px;
        background: #181313;
        position: relative;
        z-index: 2;
    }
    .crown-count-display {
        display: flex;
        align-items: center;
        font-size: 1.14rem;
        font-weight: 600;
        color:rgb(255, 255, 255);
        gap: 8px;
        background:#111;
        padding: 8px 18px;
        border-radius: 8px;
        margin-left: 19px;
        border: 1px solid rgb(48, 48, 48);
        box-shadow: 0 2px 8pxrgba(32, 32, 32, 0.72);
        user-select: none;
    }
    .crown-count-display img {
        width: 1.35em;
        height: 1.35em;
        margin-right: 5px;
        vertical-align: middle;
        pointer-events: none;
    }
    .shop-modal-header h2 {
        color: #f1c40f;
        text-transform: uppercase;
        font-size: 2.1rem;
        letter-spacing: 2.2px;
        margin: 0;
        font-weight: 800;
    }
    .close-shop-btn {
        background: none;
        border: none;
        color: #aaa;
        border-radius: 5px;
        padding: 12px 24px;
        font-weight: bold;
        font-size: 1.18rem;
        cursor: pointer;
        transition: background 0.15s, color 0.15s;
    }
    .close-shop-btn:hover, .close-shop-btn:focus {
        background: #221a20;
        color: #fff;
    }
    .crown-shop-btn {
        background: #111;
        color: #eee;
        border: 1.5px solid #232323;
        border-radius: 7px;
        padding: 9px 22px;
        font-weight: 600;
        font-size: 1.07rem;
        margin-left: 16px;
        margin-right: 0;
        cursor: pointer;
        transition: background 0.14s, color 0.13s, border 0.13s;
        display: flex;
        align-items: center;
        gap: 8px;
        box-shadow: 0 2px 13px #1a1a1a1a;
        text-decoration: none;
        outline: none;
    }
    .crown-shop-btn:hover, .crown-shop-btn:focus {
        background: #222;
        border-color: #444;
        color: #fff;
    }
    .crown-shop-btn img {
        width: 1.4em;
        height: 1.4em;
        margin-right: 4px;
        vertical-align: middle;
    }
    .shop-categories-hamburger {
        display: none;
        position: relative;
        z-index: 11;
    }
    .shop-categories-hamburger-btn {
        background: none;
        border: none;
        cursor: pointer;
        padding: 10px 14px;
        border-radius: 8px;
        margin-left: 7px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.17s;
    }
    .shop-categories-hamburger-btn:focus,
    .shop-categories-hamburger-btn:hover {
        background: rgba(23,18,15,0.58);
    }
    .shop-categories-hamburger-icon {
        width: 28px;
        height: 28px;
        display: block;
    }
    .shop-categories-mobile-menu {
        position: absolute;
        top: calc(100% + 5px);
        left: 0;
        right: 0;
        background: #181313;
        border: 1.5px solid #292929;
        box-shadow: 0 10px 36px 0 rgba(30,25,8,0.21);
        display: none;
        flex-direction: column;
        border-radius: 11px;
        gap: 0;
        padding: 2px 0;
        z-index: 1002;
        animation: shopCategoryMenuOpen 0.20s ease;
    }
    @keyframes shopCategoryMenuOpen {
        from { opacity: 0; transform: translateY(-10px);}
        to   { opacity: 1; transform: translateY(0);}
    }
    .shop-category-btn-mobile {
        background: none;
        border: none;
        text-align: left;
        color: #e4dfc1;
        font-size: 1rem;
        font-weight: 600;
        padding: 13px 26px;
        border-bottom: 1px solid #2220;
        cursor: pointer;
        transition: background 0.16s, color 0.16s;
        letter-spacing: 1.2px;
        outline: none;
        width: 100%;
    }
    .shop-category-btn-mobile.active, .shop-category-btn-mobile:focus {
        background: rgb(56, 56, 56);
        color: #ffe082;
    }
    .shop-category-btn-mobile:hover:not(.active):not(:focus) {
        background: rgb(46, 46, 46);
        color: #eacc97;
    }
    .shop-category-btn-mobile:last-child {
        border-bottom: none;
    }
    .shop-categories-bar {
        display: flex;
        gap: 12px;
        background: #181313;
        border-bottom: 1.5px solid #292929;
        padding: 9px 38px 9px 40px;
        position: sticky;
        top: 0;
        z-index: 1;
    }
    .shop-category-btn {
        background: none;
        border: none;
        color: #d3ad61;
        font-weight: 600;
        font-size: 1.04rem;
        padding: 5px 18px;
        border-radius: 7px 7px 0 0;
        cursor: pointer;
        transition: background 0.16s, color 0.16s;
        letter-spacing: 1.2px;
        outline: none;
    }
    .shop-category-btn.active, .shop-category-btn:focus {
        background: #292217;
        color: #ffe082;
    }
    .shop-category-btn:hover:not(.active):not(:focus) {
        background: #212014;
        color: #eacc97;
    }
    .furniture-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(178px, 1fr));
        gap: 24px;
        padding: 34px 50px 50px 50px;
        width: 100%;
        box-sizing: border-box;
    }
    .furniture-card {
        background: #181818;
        border: 2px solid #292929;
        border-radius: 14px;
        padding: 24px 10px 17px 10px;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        transition: box-shadow 0.15s, border 0.15s;
        box-shadow: 0 1px 10px rgba(0,0,0,0.12);
    }
    .furniture-card:hover {
        box-shadow: 0 4px 24px 1px rgba(50,50,0,0.14);
        border-color: #3a3a2d;
    }
    .furniture-card .image-preview {
        width: 72px;
        height: 72px;
        border-radius: 10px;
        margin-bottom: 12px;
        object-fit: contain;
        background: #141414;
        border: 2px solid #242424;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .buy-furniture-btn {
        margin-top: 17px;
        background: linear-gradient(90deg, #181a12 0%, #111 100%);
        border: 1.5px solid #31350f;
        color: #f5c842;
        padding: 10px 0;
        width: 100%;
        border-radius: 7px;
        font-weight: 600;
        font-size: 1.07rem;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 8px;
        transition: background 0.18s, color 0.15s, border 0.15s;
    }
    .buy-furniture-btn:hover {
        background: linear-gradient(90deg, #22220e 0%, #171a13 100%);
        color: #ffe082;
        border-color: #686214;
    }
    .crown-shop-nav-wrap {
        display: flex;
        align-items: center;
        gap: 0;
    }
    @media (max-width: 900px) {
        .shop-modal-header, .shop-categories-bar {
            padding-left: 7vw;
            padding-right: 7vw;
        }
        .furniture-grid {
            padding-left: 7vw;
            padding-right: 7vw;
            gap: 14px;
        }
        .crown-count-display {
            font-size: 1rem;
            padding: 7px 9px;
            margin-left: 12px;
        }
    }
    @media (max-width: 650px) {
        .shop-modal-header {
            padding-left: 2vw;
            padding-right: 2vw;
        }
        .furniture-grid {
            grid-template-columns: repeat(auto-fill, minmax(135px, 1fr));
            padding-left: 2vw;
            padding-right: 2vw;
            padding-top: 12px;
            padding-bottom: 12px;
            gap: 7px;
        }
        .shop-modal-header h2 {
            font-size: 1.23rem;
        }
        .shop-categories-bar {
            display: none !important;
        }
        .shop-categories-hamburger {
            display: flex !important;
            flex-direction: column;
            position: relative;
            width: 100%;
            background: #181313;
            border-bottom: 1.5px solid #292929;
            padding: 9px 2vw 8px 2vw;
        }
        .shop-categories-mobile-menu {
            display: flex;
        }
        .shop-modal-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 6px 0;
        }
        .crown-shop-nav-wrap {
            width: 100%;
            display: flex;
            flex-direction: row-reverse;
            align-items: center;
            margin-bottom: 2px;
        }
        .crown-count-display {
            margin-left: 0;
            margin-top: 8px;
            margin-bottom: 3px;
            width: max-content;
            font-size: 0.97rem;
        }
    }
    @media (max-width: 400px) {
        .furniture-card .image-preview {
            width: 56px;
            height: 56px;
        }
        .furniture-card {
            padding-top: 13px;
            padding-bottom: 11px;
        }
        .crown-shop-btn {
            padding-left: 13px;
            padding-right: 13px;
            font-size: 0.91rem;
        }
        .crown-count-display {
            font-size: 0.90rem;
            padding: 5px 6px;
        }
    }
</style>

<div class="floating-shop-btn" id="open-shop-btn" title="Open furniture shop">
    <img src="resources/ui/shop.png" alt="Open furniture shop" draggable="false" />
</div>

<div class="shop-modal-overlay" id="shop-modal">
    <div class="shop-modal-content" role="dialog" aria-modal="true" aria-labelledby="furniture-shop-title">
        <div class="shop-modal-header">
            <div class="crown-shop-nav-wrap">
                <button class="close-shop-btn" id="close-shop-btn" aria-label="Close shop">&times;</button>
                <a class="crown-shop-btn" id="crown-shop-link" href="crown-shop.html" rel="noopener">
                    <img src="resources/ui/crown.png" alt="Crown">
                    Crown Shop
                </a>
                <span class="crown-count-display" id="crown-count-display" title="Your Crowns">
                    <img src="resources/ui/crown.png" alt="Crown" />
                    <span id="crown-count-value">0</span>
                </span>
            </div>
            <h2 id="furniture-shop-title">RiverHall Trader</h2>
        </div>
        <div class="shop-categories-bar" id="shop-categories-bar" aria-label="Shop Categories"></div>
        <div class="shop-categories-hamburger" id="shop-categories-hamburger" aria-label="Category Menu">
            <button id="hamburger-menu-btn" class="shop-categories-hamburger-btn" aria-label="Open menu" aria-haspopup="true" aria-expanded="false">
                <svg class="shop-categories-hamburger-icon" viewBox="0 0 32 32" fill="none" stroke="#f1c40f" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="7" y1="9" x2="25" y2="9" />
                    <line x1="7" y1="16" x2="25" y2="16" />
                    <line x1="7" y1="23" x2="25" y2="23" />
                </svg>
            </button>
            <div id="shop-categories-mobile-menu" class="shop-categories-mobile-menu" role="menu" style="display: none;"></div>
        </div>
        <div class="furniture-grid" id="furniture-grid"></div>
    </div>
</div>

<script>
(function() {
    function generateChestId() {
        return 'chest-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now();
    }

    const openBtn = document.getElementById('open-shop-btn');
    const modal = document.getElementById('shop-modal');
    const closeBtn = document.getElementById('close-shop-btn');
    const grid = document.getElementById('furniture-grid');
    const catBar = document.getElementById('shop-categories-bar');
    const catHamburger = document.getElementById('shop-categories-hamburger');
    const hamburgerBtn = document.getElementById('hamburger-menu-btn');
    const mobileMenu = document.getElementById('shop-categories-mobile-menu');
    const crownCountValue = document.getElementById('crown-count-value');

    function getCrownCountDisplayAmount() {
        if (typeof window.getCrownBalance === "function") {
            return window.getCrownBalance();
        } else {
            return parseInt(localStorage.getItem('kings-casino-crowns'), 10) || 0;
        }
    }

    function updateCrownCountDisplay() {
        crownCountValue.textContent = getCrownCountDisplayAmount().toLocaleString();
    }

    window.addEventListener('storage', updateCrownCountDisplay);

    if (typeof window.syncCrownBalance === 'function') {
        window.addEventListener('crown-balance-sync', updateCrownCountDisplay);
    }

    if (typeof window.syncCrownBalance === 'function') {
        const origSync = window.syncCrownBalance;
        window.syncCrownBalance = function(...args) {
            origSync.apply(this, args);
            window.dispatchEvent(new Event('crown-balance-sync'));
        }
    }

    const catalog = [
        { name: "Wooden Wall", cost: 50, w: 1, h: 1, img: "resources/walls/wooden.jpg", ischest: false, category: "Walls" },
        { name: "Wooden Wall", cost: 150, w: 3, h: 1, img: "resources/walls/wooden.jpg", ischest: false, category: "Walls" },
        { name: "Wooden Wall", cost: 250, w: 5, h: 1, img: "resources/walls/wooden.jpg", ischest: false, category: "Walls" },
        { name: "Stone Wall", cost: 100, w: 1, h: 1, img: "resources/walls/stone.png", ischest: false, category: "Walls" },
        { name: "Stone Wall", cost: 300, w: 3, h: 1, img: "resources/walls/stone.png", ischest: false, category: "Walls" },
        { name: "Stone Wall", cost: 500, w: 5, h: 1, img: "resources/walls/stone.png", ischest: false, category: "Walls" },
        { name: "Marble Wall", cost: 500, w: 1, h: 1, img: "resources/walls/marble.jpg", ischest: false, category: "Walls" },
        { name: "Marble Wall", cost: 1500, w: 3, h: 1, img: "resources/walls/marble.jpg", ischest: false, category: "Walls" },
        { name: "Marble Wall", cost: 2500, w: 5, h: 1, img: "resources/walls/marble.jpg", ischest: false, category: "Walls" },

        { name: "Small Plant", cost: 100, w: 1, h: 1, img: "resources/furniture/small-plant.png", ischest: false, category: "Decor" },
        { name: "Outdoor Plant", cost: 500, w: 1, h: 1, img: "resources/furniture/city-plant.png", ischest: false, category: "Decor" },
        { name: "Demon Plant", cost: 500, w: 1, h: 1, img: "resources/furniture/demon-plant.png", ischest: false, category: "Decor" },
        { name: "Dragon Statue", cost: 20000, w: 4, h: 2, img: "resources/furniture/dragon-statue.png", ischest: false, category: "Decor" },
        { name: "Gaming Setup", cost: 35000, w: 2, h: 2, img: "resources/furniture/game-setup.png", ischest: false, category: "Decor" },
        { name: "Fountain", cost: 30000, w: 4, h: 4, img: "resources/furniture/fountain.png", ischest: false, category: "Decor" },
        { name: "Ice Dragon Statue", cost: 60000, w: 3, h: 1, img: "resources/furniture/ice-dragon-statue.png", ischest: false, category: "Decor" },

        { name: "Wooden Chair", cost: 300, w: 1, h: 1, img: "resources/furniture/wooden-chair.png", ischest: false, category: "Furniture" },
        { name: "Basic Sofa", cost: 1000, w: 2, h: 1, img: "resources/furniture/basic-sofa.png", ischest: false, category: "Furniture" },
        { name: "White Sofa", cost: 1000, w: 2, h: 1, img: "resources/furniture/white-sofa.png", ischest: false, category: "Furniture" },
        { name: "Red Sofa", cost: 1000, w: 2, h: 1, img: "resources/furniture/red-sofa.png", ischest: false, category: "Furniture" },
        { name: "BlackXSkulls Sofa", cost: 3000, w: 2, h: 1, img: "resources/furniture/blackxskulls-sofa.png", ischest: false, category: "Furniture" },
        { name: "King Bed", cost: 4000, w: 2, h: 2, img: "resources/furniture/king-bed.png", ischest: false, category: "Furniture" },
        { name: "Marble Bed", cost: 18000, w: 2, h: 2, img: "resources/furniture/marble-bed.png", ischest: false, category: "Furniture" },
        { name: "Coffee Table", cost: 1500, w: 2, h: 1, img: "resources/furniture/coffee-table.png", ischest: false, category: "Furniture" },

        { name: "Forge Home", cost: 30000, w: 5, h: 3, img: "resources/furniture/forge-home.png", ischest: false, category: "City" },
        { name: "Blacksmith", cost: 50000, w: 5, h: 3, img: "resources/furniture/forge-home.png", ischest: false, category: "City" },
        { name: "Town Hall", cost: 100000, w: 5, h: 3, img: "resources/furniture/town-hall.png", ischest: false, category: "City" },
        { name: "RiverHall Trader", cost: 25000, w: 5, h: 3, img: "resources/furniture/riverhall-trader.png", ischest: false, category: "City" },
        { name: "Water Square", cost: 75000, w: 6, h: 4, img: "resources/furniture/water-square.png", ischest: false, category: "City" },
        { name: "GH Bank", cost: 300000, w: 6, h: 4, img: "resources/furniture/bank.png", ischest: true, category: "City" },
        { name: "Statue Of RiverHall", cost: 100000, w: 5, h: 4, img: "resources/furniture/sor.png", ischest: false, category: "City" },
        { name: "The Sovereign Residence", cost: 150000, w: 5, h: 3, img: "resources/furniture/the-sovereign-residence.png", ischest: false, category: "City" },
        { name: "The Alchemist's Conservatory", cost: 150000, w: 5, h: 4, img: "resources/furniture/the-alchemists-conservatory.png", ischest: false, category: "City" },
        { name: "King's Casino", cost: 650000, w: 7, h: 5, img: "resources/furniture/kings-casino.png", ischest: true, category: "City" },
        { name: "FAA Zone", cost: 20000, w: 7, h: 5, img: "resources/furniture/faa.png", ischest: false, category: "City" },
        { name: "Horse Stables", cost: 35000, w: 7, h: 5, img: "resources/furniture/horse-stables.png", ischest: false, category: "City" },
        { name: "Ice Dragon", cost: 300000, w: 5, h: 3, img: "resources/furniture/ice-dragon-statue.png", ischest: false, category: "City" },
        { name: "Fire Dragon", cost: 500000, w: 5, h: 3, img: "resources/furniture/fire-dragon-statue.png", ischest: false, category: "City" },

        { name: "Terrain Water", cost: 2000, w: 3, h: 3, img: "resources/walls/water.jpg", ischest: false, category: "Land" },
        { name: "Terrain Water 2", cost: 3000, w: 5, h: 5, img: "resources/walls/water.jpg", ischest: false, category: "Land" },
        { name: "Terrain Water 3", cost: 2000, w: 5, h: 5, img: "resources/walls/water2.jpg", ischest: false, category: "Land" },
        { name: "Terrain Water 4", cost: 2000, w: 5, h: 5, img: "resources/walls/water3.jpg", ischest: false, category: "Land" },
        { name: "Grass", cost: 1000, w: 1, h: 1, img: "resources/walls/grass.jpg", ischest: false, category: "Land" },
        { name: "Grass", cost: 3000, w: 3, h: 3, img: "resources/walls/grass.jpg", ischest: false, category: "Land" },
        { name: "Grass", cost: 5000, w: 5, h: 5, img: "resources/walls/grass.jpg", ischest: false, category: "Land" },
        { name: "Gravel", cost: 5000, w: 1, h: 1, img: "resources/walls/gravel.jpg", ischest: false, category: "Land" },
        { name: "Gravel", cost: 10000, w: 5, h: 5, img: "resources/walls/gravel.jpg", ischest: false, category: "Land" },
        { name: "Tree", cost: 500, w: 3, h: 3, img: "resources/furniture/tree1.png", ischest: false, category: "Land" },
        { name: "Tree 2", cost: 500, w: 4, h: 3, img: "resources/furniture/tree2.png", ischest: false, category: "Land" },
        { name: "Demon Tree", cost: 3000, w: 3, h: 3, img: "resources/furniture/tree3.png", ischest: false, category: "Land" },
        { name: "Snow Tree", cost: 900, w: 3, h: 3, img: "resources/furniture/tree4.png", ischest: false, category: "Land" },
        { name: "Xmas Tree", cost: 15000, w: 3, h: 3, img: "resources/furniture/tree5.png", ischest: false, category: "Land" },

        { name: "Vault", cost: 100000, w: 3, h: 3, img: "resources/furniture/vault.png", ischest: true, category: "Storage" },
        { name: "Luxury Vault", cost: 500000, w: 3, h: 3, img: "resources/furniture/vault2.png", ischest: true, category: "Storage" },
        { name: "Luxury Chest", cost: 3000, w: 2, h: 1, img: "resources/furniture/luxury-chest.png", ischest: true, category: "Storage" },
        { name: "Luxury Chest", cost: 4000, w: 3, h: 2, img: "resources/furniture/luxury-chest.png", ischest: true, category: "Storage" },
        { name: "Luxury Safe", cost: 5000, w: 2, h: 1, img: "resources/furniture/luxury-safe.png", ischest: true, category: "Storage" },
        { name: "Wooden Chest", cost: 1000, w: 2, h: 1, img: "resources/furniture/wooden-chest.png", ischest: true, category: "Storage" },
        { name: "Marble Chest", cost: 10000, w: 2, h: 1, img: "resources/furniture/marble-chest.png", ischest: true, category: "Storage" },
    ];

    const CATEGORY_ORDER = ["All", "Walls", "Furniture", "Storage", "City", "Land", "Decor"];
    const categories = Array.from(new Set(catalog.map(item => item.category)));
    const displayCategories = CATEGORY_ORDER.filter(c => c === "All" || categories.includes(c));

    let currentCategory = "All";

    function createCategoriesBar() {
        catBar.innerHTML = '';
        displayCategories.forEach(cat => {
            const btn = document.createElement('button');
            btn.className = 'shop-category-btn';
            btn.type = 'button';
            btn.textContent = cat;
            btn.setAttribute('data-category', cat);
            if (cat === currentCategory) btn.classList.add('active');
            btn.addEventListener('click', () => {
                currentCategory = cat;
                updateCategoryHighlight();
                updateMobileCategoryHighlight();
                renderCatalog();
                closeMobileMenu();
            });
            catBar.appendChild(btn);
        });
    }

    function createMobileCategoriesMenu() {
        mobileMenu.innerHTML = '';
        displayCategories.forEach(cat => {
            const btn = document.createElement('button');
            btn.className = 'shop-category-btn-mobile';
            btn.type = 'button';
            btn.textContent = cat;
            btn.setAttribute('data-category', cat);
            btn.setAttribute('role', 'menuitem');
            if (cat === currentCategory) btn.classList.add('active');
            btn.addEventListener('click', () => {
                currentCategory = cat;
                updateCategoryHighlight();
                updateMobileCategoryHighlight();
                renderCatalog();
                closeMobileMenu();
            });
            mobileMenu.appendChild(btn);
        });
    }

    function updateCategoryHighlight() {
        Array.from(catBar.children).forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-category') === currentCategory);
        });
    }

    function updateMobileCategoryHighlight() {
        Array.from(mobileMenu.children).forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-category') === currentCategory);
        });
    }

    function closeMobileMenu() {
        if (window.innerWidth > 650) return;
        mobileMenu.style.display = "none";
        hamburgerBtn.setAttribute('aria-expanded', 'false');
    }

    function openMobileMenu() {
        if (window.innerWidth > 650) return;
        mobileMenu.style.display = "flex";
        hamburgerBtn.setAttribute('aria-expanded', 'true');
    }

    hamburgerBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        if (mobileMenu.style.display === "flex") {
            closeMobileMenu();
        } else {
            openMobileMenu();
            setTimeout(() => {
                if (window.scrollY > 60) mobileMenu.scrollIntoView({ block: "nearest", behavior: "smooth" });
            }, 80);
        }
    });

    document.addEventListener('click', function(e) {
        if (window.innerWidth > 650) return;
        if (mobileMenu.style.display === "flex" && !catHamburger.contains(e.target)) {
            closeMobileMenu();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (mobileMenu.style.display === "flex" && (e.key === "Escape" || e.key === "Esc")) {
            closeMobileMenu();
        }
    });

    window.addEventListener('resize', function() {
        if (window.innerWidth > 650) closeMobileMenu();
    });

    function filterCatalogByCategory() {
        if (currentCategory === "All") return catalog;
        return catalog.filter(item => item.category === currentCategory);
    }

    function renderCatalog() {
        grid.innerHTML = '';
        const items = filterCatalogByCategory();
        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'furniture-card';
            card.innerHTML = `
                <img class="image-preview" src="${item.img}" alt="${item.name}" />
                <h4 style="margin-bottom:7px;color:#ffe082;font-size:1.09rem;font-weight:600;">${item.name}</h4>
                <span style="font-size:0.88rem;color:#beb686;margin-bottom:9px;">${item.w}x${item.h} Blocks</span>
                <button class="buy-furniture-btn" data-cost="${item.cost}">
                    <img src="resources/ui/crown.png" alt="Crowns" style="width:1.25em;height:1.25em;vertical-align:middle;margin-right:3px;" aria-hidden="true" />
                    <span>${item.cost.toLocaleString()}</span>
                </button>
            `;
            const buyBtn = card.querySelector('.buy-furniture-btn');
            buyBtn.addEventListener('click', () => {
                let balance;
                if (typeof window.getCrownBalance === "function") {
                    balance = window.getCrownBalance();
                } else {
                    balance = parseInt(localStorage.getItem('kings-casino-crowns'), 10) || 0;
                }
                if (balance >= item.cost) {
                    if (typeof window.setCrownBalance === "function") {
                        window.setCrownBalance(balance - item.cost);
                    } else {
                        localStorage.setItem('kings-casino-crowns', balance - item.cost);
                    }
                    if (typeof window.syncCrownBalance === "function") {
                        window.syncCrownBalance();
                    } else {
                        window.dispatchEvent(new Event('storage'));
                    }
                    if (typeof window.placeFurniture === "function") {
                        if (item.ischest) {
                            const chestId = generateChestId();
                            window.placeFurniture(item.name, item.w, item.h, item.img, { chestId, ischest: true });
                            closeModal();
                        } else {
                            window.placeFurniture(item.name, item.w, item.h, item.img);
                            closeModal();
                        }
                    }
                    updateCrownCountDisplay();
                } else {
                    buyBtn.innerText = "Not Enough Crowns!";
                    buyBtn.style.background = "#602424";
                    buyBtn.style.color = "#ffb5b5";
                    setTimeout(() => {
                        buyBtn.innerHTML = `<img src="resources/items/crown.png" alt="Crowns" style="width:1.25em;height:1.25em;vertical-align:middle;margin-right:3px;" aria-hidden="true" /> <span>${item.cost.toLocaleString()}</span>`;
                        buyBtn.style.background = "";
                        buyBtn.style.color = "";
                    }, 1500);
                }
            });
            if (item.ischest) {
                card.setAttribute('title', 'This is a chips chest/safe');
                card.style.borderColor = '#c6ae68';
                card.style.boxShadow = '0 3px 18px rgba(180,150,25,0.13)';
            }
            grid.appendChild(card);
        });
    }

    openBtn.addEventListener('click', () => {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        setTimeout(() => closeBtn.focus(), 50);
        updateCrownCountDisplay();
    });
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', e => {
        if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', e => {
        if (modal.style.display === 'flex' && e.key === 'Escape') {
            closeModal();
        }
    });

    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = '';
        closeMobileMenu();
    }

    createCategoriesBar();
    createMobileCategoriesMenu();
    renderCatalog();
    updateCrownCountDisplay();
})();
</script>