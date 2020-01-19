const mongoose = require("mongoose")

const ObjectId = mongoose.Schema.Types.ObjectId

const playerSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  name: String,
  email: {
    type: String,
    required: true
  },
  auth: {
    role: String,
    password: String
  },
  social: {
    facebook: String
  },
  seasons: [
    {
      _id: ObjectId
    }
  ],
  availability: [
    {
      _id: ObjectId,
      status: Array,
      fixtures: Array
    }
  ]
})

mongoose.model("Player", playerSchema, "players")
