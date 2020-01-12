const mongoose = require("mongoose")

const playerSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  fullname: String,
  email: {
    type: String,
    required: true
  },
  social: {
    facebook: String
  },
  seasons: {
    length: Number,
    id: Array
  },
  availability: [
    {
      competition: {
        title: String,
        id: Number
      },
      length: Number,
      status: Array,
      events: Array,
      empty: {
        type: Boolean,
        required: true
      }
    }
  ]
})

mongoose.model("Player", playerSchema, "players")
