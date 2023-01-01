const User = require("../model/User");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");


const TOKEN_SECRET = process.env.TOKEN_SECRET;

const signup = asyncHandler(async (req, res, next) => {

  const password = req.body.password;

  if (!password) return res.status(400).json({ msg: "password required" });

  // hashing the password for our database
  const hash = bcrypt.hashSync(password, saltRounds);

  const user = await User.create({ ...req.body, password: hash, avatar: req.file?.path });

  if (user) res.json({ msg: "Account created successfully" });
});

// Login user
const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email) return res.status(400).json({ msg: "email required" });
  if (!password) return res.status(400).json({ msg: "password required" });

  const hash = await User.findOne({ email })
    .select(["password", "roles"])
    .exec();

  if (!hash) return res.status(400).json({ msg: "No user found with that email" });
  // check password
  const samePassword = bcrypt.compareSync(password, hash.password);
  
  if (!samePassword) return res.status(401).json({ msg: "Invalid credentials" });

  const token = jwt.sign(
    {
      id: hash._id,
      roles: hash.roles,
    },
    TOKEN_SECRET,
    {}
  );

  res.json({ token });
});

// Change password
const changePassword = asyncHandler(async (req, res, next) => {

  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword)
    return res.status(400).json({ msg: "Both old and new password are required" });

  if (oldPassword === newPassword)
    return res.status(400).json({
      msg: "Old password and new password should be different",
    });

  // get the password from database
  const { id } = req.user;
  const { password } = await User.findById(id).select("password");

  // check old password and password in the database
  const samePassword = bcrypt.compareSync(oldPassword, password);
  if (!samePassword) return res.status(401).json({ msg: "Invalid credentials" });

  // hashing the password for our database
  const hash = bcrypt.hashSync(newPassword, saltRounds);

  const updatePassword = await User.findByIdAndUpdate(id, { password: hash });
  if (updatePassword) return res.json({ msg: "Password updated successfully" });
});
module.exports = { signup, login, changePassword };
