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
      let obj = {
        title: doc.title,
        status: doc.status.list[doc.status.current],
        startDate: doc.timelines.start,
        endDate: doc.timelines.end,
        id: doc._id
      }
      if (doc.competitions.length > 0)
        obj["competition"] = doc.competitions[0]._id

      return obj
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
    else if (req.params.id === "-1")
      // INITIAL EMPTY SEASON ID REQUEST
      return res.json({ ok: true, competitions: [] })

    let competitions = await Competition.find({ season: req.params.id })
    consola.info(competitions)
    if (competitions === null)
      res.locals.data = {
        ok: false,
        msg: "Error processing request",
        competitions: []
      }
    else {
      let competitions = await Competition.find({ season: req.params.id })
      res.locals.data = {
        competitions: competitions.map(doc => {
          return {
            title: doc.title,
            startDate: doc.timelines.start,
            endDate: doc.timelines.start,
            description: doc.description,
            id: doc._id
          }
        })
      }
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
    if (playerDoc === null) {
      throw new Error("No results")
    }
    if (playerDoc.seasons.id(req.query.season) === null) {
      playerDoc.seasons.push(req.query.season)
    }
    if (playerDoc.availability.id(req.query.competition) === null) {
      // COMPETITION AVAILABILITY NEEDS TO BE ADDED
      let fixtures = new Array(parseInt(req.query.length))
      playerDoc.availability.push({
        _id: req.query.competition,
        fixtures: fixtures.fill(0), // default to 0 / maybe
        status: ["maybe", "yes", "no"]
      })
    } else if (
      playerDoc.availability.id(req.query.competition).fixtures.length <
      req.query.length
    ) {
      let fixtures = playerDoc.availability
        .id(req.query.competition)
        .get("fixtures")

      let difference = req.query.length - fixtures.length
      for (let i = 0; i < difference; i++) fixtures.push(0)
      playerDoc.availability.id(req.query.competition).fixtures = fixtures // update the database
    }
    let doc = await playerDoc.save()
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

router.post("/admin/addCompetition", async (req, res, next) => {
  try {
    if (
      typeof req.body.season === "undefined" ||
      typeof req.body.competition.title === "undefined" ||
      typeof req.body.competition.fixtures === "undefined" ||
      typeof req.body.competition.start === "undefined" ||
      typeof req.body.competition.end === "undefined"
    )
      throw new Error("Incorrect paramaters: addCompetition")

    let competition = new Competition({
      title: req.body.competition.title,
      season: req.body.season,
      fixtures: new Array(),
      description:
        typeof req.body.competition.description !== "undefined"
          ? req.body.competition.description
          : "",
      timelines: {
        start: req.body.competition.start,
        end: req.body.competition.end
      }
    })

    consola.info(competition)

    let season = await Season.findById(req.body.season)
    season.competitions.push(competition._id)

    await competition.save()
    await season.save()

    res.status(200).json({ ok: true, change: true })
  } catch (err) {
    consola.error(err)
    next(err)
  }
})

router.post("/admin/addFixture", async (req, res, next) => {
  try {
    if (
      typeof req.body.competition === "undefined" ||
      typeof req.body.fixture.title === "undefined" ||
      typeof req.body.fixture.home === "undefined" ||
      typeof req.body.fixture.away === "undefined" ||
      typeof req.body.fixture.date === "undefined" ||
      typeof req.body.fixture.location === "undefined"
    )
      throw new Error("Incorrect paramaters: addFixture")

    let competition = await Competition.findById(req.body.competition)

    if (req.body.fixture.index !== -1) {
      consola.info(req.body)
      let removeId = competition.fixtures[req.body.fixture.index]._id
      //let doc = competition.toObject()
      //let res = await competition.update({$pull: {fixtures: {_id: req.body.index}}}, {overwrite: true})
      let queryRes = await competition.updateOne({
        $push: {
          fixtures: {
            $each: [
              {
                title: req.body.fixture.title,
                home: {
                  title: req.body.fixture.home
                },
                away: {
                  title: req.body.fixture.away
                },
                date: req.body.fixture.date,
                location: req.body.fixture.location
              }
            ],
            $position: req.body.fixture.index
          }
        }
      })
      consola.info(queryRes)
      if (queryRes.ok === 1 && queryRes.n === 1 && queryRes.nModified >= 1) {
        queryRes = await competition.updateOne({
          $pull: {
            fixtures: { _id: removeId }
          }
        })
        if (queryRes.ok === 1 && queryRes.n === 1 && queryRes.nModified === 1)
          res.locals.data = { ok: true, change: true }
        else if (queryRes.ok !== 1 || queryRes.n !== 1)
          res.locals.data = { ok: false, change: false }
        else res.locals.data = { ok: true, change: false }
      } else res.locals.data = { ok: false, change: false }
    } else {
      consola.info("not edited!")
      let queryRes = await competition.updateOne({
        $push: {
          fixtures: {
            title: req.body.fixture.title,
            home: {
              title: req.body.fixture.home
            },
            away: {
              title: req.body.fixture.away
            },
            date: req.body.fixture.date,
            location: req.body.fixture.location
          }
        }
      })
      consola.info(queryRes)

      if (queryRes.ok === 1 && queryRes.n === 1 && queryRes.nModified === 1)
        res.locals.data = { ok: true, change: true }
      else if (queryRes.ok !== 1 || queryRes.n !== 1)
        res.locals.data = { ok: false, change: false }
      else res.locals.data = { ok: true, change: false }
    }

    res.status(200).json(res.locals.data)
  } catch (err) {
    consola.error(err)
    next(err)
  }
})

router.post("/admin/addSeason", async (req, res, next) => {
  try {
    if (typeof req.body.season.title === "undefined")
      throw new Error("Incorrect paramaters: addSeason")

    let season = new Season({
      title: req.body.season.title,
      timelines: {
        start:
          typeof req.body.season.start !== "undefined"
            ? req.body.season.start
            : "",
        end:
          typeof req.body.season.end !== "undefined" ? req.body.season.end : ""
      },
      competitions: new Array(),
      status: {
        list: ["ongoing", "expired"],
        current: 0
      }
    })

    consola.info(season)

    await season.save()

    res.status(200).json({ ok: true, change: true })
  } catch (err) {
    consola.err(err)
    next(err)
  }
})

router.post("/admin/addBulkFixtures", async (req, res, next) => {
  try {
    if (
      typeof req.body.competition === "undefined" ||
      typeof req.body.fixtures === "undefined" ||
      typeof req.body.fixtures !== "object"
    )
      throw new Error("Incorrect paramaters: addBulkFixtures")

    let competition = await Competition.findById(req.body.competition)
    consola.info(competition)

    let fixtures = req.body.fixtures.map(value => {
      return {
        title: value.title,
        home: {
          title: value.home
        },
        away: {
          title: value.away
        },
        date: value.date,
        location: value.location
      }
    })
    consola.info(fixtures)
    competition.fixtures = competition.fixtures.concat(fixtures)

    let doc = await competition.save()
    consola.info(doc)

    res.status(200).json({ ok: true, change: true })
  } catch (err) {
    consola.error(err)
    next(err)
  }
})

router.post("/admin/fixturePlayers", async (req, res, next) => {
  try {
    if (
      typeof req.body.competition === "undefined" ||
      typeof req.body.index === "undefined"
    )
      throw new Error("Incorrect paramaters: fixturePlayers")

    let players = await Player.find({
      "availability._id": { $eq: req.body.competition }
    }).exec()
    if (players.length > 0) {
      res.locals.data = { ok: true, players: [] }
      for (let i = 0; i < players.length; i++) {
        if (typeof players[i].availability[req.body.index] === "undefined")
          continue
        res.locals.data.players.push({
          name: players[i].first_name,
          surname: players[i].last_name,
          fullname: players[i].name,
          availability: players[i].availability.id(req.body.competition)
            .fixtures[req.body.index]
        })
      }
      res.locals.data.length = res.locals.data.players.length
    } else {
      res.locals.data = { ok: true, length: players.length }
    }
    consola.info(res.locals.data.players)
    consola.info(res.locals.data)
    res.status(200).json(res.locals.data)
  } catch (err) {
    consola.error(err)
    next(err)
  }
})

module.exports = router
