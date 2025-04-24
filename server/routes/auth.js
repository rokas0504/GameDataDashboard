const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const User = require('../models/users');

router.post('/login', async (req, res) => {
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
  
  router.post('/register', async (req, res) => {
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

    module.exports = router;