const express = require("express");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
   return res.status(400).json({ message: "Please provide name, email, and password" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

  const user= await User.create({ name, email, password })
  const { _id, name: userName, email: userEmail } = user;

  res.status(201).json({ user: { _id, name: userName, email: userEmail } });
   
  } catch(error)  {
      res.status(500).json({ message: error });
    };
  });
  


router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please enter both email and password to login' });
  }

  try {
  const user = await User.findOne({ email })
      if (!user) {
        return res.status(401).json({ message: "User not found." });
      }

      const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          console.log(err);
          return res.status(401).json({ message: "Invalid email or password" });
        }

          const payload = { _id: user._id, name: user.name, email: user.email };

          const authToken = jwt.sign(
            payload,
            process.env.TOKEN_SECRET,
            { algorithm: 'HS256', expiresIn: "6h" }
          );
          res.status(200).json({ authToken });
        } catch(error) {
          res.status(401).json({ message: "Unable to authenticate the user" });
        }
      });


router.get('/verify', async(req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: "No token provided" });
  try {
  const user = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = user;
    res.json(user);  // returns the user's information stored in the token
  } catch (error) {
     res.status(403).json({ message: "Token is not valid" });
  }
  });


module.exports = router;
