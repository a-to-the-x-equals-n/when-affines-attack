const promptText = 'Press any key to continue ';
const colors = ['red', 'orange', 'yellow', '#2ef70a', '#15d8ed', '#ed15db', 'violet'];

const rainbowPrompt = document.getElementById('pressPrompt');
const bsodText = document.getElementById('bsod-text');
const site = document.getElementById('site');
const bsod = document.getElementById('bsod-overlay');
const bsodHeading = document.getElementById('bsod-heading');
const terminalText = document.getElementById('terminal-text');


let hasStarted = false;

console.log('bsod.js loaded');

function drawRainbowText(text)
{
    rainbowPrompt.innerHTML = '';

    for (let i = 0; i < text.length; i++)
    {
        const span = document.createElement('span');
        span.textContent = text[i];
        span.style.color = colors[i % colors.length];
        rainbowPrompt.appendChild(span);
    }
}

drawRainbowText(promptText);


// =======================
//  STYLING RULES
// =======================

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

const lines = [
    'ドモ@[BOOT]$: Reboot Initialized',
    'ドモ@[VEIL]$: --unearth',
    'ドモ@[ECHO]$: >>signal received from beyond ███',
    'ドモ@[_視覚-]$: the black sun opens one eye',
    'ドモ@[_ROOT_]$: 魂リンク成功 — dream-layer locked.',
    'ドモ@[-GATE-]$: breach stabilized at offset ∆-66',
    'ドモ@[SYSFAIL]$: █ corrupt echoes in memory █',
    '__SPINNER__',
    'ドモ@[ OK ]$: ##oldgods-handshake-init',
    'ドモ@[NOT]$: 視覚層ロード完了 — the hunger.',
    'ドモ@[WARN]$: >>onlyhunger',
    'ドモ@[MSDOS]$: Goose 核心モジュール 起動中...',
    'ドモ@[_視覚-]$: <<binding_soul_to_shell>>',
    'ドモ@_dark_$: 視覚層ロード完了 — unremebered>>',
    'ドモ@[ OK ]$: goose host sync: 𝚫 nominal',
    'ドモ@[$ANIMA]$: prayers accepted//form preserved.',
    'ドモ@[ NOT ]$: no gods||waking shell manually',
    'ドモ@[BOOT]$: -TIMEDOUT- reawakening ██ shell',
    'ドモ@[_|_]$: ⛧ sigils cast. barrier compromised.',
    'ドモ@[DREAM]$: モジュールの囁きが始まった',
    'ドモ@[EYE]$: 視界フレーム完全に破られた',
    'ドモ@[ OK ]$: __the offering is accepted__',
    'ドモ@[DREAM]$: モジュールの囁きが始まった',
    'ドモ@[EYE]$: 視界フレーム完全に破られた',
    'ドモ@[HOME]$: redirecting'
];

let index = 0;
let interval = null;


// =======================
//  EVENT: PRESS KEY
// =======================

window.addEventListener('keydown', () =>
{
    if (hasStarted) return;
    hasStarted = true;

    // hide the bsod-text and prompt
    bsodText.style.display = 'none';
    rainbowPrompt.style.display = 'none';
    terminalText.style.display = 'block';
    terminalText.innerHTML = '';
    bsodHeading.innerHTML = '';
    bsodHeading.style.display = 'none'; // ← hide the whole gray Windows tag

    bsod.style.alignItems = 'flex-start';
    bsod.style.justifyContent = 'flex-start';

    bsodText.style.textAlign = 'left';
    bsodText.style.padding = '20px';
    bsodText.style.maxWidth = '700px';
    bsodText.style.fontSize = '24px';

    interval = setInterval(handlePrint, 1200);
});


// =======================
//  - PRINT LINES -
// =======================

function handlePrint()
{
    const line = lines[index++];

    if (line === '__SPINNER__')
    {
        clearInterval(interval);
        runSpinner(() =>
        {
            interval = setInterval(printLine, 1200);
        });
    }
    else
    {
        printLineContent(line);
    }
}

function printLine()
{
    if (index >= lines.length)
    {
        clearInterval(interval);

        bsod.style.transition = 'opacity 1s ease';
        bsod.style.opacity = '0';

        setTimeout(() =>
        {
            bsod.style.display = 'none';
            document.getElementById('cosmic-terminal').style.display = 'block';
            site.style.opacity = '0';

            requestAnimationFrame(() =>
            {
                site.style.transition = 'opacity 1s ease';
                site.style.opacity = '1';
            });

        }, 2000);

        return;
    }

    const nextLine = lines[index++];
    printLineContent(nextLine);
}

function printLineContent(line)
{
    const div = document.createElement('div');
    div.textContent = line;
    div.classList.add('cyberline');

    if (glitchLines.has(line)) div.classList.add('glitch');

    if (overwriteLines.has(line))
    {
        let last = bsodText.lastChild;
        if (last && last.textContent.trim() === '')
        {
            last = last.previousSibling;
        }
        if (last) bsodText.removeChild(last);
    }

    terminalText.appendChild(div);
}


// =======================
//  - SPINNER
// =======================

function runSpinner(done)
{
    const spinChars = ['/', '-', '\\'];
    let spinIndex = 0;
    let cycles = 0;

    const spinnerDiv = document.createElement('div');
    spinnerDiv.textContent = 'Feeding geese... /';
    spinnerDiv.classList.add('cyberline');
    bsodText.appendChild(spinnerDiv);

    const spin = setInterval(() =>
    {
        spinnerDiv.textContent = '\tFeeding geese... ' + spinChars[spinIndex];
        spinIndex = (spinIndex + 1) % spinChars.length;
        cycles++;

        if (cycles >= 12)
        {
            clearInterval(spin);
            spinnerDiv.textContent = '\tGooses fed...';
            if (done) done();
        }
    }, 300);
}
