const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var studentSchema = new Schema(
  {
    userid: {
      type: Schema.Types.ObjectId,
      required: "User ID can't be empty",
      ref: "User",
    },
    name: {
      firstname: { type: String, required: "First Name can't be empty" },
      lastname: { type: String, required: "Last Name can't be empty" },
    },
    gender: {
      type: String,
      required: "Gender can't be empty",
    },
    phonenumber: {
      type: String,
      required: "Phone Number can't be empty",
      unique: true,
    },
    email: {
      type: String,
      required: "Email can't be empty",
      unique: true,
    },
    dateofbirth: {
      type: Date,
      required: "Date Of Birth can't be empty",
    },
    address: {
      type: String,
      required: "Address can't be empty",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
