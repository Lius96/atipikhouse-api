const express = require("express");

const router = express.Router();

const {
    sendMail,
    getRecaptcha
} = require("../controllers/mailler");

router
  .route("/")
  .post(sendMail)

router
  .route("/recaptcha/:response")
  .get(getRecaptcha)

  module.exports = router;

