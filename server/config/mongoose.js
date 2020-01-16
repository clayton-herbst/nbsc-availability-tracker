const mongoose = require("mongoose")
const consola = require("consola")

const dbURI = "mongodb://localhost:27017/nbsc"

mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
  bufferCommands: false,
  family: 4
})

mongoose.connection.on("connected", () => {
  consola.success(`Mongoose connected to ${dbURI}`)
})

mongoose.connection.on("error", err => {
  consola.error(`Mongoose connection error ${err}`)
})

mongoose.connection.on("disconected", () => {
  consola.info("Mongoose disconnected")
})

function gracefulShutdown(msg, callback) {
  consola.info(`Mongoose disconnected through ${msg}`)
  callback()
}

process.once("SIGUSR2", () => {
  gracefulShutdown("shutdown", () => {
    process.kill(process.pid, "SIGUSR2")
  })
})

process.on("SIGINT", () => {
  gracefulShutdown("app shutdown", () => {
    process.exit(0)
  })
})

process.on("SIGTERM", () => {
  gracefulShutdown("app shutdown", () => {
    process.exit(0)
  })
})

module.exports.mongoose = mongoose.connection

require("../models/competition")
require("../models/club")
require("../models/player")
require("../models/season")
