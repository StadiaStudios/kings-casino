function parseInput(input) {
    const rawText = input.trim();
    const text = rawText.toLowerCase();

    if (text !== '') {
        addMessage(input, 'user');
    }

    if (text === "/stats" || text.startsWith("/stats")) {
        let stats = null;
        if (typeof getStats === "function") {
            stats = getStats();
        } else if (window && typeof window.getChatDiceStats === "function") {
            stats = window.getChatDiceStats();
        }
        if (stats) {
            let timePlayedMs = typeof stats.timePlayedMs === "number" ? stats.timePlayedMs : 0;
            let usernameChanges = typeof stats.usernameChanges === "number" ? stats.usernameChanges : 0;
            let earned = typeof stats.earned === "number" ? stats.earned :
                (typeof stats.totalMoneyEarned === "number" ? stats.totalMoneyEarned : 0);
            let lost = typeof stats.lost === "number" ? stats.lost :
                (typeof stats.totalMoneyLost === "number" ? stats.totalMoneyLost : 0);

            function formatTime(ms) {
                let seconds = Math.floor(ms / 1000);
                let h = Math.floor(seconds / 3600);
                let m = Math.floor((seconds % 3600) / 60);
                let s = seconds % 60;
                return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
            }

            let playStr = formatTime(timePlayedMs);

            addMessage(
                `<strong>Chat Dice Stats</strong><br>
                <span style="color:#f1c40f;">Time Played: </span><b>${playStr}</b><br>
                <span style="color:#43ff67;">Total Chips Earned: </span><b>+${earned.toLocaleString()}</b><br>
                <span style="color:#ff6262;">Total Chips Lost: </span><b>-${lost.toLocaleString()}</b><br>
                <span style="color:#8e44ad;">Username Changes: </span><b>${usernameChanges.toLocaleString()}</b>`,
                "system"
            );
        } else {
            addMessage("Stats could not be loaded: stats storage or function missing.", "system-error");
        }
        return;
    }

    if (text === "/partymode" || text.startsWith("/partymode")) {
        if (!document.body.classList.contains('party-mode-active')) {
            const style = document.createElement('style');
            style.id = 'party-mode-style';
            style.innerHTML = `
                body, html {
                    animation: partyBgColor 6s linear infinite alternate;
                    background: #181d24 !important;
                }
                @keyframes partyBgColor {
                    0% {background: #181d24;}
                    14% {background: #ff0099;}
                    28% {background: #24ffec;}
                    43% {background: #f6fa4d;}
                    57% {background: #6a00ff;}
                    72% {background: #57e32c;}
                    86% {background: #42e9f5;}
                    100% {background: #ff0099;}
                }
                *,
                *::before,
                *::after {
                    transition: all 0.25s cubic-bezier(0.4,0.8,0.3,1);
                }
                .hud-top,
                .hud-bottom,
                .currency-display,
                .back-btn,
                .btn-3d,
                .btn-3d .btn-content,
                .btn-icon,
                input,
                button,
                .panel,
                .message,
                .message-bubble,
                .input-bar,
                .score {
                    box-shadow: 0 0 22px 0 #0ff, 0 0 3px 0 #ff0, 0 0 7px 0 #ff4dff;
                    border-color: #00fff7 !important;
                    outline: none !important;
                }
                .btn-3d, button, .input-bar {
                    background: linear-gradient(130deg, #ff00cc88, #3333ff88, #24ffec88, #ffff0088) !important;
                    color: #fff !important;
                    border-radius: 18px !important;
                }
                .back-btn:hover, .btn-3d:hover, .btn-icon:hover, button:hover {
                    filter: brightness(1.2) drop-shadow(0 0 10px #42e9f5) drop-shadow(0 0 8px #ffe067);
                }
                .message.user { color: #ff8ace !important; text-shadow: 0 0 6px #ff00cc88;}
                .message.system {color: #00fff7 !important;}
                .message.system-error { color: #ff5470 !important; text-shadow: 0 0 7px #ff3e55;}
                .message { border-left: 4px solid #ff00cc !important;}
                .input-bar, input[type="text"], input, textarea {
                    background: #181d24 !important;
                    color: #fff !important;
                    border: 2px solid #00fff7 !important;
                    box-shadow: 0 0 8px #24ffec88 inset;
                }
                .currency-display, .score {
                    background: linear-gradient(135deg, #ff00cc33, #24ffec33) !important;
                }
                .coin-icon {
                    box-shadow: 0 0 20px #ffe067, 0 0 8px #ff00cc;
                }
                ::selection { background: #12e2df88; }
                #party-mode-confetti {
                    pointer-events: none;
                    position: fixed; left: 0; top: 0; width: 100vw; height: 100vh;
                    z-index: 99999;
                    background: repeating-linear-gradient(120deg, #ff00cc, #ff00cc 2px, transparent 2px, transparent 20px),
                                repeating-linear-gradient(60deg, #24ffec, #24ffec 2px, transparent 2px, transparent 14px),
                                repeating-linear-gradient(175deg, #f6fa4d, #f6fa4d 2px, transparent 2px, transparent 17px);
                    opacity: 0.10;
                    pointer-events: none;
                    animation: confettiMove 10s linear infinite alternate;
                }
                @keyframes confettiMove {
                    0% {background-position:0 0, 0 0, 0 0;}
                    100% {background-position:40vw 120vh, -50vw 100vh, 90vw -140vh;}
                }
            `;
            document.head.appendChild(style);

            if (!document.getElementById('party-mode-confetti')) {
                var confetti = document.createElement('div');
                confetti.id = 'party-mode-confetti';
                document.body.appendChild(confetti);
            }

            document.body.classList.add('party-mode-active');

            addMessage("<strong>Party Mode activated!</strong> The chat is now in <span style='color:#ff00cc;'>neon party mode</span> until you refresh! 🕺💃", "system");
        } else {
            addMessage("<strong>Party Mode</strong> is already active. Refresh the page to return to normal!", "system-error");
        }
        return;
    }

    if (text.startsWith("/setusername")) {
        const usernameArg = rawText.slice(12).trim();
        if (usernameArg === "") {
            addMessage("Usage: /setusername yourName", "system-error");
            return;
        }
        username = usernameArg;
        if (typeof incrementUsernameChanges === "function") {
            incrementUsernameChanges();
        }
        addMessage(`Username has been set to <strong>${username}</strong>.`, "system");
        return;
    }

    if (isGameActive) {
        addMessage("Please wait for the current game to finish rolling.", 'system-error');
        return;
    }

    if (text.startsWith("/color")) {
        const colorArg = text.replace("/color", "").trim();
        if (colorArg === "blue") {
            setChatTheme("blue");
            addMessage("Chat theme set to <strong>blue</strong>!", "system");
        } else if (colorArg === "red") {
            setChatTheme("red");
            addMessage("Chat theme set to <strong>red</strong>!", "system");
        } else if (colorArg === "" || colorArg === "default") {
            setChatTheme("default");
            addMessage("Chat theme set to <strong>default</strong>!", "system");
        } else {
            addMessage("Usage: /color blue, /color red, or /color default", "system-error");
        }
        return;
    }

    if (text.startsWith("/switch opponent")) {
        currentOpponentName = getRandomOpponentName();
        hasNamedOpponent = true;
        if (gameTitle) {
            gameTitle.textContent = currentOpponentName;
        }
        addMessage(`Opponent switched! New opponent is <strong>${currentOpponentName}</strong>.`, "system");
        return;
    }

    if (text === "/money" || text.startsWith("/money")) {
        if (!currentOpponentName) {
            addMessage("No opponent assigned yet. Set a bet or roll to get an opponent!", "system-error");
            return;
        }
        const oppMoney = opponentBalances[currentOpponentName] || 0;
        addMessage(`<strong>${currentOpponentName}</strong> has <strong>${oppMoney.toLocaleString()}</strong> chips left.`, "system");
        return;
    }

    if (
        text === "/sessioninfo" ||
        text === "/sessionstats" ||
        text.startsWith("/sessioninfo") ||
        text.startsWith("/sessionstats")
    ) {
        if (!currentOpponentName) {
            addMessage(
                "No opponent assigned yet. Set a bet first to get an opponent!", 
                "system-error"
            );
            return;
        }
        let stats = sessionStatsByOpponent[currentOpponentName];
        if (!stats) stats = { gain: 0, loss: 0 };
        const formattedGain = stats.gain.toLocaleString();
        const formattedLoss = stats.loss.toLocaleString();
        let summaryMsg = `<strong>Session Stats vs ${currentOpponentName}</strong>:<br>`;
        summaryMsg += `Total Chips <span style="color: #6fed8f;">WON:</span> <strong style="color:#6fed8f;">+${formattedGain}</strong><br>`;
        summaryMsg += `Total Chips <span style="color: #ed6f6f;">LOST:</span> <strong style="color:#ed6f6f;">-${formattedLoss}</strong>`;
        addMessage(summaryMsg, "system");
        return;
    }

    if (text === "/help") {
        window.location.href = "resources/external/dice-command-list.txt";
        return;
    }

    if (text.startsWith('/bet')) {
        const betString = text.replace('/bet', '').replace('$', '').trim();
        const betAmount = parseInt(betString, 10);

        if (isNaN(betAmount) || betAmount < 100) {
            addMessage("Invalid bet amount! Minimum bet is 100 chips. Example: /bet $100", 'system-error');
            return;
        }
        if (betAmount > getBalance()) {
            addMessage("Not enough chips for that bet!", 'system-error');
            return;
        }

        currentBet = betAmount;

        if (!hasNamedOpponent) {
            currentOpponentName = getRandomOpponentName();
            hasNamedOpponent = true;
            if (gameTitle) {
                gameTitle.textContent = currentOpponentName;
            }
        }

        addMessage(`Bet locked in at <strong>${currentBet.toLocaleString()}</strong> chips. Type <strong>/roll</strong> to toss the dice!`, 'system');
        return;
    }

    if (text.startsWith('/roll')) {
        if (currentBet <= 0) {
            addMessage("You must set a bet before rolling! Minimum bet is 100 chips. Type <strong>/bet $100</strong> to set a bet.", 'system-error');
            return;
        }
        if (currentBet > getBalance()) {
            addMessage("You no longer have enough chips to cover your current bet. Please set a lower /bet.", 'system-error');
            currentBet = 0;
            return;
        }

        playGame();
        return;
    }

    if (text !== '') {
        addMessage("Unknown command.", 'system-error');
    }
}