const express = require("express")
const mongoose = require("mongoose")
const router = express.Router()
const consola = require("consola")

require("../models/club")
require("../models/season")
require("../models/player")
require("../models/competition")

const Club = mongoose.model("Club")
const Season = mongoose.model("Season")
const Player = mongoose.model("Player")
const Competition = mongoose.model("Competition")

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
  if (typeof req.params.id === "undefined") next(Error("Invalid request"))

  try {
    const doc = await Club.findById(req.params.id)
    res.status(200).json(doc)
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
        id: doc._id
      }
    })
    res.status(200).json(res.locals.data)
  } catch (err) {
    consola.error(err)
    next(err)
  }
})

router.get("/season/:id", async (req, res, next) => {
  // RETRIEVE ALL COMPETITIONS ASSOCIATED WITH A PARTICULAR SEASON
  try {
    if (
      typeof req.params === "undefined" ||
      typeof req.params.id === "undefined"
    )
      throw new Error("Incorrect paramaters")
    else if (req.params.id === "all")
      // INITIAL EMPTY SEASON ID REQUEST
      return res.json({ status: "WAIT", competitions: [] })

    const compDocuments = await Competition.find({ season: req.params.id })
    consola.info(compDocuments)
    if (compDocuments === null)
      res.locals.data = {
        ok: false,
        msg: "Error processing request",
        competitions: []
      }
    else {
      let competitions = compDocuments.map(doc => {
        return {
          title: doc.title,
          startDate: doc.timelines.start,
          endDate: doc.timelines.start,
          description: doc.description,
          id: doc._id
        }
      })
      res.locals.data = { competitions: competitions }
      consola.info(res.locals.data.competitions)
      if (res.locals.data.competitions.length > 0) res.locals.data.ok = true
      else res.locals.data.ok = false
    }
    res.status(200).json(res.locals.data)
  } catch (err) {
    consola.error(err)
    next(err)
  }
})

router.get("/competition/:id", async (req, res, next) => {
  // RETRIEVE A SINGULAR COMPETITION WITHIN A PARTICULAR SEASON & ALL ASSOCIATED FIXTURES
  try {
    if (
      typeof req.params === "undefined" ||
      typeof req.query.season === "undefined" ||
      typeof req.params.id === "undefined"
    )
      throw new Error("Incorrect paramaters")

    const compDoc = await Competition.findById(req.params.id)
    consola.info(compDoc)
    if (compDoc === null)
      res.locals.data = {
        ok: false,
        msg: "Error processing request 1",
        fixtures: []
      }
    else if (compDoc.season._id != req.query.season) {
      res.locals.data = {
        ok: false,
        msg: "Error processing request",
        fixtures: []
      }
    } else {
      res.locals.data = compDoc
    }
    res.status(200).json(res.locals.data)
  } catch (err) {
    consola.error(err)
    next(err)
  }
})

router.get("/fixture/:id", async (req, res, next) => {
  // RETRIEVE THE AVAILABILITY OF A PLAYER
  /**
   * PARAMS:
   *  - :id -- player id
   * QUERY PARAMS:
   *  - season -- season id
   *  - competition -- competition id
   *  - length -- number of fixtures
   */
  try {
    if (
      typeof req.params === "undefined" ||
      typeof req.params.id === "undefined" ||
      typeof req.query.season === "undefined" ||
      typeof req.query.competition === "undefined"
    )
      throw new Error("Incorrect paramater")
    const playerDoc = await Player.findById(req.params.id)
    consola.info(playerDoc)
    if (playerDoc === null) throw new Error("No results")
    else if (playerDoc.seasons.id(req.query.season) === null) {
      throw new Error("Invalid season")
    } else if (playerDoc.availability.id(req.query.competition) === null) {
      // COMPETITION AVAILABILITY NEEDS TO BE ADDED
      let fixtures = new Array(parseInt(req.query.length))
      playerDoc.availability.push({
        _id: req.query.competition,
        fixtures: fixtures.fill(0), // default to 0 / maybe
        status: ["maybe", "yes", "no"]
      })
    }
    const doc = await playerDoc.save()
    res.status(200).json(doc.availability.id(req.query.competition))
  } catch (err) {
    consola.error(err)
    next(err)
  }
})

router.post("/fixture/:id", async (req, res, next) => {
  // SAVE A PLAYERS AVAILABILITY
  /**
   * PARAMS:
   *  - :id -- player id
   * QUERY PARAMS:
   *  - season -- season id
   *  - competition -- competition id
   *  - fixtures -- fixture availability (array)
   */
  try {
    if (typeof req.params === "undefined")
      throw new Error("Incorrect paramater")
    const playerDoc = await Player.findById(req.params.id)
    if (playerDoc === null) throw new Error("No results")
    else if (playerDoc.seasons.id(req.body.season) === null) {
      console.log("season not found")
      res.status(200).json({ ok: false })
    } else if (playerDoc.availability.id(req.body.competition) === null) {
      // COMPETITION AVAILABILITY NEEDS TO BE ADDED
      console.log("competition not found")
      res.status(200).json({ ok: false })
    } else {
      // UPDATE PLAYER AVAILABILITY
      let availability = playerDoc.availability.map(value => {
        if (value._id != req.body.competition) return value
        else
          return {
            _id: value._id,
            fixtures: req.body.fixtures, // update
            status: value.status
          }
      })
      consola.info(availability)
      const q = await playerDoc.updateOne({ availability: availability })
      //consola.info(doc.availability.id(req.query.competition.fixtures))
      if (q.ok !== 1) throw new Error("Update error occured")
      else if (q.nModified === 0)
        res.status(200).json({ ok: true, change: false })
      else res.status(200).json({ ok: true, change: true })
    }
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
