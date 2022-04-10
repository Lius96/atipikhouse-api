const express = require("express");

const router = express.Router();

const {
    login,
    logout
} = require("../controllers/login");

router
  .route("/")
  .post(login)
  .delete(logout);

  module.exports = router;

