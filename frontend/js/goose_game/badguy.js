import { gameOver } from "./main.js";
export let totalBadguys = 0;
const MAXBAD = 15;
export const badguys = [];
let firstSpawn = false;

export function createBadguy(display) 
{
    const badguy = document.createElement('div');
    const matrix = generateTransformMatrix();

    const id = `badguy${totalBadguys}`;
    badguy.id = id;

    badguy.style.position = 'absolute';
    badguy.style.color = 'white';
    badguy.style.fontFamily = 'monospace';
    badguy.style.whiteSpace = 'pre';
    badguy.style.padding = '6px';

    badguy.textContent = matrixToString(matrix);
    display.appendChild(badguy);

    totalBadguys++;

    const w  = 80;
    const h = 50;

    const MAX_X = display.clientWidth  - w;
    const MAX_Y = display.clientHeight - h;

    let x, y;

    if (firstSpawn)
    {
        [x, y] = initialSpawn(display, w, h);
        firstSpawn = false;
    }
    else
    {
        x = Math.random() * MAX_X;
        y = Math.random() * MAX_Y;
    }

    // clamp to within bounds
    x = Math.max(0, Math.min(x, MAX_X));
    y = Math.max(0, Math.min(y, MAX_Y));
    
    // random direction vector
    const angle = Math.random() * Math.PI * 2;
    let vx = Math.cos(angle);
    let vy = Math.sin(angle);

    // const speed = 1.5;
    // const speed = Math.random() * 1.0 + 1.0
    const speed = (Math.random() + 1.0) * 3.0;

    function update() 
    {
        // update position
        x += vx * speed;
        y += vy * speed;

        const width = badguy.offsetWidth || 50;
        const height = badguy.offsetHeight || 50;
        const maxX = display.clientWidth - width;
        const maxY = display.clientHeight - height;

        // bounce off left/right edges
        if (x <= 0 || x >= maxX) vx *= -1;

        // bounce off top/bottom edges
        if (y <= 0 || y >= maxY) vy *= -1;

        // apply new position to element
        badguy.style.left = x + 'px';
        badguy.style.top = y + 'px';
    }

    function destroy() 
    {
        badguy.remove();
        totalBadguys--;
        const i = badguys.indexOf(badguyObj);
        if (i !== -1) badguys.splice(i, 1);
    }

    const badguyObj = { update, getMatrix: () => matrix, destroy, getId: () => id };
    badguys.push(badguyObj)
    return badguyObj
}

function initialSpawn(display, w, h)
{
    const maxX = display.clientWidth  - width;
    const maxY = display.clientHeight - height;

    let x = Math.random() * maxX;
    let y = Math.random() * maxY;

    const centerX = display.clientWidth  / 2;
    const centerY = display.clientHeight / 2;

    if (x > centerX - 100 && x < centerX + 100) x = centerX + 120;
    if (y > centerY - 100 && y < centerY + 100) y = centerY + 120;

    return [x, y];
}

export function spawnManager(display)
{
    setInterval(() =>
    {
        if (totalBadguys < MAXBAD && !gameOver)
        {
            createBadguy(display)
        }
    }, 3000);
}

// =======================
//  - MATRIX GENERATION -
// =======================
function generateTransformMatrix() 
{
    const angle = Math.random() * Math.PI * 2;          // random rotation
    const scaleX = Math.random() * 1.5 + 0.5;           // scale between 0.5–2.0
    const scaleY = Math.random() * 1.5 + 0.5;

    const skewX = Math.random() * 0.5 - 0.25;           // skew -0.25 to 0.25
    const skewY = Math.random() * 0.5 - 0.25;

    const tx = Math.floor(Math.random() * 100 - 50);    // translate -50 to 50
    const ty = Math.floor(Math.random() * 100 - 50);

    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    const a = scaleX * cos;
    const b = scaleY * sin + skewY;
    const c = -scaleX * sin + skewX;
    const d = scaleY * cos;

    return [
        [ a,  c,  tx ],
        [ b,  d,  ty ],
        [ 0,  0,   1 ]
    ];
}

function matrixToString(matrix) 
{
    // format to 2 decimal places
    // pad to 6 spaces
    const f_matrix = matrix.map(row => row.map(n => Number(n).toFixed(2).padStart(6, ' ')));

    // join rows with spaces and wrap in brackets
    return f_matrix.map(row => `[${row.join(' ')}]`).join('\n');
}