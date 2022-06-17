require("./config/config");
require("./models/db");
require("./config/passportconfig");

const PORT = process.env.PORT || 3000;
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
var app = express();
var allowedDomains = [
  "https://ecole-tabulate.web.app",
  "http://localhost:4200",
];
app.use(
  cors({
    origin: function (origin, callback) {
      // bypass the requests with no origin (like curl requests, mobile apps, etc )
      if (!origin) return callback(null, true);

      if (allowedDomains.indexOf(origin) === -1) {
        var msg = `This site ${origin} does not have an access. Only specific domains are allowed to access it.`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);
const passport = require("passport");
const rtsIndex = require("./routes/index.router");
const rtsUser = require("./routes/user.router");
const rtsStudent = require("./routes/student.router");
const multer = require("multer");
const excelFilter = async (req, file, cb) => {
  if (
    (await file.mimetype.includes("excel")) ||
    (await file.mimetype.includes("spreadsheetml"))
  ) {
    await cb(null, true);
  } else {
    await cb("Please upload only excel file.", false);
  }
};

const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./excel-documents");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "__" + file.originalname);
  },
});
var uploadFile = multer({
  storage: fileStorageEngine,
  fileFilter: excelFilter,
});

// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(uploadFile.single("file"));
app.use(passport.initialize());
app.use("/api", [rtsIndex, rtsUser, rtsStudent]);

// error handler
app.use((err, req, res, next) => {
  if (err.name === "ValidationError") {
    var valErrors = [];
    Object.keys(err.errors).forEach((key) =>
      valErrors.push(err.errors[key].message)
    );
    res.status(422).send(valErrors);
  } else {
    console.log(err);
  }
});

// start server
app.listen(PORT, () => {
  console.log(`Server started at port : ${PORT}`);
});
