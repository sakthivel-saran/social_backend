const express = require('express');
const router = express.Router();
const User = require('../models/User');


router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
  
    if (!name || !email || !password) {
      return res.status(400).json({ msg: 'Please enter all fields' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const newUser = new User({
      name,
      email,
      password 
    });

    const savedUser = await newUser.save();
    
    res.status(201).json({
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error during registration' });
  }
});


router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: 'Please enter all fields' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'User does not exist' });
    }

   
    if (password !== user.password) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error during login' });
  }
});

module.exports = router;
