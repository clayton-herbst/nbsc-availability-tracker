const express = require("express");
const middleware = require("./middleware");

var app = express();

const { mongoose } = require("./config/mongoose");
const { seedClubs, seedDB } = require("./seeder/index");
// // Seed data for empty collections
if (process.env.NODE_ENV !== "production") {
  seedDB(mongoose, "clubs", seedClubs);
}

middleware(app);

module.exports = app;
