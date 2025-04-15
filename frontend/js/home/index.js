import { setTheme } from '../util/themes.js';
import { createAppWindow } from '../util/window-manager.js';

// === DESKTOP ICON BUTTONS ===
document.addEventListener('DOMContentLoaded', function () 
{
	const desktopIcons = document.querySelectorAll('.desktop-icon');

	desktopIcons.forEach((iconBtn) => 
    {
		iconBtn.addEventListener('click', () => 
        {
			const labelSpan = iconBtn.querySelector('.icon-label');
			const label = labelSpan?.dataset.label;

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
							style="border: none;">
						</iframe>
					`);
					break;

				case 'vibes':
					createAppWindow('tv-vibes', 'CRT-TV.exe', `
						<iframe 
							src="pages/vibes.html" 
							width="100%" 
							height="100%" 
							frameborder="0" 
							style="border: none;">
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
							style="border: none;">
						</iframe>
					`);
					break;

				case 'theme':
					// toggle theme instead of opening a window
					const currentTheme = document.body.classList.contains('theme-cosmic') ? 'cosmic' : 'win95';
					const nextTheme = currentTheme === 'cosmic' ? 'win95' : 'cosmic';
					setTheme(nextTheme);
					break;

				default:
					console.warn(`Unrecognized desktop label: ${label}`);
			}
		});
	});
});

// === START MENU BUTTONS ===
document.addEventListener('DOMContentLoaded', function () 
{
	const menuItems = ['game', 'vibes', 'gooses', 'theme'];

	menuItems.forEach((label) => 
    {
		const menuButton = document.querySelector(`[data-label="${label}"]`);
		if (!menuButton) return;

		menuButton.addEventListener('click', () => 
        {
			switch (label) 
            {
				case 'game':
					createAppWindow('goose-game', 'Goose.exe', `
						<iframe 
							src="pages/goose.html" 
							width="100%" 
							height="100%" 
							frameborder="0" 
							style="border: none;">
						</iframe>
					`);
					break;

				case 'vibes':
					createAppWindow('tv-vibes', 'CRT-TV.exe', `
						<iframe 
							src="pages/vibes.html" 
							width="100%" 
							height="100%" 
							frameborder="0" 
							style="border: none;">
						</iframe>
					`);
					break;

				case 'gooses':
					createAppWindow('carousel-vote', 'VoteGoose.exe', `
						<iframe 
							src="pages/belles-lettres.html" 
							width="100%" 
							height="100%" 
							frameborder="0" 
							style="border: none;">
						</iframe>
					`);
					break;

				case 'theme':
					const currentTheme = document.body.classList.contains('theme-cosmic') ? 'cosmic' : 'win95';
					const nextTheme = currentTheme === 'cosmic' ? 'win95' : 'cosmic';
					setTheme(nextTheme);
					break;

				default:
					console.warn(`Unhandled start menu label: ${label}`);
			}
		});
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

// === MOUSECLICK THEME FLICKER ==
document.addEventListener('DOMContentLoaded', function () 
{
	let flickerTimeout = null;

	document.addEventListener('pointerdown', function (e) 
    {
		const button = e.target.closest('button, .brutal-button, .start-button, [role="button"]');
		if (!button) return;

		// if button or any child has data-label "theme" or "themes"
		const ignoredLabel = button.querySelector('[data-label="theme"], [data-label="themes"]')?.dataset.label;
		if (ignoredLabel === 'theme' || ignoredLabel === 'themes') return;

		// clear previous flicker if user spam-clicks
		clearTimeout(flickerTimeout);

		const currentTheme = document.body.classList.contains('theme-cosmic') ? 'cosmic' : 'win95';
		const nextTheme = currentTheme === 'cosmic' ? 'win95' : 'cosmic';

		// trigger quick flicker
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
