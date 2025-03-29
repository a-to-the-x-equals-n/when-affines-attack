
let players = {};
let currentIndex = 0;
const channels = ["vaporwave", "lofi", "retro"];
let tvIsOn = false; 
const videoIds = {vaporwave: "G1flq8LKkzk", lofi: "BrnDlRmW5hs", retro: "MxGJCjNa-80"};
let tvLoopPlayer = null;




function onYouTubeIframeAPIReady() 
{
    console.log("YouTube IFrame API is ready.");

    tvLoopPlayer = new YT.Player("tv-loop-bg", 
    {
        videoId: "YKOfHZReZEs",
        playerVars: 
        {
            autoplay: 1,
            mute: 1,
            controls: 0,
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
            start: 10,
            end: 213
        },
        events: 
        {
            onReady: (event) => 
            {
                event.target.pauseVideo(); // don’t play until powerOn
            },
            onStateChange: (event) => 
            {
                if (event.data === YT.PlayerState.ENDED) 
                {
                    event.target.seekTo(10);
                    event.target.playVideo();
                }
            }
        }
    });

    channels.forEach((channel) => 
    {
        players[channel] = new YT.Player(`channel-${channel}`, 
        {
            videoId: videoIds[channel],
            playerVars: 
            {
                autoplay: 1,
                mute: 1,
                controls: 0,
                modestbranding: 1,
                rel: 0,
                showinfo: 0
            },
            events: 
            {
                onReady: (event) => 
                {
                    if (channel !== channels[currentIndex]) 
                    {
                        event.target.pauseVideo();
                    }
                }
            }
        });
    });

    const dial = document.getElementById("channel-dial");
    const label = document.getElementById("tv-channel-label");
    const powerBtn = document.getElementById("power-dial");

    powerBtn.addEventListener("click", function () 
    {
        if (!tvIsOn) 
        {
            powerOn(label);
        } 
        else 
        {
            powerOff(players); 
        }
    });


    dial.addEventListener("click", function () 
    {
        if (!tvIsOn) return;

        // pause current
        players[channels[currentIndex]].pauseVideo();

        // next channel
        currentIndex = (currentIndex + 1) % channels.length;
        const currentChannel = channels[currentIndex];

        // play new one 
        players[currentChannel].playVideo();
        players[currentChannel].unMute();

        // label
        label.textContent = currentChannel;
        label.style.opacity = "1";

        setTimeout(() => 
        {
            label.style.opacity = "0";
        }, 3000); 
    });
}


function powerOn(label) 
{
    tvIsOn = true;
    toggleTvScreen(true); // hide the screen visuals

    if (tvLoopPlayer) 
    {
        tvLoopPlayer.seekTo(10);
        tvLoopPlayer.playVideo();
    }
    

    // Unhide label
    label.textContent = channels[currentIndex];
    label.style.opacity = "1";

    setTimeout(() => 
    {
        label.style.opacity = "0";
    }, 3500); 

    // start the first video
    const currentChannel = channels[currentIndex];
    players[currentChannel].playVideo();
    players[currentChannel].unMute();
}




function powerOff(players) 
{
    // optional: pause all players, fade screen, etc.
    tvIsOn = false;
    console.log("TV turned off.");

    toggleTvScreen(false); // hide the screen visuals

    // Pause and mute all videos
    for (let key in players) 
    {
        players[key].pauseVideo();
        players[key].mute();
    }

    // Clear the channel label
    const label = document.getElementById("tv-channel-label");
    label.textContent = "";
}



function toggleTvScreen(on) 
{
    const tvScreen = document.querySelector(".tv-screen");
    const loopVideo = document.getElementById("tv-loop-bg");

    // Toggle the screen container visibility
    tvScreen.style.opacity = on ? "1" : "0";
    tvScreen.style.pointerEvents = on ? "auto" : "none";

    // how/hide the background video element itself
    loopVideo.style.display = on ? "block" : "none";

    // control background video playback
    if (tvLoopPlayer) 
    {
        if (on) 
        {
            tvLoopPlayer.seekTo(10);
            tvLoopPlayer.playVideo();
        } 
        else 
        {
            tvLoopPlayer.pauseVideo();
        }
    }
}


// Load YouTube IFrame API
const tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
document.head.appendChild(tag);