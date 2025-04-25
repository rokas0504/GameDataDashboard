require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const https = require('https');
const fs = require('fs');
const cors = require('cors');


const authRoutes = require('./routes/auth');
const wishlistRoutes = require('./routes/wishlist');
const ratingRoutes = require('./routes/ratings');

const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

const privateKey = fs.readFileSync('./certs/private.pem', 'utf8');
const certificate = fs.readFileSync('./certs/public.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };

mongoose.connect(process.env.dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');

  https.createServer(credentials, app).listen(5001, () => {
    console.log('HTTPS server running on port 5001');
  });
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

app.use('/api', authRoutes);
app.use('/api', wishlistRoutes);
app.use('/api', ratingRoutes);
