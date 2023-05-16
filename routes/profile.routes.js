const express = require("express");
const User = require("../models/User.model");

const { isAuthenticated } = require('./../middleware/jwt.middleware.js');

const router = express.Router();

// GET  /auth/profile  -  Get user profile
router.get('/profile', isAuthenticated, (req, res, next) => {
    const { _id } = req.payload;
  
    User.findById(_id)
      .then((user) => {
        if (!user) {
          res.status(404).json({ message: "User not found." });
          return;
        }
        // Omit the password when sending the user data
        user.password = undefined;
        res.status(200).json(user);
      })
      .catch(err => res.status(500).json({ message: "Internal Server Error" }));
  });

// PUT  /profile  -  Update user profile
router.put('/', isAuthenticated, (req, res, next) => {
  const { _id } = req.payload;
  const { email, name } = req.body;

  User.findById(_id)
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      user.name = name;
      user.email = email;

      return user.save();
    })
    .then(updatedUser => {
      updatedUser.password = undefined;
      res.status(200).json(updatedUser);
    })
    .catch(err => res.status(500).json({ message: "Internal Server Error" }));
});

module.exports = router;
