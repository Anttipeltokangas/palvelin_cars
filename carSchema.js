// Otetaan Mongoose käyttöön
const mongoose = require('mongoose');

// Luodaan skeema autoille
const carSchema = new mongoose.Schema({
    brand: { type: String, required: true },
    model: { type: String, required: true },
    year: Number,
    fuel: String,
    electric: Boolean
}, 
// Viitataan oikeaan kokoelmaan
{ collection: 'cars' }
);

// Export model eli tuodaan skeema muiden tiedostojen käytettäväksi
module.exports = mongoose.model('Car', carSchema);
