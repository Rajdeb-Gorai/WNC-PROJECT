const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const crewFilter = document.getElementById("crewFilter");
const hyperdriveFilter = document.getElementById("hyperdriveFilter");
const themeToggle = document.getElementById('themeToggle');

let currentShips = [];

let nextUrl = null;
let prevUrl = null;

const starshipList = document.getElementById("starshipList");
const statusMessage = document.getElementById("statusMessage");
const searchInput = document.getElementById("searchInput");

const API_URL = "https://swapi.dev/api/starships/";

function applyFilters() {
  let filteredShips = currentShips;

  const crewValue = crewFilter.value;
  const hyperdriveValue = hyperdriveFilter.value;

  if (crewValue !== "all") {
    filteredShips = filteredShips.filter((ship) => {
      const crewNum = parseInt(ship.crew.replace(/,/g, ""));

      if (isNaN(crewNum)) return false;

      if (crewValue === "1-5") return crewNum >= 1 && crewNum <= 5;
      if (crewValue === "6-50") return crewNum >= 6 && crewNum <= 50;
      if (crewValue === "50+") return crewNum > 50;
    });
  }

  if (hyperdriveValue !== "all") {
    filteredShips = filteredShips.filter((ship) => {
      const hdNum = parseFloat(ship.hyperdrive_rating);

      if (isNaN(hdNum)) return false;

      if (hyperdriveValue === "<1.0") return hdNum < 1.0;
      if (hyperdriveValue === "1.0-2.0") return hdNum >= 1.0 && hdNum <= 2.0;
      if (hyperdriveValue === ">2.0") return hdNum > 2.0;
    });
  }
  renderShips(filteredShips);
}

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

    currentShips = data.results;

    applyFilters();
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

let searchTimeout;


searchInput.addEventListener("input", (event) => {
  const typedText = event.target.value;

  clearTimeout(searchTimeout);

  searchTimeout = setTimeout(() => {
    const searchUrl = `${API_URL}?search=${typedText}`;
    getStarship(searchUrl);
  }, 500);
});

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

crewFilter.addEventListener("change", applyFilters);
hyperdriveFilter.addEventListener("change", applyFilters);

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
})

getStarship(API_URL);
