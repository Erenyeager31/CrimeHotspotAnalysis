var processedData = [];

// let ct1 = document.getElementById('chartContainer')
let ct2 = document.getElementsByClassName('chartContainer')

const fetchPData = async () => {
    const response = await fetch(`${host}/getData`, {
        method: 'GET',
    });

    // parse data into json
    const data = await response.json();

    // split the data
    const lines = data.Data.split('\n');

    // iterate for each line
    lines.forEach((line, index) => {
        try {
            // push into the variable
            processedData.push(JSON.parse(line));
        } catch (error) {
            console.error('Error parsing JSON:', error);
        }
    });

    let data1 = {
        labels: ['Label 1', 'Label 2',
            'Label 3', 'Label 4',
            'Label 5'],
        datasets: [{
            label: 'Sample Bar Chart',
            data: [12, 17, 3, 8, 2],
            backgroundColor: 'rgba(70, 192, 192, 0.6)',
            borderColor: 'rgba(150, 100, 255, 1)',
            borderWidth: 1
        }]
    };

    // Configuration options for the chart
    let options = {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

console.log(ct2)

    // Create the bar chart
    let myBarChart = new Chart(ct2, {
        type: 'bar',
        data: data1,
        options: options
    });
};

window.onload = fetchPData; // Assign the function directly to window.onload