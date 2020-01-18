const express = require("express")
const jwt = require("jsonwebtoken")
const consola = require("consola")
const { isUser, validateToken } = require("./middleware")

const router = express.Router()

router.post("/register", isUser, (req, res, next) => {
  try {
    if (!res.locals.status) throw new Error("not okay")

    const options = {
      algorithm: process.env.JWT_ALGORITHM,
      expiresIn: 60 * 60
    }
    const token = jwt.sign(res.locals.user, process.env.JWT_SECRET, options)
    consola.info(token)
    res.cookie("auth", token, { maxAge: 60 * 60 * 1000 })
    res.status(200).json({ ok: res.locals.status, id: res.locals.user.id })
  } catch (err) {
    consola.error(err)
  }
})

router.get(
  "/test",
  (req, res, next) => {
    consola.info(req.cookies.auth)
    next()
  },
  validateToken(),
  (req, res, next) => {
    consola.info(req.auth)
    res.status(200).json({ ok: true })
  }
)

module.exports = router
