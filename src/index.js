document.addEventListener("DOMContentLoaded", () => {
    const dogBar = document.getElementById("dog-bar");
    const dogInfo = document.getElementById("dog-info");
    const filterButton = document.getElementById("good-dog-filter");
    let filterOn = false; 

    function fetchDogs() {
        fetch("http://localhost:3000/pups")
        .then(response => {
            if (!response.ok) throw new Error("Failed to fetch dogs");
            return response.json();
        })
        .then(dogs => renderDogs(dogs))
        .catch(error => console.error("Error:", error));
    }
    function renderDogs(dogs) {
        dogBar.innerHTML = ""; 
        dogs.forEach(dog => {
            if (!filterOn || dog.isGoodDog) { 
                const span = document.createElement("span");
                span.textContent = dog.name;
                span.addEventListener("click", () => showDogInfo(dog));
                dogBar.appendChild(span);
            }
        });
    }
    function showDogInfo(dog) {
        dogInfo.innerHTML = `
            <img src="${dog.image}" alt="${dog.name}">
            <h2>${dog.name}</h2>
            <button id="dog-button">${dog.isGoodDog ? "Good Dog!" : "Bad Dog!"}</button>
        `;
        document.getElementById("dog-button").addEventListener("click", () => toggleGoodDog(dog));
    }
    function toggleGoodDog(dog) {
        const newStatus = !dog.isGoodDog;
        fetch(`http://localhost:3000/pups/${dog.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isGoodDog: newStatus })
        })
        .then(response => response.json())
        .then(updatedDog => {
            showDogInfo(updatedDog);
            fetchDogs();
        })
        .catch(error => console.error("Error updating dog:", error));
    }
    filterButton.addEventListener("click", () => {
        filterOn = !filterOn;
        filterButton.textContent = `Filter good dogs: ${filterOn ? "ON" : "OFF"}`;
        fetchDogs();
    });

    fetchDogs();
});
