document.addEventListener("DOMContentLoaded", function () {
    const shipList = document.getElementById("shipList");
    const fleetList = document.getElementById("fleetList");
    const totalPointsElement = document.getElementById("totalPoints");

    let selectedShips = [];
    let totalPoints = 0;

    function updateTotalPoints() {
        totalPointsElement.textContent = totalPoints;
    }

    function addShipToFleet(ship) {
        selectedShips.push(ship);

        const cost = parseFloat(ship.Cost) || 0;
        totalPoints += cost;

        const fleetShip = document.createElement("li");
        fleetShip.textContent = `${ship.Name} (Class: ${ship.Class}, Ability: ${ship.Ability}, Cost: ${cost} points)`;
        fleetShip.dataset.shipName = ship.Name;

        fleetShip.addEventListener("click", () => {
            removeShipFromFleet(ship);
        });
        fleetList.appendChild(fleetShip);

        updateTotalPoints();
    }

    function removeShipFromFleet(ship) {
        const index = selectedShips.indexOf(ship);
        if (index !== -1) {
            selectedShips.splice(index, 1);
            totalPoints -= parseFloat(ship.Cost) || 0;

            const fleetItemToRemove = fleetList.querySelector(`li[data-ship-name="${ship.Name}"]`);
            if (fleetItemToRemove) {
                fleetList.removeChild(fleetItemToRemove);
                updateTotalPoints();
            }
        }
    }

    function parseCSV(csv) {
        const lines = csv.split('\n');
        const headers = lines[0].split(',');
        const ships = [];

        for (let i = 1; i < lines.length; i++) {
            const shipData = lines[i].split(',');
            if (shipData.length === headers.length) {
                const ship = {};
                for (let j = 0; j < headers.length; j++) {
                    const key = headers[j].trim();
                    const value = shipData[j].trim();
                    ship[key] = value;
                }
                ships.push(ship);
            }
        }
        return ships;
    }

    // Fetch the CSV file automatically from the same directory
    fetch("./ships.csv") // Replace 'ships.csv' with your CSV file name
        .then(response => response.text())
        .then(data => {
            const ships = parseCSV(data);
            displayAvailableShips(ships);
        })
        .catch(error => {
            console.error('Error loading CSV:', error);
        });

    function displayAvailableShips(ships) {
        ships.forEach(ship => {
            const shipItem = document.createElement("li");
            shipItem.textContent = `${ship.Name} (Class: ${ship.Class}, Ability: ${ship.Ability}, Cost: ${ship.Cost} points)`;

            shipItem.addEventListener("click", () => {
                addShipToFleet(ship);
            });
            shipList.appendChild(shipItem);
        });
    }
});
