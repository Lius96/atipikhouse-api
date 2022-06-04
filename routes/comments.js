const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/auth");

const {
    createComments,
    editComment,
    getComment,
    getHouseComments,
    deleteComment,
    getComments
} = require("../controllers/comments");

router
  .route("/")
  .get(getComments)
  .post(protect, createComments);

router
  .route("/:id")
  .get(getComment)
  .put(protect, editComment)
  .delete(protect, deleteComment);

router
  .route("/house/:id")
  .get(getHouseComments);

module.exports = router;
