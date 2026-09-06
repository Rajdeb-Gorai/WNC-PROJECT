// 1. Grab the html elements we want to interact with
const starshipList = document.getElementById('starshipList');
const statusMessage = document.getElementById('statusMessage');

// The base URL for the Stars Wars API
const API_URL = 'https://swapi.dev/api/starships/';

// 2. Create an asyncronus function to get the data
// 'async' means this function takes time (fetching from the internet)
// so the rest of the page won't freeze while it waits
async function getStarship() {
    try{
        // show our Loading State
        statusMessage.textContent = "Loading starships...";

        // go to the API and 'await' (wait for) the response
        const response = await fetch(API_URL);

        // Convert the raw response into JSON (a format javascript understands)
        const data = await response.json();

        // Let's print the raw data to the browser's console so YOU can see it!
        console.log("Raw data from the Stars Wars API:", data);

        // clear the loading message since we have the data now
        statusMessage.textContent = "";

        // 'data results' is the array of the ships. Let's send them to our drawing function
        renderShips(data.results);
    } catch(error){
        statusMessage.textContent = "Error loading starship. Please try again.";
        console.log(error);
    }
}


// 3. Create a function to draw the ships on the screen 
function renderShips(ships){
    // Empty the section first so we don't accidently duplicate ships
    starshipList.innerHTML = "";

    // loop through every single ship in the list
    ships.forEach(ship => {
        // create a generic box (div) to hold this specific ship's details
        const shipCard = document.createElement('div');

        // Inject the required information using "Template Literals:" (the backticks ``)
        // ${} allows us to inject JavaScript variables directly into HTML string
        shipCard.innerHTML = `
            <h3>${ship.name}</h3>
            <p><strong>Model : </strong>${ship.model}</p>
            <p><strong>Manufacturer : </strong> ${ship.manufacturer}</p>
            <p><strong>Crew:</strong> ${ship.crew}</p>
            <p><strong>Hyperdrive Rating:</strong> ${ship.hyperdrive_rating}</p>
            <hr> <!-- A horizontal line to separate the ships -->
        `;
        starshipList.append(shipCard);
    });

}

getStarship();