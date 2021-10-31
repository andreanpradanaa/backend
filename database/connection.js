const mongoose = require("mongoose");

const connect = async () => {
  try {
    // mongoose conncetion
    const con = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB connected : ${con.connection.host}`);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

module.exports = connect;
