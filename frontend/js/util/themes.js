// === THEME SWITCHER ===
const themes = ['theme-win95', 'theme-cosmic'];
export function setTheme(themeName) 
{
	const allThemes = ['theme-win95', 'theme-cosmic'];

	// Update main window
	document.body.classList.remove(...allThemes);
	document.body.classList.add(`theme-${themeName}`);

	// Sync theme to any iframes
	document.querySelectorAll('iframe').forEach((iframe) => 
	{
		if (!iframe.contentWindow) return;

		// Wait until the iframe loads before changing theme
		iframe.addEventListener('load', () => 
		{
			try 
			{
				const iframeBody = iframe.contentDocument?.body;
				if (!iframeBody) return;

				iframeBody.classList.remove(...allThemes);
				iframeBody.classList.add(`theme-${themeName}`);
			} 
			catch (err) 
			{
				console.warn('Could not update iframe theme:', err);
			}
		});

		// If iframe already loaded, update immediately
		try 
		{
			const iframeBody = iframe.contentDocument?.body;
			if (iframeBody) 
			{
				iframeBody.classList.remove(...allThemes);
				iframeBody.classList.add(`theme-${themeName}`);
			}
		}
		catch {}
	});
}