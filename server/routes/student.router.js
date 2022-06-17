const express = require("express");
const router = express.Router();
const jwtHelper = require("../config/jwtHelper");

const ctrlStudent = require("../controllers/student.controller");

// Students
router.post("/student/register", ctrlStudent.register);
router.post(
  "/student/uploadExcel",
  jwtHelper.verifyJwtToken,
  ctrlStudent.uploadExcel
);
router.get("/students", jwtHelper.verifyJwtToken, ctrlStudent.get);
router.get(
  "/allstudentcount",
  jwtHelper.verifyJwtToken,
  ctrlStudent.getAllCount
);
router.get(
  "/allstudentsdatefilter/:startdate/:enddate",
  jwtHelper.verifyJwtToken,
  ctrlStudent.getAllStudentsDateFilter
);
router.get("/allstudents/male", jwtHelper.verifyJwtToken, ctrlStudent.getMale);
router.get(
  "/allstudents/female",
  jwtHelper.verifyJwtToken,
  ctrlStudent.getFemale
);
router.put("/student/:id", jwtHelper.verifyJwtToken, ctrlStudent.put);
router.delete("/student/:id", jwtHelper.verifyJwtToken, ctrlStudent.delete);

module.exports = router;
