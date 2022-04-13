const express = require("express");

const router = express.Router();

const {
    sendMail
} = require("../controllers/mailler");

router
  .route("/")
  .post(sendMail)

  module.exports = router;

