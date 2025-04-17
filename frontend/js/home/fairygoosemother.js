// === DOM REFERENCES ===
const svg = d3.select("#sky");
const goose = svg.append("image")
    .attr("width", 280)
    .attr("height", 280)
    .style("opacity", 0);

// === IMAGE TRACKING STATE ===
let allGooseImages = [];
let usedGooseImages = new Set();
let gooseImgUrl = "./assets/icons/fairygoose.png"; // fallback

// === FETCH RANDOM IMAGE FROM BACKEND ===
function nextGoose() 
{
    return new Promise((resolve) => 
    {
        $.getJSON("http://localhost:8003/images")
            .done(function (data) 
            {
                allGooseImages = data.images || [];

                // filter out used
                const available = allGooseImages.filter(img => !usedGooseImages.has(img.id));

                // reset if used all
                if (available.length === 0) 
                {
                    usedGooseImages.clear();
                    resolve(nextGoose()); // recurse after reset
                    return;
                }

                // pick random
                const rand = Math.floor(Math.random() * available.length);
                const selected = available[rand];

                usedGooseImages.add(selected.id);
                resolve(selected.image);
            })
            .fail(function (jqXHR, textStatus, errorThrown) 
            {
                console.warn("Could not fetch goose image:", textStatus, errorThrown);
                resolve(gooseImgUrl); // fallback
            });
    });
}

// === POSITION CALCULATOR ===
function getEdge(edge)
{
    const pad = 150;
    const edges = [
        { x: -pad, y: Math.random() * window.innerHeight },                     // west
        { x: Math.random() * window.innerWidth, y: -pad },                      // north
        { x: window.innerWidth + pad, y: Math.random() * window.innerHeight },  // east
        { x: Math.random() * window.innerWidth, y: window.innerHeight + pad }   // south
    ];
    return edges[edge];
}

// === FLYBY SEQUENCE ===
function startFlapping() 
{
    nextGoose().then((imgUrl) => 
    {
        const isHorizontal = Math.random() > 0.5;
        const startEdge = isHorizontal ? (Math.random() > 0.5 ? 0 : 2) : (Math.random() > 0.5 ? 1 : 3);
        const endEdge = startEdge % 2 === 0 ? 2 - startEdge : 4 - startEdge;
        const startPos = getEdge(startEdge);
        const endPos = getEdge(endEdge);

        goose
            .attr("href", imgUrl)
            .attr("x", startPos.x)
            .attr("y", startPos.y)
            .style("opacity", 1)
            .transition()
            .duration(3000 + Math.random() * 5000)
            .ease(d3.easeLinear)
            .attr("x", endPos.x)
            .attr("y", endPos.y)
            .style("opacity", 0)
            .on("end", () => setTimeout(startFlapping, 3000 + Math.random() * 7000));
    });
}

// === WAIT UNTIL READY ===
if (window.bsodCompleted && window.cosmicCompleted) 
{
    startFlapping();
} 
else 
{
    const checkReady = setInterval(() => 
    {
        if (window.bsodCompleted && window.cosmicCompleted) 
        {
            clearInterval(checkReady);
            startFlapping();
        }
    }, 100);
}
