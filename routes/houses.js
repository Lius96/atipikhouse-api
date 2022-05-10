const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/auth");

const {
    getHouse,
    creatHouse,
    editHouse,
    getHouses,
    deleteHouse,
    getAuthorHouses,
    uploadFiles,
    editHouseNotify,
    getAuthorBookedHouses
} = require("../controllers/houses");

router
  .route("/")
  .get(getHouses)
  .post(protect, creatHouse);

router
  .route("/:id")
  .get(getHouse)
  .put(protect, editHouse)
  .delete(protect, deleteHouse);


router
  .route("/notification/:id")
  .put(protect, editHouseNotify)

router
  .route("/author/:id")
  .get(protect, getAuthorHouses);

router
  .route("/booked/author/:id")
  .get(protect, getAuthorBookedHouses);


router
  .route("/images/")
  .post(protect, uploadFiles);

module.exports = router;
