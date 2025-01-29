d3.json("top10.json").then((data) => {
    console.log(data);
});

// Load the JSON data using D3
d3.json('top10.json').then(function(jsonData) {
    data = jsonData;
    initializeDropdowns();
// }).catch(function(error) {
//     console.error("Error loading the data:", error);
});

// Populate dropdowns with unique years and area names from the data
function initializeDropdowns() {
    const years = [...new Set(data.map(item => item.Year))];
    const areas = [...new Set(data.map(item => item.Area_Name))];

    const yearDropdown = document.getElementById('yearDropdown');
    const areaDropdown = document.getElementById('areaDropdown');

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
}

// Function to update the chart based on selected Year and Area_Name
function updateChart() {
    const selectedYear = document.getElementById('yearDropdown').value;
    const selectedArea = document.getElementById('areaDropdown').value;

    if (selectedYear && selectedArea) {
        // Filter data based on selected year and area
        const filteredData = data.filter(item => item.Year == selectedYear && item.Area_Name == selectedArea);

        if (filteredData.length > 0) {
            // Group by Industry_Name
            const industryNames = [...new Set(filteredData.map(item => item.Industry_Name))];

            // Prepare chart data for Plotly
            const wages = industryNames.map(industry => {
                // Filter data for the industry
                const industryData = filteredData.filter(item => item.Industry_Name === industry);
                // Get the first entry's wage because all entries for the industry have the same wage)
                return industryData[0].Average_Weekly_Wages;
            });

            const chartData = {
                x: industryNames, // Use Industry_Name as x-axis
                y: wages,          // Use Average_Weekly_Wages for y-axis
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
                title: 'Average Weekly Wages by Industry for Selected Area and Year',
                xaxis: {
                    title: 'Industry Name'
                },
                yaxis: {
                    title: 'Average Weekly Wages',
                    rangemode: 'tozero'
                },
                margin: {
                    b: 250
                }
            };

            // Render the chart with Plotly
            Plotly.newPlot('chart', [chartData], layout);
        }
    }
}