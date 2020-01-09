const express = require("express");
const middleware = require("./middleware");

var app = express();

middleware(app);

module.exports = app;
