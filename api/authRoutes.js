const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const users = require("../models/UserModel");
const {
  signupJoiValidation,
  loginJoiValidation,
} = require("../validations/authJoiValidation");

router.post("/signup", async (req, res, next) => {
  const { error } = signupJoiValidation(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });
  try {
    const userData = await users.findOne({
      $or: [{ email: req.body.email }, { username: req.body.username }],
    });
    if (userData) {
      if (userData.email === req.body.email) {
        return res
          .status(403)
          .send({ message: "This email is already registered with us." });
      } else {
        return res.status(403).send({ message: "This username is taken." });
      }
    }
    const encryptedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new users({ ...req.body, password: encryptedPassword });
    await newUser.save();
    res.status(200).send({ message: "Successfully registered." });
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  const wrongCredentialsMessage = "Invalid email or password.";
  const { error } = loginJoiValidation(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });
  try {
    const userData = await users.findOne({ username: req.body.username });
    if (!userData)
      return res.status(401).send({ message: wrongCredentialsMessage });
    const passwordMatches = await bcrypt.compare(
      req.body.password,
      userData.password
    );
    if (!passwordMatches)
      return res.status(401).send({ message: wrongCredentialsMessage });
    const token = jwt.sign(
      { username: userData.username },
      process.env.TOKEN_SECRET
    );
    res.status(200).send({
      message: "Successfully logged in!",
      fullName: userData.fullName,
      username: userData.username,
      token,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
