(function () {
    const STORAGE_KEY = 'kings-casino-age-verified';

    if (localStorage.getItem(STORAGE_KEY) === 'true') {
        return;
    }

    const styles = `
        .age-gate-overlay {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: linear-gradient(135deg, #1c0522 0%, #110517 100%);
            z-index: 999999;
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: 'Fredoka', sans-serif;
            padding: 20px;
            user-select: none;
            -webkit-tap-highlight-color: transparent;
        }
        .age-gate-modal {
            background: radial-gradient(circle at 50% 30%, #3d142b 0%, #110517 100%);
            border: 3px solid #f1c40f;
            box-shadow: 0 0 25px rgba(241,196,15,0.3), inset 0 0 15px rgba(0,0,0,0.6);
            width: 100%;
            max-width: 380px;
            border-radius: 24px;
            padding: 35px 25px;
            text-align: center;
            color: #fff;
            box-sizing: border-box;
            animation: ageGatePulse 4s infinite ease-in-out;
        }
        @keyframes ageGatePulse {
            0%, 100% { box-shadow: 0 0 25px rgba(241,196,15,0.3), inset 0 0 15px rgba(0,0,0,0.6); }
            50% { box-shadow: 0 0 35px rgba(241,196,15,0.5), inset 0 0 15px rgba(0,0,0,0.6); }
        }
        .age-gate-logo {
            font-size: 2.6rem;
            text-transform: uppercase;
            font-weight: 700;
            background: linear-gradient(to bottom, #f1c40f, #e67e22, #d35400);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            filter: drop-shadow(0 4px 2px rgba(0,0,0,0.8));
            margin-bottom: 5px;
            line-height: 1.1;
        }
        .age-gate-logo span {
            display: block;
            font-size: 1.5rem;
            color: #fff;
            -webkit-text-fill-color: #fff;
            text-shadow: 0 3px 3px rgba(0,0,0,0.8);
            margin-top: -5px;
            margin-bottom: 20px;
        }
        .age-gate-title {
            font-size: 1.4rem;
            font-weight: 700;
            color: #fff;
            margin-bottom: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .age-gate-desc {
            font-size: 1rem;
            color: #bdc3c7;
            margin-bottom: 30px;
            line-height: 1.4;
            font-weight: 600;
        }
        .age-gate-actions {
            display: flex;
            gap: 15px;
            width: 100%;
        }
        .age-gate-btn {
            flex: 1;
            padding: 16px;
            font-size: 1.3rem;
            font-weight: 700;
            border-radius: 16px;
            cursor: pointer;
            border: none;
            font-family: 'Fredoka', sans-serif;
            text-transform: uppercase;
            transition: transform 0.1s, box-shadow 0.1s;
        }
        .age-gate-btn-yes {
            background: linear-gradient(to bottom, #2ecc71, #27ae60);
            border: 3px solid #58d68d;
            color: #fff;
            box-shadow: 0 6px 0 #1e8449, 0 10px 15px rgba(0,0,0,0.4);
        }
        .age-gate-btn-yes:active {
            transform: translateY(6px);
            box-shadow: 0 0px 0 #1e8449, 0 4px 5px rgba(0,0,0,0.4);
        }
        .age-gate-btn-no {
            background: linear-gradient(to bottom, #e74c3c, #c0392b);
            border: 3px solid #ff7979;
            color: #fff;
            box-shadow: 0 6px 0 #7a1f1f, 0 10px 15px rgba(0,0,0,0.4);
        }
        .age-gate-btn-no:active {
            transform: translateY(6px);
            box-shadow: 0 0px 0 #7a1f1f, 0 4px 5px rgba(0,0,0,0.4);
        }
        .age-lockout-msg {
            color: #e74c3c;
            font-size: 1.25rem;
            font-weight: 700;
            margin-top: 10px;
            display: none;
            line-height: 1.5;
            text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }
    `;

    const styleEl = document.createElement('style');
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);

    const overlay = document.createElement('div');
    overlay.className = 'age-gate-overlay';
    overlay.innerHTML = `
        <div class="age-gate-modal">
            <img src="resources/title-ico.png" style="width:110px;height:110px;">
            <div class="age-gate-title" id="ageTitle">Age Verification</div>
            <p class="age-gate-desc" id="ageDesc">You must be 18 years or older (over 17) to play. Are you of legal age?</p>
            <div class="age-gate-actions" id="ageActions">
                <button class="age-gate-btn age-gate-btn-no" id="ageBtnNo">No</button>
                <button class="age-gate-btn age-gate-btn-yes" id="ageBtnYes">Yes</button>
            </div>
            <div class="age-lockout-msg" id="ageLockoutMsg">
                SORRY BUT..<br>
                <span style="color: #bdc3c7; font-size: 0.95rem; font-weight: 600;">You do not meet the minimum age requirement to access this game.</span>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    document.getElementById('ageBtnYes').addEventListener('click', () => {
        localStorage.setItem(STORAGE_KEY, 'true');
        overlay.remove();
        styleEl.remove();
    });

    document.getElementById('ageBtnNo').addEventListener('click', () => {
        document.getElementById('ageTitle').style.display = 'none';
        document.getElementById('ageDesc').style.display = 'none';
        document.getElementById('ageActions').style.display = 'none';
        document.getElementById('ageLockoutMsg').style.display = 'block';
    });
})();