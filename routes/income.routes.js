const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('./../middleware/jwt.middleware.js');
const User = require("../models/User.model");
const Income = require("../models/Income.model");

// GET /income: Get all income entries for the logged-in user
router.get('/', isAuthenticated, (req, res, next) => {
  Income.find({ user: req.payload._id })
    .then(incomes => {
      if (incomes.length === 0) {
        res.status(404).json({ message: "No income entries found for this user" });
      } else {
        res.status(200).json(incomes);
      }
    })
    .catch(err => res.status(500).json({ message: "Internal Server Error" }));
});


// POST /income: Create a new income entry
router.post('/', isAuthenticated, (req, res, next) => {
  const { category, amount, date, currency, description } = req.body;
  const user = req.payload._id; // Changed this line
  console.log(req.body);
  console.log(user);
  Income.create({ category, amount, date, currency, description, user }) // Changed this line
    .then(income => res.status(201).json(income))
    .catch(err => {
      console.error(err); // log the error
      res.status(500).json({ message: "Internal Server Error" })
    });
});


// GET /income/:id: Get a specific income entry
router.get('/:id', isAuthenticated, (req, res, next) => {
  Income.findOne({ _id: req.params.id, user: req.payload._id })
    .then(income => {
      if (!income) {
        res.status(404).json({ message: "Income not found" });
      } else {
        res.status(200).json(income);
      }
    })
    .catch(err => res.status(500).json({ message: "Internal Server Error" }));
});

// PUT /income/:id: Update a specific income entry
router.put('/:id', isAuthenticated, (req, res, next) => {
  const { category, amount, date, currency, description } = req.body;

  Income.findOneAndUpdate(
    { _id: req.params.id, userId: req.payload._id },
    { category, amount, date, currency, description },
    { new: true } // This ensures that the updated document is returned
  )
    .then(income => {
      if (!income) {
        res.status(404).json({ message: "Income not found" });
      } else {
        res.status(200).json(income);
      }
    })
    .catch(err => res.status(500).json({ message: "Internal Server Error" }));
});

// DELETE /income/:id: Delete a specific income entry
router.delete('/:id', isAuthenticated, (req, res, next) => {
  Income.findOneAndDelete({ _id: req.params.id, userId: req.payload._id })
    .then(income => {
      if (!income) {
        res.status(404).json({ message: "Income not found" });
      } else {
        res.status(204).json(); 
      }
    })
    .catch(err => res.status(500).json({ message: "Internal Server Error" }));
});

module.exports = router;
