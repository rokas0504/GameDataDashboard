const mongoose = require('mongoose');

const Ratings = new mongoose.Schema({
    userId: { type: String, required: true }, 
  gameId: { type: String, required: true }, 
  rating: { type: Number, min: 1, max: 10, required: true } 
});

module.exports = mongoose.model('Ratings', Ratings);