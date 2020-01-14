const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId

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
  availability: [
    {
      _id: ObjectId,
      competitions: [
        {
          _id: ObjectId,
          length: Number,
          status: Array,
          fixtures: Array
        }
      ]
    }
  ]
})

mongoose.model("Player", playerSchema, "players")
