const mongoose = require("mongoose")

const ObjectId = mongoose.Schema.Types.ObjectId

const seasonSchema = new mongoose.Schema({
  title: String,
  timelines: {
    start: Date,
    end: Date
  },
  competitions: [
    {
      _id: ObjectId
    }
  ],
  status: {
    list: Array,
    current: Number
  }
})

mongoose.model("Season", seasonSchema, "seasons")
