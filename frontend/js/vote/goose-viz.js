// js/vote/goose-viz.js
class GooseViz {
    constructor() {
        this.initMeter();
        this.bindToButtons();
    }

    initMeter() {
        const svg = d3.select("#goose-meter svg")
            .append("g")
            .attr("transform", "translate(100, 60)");

        // Goose body
        svg.append("circle")
            .attr("r", 30)
            .attr("fill", "#ffcc00");

        // Neck (will animate)
        this.neck = svg.append("rect")
            .attr("x", -5)
            .attr("y", -30)
            .attr("width", 10)
            .attr("height", 30)
            .attr("fill", "#ffcc00");

        // Head
        svg.append("circle")
            .attr("cx", 0)
            .attr("cy", -60)
            .attr("r", 15)
            .attr("fill", "#ffcc00");
    }

    bindToButtons() {
        document.getElementById("thumbsUpBtn")?.addEventListener("click", () => {
            this.neck.transition().attr("height", 50); // Neck stretches
            this.spawnGoose("🦆");
        });

        document.getElementById("thumbsDownBtn")?.addEventListener("click", () => {
            this.neck.transition().attr("height", 10); // Neck squashes
            this.spawnGoose("💢");
        });
    }

    spawnGoose(emoji) {
        const goose = document.createElement("div");
        goose.className = "flying-goose";
        goose.textContent = emoji;
        goose.style.left = `${Math.random() * 50}%`;
        document.getElementById("flying-geese").appendChild(goose);
        
        setTimeout(() => goose.remove(), 2000);
    }
}

// Start when DOM is ready
document.addEventListener("DOMContentLoaded", () => new GooseViz());