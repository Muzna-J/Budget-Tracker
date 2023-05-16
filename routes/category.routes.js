const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('./../middleware/jwt.middleware.js');
const Category = require("../models/Category.model");



router.get('/', isAuthenticated, (req, res, next) => {
  Category.find({ user: req.payload._id })
    .then(categories => res.status(200).json(categories))
    .catch(err => res.status(500).json({ message: "Internal Server Error" }));
});

router.post('/', isAuthenticated, (req, res, next) => {
  const { name, type } = req.body;
  const user = req.payload._id;

  Category.create({ name, type, user })
    .then(category => res.status(201).json(category))
    .catch(err => res.status(500).json({ message: "Internal Server Error" }));
});

router.get('/:id', isAuthenticated, (req, res, next) => {
  Category.findOne({ _id: req.params.id, user: req.payload._id })
    .then(category => {
      if (!category) {
        res.status(404).json({ message: "Category not found" });
      } else {
        res.status(200).json(category);
      }
    })
    .catch(err => res.status(500).json({ message: "Internal Server Error" }));
});

router.put('/:id', isAuthenticated, (req, res, next) => {
  const { name, type } = req.body;

  Category.findOneAndUpdate(
    { _id: req.params.id, user: req.payload._id },
    { name, type },
    { new: true }
  )
    .then(category => {
      if (!category) {
        res.status(404).json({ message: "Category not found" });
      } else {
        res.status(200).json(category);
      }
    })
    .catch(err => res.status(500).json({ message: "Internal Server Error" }));
});

router.delete('/:id', isAuthenticated, (req, res, next) => {
  Category.findOneAndDelete({ _id: req.params.id, user: req.payload._id })
    .then(category => {
      if (!category) {
        res.status(404).json({ message: "Category not found" });
      } else {
        res.status(204).json();
      }
    })
    .catch(err => res.status(500).json({ message: "Internal Server Error" }));
});

module.exports = router;
