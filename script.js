document.addEventListener('DOMContentLoaded', function() {
    const weightForm = document.getElementById('weight-form');
    const dateInput = document.getElementById('date');
    const weightInput = document.getElementById('weight');
    const weightsTableBody = document.querySelector('#weights-table tbody');
    const weeklyAverageDiv = document.getElementById('weekly-average');

    let weights = JSON.parse(localStorage.getItem('weights')) || [];

    function saveWeights() {
        localStorage.setItem('weights', JSON.stringify(weights));
    }

    function addWeight(date, weight) {
        weights.push({ date, weight });
        weights.sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort weights by date
        saveWeights();
        displayWeights();
        calculateWeeklyAverage();
    }

    function deleteWeight(index) {
        weights.splice(index, 1);
        saveWeights();
        displayWeights();
        calculateWeeklyAverage();
    }

    function displayWeights() {
        weightsTableBody.innerHTML = '';
        weights.forEach((weightEntry, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${weightEntry.date}</td>
                <td>${weightEntry.weight}</td>
                <td><button class="delete" data-index="${index}">Delete</button></td>
            `;
            weightsTableBody.appendChild(row);
        });

        document.querySelectorAll('.delete').forEach(button => {
            button.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                deleteWeight(index);
            });
        });
    }

    function calculateWeeklyAverage() {
        const weeks = {};
        weights.forEach(entry => {
            const date = new Date(entry.date);
            const day = date.getDay();
            const weekStart = new Date(date);
            weekStart.setDate(date.getDate() - day); // Adjust to start week on Sunday

            const weekKey = weekStart.toISOString().split('T')[0];
            if (!weeks[weekKey]) {
                weeks[weekKey] = [];
            }
            weeks[weekKey].push(parseFloat(entry.weight));
        });

        weeklyAverageDiv.innerHTML = '';
        Object.keys(weeks).forEach(week => {
            const sum = weeks[week].reduce((sum, weight) => sum + weight, 0);
            const average = sum / weeks[week].length;
            const weekDiv = document.createElement('div');
            weekDiv.innerText = `Week starting ${week}: ${average.toFixed(2)} kg`;
            weeklyAverageDiv.appendChild(weekDiv);
        });
    }

    // Set the default date to today
    dateInput.valueAsDate = new Date();

    weightForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const date = dateInput.value;
        const weight = parseFloat(weightInput.value);
        if (date && weight) {
            addWeight(date, weight);
            dateInput.valueAsDate = new Date();
            weightInput.value = '';
        }
    });

    displayWeights();
    calculateWeeklyAverage();
});
