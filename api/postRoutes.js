const router = require("express").Router();
const tokenVerification = require("../middlewares/tokenVerification");
const postJoiValidation = require("../validations/postJoiValidation");
const commentJoiValidation = require("../validations/commentJoiValidation");
const posts = require("../models/PostModel");
const users = require("../models/UserModel");

router.get("/post/get-all", (req, res) => {
  posts.find((err, doc) => {
    if (err) return res.status(500).send({ message: "Something went wrong." });
    res.status(200).send({ message: "All posts fetched.", data: doc });
  });
});

router.post("/post/new", tokenVerification, async (req, res) => {
  try {
    const { error } = postJoiValidation(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });
    users.findOne({ username: req.user }, async (err, doc) => {
      if (err)
        return res.status(500).send({ message: "Something went wrong." });
      try {
        const newPost = new posts({
          ...req.body,
          postedBy: {
            username: doc.username,
            fullName: doc.fullName,
            profilePictureSourceURL: doc.profilePictureSourceURL,
          },
        });
        await newPost.save();
        res
          .status(200)
          .send({ message: "Post created successfully.", data: newPost });
      } catch (err) {
        res.status(500).send({ message: "Something went wrong." });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

router.delete("/post/delete", tokenVerification, (req, res) => {
  const postID = req.body.postID;
  if (!postID) return res.status(404).send({ message: "Post not found." });
  posts.findOneAndDelete(
    { $and: [{ postedBy: req.user }, { _id: postID }] },
    (err, doc) => {
      if (err)
        return res.status(500).send({ message: "Something went wrong." });
      res.status(200).send({ message: "Post deleted successfully." });
    }
  );
});

router.patch("/post/like", tokenVerification, (req, res) => {
  const postID = req.body.postID;
  if (!postID) return res.status(404).send({ message: "Post not found." });
  posts.findOneAndUpdate(
    { _id: postID },
    { $addToSet: { likes: req.user } },
    { new: true },
    (err, doc) => {
      if (err)
        return res.status(500).send({ message: "Something went wrong." });
      res.status(200).send({ message: "Post liked.", data: doc });
    }
  );
});

router.patch("/post/remove-like", tokenVerification, (req, res) => {
  const postID = req.body.postID;
  if (!postID) return res.status(404).send({ message: "Post not found." });
  posts.findOneAndUpdate(
    { _id: postID },
    { $pull: { likes: req.user } },
    { new: true },
    (err, doc) => {
      if (err)
        return res.status(500).send({ message: "Something went wrong." });
      res.status(200).send({ message: "Post unliked.", data: doc });
    }
  );
});

router.post("/post/comment", tokenVerification, (req, res) => {
  const joiValidation = commentJoiValidation(req.body);
  const { error } = joiValidation;
  if (error) return res.status(500).send({ message: error.details[0].message });
  users.findOne({ username: req.user }, (userErr, userDoc) => {
    if (userErr)
      return res.status(500).send({ message: "Something went wrong." });
    posts.findOneAndUpdate(
      { _id: req.body.postID },
      {
        $push: {
          comments: {
            commentedBy: {
              username: userDoc.username,
              fullName: userDoc.fullName,
              profilePictureSourceURL: userDoc.profilePictureSourceURL,
            },
            comment: req.body.comment,
          },
        },
      },
      { new: true },
      (postErr, postDoc) => {
        if (postErr)
          return res.status(500).send({ message: "Something went wrong." });
        res.status(200).send({ message: "Comment posted.", data: postDoc });
      }
    );
  });
});

module.exports = router;
