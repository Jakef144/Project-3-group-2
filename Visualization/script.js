// Load the JSON data
const dataUrl = 'employment_metrics_chart_data.json';

// Set up the SVG canvas dimensions
const margin = { top: 60, right: 150, bottom: 150, left: 120 };
const width = 1000 - margin.left - margin.right;
const height = 700 - margin.top - margin.bottom;

const svg = d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Load the data from the JSON file
d3.json(dataUrl).then(data => {
    // Sort data by the highest 2025 Projected Employment
    data.sort((a, b) => b.projected_quarter_employment_estimate - a.projected_quarter_employment_estimate);

    // Prepare the data for grouped bars
    const metrics = [
        "2023 Employment",
        "2025 Projected Employment"
    ];

    const industryCategories = data.map(d => d.industry_category);

    const x0 = d3.scaleBand()
        .domain(industryCategories)
        .range([0, width])
        .padding(0.2);

    const x1 = d3.scaleBand()
        .domain(metrics)
        .range([0, x0.bandwidth()])
        .padding(0.05);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => Math.max(
            d.base_quarter_employment_estimate,
            d.projected_quarter_employment_estimate
        ))])
        .nice()
        .range([height, 0]);

    const color = d3.scaleOrdinal()
        .domain(metrics)
        .range(["#1f77b4", "#ff7f0e"]);

    // Add the x-axis
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x0))
        .selectAll("text")
        .style("text-anchor", "end")
        .style("font-size", "10px")
        .attr("dx", "-0.8em")
        .attr("dy", "0.15em")
        .attr("transform", "rotate(-45)");

    // Add the y-axis
    svg.append("g")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("x", -height / 2)
        .attr("y", -margin.left + 40)
        .attr("transform", "rotate(-90)")
        .attr("fill", "black")
        .style("text-anchor", "middle")
        .text("Employment Metrics (Number of Employees)");

    // Add background gridlines
    svg.append("g")
        .attr("class", "grid")
        .call(d3.axisLeft(y)
            .tickSize(-width)
            .tickFormat("")
        )
        .selectAll("line")
        .style("stroke", "#ddd")
        .style("stroke-dasharray", "2,2");

    // Add bars
    svg.append("g")
        .selectAll("g")
        .data(data)
        .join("g")
        .attr("transform", d => `translate(${x0(d.industry_category)}, 0)`)
        .selectAll("rect")
        .data(d => [
            { key: "2023 Employment", value: Math.round(d.base_quarter_employment_estimate), category: d.industry_category },
            { key: "2025 Projected Employment", value: Math.round(d.projected_quarter_employment_estimate), category: d.industry_category }
        ])
        .join("rect")
        .attr("x", d => x1(d.key))
        .attr("y", d => y(d.value))
        .attr("width", x1.bandwidth())
        .attr("height", d => height - y(d.value))
        .attr("fill", d => color(d.key))
        .on("mouseover", (event, d) => {
            const tooltip = d3.select("body")
                .append("div")
                .attr("class", "tooltip")
                .style("position", "absolute")
                .style("background", "#fff")
                .style("border", "1px solid #ccc")
                .style("padding", "5px")
                .style("border-radius", "3px")
                .style("pointer-events", "none")
                .style("opacity", 0.9);

            tooltip.html(`
                <strong>Category:</strong> ${d.category}<br>
                <strong>Metric:</strong> ${d.key}<br>
                <strong>Employees:</strong> ${d.value}
            `)
                .style("left", `${event.pageX + 5}px`)
                .style("top", `${event.pageY - 28}px`);
        })
        .on("mouseout", () => {
            d3.select(".tooltip").remove();
        })
        .on("click", (event, d) => {
            d3.selectAll("rect")
                .style("stroke", "none")
                .style("stroke-width", "0");

            d3.select(event.target)
                .style("stroke", "black")
                .style("stroke-width", "2px");

            const details = d3.select("#details");
            if (details.empty()) {
                d3.select("body").append("div")
                    .attr("id", "details")
                    .style("position", "absolute")
                    .style("top", "20px")
                    .style("right", "20px")
                    .style("background", "#f9f9f9")
                    .style("border", "1px solid #ccc")
                    .style("padding", "10px")
                    .style("border-radius", "5px")
                    .style("box-shadow", "0 0 10px rgba(0,0,0,0.1)")
                    .html(`
                        <h3>Details</h3>
                        <p><strong>Category:</strong> ${d.category}</p>
                        <p><strong>Metric:</strong> ${d.key}</p>
                        <p><strong>Employees:</strong> ${d.value}</p>
                    `);
            } else {
                details.html(`
                    <h3>Details</h3>
                    <p><strong>Category:</strong> ${d.category}</p>
                    <p><strong>Metric:</strong> ${d.key}</p>
                    <p><strong>Employees:</strong> ${d.value}</p>
                `);
            }
        });

    // Add legend
    const legend = svg.append("g")
        .attr("transform", `translate(${width - 100}, 20)`);

    legend.selectAll("rect")
        .data(metrics)
        .join("rect")
        .attr("x", 0)
        .attr("y", (d, i) => i * 20)
        .attr("width", 18)
        .attr("height", 18)
        .attr("fill", d => color(d));

    legend.selectAll("text")
        .data(metrics)
        .join("text")
        .attr("x", 25)
        .attr("y", (d, i) => i * 20 + 14)
        .style("font-size", "10px")
        .text(d => d);
});