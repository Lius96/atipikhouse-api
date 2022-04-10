const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/auth");

const {
    createComments,
    editComment,
    getHouseComments,
    deleteComment,
    getComments
} = require("../controllers/comments");

router
  .route("/")
  .get(protect, getComments)
  .post(protect, createComments);

router
  .route("/:id")
  .put(protect, editComment)
  .delete(protect, deleteComment);

router
  .route("/house/:id")
  .get(protect, getHouseComments);

module.exports = router;
