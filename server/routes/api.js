const express = require("express")
const mongoose = require("mongoose")
const router = express.Router()
const consola = require("consola")

require("../models/club")
require("../models/season")
require("../models/player")

const Club = mongoose.model("Club")
const Season = mongoose.model("Season")
const Player = mongoose.model("Player")

/* GET users listing. */
router.get("/", function(req, res, next) {
  res.send("respond with a resource")
})

router.get("/club", async (req, res, next) => {
  if (typeof req.query.club === "undefined")
    next(Error("Invalid query paramaters"))
  try {
    const clubObj = await Club.findById(req.query.club)
    res.json(clubObj)
  } catch (err) {
    consola.error(err)
    next(err)
  }
})

router.get("/season", async (req, res, next) => {
  /*
   * Returns stored information about a particular season.
   * Contains an array of competitions associated with the season. This array
   * details all information relating to the competition.
   */
  try {
    if (req.query.type.toUpperCase() === "SINGLE") {
      if (typeof req.query.seasonId === "undefined")
        throw new Error("Invalid query paramaters")
      else if (req.query.seasonId == 0)
        res.locals.data = {
          competitions: []
        }
      else {
        const doc = await Season.findById(req.query.seasonId)
        consola.info(doc)
        res.locals.data = {
          competitions: doc.competitions,
          _id: doc._id
        }
      }
    } else if (req.query.type.toUpperCase() === "ALL") {
      const docs = await Season.find()
      consola.info(docs)
      res.locals.data = docs.map(doc => {
        return {
          title: doc.title,
          status: doc.status.list[doc.status.current],
          startDate: doc.timelines.start,
          endDate: doc.timelines.end,
          _id: doc._id
        }
      })
    } else throw new Error("Request paramater [type] not specified")
    res.status(200)
    res.json(res.locals.data)
  } catch (err) {
    consola.error(err)
    next(err)
  }
})

router.get("/player", async (req, res, next) => {
  const playerObj = await Player.find()
  res.json(playerObj)
})

module.exports = router
