/* =========================================
   1. DOM ELEMENTS & STATE
========================================= */
const API_URL = "https://swapi.dev/api/starships/";
let currentShips = [];
let nextUrl = null;
let prevUrl = null;
let searchTimeout;

// Dashboard Elements
const starshipList = document.getElementById("starshipList");
const statusMessage = document.getElementById("statusMessage");
const searchInput = document.getElementById("searchInput");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const crewFilter = document.getElementById("crewFilter");
const hyperdriveFilter = document.getElementById("hyperdriveFilter");

// Sidebar & Theme Elements
const settingsBtn = document.getElementById('settingsBtn');
const closeSidebarBtn = document.getElementById('closeSidebarBtn');
const settingsSidebar = document.getElementById('settingsSidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const darkModeToggle = document.getElementById('darkModeToggle');
const themeStatusText = document.getElementById('themeStatusText');


/* =========================================
   2. CORE FUNCTIONS (API & RENDERING)
========================================= */
async function getStarship(url) {
    try {
        statusMessage.textContent = "";
        renderSkeletons();

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

    ships.forEach((ship, index) => {
        const shipCard = document.createElement("div");
        shipCard.style.animationDelay = `${index * 0.1}s`;

        shipCard.innerHTML = `
            <h3>${ship.name}</h3>
            <p><strong>Model : </strong>${ship.model}</p>
            <p><strong>Manufacturer : </strong> ${ship.manufacturer}</p>
            <p><strong>Crew:</strong> ${ship.crew}</p>
            <p><strong>Hyperdrive Rating:</strong> ${ship.hyperdrive_rating}</p>
            <hr>
        `;
        starshipList.append(shipCard);
    });
}

function renderSkeletons() {
    starshipList.innerHTML = "";

    for (let i = 0; i < 6; i++) {
        const skeleton = document.createElement("div");
        skeleton.style.animationDelay = `${i * 0.1}s`;

        skeleton.innerHTML = `
            <div class="skeleton-title"></div>
            <div class="skeleton-text"></div>
            <div class="skeleton-text"></div>
            <div class="skeleton-text short"></div>
            <div class="skeleton-text short"></div>
        `;
        starshipList.append(skeleton);
    }
}


/* =========================================
   3. LOGIC & FILTERING
========================================= */
function applyFilters() {
    let filteredShips = currentShips;
    const crewValue = crewFilter.value;
    const hyperdriveValue = hyperdriveFilter.value;

    // Crew Filter
    if (crewValue !== "all") {
        filteredShips = filteredShips.filter((ship) => {
            const crewNum = parseInt(ship.crew.replace(/,/g, ""));
            if (isNaN(crewNum)) return false;

            if (crewValue === "1-5") return crewNum >= 1 && crewNum <= 5;
            if (crewValue === "6-50") return crewNum >= 6 && crewNum <= 50;
            if (crewValue === "50+") return crewNum > 50;
        });
    }

    // Hyperdrive Filter
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
    prevBtn.disabled = prevUrl === null;
    nextBtn.disabled = nextUrl === null;
}

function openSidebar() {
    settingsSidebar.classList.add('open');
    sidebarOverlay.classList.add('active');
}

function closeSidebar() {
    settingsSidebar.classList.remove('open');
    sidebarOverlay.classList.remove('active');
}


/* =========================================
   4. EVENT LISTENERS
========================================= */
// Search & Filters
searchInput.addEventListener("input", (event) => {
    const typedText = event.target.value;
    clearTimeout(searchTimeout);

    searchTimeout = setTimeout(() => {
        const searchUrl = `${API_URL}?search=${typedText}`;
        getStarship(searchUrl);
    }, 500);
});

crewFilter.addEventListener("change", applyFilters);
hyperdriveFilter.addEventListener("change", applyFilters);

// Pagination
prevBtn.addEventListener("click", () => {
    if (prevUrl !== null) getStarship(prevUrl);
});

nextBtn.addEventListener("click", () => {
    if (nextUrl !== null) getStarship(nextUrl);
});

// Sidebar & Theme
settingsBtn.addEventListener('click', openSidebar);
closeSidebarBtn.addEventListener('click', closeSidebar);
sidebarOverlay.addEventListener('click', closeSidebar);

darkModeToggle.addEventListener('change', (event) => {
    if (event.target.checked) {
        document.body.classList.add('dark-mode');
        themeStatusText.textContent = "Dark mode";
    } else {
        document.body.classList.remove('dark-mode');
        themeStatusText.textContent = "Light mode";
    }
});


/* =========================================
   5. INITIALIZATION
========================================= */
// Fetch initial data when the page loads
getStarship(API_URL);