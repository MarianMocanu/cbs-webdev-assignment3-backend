const router = require("express").Router();
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const validateToken = require("../middlewares/validateToken");

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
    if (foundUser && (await foundUser.comparePassword(req.body.password))) {
      res.status(200).json({ token: jwt.sign({ id: foundUser._id }, process.env.jwt_secret) });
    } else {
      res.status(400).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error user login", error);
    res.status(500).json({ error: "Internal server error occured" });
  }
});

router.get("/logedinUser", validateToken, async (req, res) => {
  try {
    const foundUser = await User.findById(req.user.id);
    if (foundUser) {
      res.status(200).json({ id: foundUser._id, name: foundUser.name, email: foundUser.email });
    } else {
      res.status(400).json({ error: "Invalid token" });
    }
  } catch (error) {
    console.error("Error user login", error);
    res.status(500).json({ error: "Internal server error occured" });
  }
});

module.exports = router;
