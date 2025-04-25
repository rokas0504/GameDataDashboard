const express = require('express');
const router = express.Router();
const Wishlist = require('../models/wishlist');
const authenticateToken = require('../middleware/auth');

router.post('/wishlist', authenticateToken, (req, res) => {
  const userId = req.user.id; 
  const gameId = String(req.body.gameId);
    if (!gameId) {
        return res.status(400).json({ error: 'Game ID is required' });
    }
    if (typeof gameId !== 'string' || !gameId.trim()) {
      return res.status(400).json({ error: 'Invalid game ID' });
    }

  Wishlist.findOne({ userId: userId, gameId: gameId })
    .then(existingItem => {
        if (existingItem) {
            res.status(400).json({ error: 'Game is already in wishlist' });
            return null;
        }
        const wishlistItem = new Wishlist({
          userId: userId,
          gameId: gameId
      });
      wishlistItem.save()
          .then(() => {
              res.status(201).json({ message: 'Game added to wishlist' });
          })
          .catch(err => {
              console.error(err);
              res.status(500).json({ error: 'Internal server error' });
          });
    }
  )
    .catch(err => {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    });

    
}   );

router.delete('/wishlist', authenticateToken, (req, res) => {
    const userId = req.user.id; 
    const gameId = String(req.body.gameId); 
  
    if (!gameId) {
      return res.status(400).json({ error: 'Game ID is required' });
    }

    if (typeof gameId !== 'string' || !gameId.trim()) {
      return res.status(400).json({ error: 'Invalid game ID' });
    }
  
    Wishlist.findOneAndDelete({ userId: userId, gameId })
      .then(deletedItem => {
        if (!deletedItem) {
          return res.status(404).json({ error: 'Game not found in wishlist' });
        }
        res.status(200).json({ message: 'Game removed from wishlist' });
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
      });
  });

router.get('/wishlist', authenticateToken, (req, res) => {
  const userId = req.user.id; 
  console.log("Fetching wishlist for userId:", userId);

  Wishlist.find({ userId: userId })
    .then(wishlistItems => {
      res.status(200).json(wishlistItems);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    });
});

module.exports = router;
