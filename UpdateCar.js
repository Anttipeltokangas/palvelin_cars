document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);

    document.getElementById('_id').value = params.get('id');
    document.getElementById('brand').value = params.get('brand') || '';
    document.getElementById('model').value = params.get('model') || '';
    document.getElementById('year').value = params.get('year') || '';
    document.getElementById('fuel').value = params.get('fuel') || '';
    document.getElementById('electric').checked = (params.get('electric') === 'true');
});

document.getElementById("updateForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const id = document.getElementById('_id').value;
    const data = {
        brand: document.getElementById('brand').value,
        model: document.getElementById('model').value,
        year: document.getElementById('year').value,
        fuel: document.getElementById('fuel').value,
        electric: document.getElementById('electric').checked
    };

    fetch(`http://localhost:8081/cars/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(res => res.text())
    .then(msg => {
        alert(msg);
        window.location.href = "/"; // palaa etusivulle
    })
    .catch(err => console.error("Virhe päivitettäessä autoa:", err));
});
