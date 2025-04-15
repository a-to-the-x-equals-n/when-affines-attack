import { setTheme } from '../util/themes.js';
import { createAppWindow } from '../util/window-manager.js';

document.addEventListener('DOMContentLoaded', function () 
{
    const startButton = document.getElementById('start-button');
    const startMenu = document.getElementById('start-menu');

    let hoverTimeout;

    function openMenu() 
    {
        startMenu.classList.remove('hidden');

        setTimeout(() => 
        {
            startMenu.classList.add('visible');
        }, 10);
    }

    function closeMenu() 
    {
        startMenu.classList.remove('visible');

        // wait for fade-out before hiding
        setTimeout(() => 
        {
            if (!startMenu.classList.contains('visible')) 
            {
                startMenu.classList.add('hidden');
            }
        }, 150); // slight delay for user forgiveness
    }

    function scheduleMenuClose() 
    {
        hoverTimeout = setTimeout(closeMenu, 150);
    }

    function cancelMenuClose() 
    {
        clearTimeout(hoverTimeout);
    }

    startButton.addEventListener('click', openMenu);
    startButton.addEventListener('mouseenter', cancelMenuClose);
    startButton.addEventListener('mouseleave', scheduleMenuClose);
    startMenu.addEventListener('mouseenter', cancelMenuClose);
    startMenu.addEventListener('mouseleave', scheduleMenuClose);
});


// NAV TO GOOSE PAGE
document.addEventListener('DOMContentLoaded', function () 
{
    const gameButton = document.querySelector("[data-label = 'game']");

    gameButton.addEventListener('click', function () 
    {
        createAppWindow('goose-game', 'Goose.exe', `
            <iframe 
                src="pages/goose.html" 
                width="100%" 
                height="100%" 
                frameborder="0" 
                style="border: none;">
            </iframe>
        `);
        // window.location.href = 'pages/goose.html';
    });
});

// NAV TO TV/VIBES WINDOW
document.addEventListener('DOMContentLoaded', function () 
{
    const vibesButton = document.querySelector('[data-label = "vibes"]');

    vibesButton.addEventListener('click', function () 
    {
        createAppWindow('tv-vibes', 'CRT-TV.exe', `
            <iframe 
                src="pages/vibes.html" 
                width="100%" 
                height="100%" 
                frameborder="0" 
                style="border: none;">
            </iframe>
        `);
    });
});


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