(function () {
    const INTRO_KEY = 'stadia-studios-intro-shown';
    if (localStorage.getItem(INTRO_KEY)) return;

    localStorage.setItem(INTRO_KEY, '1');

    const overlay = document.createElement('div');
    overlay.id = 'ss-intro-overlay';
    Object.assign(overlay.style, {
        position: 'fixed',
        inset: 0,
        zIndex: '1000000',
        background: '#000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'opacity 1s cubic-bezier(.68,-0.55,.27,1.55)',
        opacity: '1'
    });

    const style = document.createElement('style');
    style.textContent = `
    @keyframes ssFadeInUp {
        from { opacity: 0; transform: translateY(30px);}
        to { opacity: 1; transform: translateY(0);}
    }
    @keyframes ssLogoZoomIn {
        0%   { 
            opacity: 0; 
            transform: scale(0.48) rotate(-3deg);
            filter: blur(4px) brightness(0.6);
        }
        45% {
            opacity: 1;
            transform: scale(1.10) rotate(2deg);
            filter: blur(0px) brightness(1);
        }
        70% {
            opacity: 1;
            transform: scale(0.98) rotate(-0.5deg);
            filter: blur(0px) brightness(1.12);
        }
        100% {
            opacity: 1;
            transform: scale(1.02) rotate(0deg);
            filter: blur(0px) brightness(1.03);
        }
    }
    .ss-intro-text {
        color: #fff;
        font-size: 2.3rem;
        font-family: 'Fredoka', Arial, sans-serif;
        font-weight: 800;
        letter-spacing: 1.2px;
        margin-bottom: 48px;
        text-shadow: 0 3px 24px #0008, 0 1px 0 #fff6;
        opacity: 0;
        animation: ssFadeInUp 1.1s cubic-bezier(.61,1.6,.45,.92) forwards;
        transition: color 0.2s;
    }
    .ss-intro-logo {
        display: block;
        margin: 0 auto;
        opacity: 0;
        animation: ssLogoZoomIn 1.14s cubic-bezier(.57,2.2,.43,.96) 1.4s forwards;
        will-change: transform, opacity, filter;
        filter: drop-shadow(0 8px 32px #14072333) drop-shadow(0 0px 0px #fff0);
        transition: filter 0.24s;
        width: 340px;
        max-width: 85vw;
        height: auto;
    }
    `;

    document.head.appendChild(style);

    const text = document.createElement('div');
    text.className = 'ss-intro-text';
    text.textContent = 'StadiaStudios Presents...';

    const logo = document.createElement('img');
    logo.className = 'ss-intro-logo';
    logo.src = 'resources/title-ico.png';
    logo.alt = 'Stadia Studios Logo';
    Object.assign(logo.style, {
        width: '340px',
        maxWidth: '85vw',
        height: 'auto',
        transition: 'opacity 0.4s'
    });

    overlay.appendChild(text);
    overlay.appendChild(logo);
    document.body.appendChild(overlay);

    setTimeout(() => {
        logo.style.opacity = 1;
    }, 1700);

    setTimeout(() => {
        overlay.style.opacity = '0';
    }, 3600);

    setTimeout(() => {
        overlay.remove();
        style.remove();
    }, 4600);
})();