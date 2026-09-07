const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const crewFilter = document.getElementById("crewFilter");
const hyperdriveFilter = document.getElementById("hyperdriveFilter");

// we need a place to temporarily store the current 10 ships on the screen so we can filter then wihout asking the API for them again
let currentShips = [];

let nextUrl = null;
let prevUrl = null;

const starshipList = document.getElementById("starshipList");
const statusMessage = document.getElementById("statusMessage");
const searchInput = document.getElementById("searchInput");

const API_URL = "https://swapi.dev/api/starships/";

function updatePaginationButtons() {
  prevBtn.hidden = false;
  nextBtn.hidden = false;

  if (prevUrl === null) {
    prevBtn.disabled = true;
  } else {
    prevBtn.disabled = false;
  }

  if (nextUrl === null) {
    nextBtn.disabled = true;
  } else {
    nextBtn.disabled = false;
  }
}

prevBtn.addEventListener("click", () => {
  if (prevUrl !== null) {
    getStarship(prevUrl);
  }
});

nextBtn.addEventListener("click", () => {
  if (nextUrl !== null) {
    getStarship(nextUrl);
  }
});

async function getStarship(url) {
  try {
    statusMessage.textContent = "Loading starships...";

    const response = await fetch(url);

    const data = await response.json();

    if (data.results.length === 0) {
      statusMessage.textContent = "No ships found matching your search";
      starshipList.innerHTML = "";

      prevBtn.disabled = true;
      nextBtn.disabled = true;
      return;
    }

    statusMessage.textContent = "";

    nextUrl = data.next;
    prevUrl = data.previous;

    updatePaginationButtons();

    //
    renderShips(data.results);
  } catch (error) {
    statusMessage.textContent = "Error loading starship. Please try again.";
    console.log(error);
  }
}

function renderShips(ships) {
  starshipList.innerHTML = "";

  ships.forEach((ship) => {
    const shipCard = document.createElement("div");

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

searchInput.addEventListener("input", (event) => {
  const typedText = event.target.value;

  const searchUrl = `${API_URL}?search=${typedText}`;

  getStarship(searchUrl);
});

getStarship(API_URL);
