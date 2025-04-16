import { setTheme } from './themes.js';
import { createAppWindow } from './window-manager.js';

// === UNIVERSAL LAUNCHER FOR ICONS + MENU ===
function handleAppLaunch(label) 
{
	if (!label) return;

	switch (label) 
	{
		case 'game':
			createAppWindow('goose-game', 'Goose.exe', `
				<iframe 
					src="pages/goose.html" 
					width="100%" 
					height="100%" 
					frameborder="0" 
					style="border: none; overflow: hidden;"
				</iframe>
			`);
			break;

		case 'vibes':
			createAppWindow('tv-vibes', 'CRT.tv', `
				<iframe 
					src="pages/vibes.html" 
					width="100%" 
					height="100%" 
					frameborder="0" 
					style="border: none; overflow: hidden;"
				</iframe>
			`);
			break;

		case 'gooses':
			createAppWindow('carousel-vote', 'belles-lettres.exe', `
				<iframe 
					src="pages/belles-lettres.html" 
					width="100%" 
					height="100%" 
					frameborder="0" 
					style="border: none; overflow: hidden;"
				</iframe>
			`);
			break;

		case 'afghanistan':
			createAppWindow('afghan-page', 'afghan.html', `
				<iframe 
					src="pages/afghan.html" 
					width="100%" 
					height="100%" 
					frameborder="0" 
					style="border: none; overflow: hidden;"
				</iframe>
			`);
			break;

		case 'upload':
			createAppWindow('upload-page', 'upload.cmd', `
				<iframe 
					src="pages/upload.html" 
					width="100%" 
					height="100%" 
					frameborder="0" 
					style="border: none; overflow: hidden;"
				</iframe>
			`);
			break;

		case 'theme':
		case 'themes':
			const currentTheme = document.body.classList.contains('theme-cosmic') ? 'cosmic' : 'win95';
			const nextTheme = currentTheme === 'cosmic' ? 'win95' : 'cosmic';
			setTheme(nextTheme);
			break;

		default:
			console.warn(`Unrecognized label: ${label}`);
	}
}

// === COMBINED BUTTON LISTENERS ===
document.addEventListener('DOMContentLoaded', function () 
{
	// START MENU BUTTONS
	const menuItems = Array.from(document.querySelectorAll('#start-menu [data-label]'));
	menuItems.forEach((menuButton) => 
	{
		const label = menuButton.dataset.label;
		menuButton.addEventListener('click', () => handleAppLaunch(label));
	});

	// DESKTOP ICON BUTTONS
	const desktopIcons = document.querySelectorAll('.desktop-icon');
	desktopIcons.forEach((iconBtn) => 
	{
		const labelSpan = iconBtn.querySelector('.icon-label');
		const label = labelSpan?.dataset.label;
		iconBtn.addEventListener('click', () => handleAppLaunch(label));
	});
});


// === START MENU ===
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

// === MOUSECLICK THEME FLICKER ===
document.addEventListener('DOMContentLoaded', function () 
{
	let flickerTimeout = null;

	document.addEventListener('pointerdown', function (e) 
	{
		// Match anything interactive — buttons, list items, etc.
		const interactive = e.target.closest('[data-label], button, .brutal-button, .start-button, li, [role="button"]');
		if (!interactive) return;

		// Grab label if present
		let label = interactive.dataset?.label?.trim().toLowerCase();

		// If not on self, try child element with data-label
		if (!label) 
		{
			const inner = interactive.querySelector('[data-label]');
			label = inner?.dataset?.label?.trim().toLowerCase() || null;
		}

		// Ignore flicker for theme icons
		if (label === 'theme' || label === 'themes') return;

		// Flicker time
		clearTimeout(flickerTimeout);

		const currentTheme = document.body.classList.contains('theme-cosmic') ? 'cosmic' : 'win95';
		const nextTheme = currentTheme === 'cosmic' ? 'win95' : 'cosmic';

		setTheme(nextTheme);

		flickerTimeout = setTimeout(() => 
		{
			setTheme(currentTheme);
		}, 100);
	});

	window.addEventListener('blur', function () 
	{
		clearTimeout(flickerTimeout);
	});
});