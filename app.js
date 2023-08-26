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
        fleetShip.classList.add("fleet-item");  // Add a class for styling
    
        // Create a paragraph element for ship details
        const shipDetails = document.createElement("p");
        shipDetails.textContent = `${ship.Name} (Class: ${ship.Class}, Ability: ${ship.Ability}, Cost: ${cost} points)`;
    
        fleetShip.appendChild(shipDetails);
    
        fleetShip.dataset.shipName = ship.Name;
    
        fleetShip.addEventListener("click", () => {
            removeShipFromFleet(ship);
        });
        fleetList.appendChild(fleetShip);
    
        updateTotalPoints();

         // Display fleet ships with updated styling
    displayFleetShips(selectedShips);
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
                shipItem.classList.add("ship-item");  // Add a class for styling
        
                // Create elements for each ship detail
                const shipName = document.createElement("p");
                shipName.textContent = `Ship: ${ship.Name}`;
        
                const shipClass = document.createElement("p");
                shipClass.textContent = `Class: ${ship.Class}`;
        
                const shipAbility = document.createElement("p");
                shipAbility.textContent = `Ability: ${ship.Ability}`;
        
                const shipCost = document.createElement("p");
                shipCost.textContent = `Cost: ${ship.Cost} points`;
        
                // Append ship details to ship item
                shipItem.appendChild(shipName);
                shipItem.appendChild(shipClass);
                shipItem.appendChild(shipAbility);
                shipItem.appendChild(shipCost);
        
                // Add a click event listener to add ship to fleet
                shipItem.addEventListener("click", () => {
                    addShipToFleet(ship);
                });
        
                shipList.appendChild(shipItem);
            });
        }

        function displayFleetShips(ships) {
            ships.forEach(ship => {
                const fleetShip = document.createElement("li");
                fleetShip.classList.add("fleet-item");  // Add a class for styling
        
                // Create elements for each fleet ship detail
                const shipDetails = document.createElement("p");
                shipDetails.textContent = `${ship.Name} (Class: ${ship.Class}, Ability: ${ship.Ability}, Cost: ${ship.Cost} points)`;
        
                fleetShip.appendChild(shipDetails);
        
                fleetShip.dataset.shipName = ship.Name;
        
                fleetShip.addEventListener("click", () => {
                    removeShipFromFleet(ship);
                });
        
                fleetList.appendChild(fleetShip);
            });
        }
        
        
});
