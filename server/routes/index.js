const express = require("express");
const path = require("path");
const router = express.Router();

const cwd = process.cwd();

/* GET home page. */
router.get("/", function(req, res, next) {
  res.sendFile(path.resolve(cwd, "server", "public", "index.html"));
});

router.get("/login", (req, res, next) => {
  res.render("login", { title: "Login" });
});

module.exports = router;
