const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

router.post("/signup", async (req, res) => {
  const hash = bcrypt.hashSync(req.body.password, 10);
  const user = new User({
    name: req.body.name.trim(),
    email: req.body.email.trim(),
    password: hash,
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
  const password = req.body.password;
  try {
    const foundUser = await User.findOne().where({ email });
    const passwordsMatch = bcrypt.compareSync(password, foundUser.password);
    if (passwordsMatch) {
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
