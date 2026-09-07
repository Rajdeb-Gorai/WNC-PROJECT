// 1. Grab the html elements we want to interact with
const starshipList = document.getElementById('starshipList');
const statusMessage = document.getElementById('statusMessage');
const searchInput = document.getElementById('searchInput');

// The base URL for the Stars Wars API
const API_URL = 'https://swapi.dev/api/starships/';

// 2. Create an asyncronus function to get the data
// 'async' means this function takes time (fetching from the internet)
// so the rest of the page won't freeze while it waits
async function getStarship(searchTerm = "") { // default search itm is empty string
    try{
        // show our Loading State
        statusMessage.textContent = "Loading starships...";

        // we create a dynamic URL
        const url = `${API_URL}?search=${searchTerm}`;

        // go to the API and 'await' (wait for) the response
        const response = await fetch(url);

        // Convert the raw response into JSON (a format javascript understands)
        const data = await response.json();

        if(data.results.length === 0){
            statusMessage.textContent = "No ships found matching your search";
            starshipList.innerHTML = ""; // clear the old list
            return; // stop running the rest of the function
        }


        // 'data results' is the array of the ships. Let's send them to our drawing function
        statusMessage.textContent = "";
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

// 3. NEW: Listen to the search input!
// The 'input' even fires every single time a key is pressed or deleted.
searchInput.addEventListener('input', (event) => {
    // event.target.value grabs exactly what is currently typed in the box
    const typedText = event.target.value;

    // call our fetch function with the new text
    getStarship(typedText);
});

// 4. call it once when the page loads so it isn't empty at first
getStarship();