const mongoose = require("mongoose");
const User = require("./User");

const JobSchema = mongoose.Schema(
  {
    jobTitle: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
    jobCategory: {
      type: String,
      required: true,
    },
    vacancies: {
      type: Number,
      default: 1,
    },
    salary: {
      type: String,
      required: true,
    },
    deadline: {
      type: Date,
      required: true,
    },
    education: {
      type: String,
      enum: ["High school", "Bachelor", "Master", "Phd"],
    },
    experience: {
      type: String,
      default: "Not required",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Job", JobSchema);
