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
      description: String,
      fixtures: [
        {
          title: String,
          home: String,
          away: String,
          location: String,
          date: Date
        }
      ]
    }
  ],
  status: {
    list: Array,
    current: Number
  }
})

mongoose.model("Season", seasonSchema, "seasons")
