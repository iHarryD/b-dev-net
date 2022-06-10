const router = require("express").Router();
const users = require("../models/UserModel");
const posts = require("../models/PostModel");
const tokenVerification = require("../middlewares/tokenVerification");

router.get("/user/get", (req, res) => {
  const user = req.body.user;
  if (!user) return res.status(404).send({ message: "User not found." });
  users.findOne({ username: user }, (err, userDoc) => {
    if (err) return res.status(500).send({ message: "Something went wrong." });
    posts.find({ postedBy: user }, (err, postDoc) => {
      if (err)
        return res.status(500).send({ message: "Something went wrong." });
      res.status(200).send({
        message: "User found.",
        data: {
          username: userDoc.username,
          fullName: userDoc.fullName,
          bio: userDoc.bio,
          posts: postDoc,
        },
      });
    });
  });
});

router.get("/user/posts", (req, res) => {
  const user = req.body.user;
  if (!user) return res.status(404).send({ message: "User not found." });
  posts.find({ postedBy: user }, (err, doc) => {
    if (err) return res.status(500).send({ message: "Something went wrong." });
    res.status(200).send({ message: "Posts found.", data: doc });
  });
});

router.patch("/user/update", tokenVerification, (req, res) => {
  users.findOneAndUpdate(
    { username: req.user },
    {
      fullName: req.body.fullName,
      profilePictureSourceURL: req.body.profilePictureSourceURL,
      bio: req.body.bio,
    },
    { new: true },
    (err, doc) => {
      if (err)
        return res.status(500).send({ message: "Something went wrong." });
      res
        .status(200)
        .send({ message: "User updated successfully.", data: doc });
    }
  );
});

module.exports = router;
