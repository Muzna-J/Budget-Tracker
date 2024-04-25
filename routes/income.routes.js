const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('./../middleware/jwt.middleware.js');
const User = require("../models/User.model");
const Income = require("../models/Income.model");


router.get('/', isAuthenticated, async(req, res) => {
  try {
  const incomes= await Income.find({ user: req.payload._id })
      res.status(200).json(incomes);
    } catch(err) {
      res.status(500).json({ message: "Internal Server Error" });
    }
});


router.post('/', isAuthenticated, async(req, res) => {
  const { category, amount, date, currency, description } = req.body;
  const user = req.payload._id;

  try {
  const income= await Income.create({ category, amount, date, currency, description, user })
     res.status(201).json(income);
  } catch(err) {
      res.status(500).json({ message: "Internal Server Error" });
  }
    });


router.get('/:id', isAuthenticated, async(req, res) => {
  try {
  const income = await Income.findOne({ _id: req.params.id, user: req.payload._id })
      if (!income) {
        res.status(404).json({ message: "Income not found" });
      } else {
        res.status(200).json(income);
      }
    } catch(err) {
      res.status(500).json({ message: "Internal Server Error" });
    }
});

// PUT /income/:id: Update a specific income entry
router.put('/:id', isAuthenticated, async(req, res) => {
  const { category, amount, date, currency, description } = req.body;
  const id = req.params.id;

  try {
  const income= await  Income.findOneAndUpdate(
    { _id: id, user: req.payload._id },
    { category, amount, date, currency, description },
    { new: true } 
  )
      if (!income) {
        res.status(404).json({ message: "Income not found" });
      } else {
        res.status(200).json(income);
      }
    } catch(err) {
      res.status(500).json({ message: "Internal Server Error" });
    }
});


router.delete('/:id', isAuthenticated, async(req, res) => {
  const id = req.params.id;

  try {
  const income = await Income.findOneAndDelete({ _id: id, user: req.payload._id })
      if (!income) {
        res.status(404).json({ message: "Income not found" });
      } else {
        res.status(204).json(); 
      }
    } catch(err) { 
      res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
