import { totalBadguys } from './badguy.js';

export let lives = 3;
const livesContainer = document.getElementById('lives');
const startTime = performance.now();

const heartSVG = `
<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
  <rect x="5" y="0" width="2" height="2" fill="red"/>
  <rect x="9" y="0" width="2" height="2" fill="red"/>

  <rect x="4" y="2" width="2" height="2" fill="red"/>
  <rect x="6" y="2" width="4" height="2" fill="red"/>
  <rect x="10" y="2" width="2" height="2" fill="red"/>

  <rect x="3" y="4" width="2" height="2" fill="red"/>
  <rect x="5" y="4" width="6" height="2" fill="red"/>
  <rect x="11" y="4" width="2" height="2" fill="red"/>

  <rect x="4" y="6" width="8" height="2" fill="red"/>
  <rect x="5" y="8" width="6" height="2" fill="red"/>
  <rect x="6" y="10" width="4" height="2" fill="red"/>
  <rect x="7" y="12" width="2" height="2" fill="red"/>
</svg>
`;


export function takeLife()
{
    if (lives <= 0) 
    {
        return true;
    }
    else
    {
        lives--;
        drawLives();
        return false;
    }
}

export function drawLives()
{
    
    livesContainer.innerHTML = '';
    
    for (let i = 0; i < lives; i++)
    {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = heartSVG.trim();
        const heart = wrapper.firstChild;
        heart.style.width = '32px';
        heart.style.height = '32px';
        livesContainer.appendChild(heart);
    }
}

export function info(x, y)
{
    const now = performance.now();
    const elapsed = now - startTime;

    const totalMs = Math.floor(elapsed);
    const h = String(Math.floor(totalMs / 3600000)).padStart(2, '0');
    const m = String(Math.floor((totalMs % 3600000) / 60000)).padStart(2, '0');
    const s = String(Math.floor((totalMs % 60000) / 1000)).padStart(2, '0');
    const ms = String(totalMs % 1000).padStart(3, '0');

    const timeString = `${h}:${m}:${s}.${ms}`;
    document.getElementById('info').textContent = `coordinates: ${x}, ${y}\ntime: ${timeString}\nmatrices: ${totalBadguys}`;
}