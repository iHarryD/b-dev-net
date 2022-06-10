const router = require("express").Router();
const fileUploader = require("../configs/cloudinary.config");

router.post(
  "/cloudinary-upload",
  fileUploader.single("file"),
  (req, res, next) => {
    if (!req.file) {
      return next(new Error("No file to upload."));
    }
    res.status(200).send({ secureURL: req.file.path });
  }
);

module.exports = router;
