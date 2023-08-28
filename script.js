// Initialize totalPoints to 0
let totalPoints = 0;

// Parse the CSV into an array of ship objects
function csvToArray(csv) {
  csv = csv.trim();  // Add this line to trim the csv content
  const [header, ...rows] = csv.split('\n').map(row => row.split(','));
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
    console.log(csvContent);
    const availableShips = document.getElementById('availableShips');
    const fleet = document.getElementById('fleet');

    const ships = csvToArray(csvContent);

    // Populate available ships
    ships.forEach(ship => {
      const shipBox = document.createElement('div');
      shipBox.className = 'ship-box';
      shipBox.innerHTML = `
        <p><strong>Ship:</strong> ${ship.Name}</p>
        <p><strong>Class:</strong> ${ship.Class}</p>
        <p><strong>Ability:</strong> ${ship.Ability}</p>
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
      availableShips.appendChild(shipBox);
    });
  });
