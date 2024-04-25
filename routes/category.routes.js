const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('./../middleware/jwt.middleware.js');
const Category = require("../models/Category.model");



router.get('/', isAuthenticated, async(req, res) => {
  try{
  const categories= await Category.find({ user: req.payload._id })
    res.status(200).json(categories);
  }catch(err) {

   res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post('/', isAuthenticated, async(req, res) => {
  const { name, type } = req.body;
  const user = req.payload._id;

  try{

  const category= await Category.create({ name, type, user })
     res.status(201).json(category)
  }catch(err) {

  res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get('/:id', isAuthenticated, async(req, res) => {
  const { id } = req.params;
  try {
  const category= await Category.findOne({ _id:id, user: req.payload._id })
      if (!category) {
        res.status(404).json({ message: "Category not found" });
      } else {
        res.status(200).json(category);
      }
   
    } catch(err) {
    res.status(500).json({ message: "Internal Server Error" });
    }
});

router.put('/:id', isAuthenticated, async(req, res) => {
  const { id } = req.params;
  const { name, type } = req.body;

  try{
  const category= await Category.findOneAndUpdate(
    { _id: id, user: req.payload._id },
    { name, type },
    { new: true }
  );
    
      if (!category) {
        res.status(404).json({ message: "Category not found" });
      } else {
        res.status(200).json(category);
      }
    } catch(err) {
      res.status(500).json({ message: "Internal Server Error" });
    }
});


router.delete('/:id', isAuthenticated, async(req, res) => {
  const { id } = req.params;

  try{
  const category= await Category.findOneAndDelete({ _id: id, user: req.payload._id })
   
      if (!category) {
        res.status(404).json({ message: "Category not found" });
      } else {
        res.status(204).json({ message: "Category deleted successfully" });
      }
    } catch(err) {
      res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
