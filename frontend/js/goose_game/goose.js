export const goose = document.getElementById('goose');

export function getGooseRect()
{
    return goose.getBoundingClientRect();
}

export function getGoose()
{
    return document.getElementById('goose');
}

// ==========================================
//  - APPLY VISUAL TRANSFORMATION TO GOOSE -
// ==========================================
export function applyMatrixToGooseVisual(matrix) 
{
    const [a, c, tx] = matrix[0];
    const [b, d, ty] = matrix[1];
    goose.style.transform = `matrix(${a}, ${b}, ${c}, ${d}, ${tx}, ${ty})`;
}


// ======================================================
//  - APPLY POSITIONAL SHIFT TO GOOSE -
// ======================================================
export function applyMatrixToGoosePosition(gooseX, gooseY, matrix) 
{
    const tx = matrix[0][2];
    const ty = matrix[1][2];

    gooseX += tx;
    gooseY += ty;

    goose.style.left = gooseX + 'px';
    goose.style.top  = gooseY + 'px';

    return gooseX, gooseY
}

export function applyMatrixToGoose(gooseX, gooseY, matrix)
{
    applyMatrixToGooseVisual(matrix);     // transform how goose looks
    return applyMatrixToGoosePosition(gooseX, gooseY, matrix);   // move goose by matrix translation
}