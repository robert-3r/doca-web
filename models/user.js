const { Schema, model } = require("mongoose");

const UserSchema = Schema({
  firstname: String,
  lastname: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  avatar: String,
});

module.exports = model("User", UserSchema);
