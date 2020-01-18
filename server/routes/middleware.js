const mongoose = require("mongoose")
const consola = require("consola")
const expressJwt = require("express-jwt")

require("../models/player")
const Player = mongoose.model("Player")

const createPlayer = async req => {
  // CHECK BODY PARAMATERS
  if (
    typeof req.body.firstName === "undefined" ||
    typeof req.body.lastName === "undefined" ||
    typeof req.body.email === "undefined"
  )
    throw new Error("Missing required fields")

  // CREATE NEW PLAYER
  const player = new Player();
  (player.firstName = req.body.firstName),
    (player.lastName = req.body.lastName),
    (player.fullname = `${req.body.firstName} ${req.body.lastName}`)
  player.email = req.body.email
  player.auth = {
    role: "player",
    password: ""
  }
  let doc = await player.save() // SAVE NEW PLAYER

  return {
    id: doc._id,
    firstName: doc.firstName,
    lastName: doc.lastName,
    name: doc.fullname,
    email: doc.email,
    role: doc.auth.role
  }
}

const isUser = async (req, res, next) => {
  try {
    // CHECK BODY PARAMATERS
    if (
      typeof req.body.firstName === "undefined" ||
      typeof req.body.lastName === "undefined" ||
      typeof req.body.email === "undefined"
    )
      throw new Error("Missing required fields")

    // FIND PLAYER
    const player = await Player.findOne({ email: req.body.email })

    consola.info(player)
    if (player === null) {
      // PLAYER IS NOT REGISTERED -- CREATE PLAYER
      res.locals.user = await createPlayer(req)
    } else {
      consola.info(player)
      res.locals.user = {
        id: player._id,
        firstName: player.firstName,
        lastName: player.lastName,
        name: player.fullname,
        email: player.email
      }
    }

    // SET USERS ROLE
    if (
      typeof req.body.password !== "undefined" &&
      player.auth.role === "administrator" &&
      player.auth.password === req.body.password
    )
      res.locals.user.role = "admin"
    else res.locals.user.role = "player"

    consola.info(res.locals.user)
    res.locals.status = true
    next()
  } catch (err) {
    consola.error(err)
    next(err)
  }
}

const validateToken = () =>
  expressJwt({
    secret: process.env.JWT_SECRET,
    algorithm: process.env.JWT_ALGORITHM,
    requestProperty: "auth",
    getToken: req => req.cookies.auth || ""
  })

module.exports = { isUser, createPlayer, validateToken }
