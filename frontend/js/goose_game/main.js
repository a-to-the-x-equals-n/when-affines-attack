import { badguys, createBadguy, spawnManager } from './badguy.js';
import { goose, getGooseRect, applyMatrixToGoose } from './goose.js';
import { drawLives, info, takeLife } from './info.js';

const display = document.querySelector('.display');
const keys = {};

export let gameOver = false;
let activeMatrix = null;
let gooseX = 0, gooseY = 0;

// listen for keyboard input
window.addEventListener('keydown', e => { keys[e.key] = true; });
window.addEventListener('keyup', e => { keys[e.key] = false; });


function update()
{
    if (gameOver) return;

    // get user input
    // (arrow keys or wasd)
    let dx = 0, dy = 0;
    if (keys['ArrowUp'] || keys['w'] || keys['W'])    dy -= 3;
    if (keys['ArrowDown'] || keys['s'] || keys['S'])  dy += 3;
    if (keys['ArrowLeft'] || keys['a'] || keys['A'])  dx -= 3;
    if (keys['ArrowRight'] || keys['d'] || keys['D']) dx += 3;

    // if transformed, warp the movement vector
    if (activeMatrix) 
    {
        [dx, dy] = transformUserInput(dx, dy, activeMatrix);
    }

    gooseX += dx;
    gooseY += dy;
    
    // get current positions and sizes of '.display' and '#goose"
    let gooseRect = getGooseRect();
    let displayRect = display.getBoundingClientRect();

    // calculate goose position relative to the display box
    let X = gooseRect.left - displayRect.left;
    let Y = gooseRect.top  - displayRect.top;

    // get visual size of the goose
    let gooseWidth  = gooseRect.width;
    let gooseHeight = gooseRect.height;

    // set movement boundaries based on display box
    let maxX = display.clientWidth - gooseWidth;
    let maxY = display.clientHeight - gooseHeight;

    // clamp position to stay within display box
    gooseX = Math.min(Math.max(gooseX, 0), maxX);
    gooseY = Math.min(Math.max(gooseY, 0), maxY);

    // update goose position
    goose.style.left = gooseX + 'px';
    goose.style.top = gooseY + 'px';

    // update coordinate display
    let centerX = display.clientWidth  / 2;
    let centerY = display.clientHeight / 2;
    let relativeX = Math.round(X - centerX);
    let relativeY = Math.round(centerY - Y);

    info(relativeX, relativeY)

    for (let i = 0; i < badguys.length; i++)
    {
        const badguy = badguys[i];
        const badguyRect = document.getElementById(badguy.getId()).getBoundingClientRect();

        badguy.update();

        if(checkCollision(gooseRect, badguyRect))
        {
            console.log('collision!');
    
            // get the matrix from badguy
            const matrix = badguy.getMatrix();  
            gooseX, gooseY = applyMatrixToGoose(gooseX, gooseY, matrix);
            activeMatrix = matrix;     
            
            // remove from DOM and internal array
            badguy.destroy();

            if (takeLife()) 
            {
                gameOver = true;
                document.getElementById('gameOverMessage').style.display = 'block';
            }

            // stop checking after first collision
            break;
        }
    }
    requestAnimationFrame(update);
}

function checkCollision(rectA, rectB)
{
    return !(
        rectA.right-20 < rectB.left  ||
        rectA.left   > rectB.right-22||
        rectA.bottom-20 < rectB.top   ||
        rectA.top    > rectB.bottom-9
    );
}


// ==========================
//  - TRANSFORM USER INPUT -
// ==========================
function transformUserInput(dx, dy, matrix)
{
    const a = matrix[0][0];
    const b = matrix[1][0];
    const c = matrix[0][1];
    const d = matrix[1][1];

    // apply 2x2 linear transform to input vector
    const newX = dx * a + dy * c;
    const newY = dx * b + dy * d;

    return [newX, newY];
}


const gooseRect = getGooseRect();
gooseX = (display.clientWidth  - gooseRect.width)  / 2;
gooseY = (display.clientHeight - gooseRect.height) / 2;
goose.style.left = gooseX + 'px';
goose.style.top  = gooseY + 'px';
const bg = createBadguy(display)
drawLives();
spawnManager(display);
update();