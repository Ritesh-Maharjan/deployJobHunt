const User = require("../model/User");
const asyncHandler = require("express-async-handler");
const fs = require("fs");
const Job = require("../model/Job");

/**
 * getAllUser:  RESTful GET request returning all job objects
 */
const getAllUser = asyncHandler(async (req, res, next) => {
  const user = await User.find({ roles: { $ne: "Admin" } });
  res.json(user);
});

/**
 * getUser:  RESTful GET request returning a particular job object
 */
const getUser = asyncHandler(async (req, res, next) => {
  const { id } = req.user;

  const user = await User.findById(id);
  if (!user) return res.status(400).json({ msg: "No job found with that id" });
  res.json(user);
});

/**
 * updateUser:  RESTful PUT request returning JSON object
 */
const updateUser = asyncHandler(async (req, res, next) => {
  const { id } = req.user;
  const { name, password, roles } = req.body;

  if (name || password || roles)
    return res.status(400).json({ msg: "Unable to update these fields" });

  if (req.file) {
    console.log(req.file)
    const user = await User.findByIdAndUpdate(id, {
      ...req.body,
      avatar: req.file.path,
    });
    console.log(user.avatar)
    if (user.avatar) {
      fs.unlinkSync(user.avatar);
    }
    if (!user)
      return res.status(400).json({ msg: "No job found with that id" });
    res.json({ msg: "Updated successfully" });
  } else {
    const user = await User.findByIdAndUpdate(id, req.body);
    if (!user)
      return res.status(400).json({ msg: "No job found with that id" });
    res.json({ msg: "Updated successfully" });
  }
});

/**
 * deleteUser:  RESTful DELETE request returning JSON object
 * @param id: string
 */
const deleteUser = asyncHandler(async (req, res, next) => {
  // giving the admin access to id to delete user
  let { id } = req.params;

  // if the admin didn't provide any id then delete the signed in user i.e. jobseeker/employer deleting their id
  if (!id) {
    id = req.user.id;
  }
  const user = await User.findById(id);

  if (user.avatar) {
    fs.unlinkSync(user.avatar);
  }

  const deleteJob = await Job.deleteMany({userId:id})
  if(deleteJob){
    const deleteUser = await User.findByIdAndDelete(id);
  
    if (!deleteUser)
      return res.status(400).json({ msg: "No user found with that id" });
    res.json({ msg: "Deleted successfully" });
  }
});

module.exports = { getAllUser, getUser, updateUser, deleteUser };
