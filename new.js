// Function to fetch sunrise and sunset times using the Sunrise-Sunset API
async function getGoldenHour() {
    const locationInput = document.getElementById('location').value.trim();
    const locationPattern = /^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/; // Regex for lat, long (decimal format)
    let location;

    // Validate the location input
    if (!locationPattern.test(locationInput)) {
        alert('Please enter a valid location in latitude, longitude format.');
        return;
    }

    location = locationInput;

    const [lat, lon] = location.split(',');

    // Construct the API URL
    const apiUrl = `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lon}&formatted=0`;
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.status === "OK") {
            const sunriseTime = new Date(data.results.sunrise);
            const sunsetTime = new Date(data.results.sunset);

            // Display the golden hour info
            document.getElementById('sunrise-time').textContent = `Sunrise: ${sunriseTime.toLocaleTimeString()}`;
            document.getElementById('sunset-time').textContent = `Sunset: ${sunsetTime.toLocaleTimeString()}`;

            // Calculate golden hour period
            const goldenHourStart = new Date(sunriseTime);
            goldenHourStart.setMinutes(sunriseTime.getMinutes() + 30);
            const goldenHourEnd = new Date(sunsetTime);
            goldenHourEnd.setMinutes(sunsetTime.getMinutes() - 30);

            document.getElementById('golden-hour-period').textContent =
                `Golden Hour: From ${goldenHourStart.toLocaleTimeString()} to ${goldenHourEnd.toLocaleTimeString()}`;

            // Fetch and display events during the golden hour
            displayEvents(goldenHourStart, goldenHourEnd);
        } else {
            alert('Failed to get sunrise and sunset data. Please check the location.');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        alert('An error occurred. Please try again later.');
    }
}

// Function to display events during the golden hour
function displayEvents(goldenHourStart, goldenHourEnd) {
    // Example event data (you could replace this with API data)
    const events = [
        { title: 'Sunset Photography Meetup', time: '17:30' },
        { title: 'Golden Hour Yoga', time: '18:00' },
        { title: 'Outdoor Picnic at the Park', time: '18:15' },
        { title: 'Stargazing Night', time: '19:00' }
    ];

    // Filter events based on the golden hour time range
    const filteredEvents = events.filter(event => {
        const [hours, minutes] = event.time.split(':').map(Number);
        const eventTime = new Date();
        eventTime.setHours(hours, minutes, 0, 0);
        return eventTime >= goldenHourStart && eventTime <= goldenHourEnd;
    });

    // Display filtered events
    const eventList = document.getElementById('events');
    eventList.innerHTML = ''; // Clear previous events

    filteredEvents.forEach(event => {
        const li = document.createElement('li');
        li.textContent = `${event.title} - ${event.time}`;
        eventList.appendChild(li);
    });
}
