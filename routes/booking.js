const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/auth");

const {
    getBookings,
    getAuthorBooking,
    getHouseBooking,
    deleteBooking,
    createBooking,
    editBooking,
    createIntentment,
    getOwnerBooking
} = require("../controllers/booking");

router
  .route("/")
  .get(protect, getBookings)
  .post(protect, createBooking);

router
  .route("/:id")
  .put(protect, editBooking)
  .delete(protect, deleteBooking);

router
  .route("/author/:id")
  .get(protect, getAuthorBooking);

router
  .route("/house/:id")
  .get(protect, getHouseBooking);

router
  .route("/owner/:id")
  .get(protect, getOwnerBooking);

router
  .route("/payintentment/")
  .post(protect, createIntentment);

module.exports = router;
