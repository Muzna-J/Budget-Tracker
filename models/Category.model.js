const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  name: {
    type: String,
    required: true
  },
  
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true
  }
});

const Category = mongoose.model('Category', CategorySchema);

module.exports = Category;
