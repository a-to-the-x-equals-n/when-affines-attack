// === DOM ELEMENTS ===
const cosmicTerminal = document.getElementById('cosmic-container');
const cosmicTerminalText = document.getElementById('cosmic-terminal-text');

// === CONTROL STATE ===
let currentLineIndex = 0;
let terminalInterval = null;

// === TERMINAL LINES ===
const terminalLines = [
    'user@[BOOT]:$ - INITIALIZING BOOT SEQUENCE -',
    'user@[BOOT]:$ >Mounting root filesystem',
    'user@[BOOT]:$ >Verifying device integrity',
    'user@[BOOT]:$ >Checking network interface',
    'user@[BOOT]:$ >Kernel handshake successful',
    'user@[BOOT]:$ [OK] online',
    'user@[BOOT]:$ -- detecting interference --',
    'user@[████]:$ █.^/完/',
    '██@[WARN]█功 /firewa█l_br█ech>██',
    
    // Phase 2 starts here
    'ドモ@[SYSFAIL]$: █ corrupt echoes in memory █',
    'ドモ@[VEIL]$: --unearth',
    'ドモ@[ECHO]$: >>signal?received█from█beyond',
    'ドモ@[_視覚-]$: 層█black█sun ████ eye',
    'ドモ@[_ROOT_]$: 魂リンク成功 — dream-layer {locked}',
    'ドモ@[-GATE-]$: breach destabilized::offset ∆-66',
    '__SPINNER__',
    'ドモ@[ OK ]$: ##oldgods-handshake-init',
    'ドモ@[NOT]$: 視覚層ロード完了 — the hunger',
    'ドモ@[WARN]$: >>onlyhunger',
    'ドモ@[MSDOS]$: Goose 核心モジュール 起動中...',
    'ドモ@[_視覚-]$: \<\<\_binding_soul_to_shell_\>\>',
    'ドモ@_dark_$: 視覚層ロード完了 — unremebered>>',
    'ドモ@[ OK ]$: goose層█ %host sync:: 𝚫 nominal',
    'ドモ@[$ANIMA]$: prayers accepted//form preserved',
    'ドモ@[ NOT ]$: no gods||waking shell manually',
    'ドモ@[BOOT]$: -TIMEDOUT- reawakening██shell',
    'ドモ@[_|_]$: ⛧ sigils cast__barrier compromised',
    'ドモ@[DREAM]$: モジュールの囁きが始まった',
    'ドモ@[EYE]$: 視界フレーム完全に破られた',
    'ドモ@[ OK ]$: __the offering is accepted__',
    'ドモ@[HOME]$: ERR界R HANDL██ED',
    'ドモ@[HOME]$: redirecting...',
];
const glitchLines = new Set([
    'ドモ@[SYSFAIL]$: █ corrupt echoes in memory █',
    'ドモ@[WARN]$: >>onlyhunger',
    'ドモ@_dark_$: 視覚層ロード完了 — unremebered>>',
    'ドモ@[ NOT ]$: no gods||waking shell manually',
    'ドモ@[_|_]$: ⛧ sigils cast. barrier compromised.'
]);
const overwriteLines = new Set([
    'ドモ@[SYSFAIL]$: █ corrupt echoes in memory █',
    'ドモ@[ NOT ]$: no gods||waking shell manually'
]);


//  === TERMINAL SEQUENCE ===
function runTerminal()
{
    const line = terminalLines[currentLineIndex++];

    if (line === '__SPINNER__')
    {
        clearInterval(terminalInterval);
        feedGooseSpinner(() =>
        {
            terminalInterval = setInterval(runTerminal, 1700);
        });
        return;
    }

    if (line === 'ドモ@[SYSFAIL]$: █ corrupt echoes in memory █') 
    {
        cosmicTerminal.style.backgroundColor = ' #201c1c';
        cosmicTerminal.style.color = ' #ffa500';
        const terminalOutline = document.getElementById('cosmic-terminal')
        terminalOutline.style.border = '2px outset #ffa500'
        cosmicTerminal.classList.add('crt-flicker');
    
        // Remove the flicker class after the animation completes
        setTimeout(() => 
        {
            cosmicTerminal.classList.remove('crt-flicker');
        }, 400); // match animation duration
    }

    printLine(line);

    if (currentLineIndex >= terminalLines.length)
    {
        clearInterval(terminalInterval);

        setTimeout(() =>
        {
            // fade out cosmic terminal
            cosmicTerminal.style.opacity = '0';
        
            // after fade completes, hide cosmic terminal, show landing
            setTimeout(() =>
            {
                cosmicTerminal.style.display = 'none';
        
                const landing = document.getElementById('landing');
                landing.style.display = 'block';
                landing.style.opacity = '0';
                landing.style.transition = 'opacity 1s ease';
        
                requestAnimationFrame(() =>
                {
                    landing.style.transition = 'opacity 1s ease';
                    landing.style.opacity = '1';
                });
        
            }, 3000); // allow fade out to complete
        }, 1500); // short delay after last line before fading
    }
}

//  === LINE RENDERING LOGIC ===
function printLine(line)
{
    // remove any existing cursors before adding a new line
    const existingCursors = document.querySelectorAll('.terminal-cursor');
    existingCursors.forEach(cursor => cursor.remove());

    const div = document.createElement('div');
    div.textContent = line;

    div.innerHTML = `
        <span>${line}</span><span class="terminal-cursor">█</span>
    `;

    if (glitchLines.has(line)) div.classList.add('glitch');
    if (overwriteLines.has(line))
    {
        let last = cosmicTerminalText.lastChild;
        if (last && last.textContent.trim() === '') last = last.previousSibling;
        if (last) cosmicTerminalText.removeChild(last);
    }
    cosmicTerminalText.appendChild(div);
    cosmicTerminalText.scrollTop = cosmicTerminalText.scrollHeight;
}

//  === SPINNER SIMULATION ===
function feedGooseSpinner(done)
{
    const spinChars = ['/', '-', '\\'];
    let spinIndex = 0;
    let cycles = 0;

    const spinnerDiv = document.createElement('div');
    spinnerDiv.innerHTML = '&nbsp;&nbsp;&nbsp;Feeding geese... /';
    cosmicTerminalText.appendChild(spinnerDiv);

    const spin = setInterval(() =>
    {
        spinnerDiv.innerHTML = '&nbsp;&nbsp;&nbsp;Feeding geese... ' + spinChars[spinIndex];
        spinIndex = (spinIndex + 1) % spinChars.length;
        cycles++;

        if (cycles >= 12)
        {
            clearInterval(spin);
            spinnerDiv.innerHTML = '&nbsp;&nbsp;&nbsp; - fed -';
            if (done) done();
        }
    }, 300);
}

// === EXPORTS ===
export function transitionToCosmicTerminal()
{
    cosmicTerminal.style.display = 'flex';
    cosmicTerminalText.innerHTML = '';
    currentLineIndex = 0;

    terminalInterval = setInterval(runTerminal, 1200);
}