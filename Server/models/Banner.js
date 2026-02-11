// models/Banner.js
const mongoose = require("mongoose")

const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
   
    },

    image: {
      url: String,
      publicId: String
    },

 
  },
  { timestamps: true }
)

module.exports = mongoose.model("Banner", bannerSchema)
