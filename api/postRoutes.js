const router = require("express").Router();
const tokenVerification = require("../middlewares/tokenVerification");
const postJoiValidation = require("../validations/postJoiValidation");
const posts = require("../models/PostModel");

router.get("/posts/get-all", (req, res) => {
  posts.find((err, doc) => {
    if (err) return res.status(500).send({ message: "Something went wrong." });
    res.status(200).send(doc);
  });
});

router.post("/posts/new", tokenVerification, async (req, res) => {
  try {
    const { error } = postJoiValidation(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });
    const newPost = new posts({
      ...req.body,
      postedBy: req.user,
    });
    await newPost.save();
    res
      .status(200)
      .send({ message: "Post created successfully.", post: newPost });
  } catch (err) {
    console.log(err);
  }
});

router.delete("/posts/delete", tokenVerification, (req, res) => {
  const postID = req.body.postID;
  if (!postID) return res.status(300).send({ message: "Post not found." });
  posts.findOneAndDelete(
    { $and: [{ postedBy: req.user }, { _id: postID }] },
    (err, doc) => {
      if (err)
        return res.status(500).send({ message: "Something went wrong." });
      res.status(200).send({ message: "Post deleted successfully." });
    }
  );
});

module.exports = router;