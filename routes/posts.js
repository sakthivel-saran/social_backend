const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const upload = require('../middleware/upload');


router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    const formattedPosts = posts.map(post => ({
      ...post._doc,
      id: post._id.toString() 
    }));
    res.json(formattedPosts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json({ ...post._doc, id: post._id.toString() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.post('/', upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]), async (req, res) => {
  try {
    const thumbnailFile = req.files?.thumbnail?.[0];
    const videoFile = req.files?.video?.[0];
    
    // Build URLs that point to the static /uploads path
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const thumbnailUrl = thumbnailFile ? `${baseUrl}/uploads/${thumbnailFile.filename}` : (req.body.thumbnailUrl || '');
    const videoUrl = videoFile ? `${baseUrl}/uploads/${videoFile.filename}` : (req.body.videoUrl || '');

    const post = new Post({
      title: req.body.title,
      datetime: req.body.datetime,
      body: req.body.body,
      author: req.body.author || 'Anonymous',
      videoUrl,
      thumbnailUrl
    });

    const newPost = await post.save();
    res.status(201).json({ ...newPost._doc, id: newPost._id.toString() });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE a post
router.put('/:id', upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]), async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const thumbnailFile = req.files?.thumbnail?.[0];
    const videoFile = req.files?.video?.[0];

    post.title = req.body.title || post.title;
    post.datetime = req.body.datetime || post.datetime;
    post.body = req.body.body || post.body;
    
    if (thumbnailFile) {
      post.thumbnailUrl = `${baseUrl}/uploads/${thumbnailFile.filename}`;
    } else if (req.body.thumbnailUrl !== undefined) {
      post.thumbnailUrl = req.body.thumbnailUrl;
    }

    if (videoFile) {
      post.videoUrl = `${baseUrl}/uploads/${videoFile.filename}`;
    } else if (req.body.videoUrl !== undefined) {
      post.videoUrl = req.body.videoUrl;
    }

    const updatedPost = await post.save();
    res.json({ ...updatedPost._doc, id: updatedPost._id.toString() });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a post
router.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// LIKE / UNLIKE a post (toggle)
router.post('/:id/like', async (req, res) => {
  try {
    const { userEmail } = req.body;
    if (!userEmail) return res.status(400).json({ message: 'userEmail is required' });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const index = post.likes.indexOf(userEmail);
    if (index === -1) {
      // Not liked yet — add like
      post.likes.push(userEmail);
    } else {
      // Already liked — remove like
      post.likes.splice(index, 1);
    }

    const updatedPost = await post.save();
    res.json({ ...updatedPost._doc, id: updatedPost._id.toString() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
