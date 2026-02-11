const mongoose = require("mongoose")

const commentSchema = new mongoose.Schema(
  {
    article: { type: mongoose.Schema.Types.ObjectId, ref: "Article" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    text: String
  },
  { timestamps: true }
)

module.exports = mongoose.model("Comment", commentSchema)
