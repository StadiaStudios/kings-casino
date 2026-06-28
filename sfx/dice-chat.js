const DICE_SEND_SFX_SRC = "sfx/dice-chat-send.mp3";
const DICE_WIN_SFX_SRC = "sfx/bc-payout.mp3";
const DICE_BGM_SRC = "sfx/chat-dice-bgm.mp3";

let diceSendSfx, diceWinSfx, diceBgmAudio;

function loadDiceChatSfx() {
    diceSendSfx = new Audio(DICE_SEND_SFX_SRC);
    diceSendSfx.preload = "auto";
    diceSendSfx.volume = 0.45;

    diceWinSfx = new Audio(DICE_WIN_SFX_SRC);
    diceWinSfx.preload = "auto";
    diceWinSfx.volume = 0.65;

    diceBgmAudio = new Audio(DICE_BGM_SRC);
    diceBgmAudio.loop = true;
    diceBgmAudio.preload = "auto";
    diceBgmAudio.volume = 0.38;
}

function playDiceSendSfx() {
    if (diceSendSfx) {
        try {
            const snd = diceSendSfx.cloneNode();
            snd.volume = diceSendSfx.volume;
            snd.play();
        } catch (e) {}
    }
}

function playDiceWinSfx() {
    if (diceWinSfx) {
        try {
            const snd = diceWinSfx.cloneNode();
            snd.volume = diceWinSfx.volume;
            snd.play();
        } catch (e) {}
    }
}

function startDiceBgm() {
    if (diceBgmAudio) {
        diceBgmAudio.currentTime = 0;
        diceBgmAudio.play().catch(() => {});
    }
}
function stopDiceBgm() {
    if (diceBgmAudio) {
        diceBgmAudio.pause();
        diceBgmAudio.currentTime = 0;
    }
}

function setupDiceChatAudioForDiceHtml(sendBtn, chatInput) {
    loadDiceChatSfx();

    function allowBgmOnGesture() {
        startDiceBgm();
        window.removeEventListener('pointerdown', allowBgmOnGesture, true);
    }
    window.addEventListener('pointerdown', allowBgmOnGesture, true);

    if (sendBtn) sendBtn.addEventListener('click', playDiceSendSfx, true);
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === "Enter") playDiceSendSfx();
        }, true);
    }
}

window.DiceChatSfx = {
    setupDiceChatAudioForDiceHtml,
    playDiceWinSfx,
    startDiceBgm,
    stopDiceBgm
};