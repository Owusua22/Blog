const mongoose = require("mongoose");

// Individual items under each section
const sectionItemSchema = new mongoose.Schema({
  heading: { type: String,},
  content: { type: String, required: true },
  date: { type: String }, // optional
});

// Section schema
const sectionSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Section title
  items: [sectionItemSchema],
});

const biographySchema = new mongoose.Schema(
  {
    profileImage: {
      url: String,
      publicId: String,
    },
    title: { type: String, required: true },
    sections: [sectionSchema],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Biography", biographySchema);
