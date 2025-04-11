// === WIN95 WINDOW MANAGER CORE ===
let zIndexCounter = 1000; // Used to stack windows above each other as they're opened or clicked

/**
 * Creates and displays a new app window
 * @param {string} appId - Unique ID for the window (used to avoid duplicate windows)
 * @param {string} appTitle - Title shown in the title bar
 * @param {string} appContentHTML - Inner HTML content (can be iframe, textarea, div, etc.)
 */
export function createAppWindow(appId, appTitle, appContentHTML) 
{
    // === Avoid Duplicate Windows ===
    if (document.querySelector(`#${appId}`)) 
    {
        bringToFront(appId); // If already open, just bring it to front
        return;
    }

    // === Create the Window Container ===
    const theme = [...document.body.classList].find(c => c.startsWith('theme-')) || 'theme-win95';

    const win = document.createElement('div');
    win.classList.add('win95-window', theme);
    win.id = appId;
    win.style.zIndex = zIndexCounter++;

    // === Inject Inner Window HTML ===
    win.innerHTML = `
        <div class="theme-win95 win95-window-titlebar">
            <span class="win95-window-title">${appTitle}</span>
            <div class="win95-window-controls">
                <button class="win95-window-maximize brutal-button button" title="Maximize">☐</button>
                <button class="win95-window-close brutal-button button" title="Close">✕</button>
            </div>
        </div>
        <div class="win95-window-content">
            ${appContentHTML}
        </div>
        <div class="win95-window-resizer"></div>
    `;

    // === Add to DOM ===
    document.body.appendChild(win);

    // === DEFAULT SIZE: OPEN NEAR FULLSCREEN ===
    const margin = 32;
    win.style.width = `${window.innerWidth - margin * 2}px`;
    win.style.height = `${window.innerHeight - margin * 2}px`;
    win.style.left = `${margin}px`;
    win.style.top = `${margin}px`;

    makeDraggable(win);
    makeResizable(win);
    addMaximizeBehavior(win);
    addCloseBehavior(win);
    bringToFront(appId);
}

// === BRING TO FRONT ===
// Increments zIndex and applies to the window so it's not hidden behind others
function bringToFront(appId) 
{
    const win = document.querySelector(`#${appId}`);
    if (win) 
    {
        win.style.zIndex = zIndexCounter++;
    }
}

// === CLOSE BUTTON BEHAVIOR ===
// Clicking the ✕ will remove the window from the DOM
function addCloseBehavior(win) 
{
    const closeBtn = win.querySelector('.win95-window-close');
    closeBtn.addEventListener('click', () => 
    {
        win.remove();
    });
}

function addMaximizeBehavior(win) 
{
    const maximizeBtn = win.querySelector('.win95-window-maximize');
    let prev = {
        width: win.style.width,
        height: win.style.height,
        top: win.style.top,
        left: win.style.left
    };

    maximizeBtn.addEventListener('click', () => 
    {
        const isMaximized = win.classList.toggle('maximized');

        if (isMaximized) 
        {
            // Save current dimensions
            prev = {
                width: win.style.width,
                height: win.style.height,
                top: win.style.top,
                left: win.style.left
            };

            const margin = 0;
            const startBarHeight = 50;
            win.style.width = `${window.innerWidth - margin * 2}px`;
            win.style.height = `${window.innerHeight - startBarHeight - margin * 2}px`;
            win.style.top = `${margin}px`;
            win.style.left = `${margin}px`;
        } 
        else 
        {
            // Restore previous dimensions
            win.style.width = prev.width;
            win.style.height = prev.height;
            win.style.top = prev.top;
            win.style.left = prev.left;
        }
    });
}




// === DRAGGING FUNCTIONALITY ===
// Allows user to drag the window around the screen using the title bar
function makeDraggable(win)
{
    const titlebar = win.querySelector('.win95-window-titlebar');
    let offsetX = 0, offsetY = 0, isDragging = false;

    titlebar.addEventListener('mousedown', (e) => 
    {
        isDragging = true;
        offsetX = e.clientX - win.offsetLeft;
        offsetY = e.clientY - win.offsetTop;
        bringToFront(win.id); // Bring to front when clicked
    });

    document.addEventListener('mousemove', (e) => 
    {
        if (!isDragging) return;
        win.style.left = `${e.clientX - offsetX}px`;
        win.style.top = `${e.clientY - offsetY}px`;
    });

    document.addEventListener('mouseup', () => 
    {
        isDragging = false;
    });
}

// === RESIZING FUNCTIONALITY ===
// Adds ability to resize the window from the bottom-right corner
function makeResizable(win) 
{
    const resizer = win.querySelector('.win95-window-resizer');
    let isResizing = false;
    let startX, startY, startWidth, startHeight;

    resizer.addEventListener('mousedown', (e) => 
    {
        isResizing = true;
        startX = e.clientX;
        startY = e.clientY;
        startWidth = parseInt(document.defaultView.getComputedStyle(win).width, 10);
        startHeight = parseInt(document.defaultView.getComputedStyle(win).height, 10);
        e.preventDefault(); // Prevent text selection
    });

    document.addEventListener('mousemove', (e) => 
    {
        if (!isResizing) return;
        win.style.width = `${startWidth + e.clientX - startX}px`;
        win.style.height = `${startHeight + e.clientY - startY}px`;
    });

    document.addEventListener('mouseup', () => 
    {
        isResizing = false;
    });
}


document.addEventListener('DOMContentLoaded', function () 
{
    let flickerTimeout = null;

    document.addEventListener('pointerdown', function (e) 
    {
        // if (e.target.closest('.brutal-button') || e.target.closest('.start-button')) 
        if (e.target.closest('button, .brutal-button, .start-button, [role="button"]'))
        {
            // Clear previous flicker if user spam-clicks
            clearTimeout(flickerTimeout);

            // Trigger quick flicker: switch to 'cosmic' for ~100ms
            setTheme('cosmic');

            flickerTimeout = setTimeout(() => 
            {
                setTheme('win95');
            }, 100);  // This delay = flicker duration
        }
    });

    // Edge case cleanup
    window.addEventListener('blur', function () 
    {
        clearTimeout(flickerTimeout);
    });
});