// Load the data
d3.json("employment_data_transformed.json").then(function (data) {
    // Set up dimensions
    const margin = { top: 20, right: 30, bottom: 50, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // Create SVG canvas
    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Set up scales
    const xScale = d3.scaleLinear().domain([2023, 2025]).range([0, width]);
    const yScale = d3.scaleLinear().range([height, 0]);

    // Add axes
    const xAxis = d3.axisBottom(xScale).ticks(2).tickFormat(d3.format("d"));
    const yAxis = d3.axisLeft(yScale);

    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height})`)
        .call(xAxis);

    svg.append("g").attr("class", "y-axis");

    // Tooltip
    const tooltip = d3.select("body").append("div")
        .style("position", "absolute")
        .style("background", "#fff")
        .style("border", "1px solid #ccc")
        .style("padding", "5px")
        .style("display", "none");

    // Populate dropdown
    const categorySelect = d3.select("#category-select");
    const categories = Array.from(new Set(data.map(d => d.industry_category)));
    categories.forEach(category => {
        categorySelect.append("option").text(category).attr("value", category);
    });

    // Update function
    function update(selectedCategory) {
        const filteredData = data.filter(d => d.industry_category === selectedCategory);

        // Flatten data for line chart
        const linesData = filteredData.map(d => d.data).flat();

        // Update scales
        yScale.domain([0, d3.max(linesData, d => d.employment)]);

        // Update axes
        svg.select(".y-axis").call(yAxis);

        // Bind data
        const line = d3.line()
            .x(d => xScale(d.year))
            .y(d => yScale(d.employment));

        const lines = svg.selectAll(".line").data([linesData]);

        // Enter + update
        lines.enter()
            .append("path")
            .attr("class", "line")
            .merge(lines)
            .transition()
            .duration(500)
            .attr("fill", "none")
            .attr("stroke", "#007ACC")
            .attr("stroke-width", 2)
            .attr("d", line);

        // Add circles for points
        const points = svg.selectAll(".point").data(linesData);

        points.enter()
            .append("circle")
            .attr("class", "point")
            .merge(points)
            .transition()
            .duration(500)
            .attr("cx", d => xScale(d.year))
            .attr("cy", d => yScale(d.employment))
            .attr("r", 5)
            .attr("fill", "#007ACC");

        points.on("mouseover", (event, d) => {
            tooltip.style("display", "block")
                .html(`Year: ${d.year}<br>Employment: ${d.employment}`);
        }).on("mousemove", (event) => {
            tooltip.style("left", `${event.pageX + 10}px`).style("top", `${event.pageY + 10}px`);
        }).on("mouseout", () => {
            tooltip.style("display", "none");
        });

        points.exit().remove();
    }

    // Initial render
    categorySelect.on("change", () => update(categorySelect.node().value));
    update(categories[0]);
});

