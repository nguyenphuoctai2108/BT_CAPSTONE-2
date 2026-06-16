document.addEventListener("DOMContentLoaded", async () => {
    const res = await fetch("https://6a30e3c1a7f8866418d6955b.mockapi.io/api/v1/Products", {
        method: "GET"
    });
    const rawData = await res.json();

    const brandCounts = rawData.reduce((acc, item) => {
        const brand = item.type;
        acc[brand] = (acc[brand] || 0) + 1;
        return acc;
    }, {}); 

    const categoriesData = Object.keys(brandCounts);
    const seriesData = Object.values(brandCounts);
    
    const maxValue = Math.max(...seriesData);

    const options = {
        series: [{
            name: 'Số lượng',
            data: seriesData
        }],
        chart: {
            type: 'bar',
            height: 450,
            toolbar: { show: false }
        },
        plotOptions: {
            bar: {
                horizontal: true,
                borderRadius: 4,
                barHeight: '30%',
                dataLabels: {
                    position: 'top',
                },
            }
        },
        colors: ['#2563eb'],
        dataLabels: {
            enabled: true,
            textAnchor: 'start',
            offsetX: 14,
            formatter: function (val) {
                return `${val}`; 
            },
            style: {
                fontSize: '14px',
                colors: ['var(--app-text-sec)'],
                fontWeight: 400
            }
        },
        xaxis: {
            categories: categoriesData,
            labels: { show: false }, 
            axisBorder: { show: false },
            axisTicks: { show: false },
            max: maxValue * 1.15 
        },
        yaxis: {
            labels: {
                style: {
                    colors: Array(categoriesData.length).fill('var(--app-text)'), 
                    fontSize: '16px',
                },
                offsetY: 3,
            }
        },
        grid: { show: false },
        tooltip: { enabled: false }
    };

    const chartElement = document.querySelector("#product-chart");
    if (chartElement) {
        chartElement.innerHTML = '';
        const chart = new ApexCharts(chartElement, options);
        chart.render();
    }
});

document.addEventListener('DOMContentLoaded', async () => {

    const res = await fetch("https://6a30e3c1a7f8866418d6955b.mockapi.io/api/v1/Products", {
        method: "GET"
    });
    const rawData = await res.json();
   
    const brandCounts = rawData.reduce((acc, item) => {
        const brand = item.type;
        acc[brand] = (acc[brand] || 0) + 1;
        return acc;
    }, {}); 

    
    const series = Object.values(brandCounts);
    const labels = Object.keys(brandCounts);

    const generateRandomColors = (count) => {
        return Array.from({ length: count }, () =>
            '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
        );
    };

    const initChart = () => { 

        if (!series.length) return;

        const dynamicColors = generateRandomColors(series.length);

        const options = {
            series: series,
            labels: labels,
            colors: dynamicColors,
            chart: {
                height: 500,
                type: 'donut'
            },
            plotOptions: {
                pie: {
                    donut: { size: '60%' }
                }
            },
            dataLabels: {
                enabled: false
            },
            legend: {
                show: true,
                position: 'bottom',
                fontSize: 16,
                itemMargin: {
                    horizontal: 15,
                    vertical: 15
                },
                formatter: function (seriesName, opts) {
                    const allSeries = opts.w.globals.series;
                    const total = allSeries.reduce((a, b) => a + b, 0);
                    const value = opts.w.globals.series[opts.seriesIndex];
                    const percent = ((value / total) * 100).toFixed(0);
                    return `<span class="text-(--app-text)">${seriesName} </span><i class="text-(--app-text-sec)">(${percent}%)</i>`;
                }
            },
            stroke: {
                width: 1,
                colors: ['#ffffff']
            },
            grid: {
                padding: { top: 0, bottom: 11, left: 12, right: 12 }
            },
            states: {
                hover: { filter: { type: 'none' } }
            },
            tooltip: {
                enabled: true
            }
        };

        const chartElement = document.querySelector("#hs-doughnut-chart");
        if (chartElement) {
            chartElement.innerHTML = ''; 
            const donutChart = new ApexCharts(chartElement, options);
            donutChart.render();
        }
    };

    initChart();
});