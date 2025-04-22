require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('./models/users');

const app = express();
app.use(express.json());

const dbURI = process.env.dbURI;

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(5000);
    console.log('Server is running on port 5000');
  })
  .catch(err => console.log(err));

const posts = [
  { username: 'John Doe', title: 'My first post' },
  { username: 'Jane Doe', title: 'My second post' }
];

// Protect this route with JWT
app.get('/posts', authenticateToken, (req, res) => {
  res.json(posts);
});

// Don't protect login
app.post('/login', (req, res) => {
  console.log("Body received:", req.body);
  
  const email = req.body.email;
  const password = req.body.password;

  if (!email && !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
User.findOne({ email: email })
    .then(user => {
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.password !== password) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        // const accessToken = jwt.sign({ name: user.username }, process.env.ACCESS_TOKEN_SECRET);
        // res.status(200).json({ accessToken });
        res.status(200).json(user);
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    });

//   const user = { name: username };
//   const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
//   res.json({ accessToken });
});

app.post('/register', (req, res) => {
    console.log("Body received:", req.body);
    
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, passa nd email are required' });
    }

    user = new User({
      username: username,
      email: email,
      password: password
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



// JWT auth middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']; // ✅ fixed
  const token = authHeader && authHeader.split(' ')[1]; 
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}