const users = require("../models/UserModel");

module.exports = async function (req, res, next) {
  const username = req.body.username;
  if (!username)
    return res.status(400).send({ message: "Username not provided." });
  users.findOne({ username }, (err, doc) => {
    if (err) return res.status(500).send({ message: "Something went wrong." });
    if (!doc) return res.status(404).send({ message: "User not found." });
    next();
  });
};
