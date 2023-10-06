const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

router.post("/signup", async (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  try {
    const addedUser = await user.save();
    if (addedUser._id) {
      res.status(201).json(addedUser);
    }
  } catch (error) {
    console.error("Error creating user", error);
    res.status(500).json({ error: "Internal server error occured" });
  }
});

router.post("/login", async (req, res) => {
  const email = req.body.email.trim();
  try {
    const foundUser = await User.findOne().where({ email });
    if (foundUser && foundUser.comparePassword(req.body.password)) {
      res.status(200).json({ token: jwt.sign({ foundUser }, process.env.jwt_secret) });
    } else {
      res.status(400).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error user login", error);
    res.status(500).json({ error: "Internal server error occured" });
  }
});

module.exports = router;
