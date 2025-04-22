const mongoose = require('mongoose');


const Wishlists = new mongoose.Schema({
    userId: { type: String, required: true }, 
  gameId: { type: String, required: true }, 
}, { timestamps: true }); 

module.exports = mongoose.model('Wishlist', Wishlists);