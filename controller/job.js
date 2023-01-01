const asyncHandler = require("express-async-handler");
const Application = require("../model/Application");
const jwt = require("jsonwebtoken");
const Job = require("../model/Job");

/**
 * getAlljob:  RESTful GET request returning all job objects
 * @query: expects page and perpage i.e. number and search i.e. text
 */
const getAllJobs = asyncHandler(async (req, res, next) => {
  let page = req.query.page || 1;
  let perPage = req.query.perpage || 5;
  let search = req.query.search;
  let jobs;
  let count;

  if (req.headers.authorization) {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    if (decoded.roles === "Company") {
      // returning jobs that is created by the user and job with title that matches search with pagination
      jobs = await Job.find({
        $and: [
          { jobTitle: new RegExp(search, "i") },
          { createdBy: { _id: decoded.id } },
        ],
      })
        .populate("createdBy", { name: 1, avatar: 1 })
        .limit(perPage)
        .skip((page - 1) * perPage);

      // giving the total number of documents found with or without the search term
      count = await Job.find({
        jobTitle: new RegExp(search, "i"),
      }).countDocuments();
    } else {
      // jobs that matches the search term if given with pagination
      jobs = await Job.find({ jobTitle: new RegExp(search, "i") })
        .populate("createdBy", { name: 1, avatar: 1 })
        .limit(perPage)
        .skip((page - 1) * perPage);
      // giving the total number of documents found with or without the search term
      count = await Job.find({
        jobTitle: new RegExp(search, "i"),
      }).countDocuments();
    }
  } else {
    // jobs that matches the search term if given with pagination
    jobs = await Job.find({ jobTitle: new RegExp(search, "i") })
      .populate("createdBy", { name: 1, avatar: 1 })
      .limit(perPage)
      .skip((page - 1) * perPage);
    // giving the total number of documents found with or without the search term
    count = await Job.find({
      jobTitle: new RegExp(search, "i"),
    }).countDocuments();
  }

  res.json({ total: count, jobs: jobs });
});

/**
 * getJob:  RESTful GET request returning a particular job object
 * @param id: string
 */
const getJob = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const job = await Job.findById(id).populate("createdBy", {
    name: 1,
    avatar: 1,
  });
  if (!job) return res.status(400).json({ msg: "No job found with that id" });
  res.json(job);
});

/**
 * createJob:  RESTful POST request returning JSON object
 * @param body: object
 */
const createJob = asyncHandler(async (req, res, next) => {
  const { jobTitle, jobCategory, salary, deadline, education } =
    req.body;

  const userId = req.user.id;
  if (
    !jobTitle ||
    !jobCategory ||
    !salary ||
    !deadline ||
    !education
  )
    return res.status(400).json({ msg: "All required fields are missing" });

  const job = await Job.create({ ...req.body, createdBy: userId });

  if (job) return res.json({ msg: "job created successfully" });
});

/**
 * updateJob:  RESTful PUT request returning JSON object
 * @param id: string
 */
const updateJob = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const job = await Job.findByIdAndUpdate(id, req.body);

  if (!job) return res.status(400).json({ msg: "No job found with that id" });
  res.json({ msg: "Updated successfully" });
});

/**
 * deleteJob:  RESTful DELETE request returning JSON object
 * @param id: string
 */
const deleteJob = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const job = await Job.findByIdAndDelete(id);
  // Deleting Apllication with this job id
  await Application.findOneAndDelete({jobId:id})

  if (!job) return res.status(400).json({ msg: "No job found with that id" });
  res.json({ msg: "Deleted successfully" });
});

/**
 * applyJob:  RESTful POST request returning JSON object
 * @param id: string
 */
const applyJob = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const applied = await Application.create({ jobId: id, userId: req.user.id });

  if (applied) res.json({ msg: "Applied to job successfully" });
});

/**
 * applications:  RESTful GET request returning all application objects
 */
const applications = asyncHandler(async (req, res, next) => {
  const allApplicaton = await Application.find({
    userId: req.user.id,
  }).populate({
    path: "jobId",
    populate: {path: "createdBy"}
  });

  if (allApplicaton) return res.json(allApplicaton);
});

/**
 * jobApplied:  RESTful GET request returning a particular job object
 * @param id: string
 */
const jobApplied = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const allApplicaton = await Application.find({
    userId: req.user.id,
    jobId: id,
  });

  if (allApplicaton.length === 0) return res.send(false);

  return res.send(true);
});

/**
 * jobApplied:  RESTful GET request returning a particular job object
 * @param id: string
 */
const deleteAppliedJobs = asyncHandler(async (req, res, next) => {
  const { id } = req.user;

  await Application.deleteMany({
    userId: id
  });

  return res.send(true);
});

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  applyJob,
  applications,
  jobApplied,
  deleteAppliedJobs
};
