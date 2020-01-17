const mongoose = require("mongoose")

const ObjectId = mongoose.Schema.Types.ObjectId

const competitionSchema = new mongoose.Schema({
  title: String,
  timelines: {
    start: Date,
    end: Date
  },
  season: ObjectId,
  description: String,
  fixtures: [
    {
      title: String,
      home: {
        title: String,
        _id: ObjectId
      },
      away: {
        title: String,
        _id: ObjectId
      },
      location: String,
      date: Date
    }
  ],
  status: {
    list: Array,
    current: Number
  }
})

mongoose.model("Competition", competitionSchema, "competitions")
