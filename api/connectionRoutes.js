const router = require("express").Router();
const tokenVerification = require("../middlewares/tokenVerification");
const userExistenceVerification = require("../middlewares/userExistenceVerification");
const connections = require("../models/ConnectionModel");

router.get("/connection/get-all", tokenVerification, (req, res) => {
  connections.find(
    {
      $and: [
        { connectionAccepted: true },
        { connectionBetween: { $in: [req.user] } },
      ],
    },
    (err, doc) => {
      if (err)
        return res.status(500).send({ message: "Something went wrong." });
      res
        .status(200)
        .send({ message: "Connections fetched successfully.", data: doc });
    }
  );
});

router.post(
  "/connection/new",
  tokenVerification,
  userExistenceVerification,
  async (req, res) => {
    try {
      const newConnection = new connections({
        connectionBetween: [req.user, req.body.username],
        initiatedBy: req.user,
      });
      await newConnection.save();
      res
        .status(200)
        .send({ message: "Connection initiated.", data: { newConnection } });
    } catch (err) {
      res.status(500).send({ message: "Something went wrong." });
    }
  }
);

router.patch(
  "/connection/accept",
  tokenVerification,
  userExistenceVerification,
  (req, res) => {
    connections.findOneAndUpdate(
      {
        $and: [
          { connectionBetween: { $all: [req.user, req.body.username] } },
          { initiatedBy: req.body.username },
        ],
      },
      { connectionAccepted: true },
      { new: true },
      (err, doc) => {
        if (err || !doc)
          return res.status(500).send({ message: "Something went wrong." });
        res.status(200).send({ message: "Connection accepted.", data: doc });
      }
    );
  }
);

router.delete(
  "/connection/remove",
  tokenVerification,
  userExistenceVerification,
  (req, res) => {
    connections.findOneAndDelete(
      {
        connectionBetween: { $all: [req.user, req.body.username] },
      },
      (err, doc) => {
        if (err)
          return res.status(500).send({ message: "Something went wrong." });
        res.status(200).send({ message: "Connection removed." });
      }
    );
  }
);

module.exports = router;
