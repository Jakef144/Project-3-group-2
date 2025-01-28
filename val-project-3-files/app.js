function initDashboard() {
    d3.json('occupations.json').then(data => {
        const filteredOccupations = data.filter(occupation => {
            const isCalifornia = occupation.area_name === 'California';
            const hasHourlyWage = occupation.median_hourly_wage > 0;
            return isCalifornia && hasHourlyWage;
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
                    marker: {
                        color: 'steelblue'
                    }
                };

                const trace2 = {
                    x: ['Projected Year'],
                    y: [occupationData.projectedYear],
                    name: '2030',
                    type: 'bar',
                    marker: {
                        color: 'orange'
                    }
                };

                const layout = {
                    title: `Employment for ${occupationTitle}`,
                    yaxis: {
                        title: 'Employment'
                    },
                    annotations: [
                        {
                            x: 'Projected Year',
                            y: occupationData.projectedYear + 4000,
                            text: `${occupationData.percentChange}%`,
                            showarrow: false,
                            font: {
                                color: 'black',
                                weight: 'bold'
                            }
                        }
                    ]
                };

                Plotly.newPlot('barChart', [trace1, trace2], layout);
            } else {
                console.error('Occupation not found:', occupationTitle);
            }
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
            infoDiv.html(`
                <p>Median Hourly Wage: ${occupation.median_hourly_wage}</p>
                <p>Median Annual Wage: ${occupation.median_annual_wage}</p>
                <p>Entry Level Education: ${occupation.entry_level_education}</p>
                <p>Work Experience: ${occupation.work_experience}</p>
                <p>Job Training: ${occupation.job_training}</p>
            `);
        }

        function updateBubbleChart() {
            const californiaData = data.filter(d => d.area_name === 'California');
            const occupationData = d3.group(californiaData, d => d.occupational_title);
            const bubbleChartCanvas = document.getElementById("bubbleChart").getContext("2d");

       // Function to determine color based on median wage
        function getColorByWage(medianWage) {
            let color;
         if (medianWage > 40) {
         color = 'green'; // High wage
         } else if (medianWage > 25) {
        color = 'yellow'; // Medium wage
         } else {
        color = 'red'; // Low wage
        }
        console.log("Color for median wage", medianWage, ":", color); 
        return color;
        }

const bubbleChartData = {
    datasets: [{
        label: "Occupations",
        data: Array.from(occupationData, ([occupationTitle, occupations]) => {
            const wages = occupations.map(d => d.median_hourly_wage);
            const medianWage = d3.median(wages);
            console.log("Median Wage for", occupationTitle, ":", medianWage);             const count = occupations.length;

            return {
                x: occupationTitle,
                y: medianWage || 0,
                r: (medianWage / 5) || 0,
                median_wage: medianWage,
                occ_title: occupationTitle,
                backgroundColor: getColorByWage(medianWage)
            };
        })
    }]
};

        // Log the final bubble chart data to check colors
        console.log("Bubble Chart Data:", bubbleChartData);

            const bubbleChartOptions = {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        type: "category",
                        title: {
                            display: false,
                            text: "Occupation"
                        },
                        ticks: {
                            display: false
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: "Median Hourly Wage"
                        },
                    }
                },


                plugins: {
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const dataPoint = context.raw;
                                if (dataPoint && dataPoint.occ_title) {
                                    return [
                                        dataPoint.occ_title,
                                        `Median Hourly Wage: ${dataPoint.median_wage}`
                                    ];
                                } else {
                                    console.error("Data point is missing properties:", dataPoint);
                                    return "No data available";
                                }
                            }
                        }
                    }
                }
            };
      
            // Wrap chart creation in a Promise
            const chartCreationPromise = new Promise((resolve) => {
                window.bubbleChart = new Chart(bubbleChartCanvas, {
                    type: "bubble",
                    data: bubbleChartData,
                    options: bubbleChartOptions,
                });
                resolve();
            });
            // Destroys existing chart
            chartCreationPromise.then(() => {
                if (window.bubbleChart) {
                    console.log("Destroying existing chart");
                    window.bubbleChart.destroy();
                }
                // Creates the new chart
                window.bubbleChart = new Chart(bubbleChartCanvas, {
                    type: "bubble",
                    data: bubbleChartData,
                    options: bubbleChartOptions,
                });
            });
          }

        const initialOccupation = filteredOccupations[0].occupational_title;
        dropdown.node().value = initialOccupation;
        updateOccupationInfo(initialOccupation);
        updateBarChart(initialOccupation);
        updateBubbleChart();
        dropdown.node().value = initialOccupation;

    });
}

document.addEventListener('DOMContentLoaded', initDashboard);

