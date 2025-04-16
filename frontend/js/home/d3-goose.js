// wait for bsod and cosmic terminal to complete
function startD3Flyby() 
{
	const svg = d3.select("#sky");

	// add goose image (off-screen initially)
	const goose = svg.append("image")
		.attr("href", "./assets/icons/fairygoose.png")
		.attr("width", 120)
		.attr("height", 120)
		.attr("x", -150)
		.attr("y", Math.random() * window.innerHeight)
		.style("opacity", 0);

	// trigger the flyby
	function flyByGoose() 
	{
		const startY = Math.random() * (window.innerHeight - 100);
		const duration = 3000 + Math.random() * 2000;

		goose
			.attr("x", -150)
			.attr("y", startY)
			.style("opacity", 1)
			.transition()
			.duration(duration)
			.ease(d3.easeLinear)
			.attr("x", window.innerWidth + 150)
			.style("opacity", 0);
	}

	// recursively trigger at random intervals
	function randomizeFlyby() 
	{
		flyByGoose();
		const nextFly = 10000 + Math.random() * 10000;
		setTimeout(randomizeFlyby, nextFly);
	}

	randomizeFlyby();
}

// launch when cosmic and bsod both complete
if (window.bsodCompleted && window.cosmicCompleted) 
{
	startD3Flyby();
} 
else 
{
	const checkReady = setInterval(() => 
	{
		if (window.bsodCompleted && window.cosmicCompleted) 
		{
			clearInterval(checkReady);
			startD3Flyby();
		}
	}, 100);
}
