(function () {
    const USERNAME_KEY = 'kings-casino-username';
    const STORAGE_KEYS = [
        'kings-casino-username',
        'kings-casino-chips',
    ];
    const APP_VERSION = 'V1.0.4 ALPHA';

    function getUsername() {
        return localStorage.getItem(USERNAME_KEY) || 'Guest';
    }

    function setUsername(newName) {
        const cleanName = newName.trim();
        if (cleanName.length > 0 && cleanName.length <= 14) {
            localStorage.setItem(USERNAME_KEY, cleanName);
            updateLobbyNameDisplay();
            return true;
        }
        return false;
    }

    function updateLobbyNameDisplay() {
        const playerNameEl = document.querySelector('.player-name');
        if (playerNameEl) {
            playerNameEl.textContent = getUsername();
        }
    }

    function getTrophyCount() {
        if (typeof window.getUnlockedTrophies === "function" && Array.isArray(window.TROPHIES)) {
            return {
                unlocked: window.getUnlockedTrophies().length,
                total: window.TROPHIES.length
            };
        }
        return { unlocked: 0, total: 0 };
    }

    const styles = `
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&display=swap');

        .settings-overlay {
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(11, 12, 16, 0.85); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
            z-index: 10005; display: flex; justify-content: center; align-items: center;
            opacity: 0; pointer-events: none; transition: opacity 0.3s ease;
            font-family: 'Montserrat', sans-serif;
            user-select: none;
        }
        .settings-overlay.active { opacity: 1; pointer-events: auto; }

        .settings-modal {
            background: linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.8) 100%);
            border: 1px solid rgba(212, 175, 55, 0.3);
            border-top: 2px solid #D4AF37;
            width: 92%; max-width: 400px;
            border-radius: 20px; padding: 30px 24px; display: flex; flex-direction: column;
            transform: scale(0.95); transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
            color: #fff; position: relative; box-sizing: border-box;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.9), inset 0 0 20px rgba(212, 175, 55, 0.05);
        }
        .settings-overlay.active .settings-modal { transform: scale(1); }

        .settings-title {
            font-size: 2.2rem; font-weight: 800; text-transform: uppercase; letter-spacing: 2px;
            background: linear-gradient(to right, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent;
            margin-bottom: 6px; text-align: center; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.8));
        }

        .settings-version {
            font-size: 0.85rem; color: rgba(255, 255, 255, 0.4); font-weight: 600;
            letter-spacing: 1px; text-align: center; margin-bottom: 20px;
            text-transform: uppercase;
        }

        .settings-trophy-row {
            font-size: 0.95rem; font-weight: 700; color: #F2D06B;
            letter-spacing: 0.5px; display: flex; align-items: center; justify-content: center; gap: 8px;
            background: rgba(212, 175, 55, 0.1); border: 1px solid rgba(212, 175, 55, 0.25);
            padding: 10px 14px; border-radius: 12px; margin-bottom: 20px;
            box-shadow: inset 0 0 10px rgba(212, 175, 55, 0.05);
        }

        .settings-group { margin-bottom: 18px; text-align: left; }
        
        .settings-label {
            display: block; font-size: 0.85rem; color: rgba(255,255,255,0.6);
            margin-bottom: 8px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;
            padding-left: 2px;
        }

        .settings-input {
            width: 100%; padding: 14px 16px; font-size: 1rem; border-radius: 12px;
            border: 1px solid rgba(255,255,255,0.15); background: rgba(0, 0, 0, 0.5);
            color: #fff; font-family: 'Montserrat', sans-serif; outline: none;
            transition: all 0.25s ease; box-sizing: border-box;
        }
        .settings-input:focus {
            border-color: #D4AF37; box-shadow: 0 0 12px rgba(212, 175, 55, 0.25);
        }

        .settings-error {
            color: #ff7675; font-size: 0.8rem; margin-top: 6px; display: none; font-weight: 600;
        }

        .settings-links-group {
            display: flex; flex-direction: column; gap: 10px; margin-bottom: 25px;
            border-top: 1px solid rgba(255,255,255,0.08); padding-top: 20px;
        }

        .settings-btn-link {
            width: 100%; background: rgba(255, 255, 255, 0.04);
            border: 1px solid rgba(255, 255, 255, 0.08); color: rgba(255, 255, 255, 0.8);
            padding: 12px 0; font-size: 0.95rem; font-weight: 700; border-radius: 12px;
            cursor: pointer; font-family: 'Montserrat', sans-serif;
            transition: all 0.2s ease; display: block; text-align: center; box-sizing: border-box;
        }
        .settings-btn-link:hover {
            background: rgba(255, 255, 255, 0.08); color: #fff; border-color: rgba(255,255,255,0.2);
        }

        .settings-btn-wipe {
            width: 100%; background: linear-gradient(145deg, rgba(231, 76, 60, 0.15) 0%, rgba(192, 41, 43, 0.05) 100%);
            border: 1px solid rgba(231, 76, 60, 0.3); color: #ff7675;
            padding: 12px 0; font-size: 0.95rem; font-weight: 700; border-radius: 12px;
            cursor: pointer; font-family: 'Montserrat', sans-serif;
            transition: all 0.2s ease; display: block; text-align: center; box-sizing: border-box;
        }
        .settings-btn-wipe:hover {
            background: rgba(231, 76, 60, 0.25); color: #fff; border-color: #e74c3c;
            box-shadow: 0 0 12px rgba(231, 76, 60, 0.2);
        }

        .settings-actions { display: flex; gap: 12px; }
        
        .settings-btn {
            flex: 1; padding: 14px; font-size: 1rem; font-weight: 700; border-radius: 12px;
            cursor: pointer; font-family: 'Montserrat', sans-serif; transition: all 0.2s ease;
            box-sizing: border-box; display: inline-flex; align-items: center; justify-content: center;
        }
        
        .settings-btn-close {
            background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.7);
        }
        .settings-btn-close:hover {
            background: rgba(255, 255, 255, 0.15); color: #fff;
        }
        
        .settings-btn-save {
            background: linear-gradient(90deg, #F2D06B 0%, #D4AF37 100%); border: none; color: #0b0c10;
            box-shadow: 0 4px 15px rgba(212, 175, 55, 0.2);
        }
        .settings-btn-save:hover {
            transform: translateY(-1px); box-shadow: 0 6px 20px rgba(212, 175, 55, 0.35);
        }
        .settings-btn-save:active { transform: translateY(1px); }
    `;

    const styleEl = document.createElement('style');
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);

    const overlay = document.createElement('div');
    overlay.className = 'settings-overlay';
    overlay.id = 'settingsOverlay';

    overlay.innerHTML = `
        <div class="settings-modal">
            <div class="settings-title">Settings</div>
            <div class="settings-version">Version ${APP_VERSION}</div>
            
            <div class="settings-trophy-row" id="trophyCountRow" style="display:none;">
                <span>🏆</span>
                <span id="trophyCountText"></span>
            </div>
            
            <div class="settings-group">
                <label class="settings-label" for="usernameInput">Edit Username</label>
                <input type="text" id="usernameInput" class="settings-input" maxlength="14" placeholder="Enter name..." autocomplete="off">
                <div class="settings-error" id="usernameError">Name must be 1 to 14 characters long.</div>
            </div>

            <div class="settings-links-group">
                <button class="settings-btn-link" id="togglePiggyBtn" title="Toggle Piggy Bank Visibility">Hide Piggy Bank</button>
                <button class="settings-btn-link" id="changelogBtn" title="View Changelog">View Changelog</button>
                <button class="settings-btn-link" id="termsBtn" title="Terms of Service">Terms of Service</button>
                <button class="settings-btn-link" id="legendBtn" title="Read the Legend of King's Casino">Tales Of Tony Doluf</button>
                <button class="settings-btn-wipe" id="wipeProgressBtn" title="Wipe all progress and reset app">Wipe Progress</button>
            </div>

            <div class="settings-actions">
                <button class="settings-btn settings-btn-close" id="closeSettingsBtn">Cancel</button>
                <button class="settings-btn settings-btn-save" id="saveSettingsBtn">Save</button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    const inputField = document.getElementById('usernameInput');
    const errorText = document.getElementById('usernameError');
    const wipeBtn = document.getElementById('wipeProgressBtn');
    const changelogBtn = document.getElementById('changelogBtn');
    const termsBtn = document.getElementById('termsBtn');
    const legendBtn = document.getElementById('legendBtn');
    const trophyCountRow = document.getElementById('trophyCountRow');
    const trophyCountText = document.getElementById('trophyCountText');

    function updateTrophyCountDisplay() {
        const { unlocked, total } = getTrophyCount();
        if (total > 0) {
            if (unlocked === total) {
                trophyCountText.textContent = `All trophies unlocked! (${unlocked}/${total})`;
            } else {
                trophyCountText.textContent = `Trophies completed: ${unlocked} / ${total}`;
            }
            trophyCountRow.style.display = 'flex';
        } else {
            trophyCountRow.style.display = 'none';
        }
    }

    function openSettings() {
        inputField.value = getUsername();
        errorText.style.display = 'none';
        overlay.classList.add('active');
        inputField.focus();
        updateTrophyCountDisplay();
    }

    function closeSettings() {
        overlay.classList.remove('active');
    }

    function handleSave() {
        if (setUsername(inputField.value)) {
            closeSettings();
        } else {
            errorText.style.display = 'block';
        }
    }

    function handleWipeProgress() {
        if (confirm("Are you sure you want to erase all your progress and reset the app? This action cannot be undone!")) {
            STORAGE_KEYS.forEach(k => localStorage.removeItem(k));
            location.reload();
        }
    }

    function handleChangelog() {
        window.open('resources/external/changelog.txt', '_blank');
    }

    function handleTerms() {
        window.open('resources/external/tos.html', '_blank');
    }

    function handleLegend() {
        window.location.href = 'scenes/legend-of-kings-casino.html';
    }

    function init() {
        updateLobbyNameDisplay();

        const settingsIcon = document.querySelector('.nav-btn img[alt="Settings"]');
        if (settingsIcon) {
            const settingsBtn = settingsIcon.closest('.nav-btn');
            if (settingsBtn) {
                settingsBtn.addEventListener('click', openSettings);
            }
        }

        document.getElementById('closeSettingsBtn').addEventListener('click', closeSettings);
        document.getElementById('saveSettingsBtn').addEventListener('click', handleSave);
        wipeBtn.addEventListener('click', handleWipeProgress);
        changelogBtn.addEventListener('click', handleChangelog);
        termsBtn.addEventListener('click', handleTerms);
        legendBtn.addEventListener('click', handleLegend);

        const togglePiggyBtn = document.getElementById('togglePiggyBtn');

    function updatePiggyToggleText() {
        const isHidden = localStorage.getItem('kings-casino-piggy-hidden') === 'true';
        togglePiggyBtn.textContent = isHidden ? "Show Piggy Bank" : "Hide Piggy Bank";
    }

    updatePiggyToggleText();

    togglePiggyBtn.addEventListener('click', function() {
        const isHidden = localStorage.getItem('kings-casino-piggy-hidden') === 'true';
        
        localStorage.setItem('kings-casino-piggy-hidden', !isHidden);
        
        updatePiggyToggleText();
        
        const piggyBtn = document.getElementById('piggy-btn');
        if (piggyBtn) {
            piggyBtn.style.display = !isHidden ? 'none' : '';
        }
    });

        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) closeSettings();
        });

        window.addEventListener('storage', function(e) {
            if (e.key === USERNAME_KEY) updateLobbyNameDisplay();
            if (typeof e.key === "string" && e.key.includes('troph')) updateTrophyCountDisplay();
        });

        inputField.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') handleSave();
        });

        setInterval(updateTrophyCountDisplay, 3000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();