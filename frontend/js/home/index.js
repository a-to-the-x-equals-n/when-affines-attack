
document.addEventListener('DOMContentLoaded', function () 
{
    const startButton = document.getElementById('start-button');
    const startMenu = document.getElementById('start-menu');

    let hoverTimeout;

    function openMenu() 
    {
        startMenu.classList.remove('hidden');

        setTimeout(() => 
        {
            startMenu.classList.add('visible');
        }, 10);
    }

    function closeMenu() 
    {
        startMenu.classList.remove('visible');

        // wait for fade-out before hiding
        setTimeout(() => 
        {
            if (!startMenu.classList.contains('visible')) 
            {
                startMenu.classList.add('hidden');
            }
        }, 150); // slight delay for user forgiveness
    }

    function scheduleMenuClose() 
    {
        hoverTimeout = setTimeout(closeMenu, 150);
    }

    function cancelMenuClose() 
    {
        clearTimeout(hoverTimeout);
    }

    startButton.addEventListener('click', openMenu);
    startButton.addEventListener('mouseenter', cancelMenuClose);
    startButton.addEventListener('mouseleave', scheduleMenuClose);
    startMenu.addEventListener('mouseenter', cancelMenuClose);
    startMenu.addEventListener('mouseleave', scheduleMenuClose);
});


// NAV TO GOOSE PAGE
document.addEventListener('DOMContentLoaded', function () 
{
    const gameButton = document.querySelector('[data-label = "game"]');

    gameButton.addEventListener('click', function () 
    {
        window.location.href = 'pages/goose.html';
    });
});

// NAV TO GOOSE PAGE
document.addEventListener('DOMContentLoaded', function () 
{
    const gameButton = document.querySelector('[data-label = "vibes"]');

    gameButton.addEventListener('click', function () 
    {
        window.location.href = 'pages/vibes.html';
    });
});


// BACKGROUND IMAGE 
document.addEventListener('DOMContentLoaded', function () 
{
    const overlay = document.getElementById('click-overlay');

    document.addEventListener('mousedown', function (e) 
    {
        if (e.target.closest('.brutal-button') || (e.target.closest('.start-button'))) 
        {
            overlay.style.display = 'block';
        }
    });

    document.addEventListener('mouseup', function () 
    {
        overlay.style.display = 'none';
    });

    // Optional: Hide image if user leaves the window while holding
    window.addEventListener('blur', function () 
    {
        overlay.style.display = 'none';
    });
});
