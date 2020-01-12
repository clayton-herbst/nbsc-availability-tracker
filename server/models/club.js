const mongoose = require("mongoose")

const clubSchema = new mongoose.Schema({
  title: {
    type: String
  },
  shorthand: String,
  logo: {
    type: String
  },
  seasons: {
    type: Array
  }
})

mongoose.model("Club", clubSchema, "clubs")
