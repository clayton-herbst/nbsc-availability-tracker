const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId

const clubSchema = new mongoose.Schema({
  title: {
    type: String
  },
  shorthand: String,
  logo: {
    type: String
  },
  activeSeason: ObjectId
})

mongoose.model("Club", clubSchema, "clubs")
