const express = require("express");
const {
  createJob,
  getAllJobs,
  getJob,
  updateJob,
  deleteJob,
  applyJob,
  applications,
  jobApplied,
  deleteAppliedJobs,
} = require("../controller/job");
const { verifyToken, isCompany, isOwner, isJobSeeker } = require("../middleware/auth");
const { validate } = require("../middleware/validation");
const { createJobSchema, updateJobSchema } = require("../util/jobSchema");
const router = express.Router();

router
  .all("")
  .get("/", getAllJobs)
  .get("/applications", verifyToken, isJobSeeker, applications)
  .get("/:id", getJob)
  .get("/:id/applied", verifyToken, jobApplied)
  .post("/", verifyToken, isCompany, validate(createJobSchema), createJob)
  .put("/:id", verifyToken, isCompany, isOwner, validate(updateJobSchema), updateJob)
  .delete("/deleteapplication", verifyToken, deleteAppliedJobs)
  .delete("/:id", verifyToken, isCompany, isOwner, deleteJob)
  .post("/:id/apply", verifyToken, isJobSeeker, applyJob)

module.exports = router;
