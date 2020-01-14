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
router.get("/test/:id", async function(req, res, next) {
  console.log(req.params)
  try {
    if (typeof req.params === "undefined")
      throw new Error("Incorrect paramater")
    const obj = await Player.findOne({ "availability._id": req.params.id })
    console.log(obj)
    res.json(obj.availability.id(req.params.id))
  } catch (err) {
    consola.error(err)
    next(err)
  }
})

router.get("/club", async (req, res, next) => {
  // NEED TO BE UPDATED ... USE URL PARAMATERS
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

router.get("/seasons", async (req, res, next) => {
  // NEEDS! TO BE UPDATED TO ONLY GIVE RESULTS FOR ALL
  /*
   * Returns stored information about a particular season.
   * Contains an array of competitions associated with the season. This array
   * details all information relating to the competition.
   */
  try {
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
    res.status(200)
    res.json(res.locals.data)
  } catch (err) {
    consola.error(err)
    next(err)
  }
})

router.get("/season/:seasonId", async (req, res, next) => {
  // RETRIEVE THE COMPETITIONS WITHIN A PARTICULAR SEASON
  try {
    if (
      typeof req.params === "undefined" ||
      typeof req.params.seasonId === "undefined"
    )
      throw new Error("Incorrect paramaters")
    else if (req.params.seasonId == "0")
      return res.json({ status: "ERROR", competitions: [] })

    const doc = await Season.findById(req.params.seasonId)
    consola.info(doc)
    res.locals.data = {
      competitions: doc.competitions,
      id: doc._id
    }
    res.status(200)
    res.json(res.locals.data)
  } catch (err) {
    consola.error(err)
    next(err)
  }
})

router.get("/competition/:seasonId", async (req, res, next) => {
  // RETRIEVE A COMPETITION WITHIN A PARTICULAR SEASON
  try {
    if (
      typeof req.params === "undefined" ||
      typeof req.params.seasonId === "undefined" ||
      typeof req.query.competitionId === "undefined"
    )
      throw new Error("Incorrect paramaters")

    const doc = await Season.findById(req.params.seasonId)
    const competition = doc.competitions.id(req.query.competitionId)
    consola.info(doc)
    res.locals.data = competition
    res.status(200)
    res.json(res.locals.data)
  } catch (err) {
    consola.error(err)
    next(err)
  }
})

router.get("/fixture/:id", async (req, res, next) => {
  // RETRIEVE THE AVAILABILITY OF A PLAYER
  try {
    if (typeof req.params === "undefined")
      throw new Error("Incorrect paramater")
    const doc = await Player.findById(req.params.id)
    if (doc === null) throw new Error("No results")
    const season = doc.availability.id(req.query.seasonId)
    const competition = season.competitions.id(req.query.competitionId)
    consola.info(doc)
    res.json(competition)
  } catch (err) {
    consola.error(err)
    next(err)
  }
})

router.get("/player", async (req, res, next) => {
  const playerObj = await Player.find()
  res.json(playerObj)
})

router.post("/admin/club/:id", async (req, res, next) => {
  // UPDATE THE ACTIVE SEASON FOR A CLUB
  try {
    if (
      typeof req.params.id === "undefined" ||
      typeof req.query.seasonId === "undefined"
    )
      throw new Error("Incorrect paramaters")
    const club = await Club.findById(req.params.id)
    club.activeSeason = req.query.seasonId
    await club.save()
    res.status(200)
    res.json({ status: "success" })
  } catch (err) {
    consola.error(err)
    next(err)
  }
})

module.exports = router
