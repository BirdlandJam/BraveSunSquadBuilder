document.addEventListener("DOMContentLoaded"), function () {
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
    
        const fleetShip = createShipElement(ship, "fleet-item");
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

                console.log(`Removed ship: ${ship.Name}`); //log the removal of a ship
            }
        }
    }

    function createShipElement(ship, className) {
        const shipItem = document.createElement("li");
        shipItem.classList.add(className);

        const shipDetails = document.createElement("p");
        shipDetails.textContent = `${ship.Name} (Class: ${ship.Class}, Ability: ${ship.Ability}, Cost: ${ship.Cost} points)`;

        shipItem.appendChild(shipDetails);
        shipItem.dataset.shipName = ship.Name;

        return shipItem;
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

    fetch("ships.csv") // Replace 'ships.csv' with your CSV file name
        .then(response => response.text())
        .then(data => {
            const ships = parseCSV(data);
            displayAvailableShips(ships); // Display available ships here
        })
        .catch(error => {
            console.error('Error loading CSV:', error);
        });

    function displayAvailableShips(ships) {
        ships.forEach(ship => {
            const shipItem = document.createElement("li");
            shipItem.classList.add("ship-item");  // Add a class for styling
        
            const shipName = document.createElement("p");
            shipName.textContent = `Ship: ${ship.Name}`;
        
            const shipClass = document.createElement("p");
            shipClass.textContent = `Class: ${ship.Class}`;
        
            const shipAbility = document.createElement("p");
            shipAbility.textContent = `Ability: ${ship.Ability}`;
        
            const shipCost = document.createElement("p");
            shipCost.textContent = `Cost: ${ship.Cost} points`;
        
            shipItem.appendChild(shipName);
            shipItem.appendChild(shipClass);
            shipItem.appendChild(shipAbility);
            shipItem.appendChild(shipCost);
        
            shipList.appendChild(shipItem);
        });

        /* function displayFleetShips(ships) {
            ships.forEach(ship => {
                const fleetShip = document.createElement("li");
                fleetShip.classList.add("fleet-item");  // Add a class for styling

                // Create elements for each fleet ship detail
                const shipName = document.createElement("p");
                shipName.textContent = `Ship: ${ship.Name}`;

                const shipClass = document.createElement("p");
                shipClass.textContent = `Class: ${ship.Class}`;

                const shipAbility = document.createElement("p");
                shipAbility.textContent = `Ability: ${ship.Ability}`;

                const shipCost = document.createElement("p");
                shipCost.textContent = `Cost: ${ship.Cost} points`;

                // Append ship details to fleet ship item
                fleetShip.appendChild(shipName);
                fleetShip.appendChild(shipClass);
                fleetShip.appendChild(shipAbility);
                fleetShip.appendChild(shipCost);

                // Add a click event listener to remove ship from fleet
                fleetShip.addEventListener("click", () => {
                    removeShipFromFleet(ship);
                });

                fleetList.appendChild(fleetShip);
            }); */

        shipList.addEventListener("click", (event) => {
            const shipItem = event.target.closest(".ship-item");
            if (shipItem) {
                const shipIndex = Array.from(shipList.children).indexOf(shipItem);
                const ship = ships[shipIndex];
                addShipToFleet(ship);
            }
        });
    }
};

