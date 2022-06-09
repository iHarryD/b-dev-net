const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const server = express();
const authRoutes = require("./api/authRoutes");
require("dotenv").config();

mongoose.connect(process.env.DB_PASSKEY, () => console.log("connected to db"));

server.use(cors());
server.use(express.json());
server.use("/api", authRoutes);

server.listen(process.env.PORT || 3001);
