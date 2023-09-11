// Ability tool tip definitions. "Ability Title": "Ability definition"
const abilityTooltips = {
  "Barrel Roll": "Can execute a barrel roll maneuver once per round",
  "Frigate Adv. | Cruiser Adv.": "Provides advantages to both Frigates and Cruisers in the fleet"
  // Add more abilities and their descriptions here
};

// Initialize totalPoints to 0
let totalPoints = 0;

// Parse the CSV into an array of ship objects
function csvToArray(csv) {
  csv = csv.trim();
  const [header, ...rows] = csv.split('\n').map(row => row.trim().split(',').map(cell => cell.trim()));
  return rows.map(row => Object.fromEntries(row.map((value, i) => [header[i], value])));
}

// Update the total points for the fleet
function updateTotalPoints(cost, isAdding) {
  totalPoints += isAdding ? parseInt(cost) : -parseInt(cost);
  document.getElementById('totalPoints').innerText = totalPoints;
}

// Fetch CSV and Populate Available Ships
console.log("Fetch initiated");
fetch('https://birdlandjam.github.io/BraveSunSquadBuilder/ships.csv')
  .then(response => response.text())
  .then(csvContent => {
    const availableShips = document.getElementById('availableShips');
    const fleet = document.getElementById('fleet');
    const ships = csvToArray(csvContent);

    // Create an object to hold ships by class
    const shipsByClass = {};

    // Group ships by class
    ships.forEach(ship => {
      if (!shipsByClass[ship.Class]) {
        shipsByClass[ship.Class] = [];
      }
      shipsByClass[ship.Class].push(ship);
    });

    // Create and populate collapsible menus for each class
    Object.keys(shipsByClass).forEach(shipClass => {
      const classContainer = document.createElement('div');
      const button = document.createElement('button');
      button.innerText = shipClass;
      button.className = 'collapsible';
      classContainer.appendChild(button);

      const contentContainer = document.createElement('div');
      contentContainer.className = 'content';

      shipsByClass[shipClass].forEach(ship => {
        const shipBox = document.createElement('div');
        shipBox.className = 'ship-box';
        shipBox.innerHTML = `
          <p><strong>#</strong> ${ship.ShipNumber}</p>
          <p><strong>Ship:</strong> ${ship.Name}</p>
          <p><strong>Class:</strong> ${ship.Class}</p>
          <p><strong>Ability:</strong> <span class="ability" title="${abilityTooltips[ship.Ability] || 'No additional info'}">${ship.Ability}</span></p>
          <p><strong>Cost:</strong> ${ship.Cost}</p>
          <button>Add to Fleet</button>
        `;
        shipBox.querySelector('button').addEventListener('click', () => {
          const newShipBox = shipBox.cloneNode(true);
          newShipBox.querySelector('button').innerText = "Remove from Fleet";
          newShipBox.querySelector('button').addEventListener('click', () => {
            newShipBox.remove();
            updateTotalPoints(ship.Cost, false);
          });
          fleet.appendChild(newShipBox);
          updateTotalPoints(ship.Cost, true);
        });
        contentContainer.appendChild(shipBox);
      });

      classContainer.appendChild(contentContainer);
      availableShips.appendChild(classContainer);
    });

    // Collapsible functionality
    const coll = document.getElementsByClassName("collapsible");
    for (let i = 0; i < coll.length; i++) {
      coll[i].addEventListener("click", function() {
        this.classList.toggle("active");
        const content = this.nextElementSibling;
        if (content.style.display === "flex") {
          content.style.display = "none";
        } else {
          content.style.display = "flex";
        }
      });
    }
  });
