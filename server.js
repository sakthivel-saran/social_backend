const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3500;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve uploaded files as static assets
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
// const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/social_media_app';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/social_media_app';

const BUILDFOLDER = process.env.REACT_URI || "D:/sakthi/react/renu/social/frontend/build/";

mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

app.use(cors());

// Routes
app.use(express.static(BUILDFOLDER));
app.use('/users', require('./routes/users'));
app.use('/posts', require('./routes/posts'));
app.get('/:path',(req,res)=>{
    res.sendFile(BUILDFOLDER+"index.html");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
