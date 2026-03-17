const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  datetime: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  author: {
    type: String,
    default: 'Anonymous'
  },
  videoUrl: {
    type: String,
    default: ''
  },
  thumbnailUrl: {
    type: String,
    default: ''
  },
  likes: {
    type: [String],
    default: []
  }
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
