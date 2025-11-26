// --- Perusasetukset ---
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config(); // 🔑 lataa .env-tiedoston

const app = express();

// --- Body parser ---
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// --- CORS ---
app.use(cors());

// --- Staattiset tiedostot ---
app.use(express.static(path.join(__dirname, 'public')));

// --- MongoDB yhteys ---
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Tietokantayhteys avattu MongoDB Atlas carsDb'))
  .catch(err => console.error('MongoDB-yhteysvirhe:', err));

const db = mongoose.connection;


// --- Mongoose skeema ---
const carSchema = new mongoose.Schema({
    brand: { type: String, required: true },
    model: { type: String, required: true },
    year: Number,
    fuel: String,
    electric: Boolean
}, { collection: 'cars' });

const Car = require('./carSchema');

// --- Routes ---
// Hae kaikki autot
app.get('/cars', async (req, res) => {
    try {
        const cars = await Car.find({});
        res.json(cars);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Lisää uusi auto
app.post('/cars', async (req, res) => {
    try {
        const newCar = new Car({
            brand: req.body.brand,
            model: req.body.model,
            year: req.body.year || null,
            fuel: req.body.fuel || "",
            electric: req.body.electric || false
        });
        await newCar.save();
        res.send(`Car added: ${newCar.brand} ${newCar.model}`);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Poista auto
app.delete('/cars/:id', async (req, res) => {
    try {
        await Car.findByIdAndDelete(req.params.id);
        res.send(`Car deleted: ${req.params.id}`);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Päivitä auto
app.put('/cars/:id', async (req, res) => {
    try {
        const updated = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.send(`Car updated: ${updated._id}`);
    } catch (err) {
        res.status(500).send(err);
    }
});

// --- Käynnistä palvelin ---
const PORT = 8081;
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Cars-server running on port ${PORT}`);
});
