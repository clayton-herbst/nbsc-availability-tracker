const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
  name: {
    first: {
      type: String,
      required: true
    },
    last: {
      type: String,
      required: true
    }
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  seasons: {
    type: Array
  },
  cups: {
    type: Array
  }
});
