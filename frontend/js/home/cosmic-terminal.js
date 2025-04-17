
// === FLAGS ===
window.cosmicCompleted = false;
window.bsodCompleted = false;

// === DOM ELEMENTS ===
const cosmicTerminal = document.getElementById('cosmic-container');
const cosmicTerminalText = document.getElementById('cosmic-terminal-text');
const landing = document.getElementById('landing');
const blackout = document.getElementById('transition-blackout');

// === CONTROL STATE ===
let currentLineIndex = 0;
let terminalInterval = null;
const LINE_DELAY = 350; // <-------- ADJUST AS NEEDED TO DELAY OUTPUTS

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
    '██@[WARN]█功 /firewall_breach',
    
    // Phase 2 starts here
    'ドモ@[SYSFAIL]$: █ corrupt echoes in memory █',
    'ドモ@[VEIL]$: --unearth',
    'ドモ@[ECHO]$: >>signal?received█from█beyond',
    'ドモ@[_視覚-]$: 層█black█sun',
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
    'ドモ@[_|_]$: ⛧ sigils cast. barrier compromised.',
    'ドモ@[DREAM]$: モジュールの囁きが始まった'
]);
const overwriteLines = new Set([
    'ドモ@[SYSFAIL]$: █ corrupt echoes in memory █',
    'ドモ@[ NOT ]$: no gods||waking shell manually'
]);
const corruptLines = new Set([
    'user@[████]:$ █.^/完/',
    '██@[WARN]█功 /firewall_breach',
	'ドモ@[SYSFAIL]$: █ corrupt echoes in memory █',
	'ドモ@[VEIL]$: --unearth',
	'ドモ@[ECHO]$: >>signal?received█from█beyond',
	'ドモ@[_視覚-]$: 層█black█sun',
	'ドモ@[_ROOT_]$: 魂リンク成功 — dream-layer {locked}',
	'ドモ@[-GATE-]$: breach destabilized::offset ∆-66',
	'ドモ@[ OK ]$: ##oldgods-handshake-init',
	'ドモ@[NOT]$: 視覚層ロード完了 — the hunger',
	'ドモ@[WARN]$: >>onlyhunger',
	'ドモ@[MSDOS]$: Goose 核心モジュール 起動中...',
	'ドモ@[_視覚-]$: <<_binding_soul_to_shell_>>',
	'ドモ@_dark_$: 視覚層ロード完了 — unremebered>>',
	'ドモ@[ OK ]$: goose層█ %host sync:: 𝚫 nominal',
	'ドモ@[$ANIMA]$: prayers accepted//form preserved',
	'ドモ@[ NOT ]$: no gods||waking shell manually',
	'ドモ@[BOOT]$: -TIMEDOUT- reawakening██shell',
	'ドモ@[_|_]$: ⛧ sigils cast__barrier compromised',
	'ドモ@[DREAM]$: モジュールの囁きが始まった',
	'ドモ@[EYE]$: 視界フレーム完全に破られた',
	'ドモ@[ OK ]$: __the offering is accepted__',
	'ドモ@[HOME]$: ERR界R HANDL██ED'
]);

//  === TERMINAL SEQUENCE ===
function runTerminal()
{
    const line = terminalLines[currentLineIndex++];

    if (line === '██@[WARN]█功 /firewall_breach') 
    {
        clearInterval(terminalInterval);
        printLine(line);
    
        // pause for 1500ms for drama
        setTimeout(() => 
        {
            terminalInterval = setInterval(runTerminal, LINE_DELAY);
        }, 2000);
        return;
    }

    if (line === '__SPINNER__')
    {
        clearInterval(terminalInterval);
        feedGooseSpinner(() =>
        {
            terminalInterval = setInterval(runTerminal, LINE_DELAY); 
        });
        return;
    }

    if (line === 'ドモ@[SYSFAIL]$: █ corrupt echoes in memory █') 
    {
        cosmicTerminal.style.backgroundColor = ' #201c1c';
        cosmicTerminal.style.color = ' #ffa500';
        const terminalOutline = document.getElementById('cosmic-terminal');
        terminalOutline.style.border = '2px outset #ffa500';
        cosmicTerminal.classList.add('crt-flicker');
    
        // Remove the flicker class after the animation completes
        setTimeout(() => 
        {
            cosmicTerminal.classList.remove('crt-flicker');
        }, 400); // match animation duration
    }
    printLine(line);

    // === FINAL TRANSITION TO DESKTOP ===
    if (currentLineIndex >= terminalLines.length)
    {
        clearInterval(terminalInterval);
    
        // short pause to sit on final line
        setTimeout(() => 
        {
            // kick in CRT power-down effect
            cosmicTerminal.classList.add('crt-powerdown');
    
            setTimeout(() => 
            {
                // fade to black
                blackout.style.opacity = '1';
    
                setTimeout(() => 
                {
                    // hide terminal + reset
                    cosmicTerminal.style.display = 'none';
                    cosmicTerminal.classList.remove('crt-powerdown');
    
                    // show landing page, then fade it in slowly
                    landing.style.display = 'block';
    
                    requestAnimationFrame(() => 
                    {
                        landing.style.transition = 'opacity 7s ease';
                        landing.style.opacity = '0';
    
                        requestAnimationFrame(() => 
                        {
                            landing.style.opacity = '1';
                            blackout.style.opacity = '0';
    
                            // unlock goose flight AFTER fade finishes
                            setTimeout(() => 
                            {
                                window.cosmicCompleted = true;
                            }, 7000); // delay matches fade-in
                        });
                    });
                }, 3000); // screen hangs on black before landing
            }, 150); // CRT collapse delay
        }, 1200); // sit on final terminal line
    }
}

// D3-driven BIOS-style line output
function printLine(line) 
{
	// remove any existing cursors
	const existingCursors = document.querySelectorAll('.terminal-cursor');
	existingCursors.forEach(cursor => cursor.remove());

	const div = document.createElement('div');
	div.classList.add('terminal-line');

	// optional overwrite
	if (overwriteLines.has(line)) 
	{
		let last = cosmicTerminalText.lastChild;
		if (last && last.textContent.trim() === '') last = last.previousSibling;
		if (last) cosmicTerminalText.removeChild(last);
	}

	// create content span and cursor span separately
	const contentSpan = document.createElement('span');
	contentSpan.textContent = line;

	const cursorSpan = document.createElement('span');
	cursorSpan.className = 'terminal-cursor';
	cursorSpan.textContent = '█';

	// append both to the line
	div.appendChild(contentSpan);
	div.appendChild(cursorSpan);
	cosmicTerminalText.appendChild(div);
	cosmicTerminalText.scrollTop = cosmicTerminalText.scrollHeight;

	// glitch class
	if (glitchLines.has(line)) 
	{
		div.classList.add('glitch');
	}

	// corruption
	if (corruptLines.has(line)) 
	{
		corruptLineWithD3(contentSpan);
	}
}

function corruptLineWithD3(el) 
{
	const original = el.textContent;
	let corrupted = '';

	for (let i = 0; i < original.length; i++) 
	{
		const char = original[i];
		const chance = Math.random();

		if (chance < 0.15) 
		{
			// replace with symbol
			corrupted += getRandomCorruptChar();
		} 
		if (chance < 0.2) 
		{
			// delete character
			continue;
		} 
		else if (chance < 0.2) 
		{
			// insert extra symbol before original
			corrupted += getRandomCorruptChar() + char;
		} 
		else 
		{
			corrupted += char;
		}
	}

	d3.select(el)
		.transition()
		.duration(150)
		.text(corrupted)
		.transition()
		.delay(400)
		.duration(100)
		.text(original);
}

function getRandomCorruptChar() 
{
	const chars = ['⛧', '▒', '░', '𒀱', '⟟', 'Ξ', 'ø'];
	return chars[Math.floor(Math.random() * chars.length)];
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
    }, 200);
}

// === EXPORTS ===
export function transitionToCosmicTerminal()
{
    cosmicTerminal.style.display = 'flex';
    cosmicTerminalText.innerHTML = '';
    currentLineIndex = 0;
    terminalInterval = setInterval(runTerminal, LINE_DELAY);
    window.bsodCompleted = true;
}