
function getGraphData() {
    console.log("getGraphData");

    let selectedRange = "LastWeek"
    const body = {
        selectedRange: selectedRange
    }

    try {
        //`/patient_profile/getGraphData?selectedRange=${selectedRange}`,
        fetch(`/patient_profile/getGraphData`, {
            method: 'POST',
            body: JSON.stringify(body)
        }).then(response => {
            console.log(response)
            if (response.redirected) window.location.href = '/login';
            return response.json()
        }).then(jsonData => {
            console.log("getGraphData json");
            console.log(jsonData)

            generateChart("glucoseLevelChart", {
                chartName: "Glucose level",
                color: "rgb(255, 99, 132)",
                labels: jsonData.labels,
                data: jsonData.glucoseLevelRecords,
            });
            generateChart("weightChart", {
                chartName: "weight",
                color: "rgb(87, 119, 255)",
                labels: jsonData.labels,
                data: jsonData.weightRecords,
            });
            generateChart("insulinDosesChart", {
                chartName: "Insulin doses",
                color: "rgb(255, 155, 63)",
                labels: jsonData.labels,
                data: jsonData.insulinDosesRecords,
            });
            generateChart("exerciseChart", {
                chartName: "Exercise",
                color: "rgb(64, 196, 92)",
                labels: jsonData.labels,
                data: jsonData.exerciseRecords,
            });
        })
    } catch (error) {
        console.log(error)
    }
}
function generateChart(chartId, config) {
    const data = {
        labels: config.labels,
        datasets: [{
            label: config.chartName,
            backgroundColor: config.color,
            borderColor: config.color,
            data: config.data,
        }]
    };
    const configAtt = {
        type: 'line',
        data: data,
        options: {}
    };

    const myChart = new Chart(document.getElementById(chartId), configAtt);
}
