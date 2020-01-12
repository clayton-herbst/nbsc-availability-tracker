const consola = require("consola")

// STANDARD ERROR MIDDLEWARE
module.exports = msg => {
  consola.error(msg)
  return (req, res, next) => {
    res.json({
      status: "ERROR",
      msg: msg
    })
  }
}
