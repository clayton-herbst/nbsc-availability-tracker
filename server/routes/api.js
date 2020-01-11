const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

require("../models/club");
require("../models/season");
require("../models/player");

const Club = mongoose.model("Club");
const Season = mongoose.model("Season");
const Player = mongoose.model("Player");

/* GET users listing. */
router.get("/", function(req, res, next) {
  res.send("respond with a resource");
});

router.get("/club", async (req, res, next) => {
  const clubObj = await Club.find();
  res.json(clubObj);
});

router.get("/season", async (req, res, next) => {
  const seasonObj = await Season.find();
  res.json(seasonObj);
});

router.get("/player", async (req, res, next) => {
  const playerObj = await Player.find();
  res.json(playerObj);
});

module.exports = router;
