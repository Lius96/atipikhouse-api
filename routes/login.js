const express = require("express");

const router = express.Router();

const {
    login,
    logout
} = require("../controllers/login");

router
  .route("/")
  .post(login)
  

router
  .route("/:id")
  .delete(logout)

  module.exports = router;

