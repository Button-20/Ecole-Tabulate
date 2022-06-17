const mongoose = require("mongoose");
var Student = require("../models/student.model");
var ObjectId = mongoose.Types.ObjectId;
const path = require("path");
const readXlsxFile = require("read-excel-file/node");

// Registering Student Record
module.exports.register = async (req, res, next) => {
  var student = await new Student(req.body);
  if (
    req.body.name == null ||
    req.body.name == "" ||
    req.body.name == {} ||
    req.body.name.firstname == null ||
    req.body.name.firstname == "" ||
    req.body.name.lastname == null ||
    req.body.name.lastname == "" ||
    req.body.phonenumber == null ||
    req.body.phonenumber == "" ||
    req.body.gender == null ||
    req.body.gender == "" ||
    req.body.dateofbirth == null ||
    req.body.dateofbirth == "" ||
    req.body.address == null ||
    req.body.address == ""
  ) {
    await res.status(422).send(["Ensure all fields were provided."]);
  } else {
    student.save(async (err, doc) => {
      if (!err) await res.send(doc);
      else {
        if (err.code == 11000)
          await res
            .status(422)
            .send(["Duplicate Email or Phone Number found."]);
        else return await next(err);
      }
    });
  }
};

// Getting all Students array
module.exports.get = async (req, res) => {
  await Student.find(async (err, docs) => {
    if (!err) {
      await res.status(200).send(docs);
    } else {
      console.log(
        "Error in retrieving Students :" +
          (await JSON.stringify(err, undefined, 2))
      );
      await res.status(400).json({
        message:
          "Error in retrieving Students :" +
          (await JSON.stringify(err, undefined, 2)),
      });
    }
  });
};

// Getting all Students count
module.exports.getAllCount = async (req, res) => {
  await Student.countDocuments({}, async (err, docs) => {
    if (!err) {
      await res.status(200).json(docs);
    } else {
      console.log(
        "Error in retrieving Student Count :" +
          (await JSON.stringify(err, undefined, 2))
      );
      await res.status(400).json({
        message:
          "Error in retrieving Student Count :" +
          (await JSON.stringify(err, undefined, 2)),
      });
    }
  });
};

// Filter by date
module.exports.getAllStudentsDateFilter = async (req, res) => {
  await Student.find(
    { dateofbirth: { $gte: req.params.startdate, $lte: req.params.enddate } },
    async (err, doc) => {
      if (!err) {
        await res.send(doc);
      } else {
        console.log(
          "Error in Retrieving Students with Date :" +
            (await JSON.stringify(err, undefined, 2))
        );
        await res.status(400).json({
          message:
            "Error in Retrieving Students with Date :" +
            (await JSON.stringify(err, undefined, 2)),
        });
      }
    }
  );
};

// Finding a member with Male Gender
module.exports.getMale = async (req, res) => {
  await Student.countDocuments({ gender: "M" }, (err, doc) => {
    if (!err) {
      res.status(200).json(doc);
    } else {
      console.log(
        "Error in Retrieving Students Male :" +
          JSON.stringify(err, undefined, 2)
      );
    }
  });
};

// Finding a member with Female Gender
module.exports.getFemale = async (req, res) => {
  await Student.countDocuments({ gender: "F" }, (err, doc) => {
    if (!err) {
      res.status(200).json(doc);
    } else {
      console.log(
        "Error in Retrieving Students Female :" +
          JSON.stringify(err, undefined, 2)
      );
    }
  });
};

// Finding an Student with ID
module.exports.getID = async (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return await res
      .status(400)
      .send(`No Student found with given id : ${req.params.id}`);

  await Student.findById(req.params.id, async (err, doc) => {
    if (!err) {
      await res.status(200).send(doc);
    } else {
      console.log(
        "Error in Retrieving Student :" +
          (await JSON.stringify(err, undefined, 2))
      );
      await res.status(400).json({
        message:
          "Error in Retrieving Student :" +
          (await JSON.stringify(err, undefined, 2)),
      });
    }
  });
};

// Updating a attendance with ID
module.exports.put = async (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return await res
      .status(400)
      .send(`No Student found with given id : ${req.params.id}`);

  await Student.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true },
    async (err, doc) => {
      if (!err) {
        await res.send(doc);
      } else {
        console.log(
          "Error in Student Update :" +
            (await JSON.stringify(err, undefined, 2))
        );
      }
    }
  );
};

// Deleting a students with ID
module.exports.delete = async (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return await res
      .status(400)
      .send(`No Student found with given id : ${req.params.id}`);

  await Student.findByIdAndRemove(req.params.id, async (err, doc) => {
    if (!err) {
      await res.status(200).send(doc);
    } else {
      console.log(
        "Error in Retrieving Attendance :" +
          (await JSON.stringify(err, undefined, 2))
      );
    }
  });
};

module.exports.uploadExcel = async (req, res) => {
  try {
    if (req.file == undefined) {
      return await res.status(400).send("Please upload an excel file!");
    }

    let route = path.join("./excel-documents/" + req.file.filename);

    await readXlsxFile(route).then(async (rows) => {
      // skip header
      await rows.shift();

      let students = [];

      await rows.forEach((row) => {
        let student = {
          userid: req.body.userid,
          name: {
            firstname: row[0],
            lastname: row[1],
          },
          phonenumber: row[2],
          gender: row[3],
          email: row[4],
          dateofbirth: Date(row[5]),
          address: row[6],
        };
        students.push(student);
        console.log(students);
      });

      await Student.insertMany(students, async (err, doc) => {
        if (!err) {
          await res.status(200).send({
            message: "Uploaded the file successfully: " + req.file.originalname,
            result: doc,
          });
        } else {
          await res.status(500).send({
            message:
              "Error in Dues Insert :" +
              (await JSON.stringify(err, undefined, 2)),
          }),
            console.log(
              "Error in Members Insert :" +
                (await JSON.stringify(err, undefined, 2))
            );
        }
      });
    });
  } catch (error) {
    console.log(error);
    await res.status(500).send({
      message: "Could not upload the file: " + req.file.originalname,
    });
  }
};
