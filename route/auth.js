const express = require("express");
const { signup, login, changePassword } = require("../controller/auth");
const { verifyToken } = require("../middleware/auth");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../util/multerHelper");
const {userSchema, loginSchema, changePasswordSchema} = require("../util/userSchema");
const {validate} = require("../middleware/validation");

const upload = multer({ storage: storage });

router
  .all("")
  .post("/signup", upload.single("avatar"), validate(userSchema), signup)
  .post("/login", validate(loginSchema), login)
  .post("/changepassword", verifyToken, validate(changePasswordSchema), changePassword);

module.exports = router;
