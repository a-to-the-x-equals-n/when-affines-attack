import { setTheme } from './themes.js'
let zIndexCounter = 1000;

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
                <button class="win95-window-minimize brutal-button button" title="Minimize">_</button>
                <button class="win95-window-maximize brutal-button button" title="Maximize">☐</button>
                <button class="win95-window-close brutal-button button" title="Close">✕</button>
            </div>
        </div>
        <div class="win95-window-content">
            ${appContentHTML}
        </div>
        <!-- <div class="win95-window-resizer"></div> -->
    `;

    // === Add to DOM ===
    document.body.appendChild(win);

    // === DEFAULT SIZE: OPEN NEAR FULLSCREEN ===
    const margin = 32;
    const startBarHeight = 50;  // Adjust if your start bar is a different height
    
    win.style.width = `${window.innerWidth - margin * 2}px`;
    win.style.height = `${window.innerHeight - startBarHeight - margin * 2}px`;
    win.style.left = `${margin}px`;
    win.style.top = `${margin}px`;

    makeDraggable(win);
    addMaximizeBehavior(win);
    addMinimizeBehavior(win, appId, appTitle);
    addCloseBehavior(win);
    bringToFront(appId);
}

// === BRING TO FRONT ===
// increments zIndex and applies to window so it's not behind others
function bringToFront(appId) 
{
    const win = document.querySelector(`#${appId}`);
    if (win) 
    {
        win.style.zIndex = zIndexCounter++;
    }
}

// === CLOSE BUTTON BEHAVIOR ===
// clicking the ✕ will remove the window from the DOM
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

function addMinimizeBehavior(win, appId, appTitle) 
{
	const minimizeBtn = win.querySelector('.win95-window-minimize');
	const taskbarContent = document.querySelector('.taskbar-apps');

	minimizeBtn.addEventListener('click', () => 
	{
		win.style.display = 'none';

		let taskButton = document.querySelector(`.taskbar-button[data-app="${appId}"]`);
		if (!taskButton) 
		{
			taskButton = document.createElement('button');
			taskButton.classList.add('taskbar-button', 'brutal-button');
			taskButton.dataset.app = appId;
			taskButton.textContent = appTitle;
            taskButton.title = appTitle;
            console.log('Creating task button:', appId, appTitle);


			taskbarContent.appendChild(taskButton);

			taskButton.addEventListener('click', () => 
			{
				win.style.display = 'block';
				bringToFront(appId);
				taskButton.remove();
			});
		} 
		else 
		{
			taskButton.click();
		}
	});
}

// === DRAGGING FUNCTIONALITY ===
// allows user to drag the window around the screen using the title bar
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


// document.addEventListener('DOMContentLoaded', function () 
// {
//     let flickerTimeout = null;

//     document.addEventListener('pointerdown', function (e) 
//     {
//         // if (e.target.closest('.brutal-button') || e.target.closest('.start-button')) 
//         if (e.target.closest('button, .brutal-button, .start-button, [role="button"]'))
//         {
//             // Clear previous flicker if user spam-clicks
//             clearTimeout(flickerTimeout);

//             // Trigger quick flicker: switch to 'cosmic' for ~100ms
//             setTheme('cosmic');

//             flickerTimeout = setTimeout(() => 
//             {
//                 setTheme('win95');
//             }, 100);  // This delay = flicker duration
//         }
//     });

//     // Edge case cleanup
//     window.addEventListener('blur', function () 
//     {
//         clearTimeout(flickerTimeout);
//     });
// });