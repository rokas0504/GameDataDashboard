require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const https = require('https');
const authRoutes = require('./routes/auth');
const wishlistRoutes = require('./routes/wishlist');
const ratingsRoutes = require('./routes/ratings');


const app = express();
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api', wishlistRoutes);
app.use('/api', ratingsRoutes);

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





