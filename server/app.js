const express = require("express")
const middleware = require("./middleware").middleware
const consola = require("consola")
require("dotenv").config()

var app = express()

const { mongoose } = require("./config/mongoose")
const {
  seedClubs,
  seedPlayers,
  seedSeasons,
  seedCompetitions,
  seedDB
} = require("./seeder/index")

// // Seed data for empty collections
if (process.env.NODE_ENV !== "production") {
  seedDB(mongoose, "clubs", seedClubs)
  seedDB(mongoose, "players", seedPlayers)
  seedDB(mongoose, "seasons", seedSeasons)
  seedDB(mongoose, "competitions", seedCompetitions)
}

async function start() {
  const host = "localhost"
  const port = 3000

  middleware(app)

  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}

start()
