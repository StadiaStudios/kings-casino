const INVENTORY_STORAGE_KEY = 'kings-casino-cards-inventory';
const CHIPS_STORAGE_KEY = 'kings-casino-chips';

const CARD_POOL = [
    { id: 'c1', name: 'Ace of Spades', rarity: 'Legendary', sellValue: 25000, img: 'resources/cards/ace-of-spades.png', dropRate: 0.05 },
    { id: 'c2', name: 'Blue Joker', rarity: 'Rare', sellValue: 13000, img: 'resources/cards/blue-joker.png', dropRate: 0.30 },
    { id: 'c3', name: 'Lit Dragon', rarity: 'Rare', sellValue: 12000, img: 'resources/cards/lit-dragon.png', dropRate: 0.50 },
    { id: 'c4', name: 'Gold Diamond', rarity: 'Legendary', sellValue: 20000, img: 'resources/cards/gold-diamonds.png', dropRate: 0.05 }
];

if (!localStorage.getItem(INVENTORY_STORAGE_KEY)) {
    localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify([]));
}

(function injectInventoryScrollbarCSS() {
    if (!document.getElementById('inventory-scrollbar-css')) {
        const style = document.createElement('style');
        style.id = 'inventory-scrollbar-css';
        style.textContent = `
            .inventory-grid,
            #vendor-action-grid {
                scrollbar-width: thin;
                scrollbar-color: #8e44ad #1a1021;
            }
            .inventory-grid::-webkit-scrollbar,
            #vendor-action-grid::-webkit-scrollbar {
                width: 10px;
                background: #1a1021;
                border-radius: 12px;
            }
            .inventory-grid::-webkit-scrollbar-thumb,
            #vendor-action-grid::-webkit-scrollbar-thumb {
                background: linear-gradient(180deg,#9b59b6 20%, #2c1e36 80%);
                border-radius: 8px;
                border: 2px solid #251b2e;
            }
            .inventory-grid::-webkit-scrollbar-thumb:hover,
            #vendor-action-grid::-webkit-scrollbar-thumb:hover {
                background: linear-gradient(180deg,#d5a6bd 0%, #9b59b6 100%);
            }
        `;
        document.head.appendChild(style);
    }
})();

const InventorySystem = {
    getChips: function() {
        let bal = parseInt(localStorage.getItem(CHIPS_STORAGE_KEY), 10);
        return isNaN(bal) ? 100 : bal;
    },
    setChips: function(amount) {
        localStorage.setItem(CHIPS_STORAGE_KEY, amount);
        window.dispatchEvent(new Event('storage'));
    },
    getCards: function() {
        return JSON.parse(localStorage.getItem(INVENTORY_STORAGE_KEY)) || [];
    },
    saveCards: function(cardsArray) {
        localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(cardsArray));
    },
    addCard: function(cardId) {
        const inventory = this.getCards();
        inventory.push({ id: cardId, acquiredAt: Date.now() });
        this.saveCards(inventory);
    },
    removeCardAt: function(index) {
        const inventory = this.getCards();
        if (index > -1 && index < inventory.length) {
            const removed = inventory.splice(index, 1);
            this.saveCards(inventory);
            return removed[0];
        }
        return null;
    },
    rollCrate: function() {
        const roll = Math.random();
        let cumulative = 0;
        for (const card of CARD_POOL) {
            cumulative += card.dropRate;
            if (roll <= cumulative) return card;
        }
        return CARD_POOL[CARD_POOL.length - 1];
    },
    getRarityColor: function(rarity) {
        switch(rarity) {
            case 'Legendary': return '#ffae00';
            case 'Epic': return '#9b59b6';
            case 'Rare': return '#3498db';
            case 'Uncommon': return '#bdc3c7';
            default: return '#bdc3c7';
        }
    },
    renderGrid: function(containerId, mode = 'view', onActionCallback = null) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = '';

        const currentInventory = this.getCards();

        if (currentInventory.length === 0) {
            container.innerHTML = `<p style="color: #bdc3c7; grid-column: 1/-1; text-align: center; margin: 40px 0;">No cards found. Go grab some crates!</p>`;
            return;
        }

        currentInventory.forEach((invItem, index) => {
            const staticData = CARD_POOL.find(c => c.id === invItem.id);
            if (!staticData) return;

            const cardColor = this.getRarityColor(staticData.rarity);
            const itemCard = document.createElement('div');
            itemCard.className = 'inventory-card-item';
            itemCard.style.cssText = `
                background: linear-gradient(180deg, #251b2e 0%, #160e1d 100%);
                border: 2px solid #3c264a;
                border-top: 5px solid ${cardColor};
                border-radius: 12px;
                padding: 15px;
                display: flex;
                flex-direction: column;
                align-items: center;
                box-shadow: 0 8px 16px rgba(0,0,0,0.4);
                position: relative;
            `;

            itemCard.innerHTML = `
                <span style="position: absolute; top: 8px; right: 10px; background: rgba(0,0,0,0.5); font-size: 0.75rem; color: ${cardColor}; padding: 2px 8px; border-radius: 10px; font-weight:700;">${staticData.rarity.toUpperCase()}</span>
                <img src="${staticData.img}" alt="${staticData.name}" style="width: 80px; height: 110px; object-fit: contain; margin: 15px 0 10px 0; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.5));">
                <h4 style="color:#fff; font-size: 1.1rem; font-weight:600; text-align:center; margin-bottom: 5px;">${staticData.name}</h4>
            `;

            if (mode === 'sell') {
                const sellBtn = document.createElement('button');
                sellBtn.style.cssText = `
                    margin-top: auto; width: 100%; background: #e74c3c; border: none; padding: 8px; border-radius: 8px; color: white; font-weight: 700; cursor: pointer; transition: transform 0.1s;
                `;
                sellBtn.innerText = `SELL (+${staticData.sellValue.toLocaleString()})`;
                sellBtn.onclick = () => { if (onActionCallback) onActionCallback(index, staticData); };
                itemCard.appendChild(sellBtn);
            } else {
                const tag = document.createElement('div');
                tag.style.cssText = `margin-top: auto; font-size: 0.9rem; color: #7f8c8d; font-weight:600;`;
                tag.innerText = "OWNED";
                itemCard.appendChild(tag);
            }

            container.appendChild(itemCard);
        });
    }
};