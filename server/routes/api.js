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
    const obj = await Player.findById(req.params.id)
    console.log(obj)
    res.json(obj.availability.id(req.params.id))
  } catch (err) {
    consola.error(err)
    next(err)
  }
})

router.get("/club/:id", async (req, res, next) => {
  // RETRIEVE ALL META DATA ASSOCIATED WITH THE CLUB
  consola.info(req.params)
  if (typeof req.params.id === "undefined") next(Error("Invalid request"))
  try {
    const doc = await Club.findById(req.params.id)
    res.json(doc)
  } catch (err) {
    consola.error(err)
    next(err)
  }
})

router.get("/seasons", async (req, res, next) => {
  // FETCH ALL THE SEASONS SAVED IN THE DATABASE
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
  // RETRIEVE ALL COMPETITIONS ASSOCIATED WITH A PARTICULAR SEASON
  try {
    if (
      typeof req.params === "undefined" ||
      typeof req.params.seasonId === "undefined"
    )
      throw new Error("Incorrect paramaters")
    else if (req.params.seasonId === "undefined")
      // INITIAL EMPTY SEASON ID REQUEST
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
  // RETRIEVE A SINGULAR COMPETITION WITHIN A PARTICULAR SEASON
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

router.post("/fixture/:id", async (req, res, next) => {
  // UPDATE / SET THE AVAILABILITY OF A PLAYERS
  try {
    if (
      typeof req.params === "undefined" ||
      typeof req.params.id === "undefined" ||
      typeof req.query.fixtures === "undefined"
    )
      throw new Error("Incorrect parameters")
    const doc = await Player.findById(req.params.id)
    if (doc === null) throw new Error("No results")
    const season = doc.availability.id(req.query.seasonId)
    if (season !== null) {
      const competition = season.id(req.query.competitionId, { upsert: true })
      if (competition !== null) {
        competition.fixtures = req.query.fixture
      } else {
        season.competitions.append({
          _id: req.query.competitionId,
          status: req.query.status,
          fixtures: req.query.fixtures
        })
      }
    } else {
      doc.availability.push({
        _id: req.query.seasonId,
        competitions: [
          {
            _id: req.query.competitionId,
            status: req.query.status,
            fixtures: req.query.fixtures
          }
        ]
      })
    }
    doc.save()
    res.status(200).json({ mgs: "success" })
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
