(function () {
    const GUIDE_KEY = 'riverhall-homes-tutorial-shown';
    if (localStorage.getItem(GUIDE_KEY)) return;

    const style = document.createElement('style');
    style.textContent = `
    .rh-tutorial-backdrop {
        position: fixed; 
        z-index: 99999; 
        inset: 0;
        display: flex; 
        align-items: center; 
        justify-content: center;
        background: rgba(10, 10, 10, 0.85);
        backdrop-filter: blur(5px); 
        -webkit-backdrop-filter: blur(5px);
        font-family: 'Fredoka', sans-serif;
        user-select: none;
        opacity: 0;
        transition: opacity 0.4s ease;
    }
    
    .rh-tutorial-modal {
        width: 90%; 
        max-width: 400px;
        background:rgb(44, 44, 44);
        border: 2px solid rgb(59, 59, 59);
        border-radius: 24px;
        color: #fff;
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.8), 0 0 20px rgba(164, 167, 236, 0.15);
        padding: 30px 25px;
        position: relative;
        text-align: center;
        transform: translateY(20px);
        transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
    }

    .rh-tutorial-backdrop.visible { opacity: 1; }
    .rh-tutorial-backdrop.visible .rh-tutorial-modal { transform: translateY(0); }

    .rh-tutorial-modal h2 {
        font-size: 1.8rem;
        margin-bottom: 15px;
        color: #fff;
        text-shadow: 0 2px 4px rgba(0,0,0,0.5);
    }

    .rh-tutorial-modal h2 span { color: #f1c40f; }

    .rh-tutorial-icon {
        width: 70px; 
        height: 70px;
        margin: 0 auto 20px;
        background: #111;
        border-radius: 50%;
        display: flex; 
        align-items: center; 
        justify-content: center;
        border: 2px solid #fff;
        box-shadow: 0 4px 10px rgba(0,0,0,0.5);
        font-size: 32px;
    }
    
    .rh-tutorial-modal p { 
        color: rgba(255,255,255,0.85); 
        font-size: 1.05rem; 
        line-height: 1.5; 
        margin-bottom: 25px;
    }
    
    .rh-tutorial-modal strong { color: #a4a7ec; font-weight: 600; }

    .rh-tutorial-controls {
        display: flex; 
        flex-direction: column;
        gap: 12px; 
    }

    .rh-tutorial-btn {
        background: #2980d9;
        border: 2px solid #1864ab;
        border-radius: 12px;
        color: #fff;
        font-family: 'Fredoka', sans-serif;
        font-weight: 700;
        font-size: 1.1rem;
        padding: 12px;
        cursor: pointer;
        box-shadow: 0 4px 0 #154360;
        transition: all 0.1s;
    }

    .rh-tutorial-btn:active {
        transform: translateY(4px);
        box-shadow: 0 0 0 #154360;
    }

    .rh-tutorial-btn.alt {
        background: transparent;
        border: 2px solid rgba(255,255,255,0.2);
        box-shadow: none;
        color: rgba(255,255,255,0.7);
    }

    .rh-tutorial-btn.alt:active {
        background: rgba(255,255,255,0.05);
        transform: translateY(2px);
    }

    .rh-tutorial-dots {
        display: flex;
        justify-content: center;
        gap: 6px;
        margin-bottom: 20px;
    }

    .rh-dot {
        width: 8px; height: 8px;
        border-radius: 50%;
        background: rgba(255,255,255,0.2);
        transition: background 0.3s;
    }
    .rh-dot.active { background: #f1c40f; }
    `;
    document.head.appendChild(style);

    const pages = [
        {
            title: 'Welcome to <span>RiverHall!</span>',
            icon: '🏠',
            text: 'Your very own home/city! Here you can do many things!'
        },
        {
            title: 'Decorating ',
            icon: '🛋️',
            text: 'Tap or click any item to <strong>select it</strong>. Once selected, you can easily <strong>drag it around</strong> to snap it to the room grid.'
        },
        {
            title: 'Full <span>Control</span>',
            icon: '🔄',
            text: 'When an item is selected, the control menu will appear. You can <strong>Rotate</strong> it to fit perfectly, or <strong>Remove</strong> it to clear space.'
        },
        {
            title: 'Mystery <span>Chests</span>',
            icon: '🎁',
            text: 'Visit the Crown shop to purchase crates and get some crowns!'
        }
    ];

    let currentPage = 0;

    const backdrop = document.createElement('div');
    backdrop.className = 'rh-tutorial-backdrop';

    const modal = document.createElement('div');
    modal.className = 'rh-tutorial-modal';

    const iconDiv = document.createElement('div');
    iconDiv.className = 'rh-tutorial-icon';

    const titleDiv = document.createElement('h2');
    const textDiv = document.createElement('p');

    const dotsDiv = document.createElement('div');
    dotsDiv.className = 'rh-tutorial-dots';
    pages.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = i === 0 ? 'rh-dot active' : 'rh-dot';
        dotsDiv.appendChild(dot);
    });

    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'rh-tutorial-controls';

    const primaryBtn = document.createElement('button');
    primaryBtn.className = 'rh-tutorial-btn';
    
    const secondaryBtn = document.createElement('button');
    secondaryBtn.className = 'rh-tutorial-btn alt';
    secondaryBtn.textContent = 'Skip';

    controlsDiv.appendChild(primaryBtn);
    controlsDiv.appendChild(secondaryBtn);

    modal.appendChild(iconDiv);
    modal.appendChild(titleDiv);
    modal.appendChild(textDiv);
    modal.appendChild(dotsDiv);
    modal.appendChild(controlsDiv);
    backdrop.appendChild(modal);
    document.body.appendChild(backdrop);

    function updateContent() {
        const page = pages[currentPage];
        iconDiv.textContent = page.icon;
        titleDiv.innerHTML = page.title;
        textDiv.innerHTML = page.text;
        
        Array.from(dotsDiv.children).forEach((dot, index) => {
            dot.className = index === currentPage ? 'rh-dot active' : 'rh-dot';
        });

        if (currentPage === pages.length - 1) {
            primaryBtn.textContent = 'Start Decorating!';
            secondaryBtn.style.display = 'none';
        } else {
            primaryBtn.textContent = 'Next';
            secondaryBtn.style.display = 'block';
        }
    }

    function closeTutorial() {
        localStorage.setItem(GUIDE_KEY, "1");
        backdrop.style.opacity = '0';
        modal.style.transform = 'translateY(20px)';
        setTimeout(() => backdrop.remove(), 400);
    }

    primaryBtn.addEventListener('click', () => {
        if (currentPage < pages.length - 1) {
            currentPage++;
            updateContent();
        } else {
            closeTutorial();
        }
    });

    secondaryBtn.addEventListener('click', closeTutorial);

    updateContent();
    
    setTimeout(() => {
        backdrop.classList.add('visible');
    }, 100);

})();