function initDashboard() {
    d3.json('/static/data/occupations.json').then(data => {
        console.log("✅ Occupations Data Loaded:", data);

        const filteredOccupations = data.filter(occupation => {
            return occupation.area_name === 'California' && occupation.median_hourly_wage > 0;
        });

        const chartData = filteredOccupations.map(occupation => ({
            occupation: occupation.occupational_title,
            baseYear: +occupation.base_year_employment_estimate,
            projectedYear: +occupation.projected_year_employment_estimate,
            percentChange: occupation.percent_change
        }));

        function updateBarChart(occupationTitle) {
            const occupationData = chartData.find(d => d.occupation === occupationTitle);
            if (occupationData) {
                const trace1 = {
                    x: ['Base Year'],
                    y: [occupationData.baseYear],
                    name: '2020',
                    type: 'bar',
                    marker: { color: 'steelblue' }
                };

                const trace2 = {
                    x: ['Projected Year'],
                    y: [occupationData.projectedYear],
                    name: '2030',
                    type: 'bar',
                    marker: { color: 'orange' }
                };

                const layout = {
                    title: `Employment for ${occupationTitle}`,
                    yaxis: { title: 'Employment' },
                    annotations: [
                        {
                            x: 'Projected Year',
                            y: occupationData.projectedYear + 4000,
                            text: `${occupationData.percentChange}%`,
                            showarrow: false,
                            font: { color: 'black', weight: 'bold' }
                        }
                    ]
                };

                const graphDiv = document.getElementById('occupationsBarChart');
                if (graphDiv) {
                    graphDiv.innerHTML = ""; 
                    Plotly.newPlot('occupationsBarChart', [trace1, trace2], layout);
                } else {
                    console.error("❌ ERROR: Element #occupationsBarChart not found in DOM.");
                }
            } else {
                console.error('Occupation not found:', occupationTitle);
            }
        }

        function updateBubbleChart() {
            const californiaData = data.filter(d => d.area_name === 'California');
            console.log("Filtered Bubble Chart Data:", californiaData);

            const occupationData = d3.group(californiaData, d => d.occupational_title);
            const bubbleChartCanvas = document.getElementById("bubbleChart");

            if (!bubbleChartCanvas) {
                console.error("❌ ERROR: Element #bubbleChart not found in DOM.");
                return;
            }

            function getColorByWage(medianWage) {
                return medianWage > 40 ? 'green' : medianWage > 25 ? 'yellow' : 'red';
            }

            const bubbleChartData = {
                datasets: [{
                    label: "Occupations",
                    data: Array.from(occupationData, ([occupationTitle, occupations], index) => {
                        const wages = occupations.map(d => d.median_hourly_wage);
                        const medianWage = d3.median(wages);
                        const count = occupations.length;

                        return {
                            x: index,  // Use an index instead of occupation name
                            y: medianWage || 0,
                            r: (medianWage / 5) || 0,
                            median_wage: medianWage,
                            occ_title: occupationTitle,
                            backgroundColor: getColorByWage(medianWage)
                        };
                    })
                }]
            };

            console.log("Bubble Chart Data:", bubbleChartData);

            if (window.bubbleChart && typeof window.bubbleChart.destroy === "function") {
                window.bubbleChart.destroy();
            }

            window.bubbleChart = new Chart(bubbleChartCanvas.getContext("2d"), {
                type: "bubble",
                data: bubbleChartData,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            type: "linear",
                            title: { display: true, text: "Occupations (Indexed)" },
                            ticks: { display: false }
                        },
                        y: {
                            title: { display: true, text: "Median Hourly Wage" }
                        }
                    },
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: (context) => {
                                    const dataPoint = context.raw;
                                    return dataPoint && dataPoint.occ_title
                                        ? [`${dataPoint.occ_title}`, `Median Hourly Wage: ${dataPoint.median_wage}`]
                                        : "No data available";
                                }
                            }
                        }
                    }
                }
            });
        }

        const dropdown = d3.select('#occupationDropdown');
        dropdown.selectAll('option')
            .data(filteredOccupations)
            .enter()
            .append('option')
            .attr('value', d => d.occupational_title)
            .text(d => d.occupational_title);

        dropdown.on("change", function() {
            const selectedOccupation = this.value;
            updateOccupationInfo(selectedOccupation);
            updateBarChart(selectedOccupation);
        });

        function updateOccupationInfo(occupationTitle) {
            const occupation = data.find(occ => occ.occupational_title === occupationTitle);
            const infoDiv = d3.select('#occupationInfo');
            if (occupation) {
                infoDiv.html(`
                    <p>Median Hourly Wage: ${occupation.median_hourly_wage}</p>
                    <p>Median Annual Wage: ${occupation.median_annual_wage}</p>
                    <p>Entry Level Education: ${occupation.entry_level_education}</p>
                    <p>Work Experience: ${occupation.work_experience}</p>
                    <p>Job Training: ${occupation.job_training}</p>
                `);
            } else {
                infoDiv.html(`<p>No data available for ${occupationTitle}.</p>`);
            }
        }

        const initialOccupation = filteredOccupations[0]?.occupational_title;
        if (initialOccupation) {
            dropdown.node().value = initialOccupation;
            updateOccupationInfo(initialOccupation);
            updateBarChart(initialOccupation);
            updateBubbleChart();
        }
    });
}

document.addEventListener('DOMContentLoaded', initDashboard);


