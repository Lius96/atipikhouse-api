const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/auth");

const {
    getPage,
    getPages,
    creatPage,
    editPage,
    deletePage
} = require("../controllers/pages");

router
  .route("/")
  .get(protect, getPages)
  .post(protect, creatPage);

router
  .route("/:id")
  .get(protect, getPage)
  .put(protect, editPage)
  .delete(protect, deletePage);

module.exports = router;
