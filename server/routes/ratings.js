const express = require('express');
const router = express.Router();
const Ratings = require('../models/ratings');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/rate', authenticateToken, (req, res) => {

    const userId = req.user.id; 
      const gameId = String(req.body.gameId);
      const rating = Number(req.body.rating); 
      
      if (!gameId || !rating) {
          return res.status(400).json({ error: 'Game ID and rating are required' });
      }
  
      if (typeof rating !== 'number' || isNaN(rating) || rating < 1 || rating > 10) {
       return res.status(400).json({ error: 'Rating must be a number between 1 and 10' });
  }
      
      Ratings.findOne({ userId: userId, gameId: gameId })
      .then(existingItem => {
          if (existingItem) {
              existingItem.rating = rating;
              existingItem.save()
              .then(() => {
                  res.status(200).json({ message: 'Rating updated successfully' });
              });
          }
          else {
              const newRating = new Ratings({ userId: userId, gameId: gameId, rating: rating });
              newRating.save()
                  .then(() => {
                      res.status(201).json({ message: 'Game rated successfully' });
                  })
                  .catch(err => {
                      console.error(err);
                      res.status(500).json({ error: 'Internal server error' });
                  });
          }
      })
      .catch(err => {
          console.error(err);
          return res.status(500).json({ error: 'Internal server error' });
      });
  
      });
  
router.get('/ratings/:gameId', authenticateToken, async (req, res) => {
        const rawGameId = req.params.gameId;
        const gameId = String(rawGameId).trim();
  
        if (!gameId || typeof gameId !== 'string') {
          return res.status(400).json({ error: 'Invalid game ID' });
        }
        
        try {
          const ratings = await Ratings.find({ gameId });
      
          if (ratings.length === 0) {
            return res.status(200).json({ averageRating: 0 });
          }
      
          const average = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
      
          res.status(200).json({ averageRating: average.toFixed(2) });
        } catch (err) {
          console.error(err);
          res.status(500).json({ error: 'Internal server error' });
        }
      });

      module.exports = router;