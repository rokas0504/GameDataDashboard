require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('./models/users');
const Wishlist = require('./models/wishlist');
const Ratings = require('./models/ratings');
const cors = require('cors');
const bcrypt = require('bcrypt');
const fs = require('fs');
const https = require('https');
const validator = require('validator');

const app = express();
app.use(express.json());

const privateKey = fs.readFileSync('private.pem', 'utf8');
const certificate = fs.readFileSync('public.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };

const dbURI = process.env.dbURI;

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    https.createServer(credentials, app).listen(5001, () => {
      console.log('HTTPS server is running on port 5001');
  });
  })
  .catch(err => console.log(err));

app.get('/posts',  (req, res) => {
  res.json(posts);
});


app.post('/api/login', async (req, res) => {
  console.log("Body received:", req.body);

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'Invalid email or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

    res.json({ 
      token, 
      username: user.username 
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/register', async (req, res) => {
    console.log("Body received:", req.body);
    
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, passa nd email are required' });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    if ( username.length > 50) {
      return res.status(400).json({ error: 'Username must be shorter than 50 charachters' });
    }
    if ( password.length > 50) {
      return res.status(400).json({ error: 'Password must be shorter than 50 charachters' });
    }

    const existingUser = await User.findOne({
      $or: [{ email: email }, { username: username }]
    });

    if (existingUser) {
      return res.status(409).json({ error: 'Email or username already in use' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username: username,
      email: email,
      password: hashedPassword
    });
    user.save()
      .then(() => {
        res.status(201).json({ message: 'User registered successfully' });
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
      });

  });

app.post('/api/wishlist', authenticateToken, (req, res) => {
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

app.delete('/api/wishlist', authenticateToken, (req, res) => {
    const userId = req.user.id; 
    const gameId = String(req.body.gameId); 
  
    if (!gameId) {
      return res.status(400).json({ error: 'Game ID is required' });
    }

    if (typeof gameId !== 'string' || !gameId.trim()) {
      return res.status(400).json({ error: 'Invalid game ID' });
    }
  
    // Find and delete the wishlist item based on userId and gameId
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

app.get('/api/wishlist', authenticateToken, (req, res) => {
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

app.post('/api/rate', authenticateToken, (req, res) => {

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

    app.get('/api/ratings/:gameId', authenticateToken, async (req, res) => {
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

// JWT auth middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; 
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

