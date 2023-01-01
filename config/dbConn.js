const mongoose = require("mongoose");

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTION);
    console.log("connected to mongo db ");
  } catch (err) {
    console.log(err);
  }
};

module.exports = connect;
