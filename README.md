# Project-3: Visualization

## Overview
The purpose of this project was to analyze employment trends in California by industry and occupation from 2020-2030. Our data sets included a Quarterly Census of Employment and Wages (2020-2022), Short-Term Industry Employment Projections (2023-2025) and Long-Term Occupational Employment Projections (2020-2030).

## Visualizations and Interactions
We created interactive dashboards for each data set, containing bar charts and a bubble chart with dropdowns that allow the user to filter the data by industry, county, occupation and year. The dashboards were combind via a Flask API for ease of use and interaction with each of the visualizations. All charts include tooltips when hovering over the data; and drop down filters for each industry, year, county, and occupation.

 - In the Quarterly Census of Employment and Wages dashboard, there are two dropdown filters - one for year, and the other for county - to show the top industries by average weekly wages.
 - The Short-Term Industry Employment Projections dashboard double bar graph shows changes in employment by industry from 2023 and 2025, and has hoverable and clickable tooltips that display information on the chart and an info table to the right.
 - In the Long-Term Occupation Employment Projections dashboard, the Occupation dropdown filters the Employment Info table below, and the bar charts to the right that show base and projected employment for each. The bubble chart below shows each occupation's median hourly wage when the user hovers over each bubble.
 - Each dashboard is easy to navigate to, with clickable tabs at the top of the Flask API.

## Data Sets & Ethics
All our data was provided publicly by the California Employment Development Department (data.ca.gov). The datasets are intended for public access, with no licensing restrictions and does not contain personally identifable information.
https://catalog.data.gov/dataset/quarterly-census-of-employment-and-wages-qcew-a6fea
https://catalog.data.gov/dataset/short-term-industry-employment-projections
https://catalog.data.gov/dataset/long-term-occupational-employment-projections
