const mongoose = require("mongoose")

const seasonSchema = new mongoose.Schema({
  title: String,
  timelines: {
    start: Date,
    end: Date
  },
  competitions: [
    {
      title: String,
      description: String
    }
  ],
  status: {
    list: Array,
    current: Number
  },
  id: Number
})

mongoose.model("Season", seasonSchema, "seasons")
