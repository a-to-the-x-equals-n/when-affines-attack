// === THEME SWITCHER ===
const themes = ['theme-win95', 'theme-cosmic'];
export function setTheme(theme) 
{
    document.body.classList.remove(...themes);          // Remove all possible theme classes
    document.body.classList.add(`theme-${theme}`);  // Add new theme
}
