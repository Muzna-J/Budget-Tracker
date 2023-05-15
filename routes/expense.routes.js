const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('./../middleware/jwt.middleware.js');
const Expense = require("../models/Expense.model");


router.get('/', isAuthenticated, (req, res, next) => {
  Expense.find({ user: req.payload._id })
    .then(expenses => res.status(200).json(expenses))
    .catch(err => res.status(500).json({ message: "Internal Server Error" }));
});

router.post('/', isAuthenticated, (req, res, next) => {
  const { category, amount, date, currency, description } = req.body;
  const user = req.payload._id;

  Expense.create({ category, amount, date, currency, description, user })
    .then(expense => res.status(201).json(expense))
    .catch(err => res.status(500).json({ message: "Internal Server Error" }));
});

router.get('/:id', isAuthenticated, (req, res, next) => {
  Expense.findOne({ _id: req.params.id, user: req.payload._id })
    .then(expense => {
      if (!expense) {
        res.status(404).json({ message: "Expense not found" });
      } else {
        res.status(200).json(expense);
      }
    })
    .catch(err => res.status(500).json({ message: "Internal Server Error" }));
});

router.put('/:id', isAuthenticated, (req, res, next) => {
  const { category, amount, date, currency, description } = req.body;

  Expense.findOneAndUpdate(
    { _id: req.params.id, user: req.payload._id },
    { category, amount, date, currency, description },
    { new: true }
  )
    .then(expense => {
      if (!expense) {
        res.status(404).json({ message: "Expense not found" });
      } else {
        res.status(200).json(expense);
      }
    })
    .catch(err => res.status(500).json({ message: "Internal Server Error" }));
});

router.delete('/:id', isAuthenticated, (req, res, next) => {
  Expense.findOneAndDelete({ _id: req.params.id, user: req.payload._id })
    .then(expense => {
      if (!expense) {
        res.status(404).json({ message: "Expense not found" });
      } else {
        res.status(204).json();
      }
    })
    .catch(err => res.status(500).json({ message: "Internal Server Error" }));
});

module.exports = router;
