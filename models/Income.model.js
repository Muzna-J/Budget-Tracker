const mongoose = require('mongoose');

const IncomeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  category: {
    // type: mongoose.Schema.Types.ObjectId,
    type: String,
    ref: 'Category'
  },

  amount: {
    type: Number,
    required: true
  },

  currency: {
    type: String,
    required: true,
    default: 'EUR' 
  },

  date: {
    type: Date,
    default: Date.now
  },
  
  description: {
    type: String,
    required: false
  }
});

const Income = mongoose.model('Income', IncomeSchema);

module.exports = Income;
