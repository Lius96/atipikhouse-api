const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/auth");

const {
    getHouse,
    creatHouse,
    editHouse,
    getHouses,
    deleteHouse,
    getAuthorHouses
} = require("../controllers/houses");

router
  .route("/")
  .get(protect, getHouses)
  .post(protect, creatHouse);

router
  .route("/:id")
  .get(protect, getHouse)
  .put(protect, editHouse)
  .delete(protect, deleteHouse);

router
  .route("/author/:id")
  .get(protect, getAuthorHouses);

module.exports = router;
