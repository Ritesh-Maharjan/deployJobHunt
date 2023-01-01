const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../model/User");
const Job = require("../model/Job");

const verifyToken = asyncHandler(async (req, res, next) => {
  // Checking if JWT token was sent or not
  if (!req.headers.authorization)
    return res.status(400).json({ msg: "Please login as JWT is required" });
  // Splitting to get only token from Bearer tokenNumber
  const token = req.headers.authorization?.split(" ")[1];
  const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

  req.user = { id: decoded.id, roles: decoded.roles };
  next();
});

const isCompany = asyncHandler(async (req, res, next) => {
  if (req.user?.roles !== "Company")
    return res.status(401).json({ msg: "Not authorized" });
  next();
});

// checking if the user is job seeker
const isJobSeeker = asyncHandler(async (req, res, next) => {
  if (req.user?.roles !== "Job seeker")
    return res.status(401).json({ msg: "Not authorized" });
  next();
});

// checking if the user is admin
const isAdmin = asyncHandler(async (req, res, next) => {
  if (req.user?.roles !== "Admin")
    return res.status(403).json({ msg: "Not authorized" });
  next();
});

// checking if the job is created by same user before doing anything to the job
const isOwner = asyncHandler(async (req, res, next) => {
  // logged in user
  const { id } = req.user;

  // user that created the job
  const userId = await Job.findById(req.params.id).populate("createdBy",{_id:1}).select(["createdBy", "-_id"])

  if (id !== userId.createdBy._id.toString())
    return res.status(401).json({ msg: "Unable to access this request" });

  next();
});




module.exports = { verifyToken, isCompany, isOwner, isJobSeeker, isAdmin };
