const express = require("express");
const {
  register,
  login,
  verifyToken,
  checkIn,
  getCheckin,
} = require("../controller/UserController");

const router = express.Router();

router.route("/register").post(register);

router.route("/login").post(login);

router.route("/checkin").post(verifyToken, checkIn).get(verifyToken, getCheckin);


module.exports = router;
