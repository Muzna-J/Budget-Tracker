const express = require("express");
const User = require("../models/User.model");
const jwt = require('jsonwebtoken')
const { isAuthenticated } = require('./../middleware/jwt.middleware.js');

const router = express.Router();

router.get('/', isAuthenticated, async(req, res) => {
    const { _id } = req.payload;

    try{
    const user = await User.findById(_id).select('-password'); //excludes password field directly
        if (!user) {
          return res.status(404).json({ message: "User not found." });
        }
        res.status(200).json(user);
      } catch(err) {
        res.status(500).json({ message: "Internal Server Error" });
    }
  });


router.put('/update-profile', isAuthenticated, async (req, res) => {
  const { _id } = req.payload;
  const { email, name } = req.body;

  try{
    const updatedUser = await User.findByIdAndUpdate(_id, { $set: { email, name } }, { new: true, runValidators: true }).select('-password');
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found." });
      }

      const payload = { _id: updatedUser._id, email: updatedUser.email, name: updatedUser.name };
      const authToken = jwt.sign(
        payload,
        process.env.TOKEN_SECRET,
        { algorithm: 'HS256', expiresIn: "6h" }
      );
      res.status(200).json({ authToken, user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
