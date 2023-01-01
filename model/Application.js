const mongoose = require("mongoose");

// const ObjectId = mongoose.Schema.ObjectId;

const ApplicationSchema = mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Application", ApplicationSchema);
