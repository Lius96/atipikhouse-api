const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/auth");

const {
    getBookings,
    getAuthorBooking,
    getHouseBooking,
    deleteBooking,
    createBooking,
    editBooking
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

module.exports = router;
