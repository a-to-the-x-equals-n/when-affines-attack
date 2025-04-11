// === Cosmic Terminal Import ===
import { transitionToCosmicTerminal } from './cosmic-terminal.js';

// === BSOD Elements ===
const bsodOverlay = document.getElementById('bsod-overlay');
const rainbowBsodPrompt = document.getElementById('bsodPrompt');

// === Prompt Text + Color Cycle ===
const bsodPrompt = 'Press any key to continue ';
const colors = ['red', 'orange', 'yellow', '#2ef70a', '#15d8ed', '#ed15db', 'violet'];

let hasStarted = false;

// ============================
//  - RAINBOW PROMPT DISPLAY - 
// ============================
function drawRainbowText(text)
{
    rainbowBsodPrompt.innerHTML = '';

    for (let i = 0; i < text.length; i++)
    {
        const span = document.createElement('span');
        span.textContent = text[i];
        span.style.color = colors[i % colors.length];
        rainbowBsodPrompt.appendChild(span);
    }
}
drawRainbowText(bsodPrompt);
// =============================
//  - EVENT: TRIGGER TERMINAL - 
// =============================
window.addEventListener('keydown', () =>
{
    if (hasStarted) return;
    hasStarted = true;

    // clean up BSOD elements
    if (bsodOverlay)
    {
        bsodOverlay.remove();
    }

    // begin terminal takeover
    transitionToCosmicTerminal();
});