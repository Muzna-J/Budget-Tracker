const express = require("express");
const User = require("../models/User.model");
const jwt = require('jsonwebtoken')
const { isAuthenticated } = require('./../middleware/jwt.middleware.js');

const router = express.Router();

// GET  /auth/profile  -  Get user profile
router.get('/', isAuthenticated, (req, res, next) => {
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
router.put('/', isAuthenticated, async (req, res, next) => {
  const { _id } = req.payload;
  const { email, name } = req.body;

  try{
    const user = await User.findById(_id);
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      user.name = name;
      user.email = email;

      const payload = { _id, email, name };
      const authToken = jwt.sign(
        payload,
        process.env.TOKEN_SECRET,
        { algorithm: 'HS256', expiresIn: "6h" }
      );

      const updatedUser = await user.save();
      
      updatedUser.password = undefined;
      const responseObj = { authToken: authToken, user: updatedUser };
      res.status(200).json(responseObj);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
