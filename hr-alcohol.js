
(function() {
    let cursorX = window.innerWidth / 2;
    let cursorY = window.innerHeight / 2;
    const cursorSpeed = 12; 
    const scrollSpeed = 20; 
    const deadzone = 0.15;  
    
    let prevButtonState = false;
    let prevDeleteButtonState = false;
    let prevSpaceButtonState = false;
    let prevDPad = { up: false, down: false, left: false, right: false, start: false };
    let isCursorVisibleMode = true;
    
    const defaultCursorSrc = 'resources/ui/cursor1.png';
    const pointerCursorSrc = 'resources/ui/cursor2.png';
    let currentCursorState = 'default';

    const virtualCursor = document.createElement('img');
    virtualCursor.src = defaultCursorSrc; 
    virtualCursor.style.position = 'fixed';
    virtualCursor.style.width = '32px';  
    virtualCursor.style.height = '32px';
    virtualCursor.style.zIndex = '999999';
    virtualCursor.style.pointerEvents = 'none'; 
    virtualCursor.style.transform = 'translate(-50%, -50%)'; 
    virtualCursor.style.left = `${cursorX}px`;
    virtualCursor.style.top = `${cursorY}px`;
    virtualCursor.style.transition = 'transform 0.1s ease, opacity 0.1s ease'; 
    virtualCursor.style.display = 'none'; 
    
    window.addEventListener('DOMContentLoaded', () => {
        document.body.appendChild(virtualCursor);
        setupVirtualKeyboard();
    });

    function hideVirtualCursor() {
        if (virtualCursor.style.display !== 'none') virtualCursor.style.display = 'none';
    }
    window.addEventListener('mousemove', hideVirtualCursor);
    window.addEventListener('keydown', hideVirtualCursor);

    const kbContainer = document.createElement('div');
    let isKeyboardVisible = false;
    let activeInput = null;
    let kbGrid = []; 
    let currentKbRow = 0;
    let currentKbCol = 0;
    
    let kbX = window.innerWidth / 2;
    let kbY = window.innerHeight / 2 + 150; 
    let activeHoverKey = null;

    function setupVirtualKeyboard() {
        kbContainer.style.position = 'fixed';
        kbContainer.style.left = `${kbX}px`;
        kbContainer.style.top = `${kbY}px`;
        kbContainer.style.transform = 'translate(-50%, -50%)';
        kbContainer.style.width = '650px';
        kbContainer.style.backgroundColor = 'rgba(40, 40, 40, 0.69)';
        kbContainer.style.backdropFilter = 'blur(6px)';
        kbContainer.style.padding = '20px';
        kbContainer.style.borderRadius = '12px';
        kbContainer.style.boxShadow = '0px 10px 30px rgba(0,0,0,0.5)';
        kbContainer.style.boxSizing = 'border-box';
        kbContainer.style.zIndex = '999998'; 
        kbContainer.style.display = 'none';
        kbContainer.style.flexDirection = 'column';
        kbContainer.style.alignItems = 'center';
        kbContainer.style.fontFamily = 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif';
        document.body.appendChild(kbContainer);

        const layout = [
            ['1','2','3','4','5','6','7','8','9','0'],
            ['q','w','e','r','t','y','u','i','o','p'],
            ['a','s','d','f','g','h','j','k','l','/'],
            ['z','x','c','v','b','n','m','Back'],
            ['Space', 'Done']
        ];

        layout.forEach((rowLayout) => {
            const rowDiv = document.createElement('div');
            rowDiv.style.display = 'flex';
            rowDiv.style.justifyContent = 'center';
            rowDiv.style.gap = '8px';
            rowDiv.style.marginBottom = '8px';
            
            let domRow = [];

            rowLayout.forEach((key) => {
                const keyBtn = document.createElement('div');
                keyBtn.innerText = key;
                keyBtn.classList.add('vk-key');
                keyBtn.style.backgroundColor = '#3a3a3a';
                keyBtn.style.color = '#fff';
                keyBtn.style.padding = '15px 20px';
                keyBtn.style.borderRadius = '6px';
                keyBtn.style.cursor = 'pointer';
                keyBtn.style.userSelect = 'none';
                keyBtn.style.fontSize = '18px';
                keyBtn.style.minWidth = '40px';
                keyBtn.style.textAlign = 'center';
                keyBtn.style.border = '2px solid transparent';
                keyBtn.style.transition = 'background-color 0.1s, border-color 0.1s';

                if (key === 'Space') {
                    keyBtn.style.width = '300px';
                    keyBtn.innerText = ''; 
                }
                if (key === 'Back') keyBtn.style.backgroundColor = '#555';
                if (key === 'Done') {
                    keyBtn.style.backgroundColor = '#0078d7'; 
                    keyBtn.style.fontWeight = 'bold';
                }

                keyBtn.addEventListener('mouseenter', () => keyBtn.style.borderColor = '#fff');
                keyBtn.addEventListener('mouseleave', () => keyBtn.style.borderColor = 'transparent');

                keyBtn.addEventListener('click', (e) => {
                    e.stopPropagation(); 
                    if (!activeInput) return;

                    if (key === 'Back') {
                        activeInput.value = activeInput.value.slice(0, -1);
                    } else if (key === 'Space') {
                        activeInput.value += ' ';
                    } else if (key === 'Done') {
                        hideKeyboard();
                        return;
                    } else {
                        activeInput.value += key;
                    }
                    activeInput.dispatchEvent(new Event('input', { bubbles: true }));
                });

                rowDiv.appendChild(keyBtn);
                domRow.push(keyBtn);
            });
            kbContainer.appendChild(rowDiv);
            kbGrid.push(domRow);
        });
    }

    function showKeyboard(inputElement) {
        activeInput = inputElement;
        isKeyboardVisible = true;
        kbContainer.style.display = 'flex';
        currentKbRow = 2; 
        currentKbCol = 4;
        kbX = window.innerWidth / 2;
        kbY = window.innerHeight / 2 + 150;
        kbContainer.style.left = `${kbX}px`;
        kbContainer.style.top = `${kbY}px`;
    }

    function hideKeyboard() {
        isKeyboardVisible = false;
        kbContainer.style.display = 'none';
        if (activeHoverKey) {
            activeHoverKey.style.borderColor = 'transparent';
            activeHoverKey = null;
        }
        if (activeInput) {
            activeInput.blur();
            activeInput = null;
        }
    }

    function moveDpadSelection(rowOffset, colOffset) {
        currentKbRow += rowOffset;
        if (currentKbRow < 0) currentKbRow = 0;
        if (currentKbRow >= kbGrid.length) currentKbRow = kbGrid.length - 1;

        currentKbCol += colOffset;
        if (currentKbCol < 0) currentKbCol = 0;
        if (currentKbCol >= kbGrid[currentKbRow].length) currentKbCol = kbGrid[currentKbRow].length - 1;

        const targetKey = kbGrid[currentKbRow][currentKbCol];
        const rect = targetKey.getBoundingClientRect();
        cursorX = rect.left + (rect.width / 2);
        cursorY = rect.top + (rect.height / 2);
    }

    function updateController() {
        const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
        const gp = gamepads[0]; 

        if (gp) {
            let controllerActive = false;

            const leftStickX = gp.axes[0];
            const leftStickY = gp.axes[1];
            const rightStickX = gp.axes[2];
            const rightStickY = gp.axes[3];

            const actionButton = gp.buttons[0].pressed;
            const deleteButton = gp.buttons[2]?.pressed;
            const spaceButton = gp.buttons[3]?.pressed;
            const startButton = gp.buttons[9]?.pressed; 
            const dpadUp = gp.buttons[12]?.pressed;
            const dpadDown = gp.buttons[13]?.pressed;
            const dpadLeft = gp.buttons[14]?.pressed;
            const dpadRight = gp.buttons[15]?.pressed;

            if (dpadUp || dpadDown || dpadLeft || dpadRight) {
                isCursorVisibleMode = false;
            }
            if (Math.abs(leftStickX) > deadzone || Math.abs(leftStickY) > deadzone) {
                isCursorVisibleMode = true;
            }

            if (isKeyboardVisible) {
                if (startButton && !prevDPad.start) hideKeyboard();

                if (dpadUp && !prevDPad.up) { moveDpadSelection(-1, 0); controllerActive = true; }
                if (dpadDown && !prevDPad.down) { moveDpadSelection(1, 0); controllerActive = true; }
                if (dpadLeft && !prevDPad.left) { moveDpadSelection(0, -1); controllerActive = true; }
                if (dpadRight && !prevDPad.right) { moveDpadSelection(0, 1); controllerActive = true; }

                if (Math.abs(rightStickX) > deadzone) { kbX += rightStickX * scrollSpeed; controllerActive = true; }
                if (Math.abs(rightStickY) > deadzone) { kbY += rightStickY * scrollSpeed; controllerActive = true; }

                kbX = Math.max(0, Math.min(window.innerWidth, kbX));
                kbY = Math.max(0, Math.min(window.innerHeight, kbY));
                kbContainer.style.left = `${kbX}px`;
                kbContainer.style.top = `${kbY}px`;

                if (deleteButton && !prevDeleteButtonState && activeInput) {
                    activeInput.value = activeInput.value.slice(0, -1);
                    activeInput.dispatchEvent(new Event('input', { bubbles: true }));
                    controllerActive = true;
                }
                if (spaceButton && !prevSpaceButtonState && activeInput) {
                    activeInput.value += ' ';
                    activeInput.dispatchEvent(new Event('input', { bubbles: true }));
                    controllerActive = true;
                }
            } else {
                let scrollDeltaX = 0; let scrollDeltaY = 0;
                if (Math.abs(rightStickX) > deadzone) { scrollDeltaX = rightStickX * scrollSpeed; controllerActive = true; }
                if (Math.abs(rightStickY) > deadzone) { scrollDeltaY = rightStickY * scrollSpeed; controllerActive = true; }

                if (scrollDeltaX !== 0 || scrollDeltaY !== 0) {
                    let targetElement = document.elementFromPoint(cursorX, cursorY);
                    let hasScrolledSpecificElement = false;

                    while (targetElement && targetElement !== document.body && targetElement !== document.documentElement) {
                        const style = window.getComputedStyle(targetElement);
                        const isScrollableY = targetElement.scrollHeight > targetElement.clientHeight && (style.overflowY === 'auto' || style.overflowY === 'scroll');
                        const isScrollableX = targetElement.scrollWidth > targetElement.clientWidth && (style.overflowX === 'auto' || style.overflowX === 'scroll');
                        
                        if (isScrollableY || isScrollableX) {
                            targetElement.scrollBy(scrollDeltaX, scrollDeltaY);
                            hasScrolledSpecificElement = true;
                            break; 
                        }
                        targetElement = targetElement.parentElement;
                    }
                    if (!hasScrolledSpecificElement) window.scrollBy(scrollDeltaX, scrollDeltaY);
                }
            }

            prevDPad.start = startButton;
            prevDPad.up = dpadUp;
            prevDPad.down = dpadDown;
            prevDPad.left = dpadLeft;
            prevDPad.right = dpadRight;
            prevDeleteButtonState = deleteButton;
            prevSpaceButtonState = spaceButton;

            if (Math.abs(leftStickX) > deadzone) {
                cursorX += leftStickX * cursorSpeed;
                controllerActive = true;
            }
            if (Math.abs(leftStickY) > deadzone) {
                cursorY += leftStickY * cursorSpeed;
                controllerActive = true;
            }

            for (let i = 0; i < gp.buttons.length; i++) {
                if (gp.buttons[i].pressed) { controllerActive = true; break; }
            }

            if (controllerActive) virtualCursor.style.display = 'block';
            virtualCursor.style.opacity = isCursorVisibleMode ? '1' : '0';

            cursorX = Math.max(0, Math.min(window.innerWidth, cursorX));
            cursorY = Math.max(0, Math.min(window.innerHeight, cursorY));
            virtualCursor.style.left = `${cursorX}px`;
            virtualCursor.style.top = `${cursorY}px`;

            if (virtualCursor.style.display === 'block') {
                const elementUnderCursor = document.elementFromPoint(cursorX, cursorY);
                let isHoveringLink = false;

                if (elementUnderCursor && elementUnderCursor.classList.contains('vk-key')) {
                    if (activeHoverKey && activeHoverKey !== elementUnderCursor) {
                        activeHoverKey.style.borderColor = 'transparent';
                    }
                    elementUnderCursor.style.borderColor = '#fff';
                    activeHoverKey = elementUnderCursor;
                } else if (activeHoverKey) {
                    activeHoverKey.style.borderColor = 'transparent';
                    activeHoverKey = null;
                }

                if (elementUnderCursor) {
                    if (
                        elementUnderCursor.closest('a') || 
                        elementUnderCursor.closest('button') || 
                        elementUnderCursor.closest('input') ||
                        elementUnderCursor.classList.contains('vk-key') ||
                        window.getComputedStyle(elementUnderCursor).cursor === 'pointer'
                    ) {
                        isHoveringLink = true;
                    }
                }

                if (isHoveringLink && currentCursorState !== 'pointer') {
                    virtualCursor.src = pointerCursorSrc;
                    currentCursorState = 'pointer';
                } else if (!isHoveringLink && currentCursorState !== 'default') {
                    virtualCursor.src = defaultCursorSrc;
                    currentCursorState = 'default';
                }
            }

            if (actionButton && !prevButtonState) {
                triggerClickAt(cursorX, cursorY);
                if (isCursorVisibleMode) {
                    virtualCursor.style.transform = 'translate(-50%, -50%) scale(0.7)';
                    setTimeout(() => virtualCursor.style.transform = 'translate(-50%, -50%) scale(1)', 100);
                }
            }
            prevButtonState = actionButton;
        }

        requestAnimationFrame(updateController);
    }

    function triggerClickAt(x, y) {
        const elementToClick = document.elementFromPoint(x, y);

        if (elementToClick) {
            const clickEvent = new MouseEvent('click', {
                view: window, bubbles: true, cancelable: true, clientX: x, clientY: y
            });
            elementToClick.dispatchEvent(clickEvent);
            
            if (typeof elementToClick.focus === 'function') {
                elementToClick.focus();
            }

            const isTextInput = elementToClick.tagName === 'INPUT' && 
                               ['text', 'password', 'search', 'email', 'url', 'number'].includes(elementToClick.type);
            const isTextArea = elementToClick.tagName === 'TEXTAREA';

            if ((isTextInput || isTextArea) && !elementToClick.classList.contains('vk-key')) {
                showKeyboard(elementToClick);
            }
        }
    }

    window.addEventListener("gamepadconnected", (e) => {
        console.log("Gamepad connected:", e.gamepad.id);
        requestAnimationFrame(updateController);
    });

})();