(function () {
    function isVipOwned() {
        return localStorage.getItem('kings-casino-vip-owned') === '1';
    }

    if (!isVipOwned()) {
        var overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.background = '#111';
        overlay.style.zIndex = '10000000';
        overlay.style.display = 'flex';
        overlay.style.flexDirection = 'column';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.style.color = '#fff';
        overlay.style.fontFamily = 'Fredoka,sans-serif';
        overlay.style.fontSize = '2rem';
        overlay.style.textAlign = 'center';

        var message = document.createElement('div');
        message.innerText = "You're not supposed to be here!";
        message.style.marginBottom = '30px';

        var timerMsg = document.createElement('div');
        var secondsLeft = 7;
        timerMsg.innerText = 'Redirecting to Casino in 7 seconds...';

        overlay.appendChild(message);
        overlay.appendChild(timerMsg);
        document.body.appendChild(overlay);

        var interval = setInterval(function () {
            secondsLeft--;
            timerMsg.innerText = 'Redirecting to Casino in ' + secondsLeft + ' seconds...';
            if (secondsLeft <= 0) {
                clearInterval(interval);
                window.location.href = '../../index.html';
            }
        }, 1000);

        setTimeout(function () {
            window.location.href = '../../index.html';
        }, 7000);
    }
})();