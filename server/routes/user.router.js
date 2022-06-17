const express = require("express");
const router = express.Router();
const jwtHelper = require("../config/jwtHelper");

const ctrlUser = require("../controllers/user.controller");

// Users
router.post("/register", ctrlUser.register);
router.get("/reset-password/:email", ctrlUser.resetPassword);
router.post("/password-reset/confirm/:token", ctrlUser.updatePassword);
router.post("/authenticate", ctrlUser.authenticate);
router.get("/users", jwtHelper.verifyJwtToken, ctrlUser.get);
router.get("/users/:id", jwtHelper.verifyJwtToken, ctrlUser.getID);
router.put("/users/:id", jwtHelper.verifyJwtToken, ctrlUser.put);
router.get("/allusers/users", jwtHelper.verifyJwtToken, ctrlUser.getUsersCount);
router.get(
  "/allusers/admin",
  jwtHelper.verifyJwtToken,
  ctrlUser.getAdminsCount
);

// router.put('/userspermission/:id', ctrlUser.putLoginPermission);
router.delete("/users/:id", jwtHelper.verifyJwtToken, ctrlUser.delete);

module.exports = router;
