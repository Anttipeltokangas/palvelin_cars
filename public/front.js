let allCars = []; // tallennetaan kaikki autot muistiin

// --- Hakee autot tietokannasta ja näyttää ne listana ---
function readCars() {
    fetch('http://localhost:8081/cars')
        .then(res => res.json())
        .then(cars => {
            allCars = cars; // tallennetaan muistiin
            renderCars(cars);
        })
        .catch(err => {
            console.error("Virhe haettaessa autoja:", err);
            showAlert("Virhe haettaessa autoja!", "danger");
        });
}

// --- Näyttää annetun listan autoja ---
// --- Näyttää annetun listan autoja kortteina ---
function renderCars(cars) {
    const carList = document.getElementById("carList");
    carList.innerHTML = "";

    if (cars.length === 0) {
        carList.innerHTML = "<p class='text-muted'>Ei autoja tietokannassa.</p>";
        return;
    }

    cars.forEach(car => {
        const card = document.createElement("div");
        card.className = "card mb-3";

        card.innerHTML = `
            <div class="card-body" id="view-${car._id}">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h5 class="card-title">${car.brand} ${car.model}</h5>
                        <p class="card-text">
                            Vuosimalli: ${car.year || "?"}<br>
                            Polttoaine: ${car.fuel || "?"}<br>
                            Sähköauto: ${car.electric ? "Kyllä" : "Ei"}
                        </p>
                    </div>
                    <div>
                        <button class="btn btn-sm btn-warning me-2" onclick="showEditForm('${car._id}')">Muokkaa</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteCar('${car._id}')">Poista</button>
                    </div>
                </div>
            </div>

            <div class="card-body d-none" id="edit-${car._id}">
                <form onsubmit="updateCar(event, '${car._id}')">
                    <div class="row g-2">
                        <div class="col-md-3"><input type="text" class="form-control" id="brand-${car._id}" value="${car.brand}" required></div>
                        <div class="col-md-3"><input type="text" class="form-control" id="model-${car._id}" value="${car.model}" required></div>
                        <div class="col-md-2"><input type="number" class="form-control" id="year-${car._id}" value="${car.year || ''}"></div>
                        <div class="col-md-2"><input type="text" class="form-control" id="fuel-${car._id}" value="${car.fuel || ''}"></div>
                        <div class="col-md-2 d-flex align-items-center">
                            <label class="form-check-label me-2">Sähköauto</label>
                            <input type="checkbox" class="form-check-input" id="electric-${car._id}" ${car.electric ? "checked" : ""}>
                        </div>
                    </div>
                    <button type="submit" class="btn btn-primary btn-sm mt-2">Tallenna</button>
                    <button type="button" class="btn btn-secondary btn-sm mt-2" onclick="cancelEdit('${car._id}')">Peruuta</button>
                </form>
            </div>
        `;

        carList.appendChild(card);
    });
}

function readCars() {
    fetch('http://localhost:8081/cars')
        .then(res => res.json())
        .then(cars => {
            allCars = cars;
            renderCars(cars);
            updateStats(); // <-- uusi rivi
        })
        .catch(err => {
            console.error("Virhe haettaessa autoja:", err);
            showAlert("Virhe haettaessa autoja!", "danger");
        });
}


// --- Hakutoiminto ---
document.getElementById("searchInput").addEventListener("input", function() {
    const query = this.value.toLowerCase();
    const filtered = allCars.filter(car =>
        car.brand.toLowerCase().includes(query) ||
        car.model.toLowerCase().includes(query)
    );
    renderCars(filtered);
});

// --- Järjestä merkin mukaan ---
function sortByBrand() {
    const sorted = [...allCars].sort((a, b) => a.brand.localeCompare(b.brand));
    renderCars(sorted);
}

// --- Järjestä vuosimallin mukaan ---
function sortByYear() {
    const sorted = [...allCars].sort((a, b) => (a.year || 0) - (b.year || 0));
    renderCars(sorted);
}

// --- Lisää uusi auto ---
document.getElementById("carForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const brand = document.getElementById("brand").value.trim();
    const model = document.getElementById("model").value.trim();
    const year = document.getElementById("year").value.trim();
    const fuel = document.getElementById("fuel").value.trim();
    const electric = document.getElementById("electric").checked;

    if (!brand || !model) {
        showAlert("Merkki ja malli ovat pakollisia!", "danger");
        return;
    }

    fetch('http://localhost:8081/cars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ brand, model, year, fuel, electric })
    })
    .then(res => res.text())
    .then(msg => {
        showAlert(msg, "success");
        document.getElementById("carForm").reset();
        readCars();
    })
    .catch(err => {
        console.error("Virhe lisättäessä autoa:", err);
        showAlert("Virhe lisättäessä autoa!", "danger");
    });
});

// --- Poistaa auton ---
function deleteCar(id) {
    if (confirm("Haluatko varmasti poistaa tämän auton?")) {
        fetch(`http://localhost:8081/cars/${id}`, { method: 'DELETE' })
        .then(res => res.text())
        .then(msg => {
            showAlert(msg, "warning");
            readCars();
        })
        .catch(err => {
            console.error("Virhe poistettaessa autoa:", err);
            showAlert("Virhe poistettaessa autoa!", "danger");
        });
    }
}

// --- Muokkaa autoa ---
function editCar(id, brand, model, year, fuel, electric) {
    const url = `UpdateCar.html?id=${id}&brand=${encodeURIComponent(brand)}&model=${encodeURIComponent(model)}&year=${encodeURIComponent(year)}&fuel=${encodeURIComponent(fuel)}&electric=${electric}`;
    window.location.href = url;
}

// --- Näyttää ilmoituksen Bootstrapin alert-komponentilla ---
function showAlert(message, type = "success") {
    const alertBox = document.getElementById("alertBox");
    alertBox.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Sulje"></button>
        </div>
    `;
}

// --- Lataa autot kun sivu avataan ---
document.addEventListener("DOMContentLoaded", () => readCars());
// --- Tumma tila toggle ---
document.getElementById("toggleTheme").addEventListener("click", function() {
    document.body.classList.toggle("bg-dark");
    document.body.classList.toggle("text-light");

    // Vaihdetaan myös korttien ulkoasu
    const cards = document.querySelectorAll(".card");
    cards.forEach(card => {
        card.classList.toggle("bg-secondary");
        card.classList.toggle("text-light");
    });
});
// --- Päivittää tilastot ---
function updateStats() {
    const total = allCars.length;
    const electricCount = allCars.filter(car => car.electric).length;
    const fuelCount = total - electricCount;

    const statsBox = document.getElementById("statsBox");
    statsBox.innerHTML = `
        <strong>Tilastot:</strong><br>
        Yhteensä autoja: ${total}<br>
        Sähköautoja: ${electricCount}<br>
        Polttomoottoriautoja: ${fuelCount}
    `;
}
function showEditForm(id) {
    document.getElementById(`view-${id}`).classList.add("d-none");
    document.getElementById(`edit-${id}`).classList.remove("d-none");
}

function cancelEdit(id) {
    document.getElementById(`edit-${id}`).classList.add("d-none");
    document.getElementById(`view-${id}`).classList.remove("d-none");
}

function updateCar(e, id) {
    e.preventDefault();

    const brand = document.getElementById(`brand-${id}`).value.trim();
    const model = document.getElementById(`model-${id}`).value.trim();
    const year = document.getElementById(`year-${id}`).value.trim();
    const fuel = document.getElementById(`fuel-${id}`).value.trim();
    const electric = document.getElementById(`electric-${id}`).checked;

    fetch(`http://localhost:8081/cars/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brand, model, year, fuel, electric })
    })
    .then(res => res.text())
    .then(msg => {
        showAlert(msg, "success");
        readCars(); // päivitetään lista
    })
    .catch(err => {
        console.error("Virhe päivitettäessä autoa:", err);
        showAlert("Virhe päivitettäessä autoa!", "danger");
    });
}

