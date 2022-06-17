const passport = require("passport");
var ObjectId = require("mongoose").Types.ObjectId;
const User = require("../models/user.model");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "jasonaddy51@gmail.com",
    pass: "gxpbewhpsvwaqdun",
  },
});

module.exports.register = async (req, res, next) => {
  var user = new User();
  user.fullname = req.body.fullname;
  user.password = req.body.password;
  user.phonenumber = req.body.phonenumber;
  user.email = req.body.email;

  if (
    req.body.fullname == null ||
    req.body.fullname == "" ||
    req.body.password == null ||
    req.body.password == "" ||
    req.body.phonenumber == null ||
    req.body.phonenumber == "" ||
    req.body.email == null ||
    req.body.email == ""
  ) {
    await res.status(422).send(["Ensure all fields were provided."]);
  } else {
    await user.save(async (err, doc) => {
      if (!err) await res.send(doc);
      else {
        if (err.code == 11000)
          await res.status(422).send(["Duplicate email address found."]);
        else return next(err);
      }
    });
  }
};

module.exports.authenticate = async (req, res, next) => {
  // call for passport authentication
  passport.authenticate("local", async (err, user, info) => {
    // error from passport middleware
    if (err) await res.status(400).json(err);
    // registered user
    else if (user) {
      await res.status(200).json({ token: await user.generateJwt() });
    }
    // unknown user or wrong password
    else return res.status(422).json(info);
  })(req, res);
};

// Getting all users array
module.exports.get = async (req, res) => {
  await User.find(async (err, docs) => {
    if (!err) {
      await res.status(200).send(docs);
    } else {
      console.log(
        "Error in retrieving Users :" + JSON.stringify(err, undefined, 2)
      );
      await res.status(400).json({
        message:
          "Error in retrieving Users :" + JSON.stringify(err, undefined, 2),
      });
    }
  });
};

// Finding a user with ID
module.exports.getID = async (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return await res
      .status(400)
      .send(`No user found with given id : ${req.params.id}`);

  await User.findById(req.params.id, async (err, doc) => {
    if (!err) {
      await res.send(doc);
    } else {
      console.log(
        "Error in Retrieving User :" + JSON.stringify(err, undefined, 2)
      );
      await res.status(400).json({
        message:
          "Error in Retrieving User :" + JSON.stringify(err, undefined, 2),
      });
    }
  }).populate({
    path: "subscription",
    populate: { path: "plan_id", model: "Plan" },
  });
};

// Updating a user with ID
module.exports.put = async (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return await res
      .status(400)
      .send(`No User found with given id : ${req.params.id}`);

  let user = req.body;

  var data = {
    fullname: user.fullname,
    password: user.password,
    phonenumber: user.phonenumber,
    email: user.email,
  };

  await User.findByIdAndUpdate(
    req.params.id,
    { $set: data },
    { new: true },
    async (err, doc) => {
      if (!err) {
        await res.send(doc);
      } else {
        console.log(
          "Error in User Update :" + JSON.stringify(err, undefined, 2)
        );
        await res.status(400).json({
          message: "Error in User Update :" + JSON.stringify(err, undefined, 2),
        });
      }
    }
  );
};

module.exports.resetPassword = async (req, res) => {
  await User.findOne({ email: req.params.email }, async (err, doc) => {
    if (err) {
      console.log(
        "Error in Retrieving User :" + JSON.stringify(err, undefined, 2)
      );
      await res.status(400).json({
        message:
          "Error in Retrieving User :" + JSON.stringify(err, undefined, 2),
      });
    } else {
      if (!doc) await res.json({ message: "Email was not found" });
      else {
        var token = jwt.sign(
          { email: req.params.email },
          process.env.JWT_SECRET,
          { expiresIn: "24h" }
        );
        await transporter.sendMail(
          {
            from: "Ecole Tabulate Staff, staff@https://ecole-tabulate.web.app",
            to: req.params.email,
            subject: "Password Reset",
            text:
              "Hello " +
              doc.fullname +
              ", thank you for registering at covcast.com. Please click on the link to complete the reset process: https://ecole-tabulate.web.app/#/auth/reset-password/confirm/" +
              token,
            html:
              "Hello <strong>" +
              doc.fullname +
              '</strong>, <br><br> You recently requested a password reset link. Please click on the link below to reset your password:<br><br><a href="https://ecole-tabulate.web.app/#/auth/reset-password/confirm/' +
              token +
              '">https://ecole-tabulate.web.app/#/auth/reset-password/confirm/</a>',
          },
          async (err, info) => {
            if (err) console.log(err);
            else console.log("Email sent: " + info.response);
          }
        );

        await res.status(200).json({
          message: "Password Reset Request has been sent to your email.",
        });
      }
    }
  });
};

module.exports.updatePassword = async (req, res) => {
  // console.log(req.body)
  // Verify token from url params
  await jwt.verify(
    req.params.token,
    process.env.JWT_SECRET,
    async (err, decoded) => {
      if (err)
        return res.status(422).send({
          auth: false,
          message: "Password link has expired or is invalid.",
        });
      else {
        //Verify user within database then continue
        await User.findOne({ email: decoded.email }, async (err, doc) => {
          if (err) {
            console.log(
              "Error in Retrieving User :" + JSON.stringify(err, undefined, 2)
            );
          } else {
            if (doc == null)
              return await res.json({ message: "Email was not found" });
            else {
              if (req.body.password === null || req.body.password === "") {
                await res
                  .status(422)
                  .json({ message: "Password not provided!" });
              } else {
                await bcrypt.genSalt(10, async (err, salt) => {
                  bcrypt.hash(req.body.password, salt, async (err, hash) => {
                    var user = {
                      password: hash,
                      saltSecret: salt,
                    };
                    await User.findOneAndUpdate(
                      decoded.email,
                      { $set: user },
                      { new: true },
                      async (err, doc) => {
                        if (err) {
                          console.log(
                            "Error in User Password Update :" +
                              JSON.stringify(err, undefined, 2)
                          );
                        } else {
                          // Create email object to send to user
                          await transporter.sendMail(
                            {
                              from: "Ecole Tabulate Staff, staff@https://ecole-tabulate.web.app",
                              to: decoded.email,
                              subject: "Ecole Tabulate Reset Password",
                              text:
                                "Hello " +
                                doc.fullname +
                                ", This email is to notify you that your password was recently reset at ecole-tabulate.web.app",
                              html:
                                "Hello <strong>" +
                                doc.fullname +
                                "</strong>,<br><br>This email is to notify you that your password was recently reset at https://ecole-tabulate.web.app",
                            },
                            async (err, info) => {
                              if (err) console.log(err);
                              else console.log("Email sent: " + info.response);
                            }
                          );
                          await res.json({
                            message: "Password Reset Successfully!",
                          });
                        }
                      }
                    );
                  });
                });
              }
            }
          }
        });
      }
    }
  );
};

// Find all admins count
module.exports.getAdminsCount = async (req, res) => {
  await User.countDocuments({ role: "admin" }, (err, doc) => {
    if (!err) {
      res.status(200).json(doc);
    } else {
      console.log(
        "Error in Retrieving Admins Count :" + JSON.stringify(err, undefined, 2)
      );
    }
  });
};

// Find all users count
module.exports.getUsersCount = async (req, res) => {
  await User.countDocuments({ role: "user" }, (err, doc) => {
    if (!err) {
      res.status(200).json(doc);
    } else {
      console.log(
        "Error in Retrieving Users Count:" + JSON.stringify(err, undefined, 2)
      );
    }
  });
};

// Deleting a user with ID
module.exports.delete = (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res
      .status(400)
      .send(`No user found with given id : ${req.params.id}`);

  User.findByIdAndRemove(req.params.id, (err, doc) => {
    if (!err) {
      res.send(doc);
    } else {
      console.log(
        "Error in Retrieving User :" + JSON.stringify(err, undefined, 2)
      );
    }
  });
};
