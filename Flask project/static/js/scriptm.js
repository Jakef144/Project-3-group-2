let wagesData = []; // Global variable to store the data

// Fetch California Wages Data
d3.json('/static/data/top10.json').then(data => {
    console.log("✅ California Wages Data Loaded:", data);
    wagesData = data; // Store data globally

    // Populate dropdowns
    initializeDropdowns();

    // Set an initial chart
    updateChart();
}).catch(error => {
    console.error("❌ Error loading top10.json:", error);
});

// Populate dropdowns with unique years and area names from the data
function initializeDropdowns() {
    const years = [...new Set(wagesData.map(item => item.Year))];
    const areas = [...new Set(wagesData.map(item => item.Area_Name))];

    const yearDropdown = document.getElementById('yearDropdown');
    const areaDropdown = document.getElementById('areaDropdown');

    // Clear existing options
    yearDropdown.innerHTML = '<option value="">Select Year</option>';
    areaDropdown.innerHTML = '<option value="">Select Area</option>';

    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearDropdown.appendChild(option);
    });

    areas.forEach(area => {
        const option = document.createElement('option');
        option.value = area;
        option.textContent = area;
        areaDropdown.appendChild(option);
    });

    // Add event listeners for dropdown changes
    yearDropdown.addEventListener("change", updateChart);
    areaDropdown.addEventListener("change", updateChart);
}

// Function to update the chart based on selected Year and Area_Name
function updateChart() {
    const selectedYear = document.getElementById('yearDropdown').value;
    const selectedArea = document.getElementById('areaDropdown').value;

    if (selectedYear && selectedArea) {
        // Filter data based on selected year and area
        const filteredData = wagesData.filter(item => item.Year == selectedYear && item.Area_Name == selectedArea);

        if (filteredData.length > 0) {
            // Group by Industry_Name
            const industryNames = [...new Set(filteredData.map(item => item.Industry_Name))];

            // Prepare chart data for Plotly
            const wages = industryNames.map(industry => {
                // Filter data for the industry
                const industryData = filteredData.filter(item => item.Industry_Name === industry);
                return industryData[0].Average_Weekly_Wages; // Get first entry's wage
            });

            const chartData = {
                x: industryNames,
                y: wages,
                type: 'bar',
                marker: {
                    color: 'rgba(75, 192, 192, 0.6)',
                    line: {
                        color: 'rgba(75, 192, 192, 1)',
                        width: 2
                    }
                }
            };

            // Plotly chart configuration
            const layout = {
                title: `Average Weekly Wages in ${selectedArea} (${selectedYear})`,
                xaxis: { title: 'Industry Name' },
                yaxis: { title: 'Average Weekly Wages', rangemode: 'tozero' },
                margin: { b: 250 }
            };

            // Render the chart with Plotly
            Plotly.newPlot('chart', [chartData], layout);
        } else {
            document.getElementById("chart").innerHTML = "<p>No data available for selected filters.</p>";
        }
    }
}

