const express = require("express");
const { deleteJob } = require("../controller/job");
const { getAllUser, deleteUser } = require("../controller/user");
const { isAdmin, verifyToken } = require("../middleware/auth");
const router = express.Router();

router
  .all("")
  .get("/users", verifyToken, isAdmin, getAllUser)
  .delete("/users/:id", verifyToken, isAdmin, deleteUser)
  .delete("/jobs/:id", verifyToken, isAdmin, deleteJob);

module.exports = router;
