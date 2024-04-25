const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('./../middleware/jwt.middleware.js');
const Expense = require("../models/Expense.model");


router.get('/', isAuthenticated, async(req, res) => {
  try {
  const expenses= await Expense.find({ user: req.payload._id })
     res.status(200).json(expenses)
  } catch (err) { 
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post('/', isAuthenticated, async(req, res) => {
  const { category, amount, date, currency, description } = req.body;
  const user = req.payload._id;

  try {

  const expense= await Expense.create({ category, amount, date, currency, description, user })
     res.status(201).json(expense)
  } catch(err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get('/:id', isAuthenticated, async(req, res) => {
  const { id } = req.params;

  try {
  const expense = await Expense.findOne({ _id: id, user: req.payload._id })
      if (!expense) {
        res.status(404).json({ message: "Expense not found" });
      } else {
        res.status(200).json(expense);
      }
    } catch(err) { 
    res.status(500).json({ message: "Internal Server Error" });
    }
});

router.put('/:id', isAuthenticated, async(req, res) => {
  const { id } = req.params;
  const { category, amount, date, currency, description } = req.body;

  try {
  const expense = await Expense.findOneAndUpdate(
    { _id: id, user: req.payload._id },
    { category, amount, date, currency, description },
    { new: true }
  )
      if (!expense) {
        res.status(404).json({ message: "Expense not found" });
      } else {
        res.status(200).json(expense);
      }
    } catch(err) {
    res.status(500).json({ message: "Internal Server Error" });
    }
});

router.delete('/:id', isAuthenticated, async(req, res) => {
  const { id } = req.params;
  try {
  const expense= await Expense.findOneAndDelete({ _id: id, user: req.payload._id })
      if (!expense) {
        res.status(404).json({ message: "Expense not found" });
      } else {
        res.status(204).json({ message: "Expense deleted successfully" });
      }
    } catch(err) {
      res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
