const express = require("express");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

const router = express.Router();

router.post('/signup', (req, res, next) => {
  const { email, password, name } = req.body;

  if (email === '' || password === '' || name === '') {
    res.status(400).json({ message: "Provide email, password, and name" });
    return;
  }

  User.create({ email, password, name })
    .then((createdUser) => {
      const { email, name, _id } = createdUser;
      const user = { email, name, _id };

      res.status(201).json({ user });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    });
});

router.post('/login', (req, res, next) => {
  const { email, password } = req.body;

  if (email === '' || password === '') {
    res.status(400).json({ message: "Provide email and password." });
    return;
  }

  User.findOne({ email })
    .then((foundUser) => {
      if (!foundUser) {
        res.status(401).json({ message: "User not found." });
        return;
      }

      bcrypt.compare(password, foundUser.password, function (err, result) {
        if (err) {
          console.log(err);
          res.status(500).json({ message: "Internal Server Error" });
          return;
        }
        
        if (result) {
          const { _id, email, name } = foundUser;

          const payload = { _id, email, name };

          const authToken = jwt.sign(
            payload,
            process.env.TOKEN_SECRET,
            { algorithm: 'HS256', expiresIn: "6h" }
          );

          res.status(200).json({ authToken });
        } else {
          res.status(401).json({ message: "Unable to authenticate the user" });
        }
      });

    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    });
});

router.get('/verify', (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401); // if there isn't any token

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    console.log(err);

    if (err) return res.sendStatus(403);

    req.user = user;

    console.log(`req.user`, req.user);

    res.json(user);  // returns the user's information stored in the token
  });
});

module.exports = router;
