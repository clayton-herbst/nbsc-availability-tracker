const cookieParser = require("cookie-parser")
const logger = require("morgan")
const path = require("path")
const express = require("express")
const createError = require("http-errors")
const mongoose = require("mongoose")
const consola = require("consola")

const apiRouter = require("../routes/api")
const indexRouter = require("../routes/index")
const authRouter = require("../routes/user")

const initApp = app => {
  app.use(cookieParser())
  app.use(logger("dev"))
  app.use(express.json())
  app.use(express.static(`${__dirname}/../public`))

  app.use("/", indexRouter)
  app.use("/api", apiRouter)
  app.use("/user", authRouter)

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    next(createError(404))
  })

  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    console.log(process.env.NODE_ENV)
    res.locals.message = err.message
    res.locals.error = process.env.NODE_ENV === "development" ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.json({
      msg: res.locals.message,
      stack: err.stack,
      env: process.env.NODE_ENV
    })
  })
}

module.exports.init = initApp
