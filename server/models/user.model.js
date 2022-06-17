const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;

var userSchema = new Schema(
  {
    fullname: {
      type: String,
      required: "Fullname can't be empty",
    },
    password: {
      type: String,
      required: "Password can't be empty",
      minlength: [8, "Password must be at least 4 character long"],
    },
    phonenumber: {
      type: String,
      required: "Phone number can't be empty",
    },
    email: {
      type: String,
      required: "Email can't be empty",
      unique: true,
    },
    role: {
      type: String,
      default: "user",
    },
    pic: {
      type: String,
      default: "assets/img/default-avatar.png",
    },
    saltSecret: String,
  },
  { timestamps: true }
);

// Custom validation for email
userSchema.path("email").validate((val) => {
  emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(val);
}, "Invalid e-mail.");

// Events
userSchema.pre("save", function (next) {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(this.password, salt, (err, hash) => {
      this.password = hash;
      this.saltSecret = salt;
      next();
    });
  });
});

// Methods
userSchema.methods.verifyPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

userSchema.methods.generateJwt = async function () {
  return await jwt.sign(
    {
      _id: this._id,
      role: this.role,
      pic: this.pic,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXP,
    }
  );
};

module.exports = mongoose.model("User", userSchema);
