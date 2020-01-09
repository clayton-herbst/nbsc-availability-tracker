const express = require("express");
const { mongoose } = require("../config/mongoose");
const router = express.Router();

const Club = mongoose.model("Club");

/* GET users listing. */
router.get("/", function(req, res, next) {
  res.send("respond with a resource");
});

router.get("/club", async (req, res, next) => {
  const clubObj = await Club.find();
  res.json(clubObj);
});

module.exports = router;
