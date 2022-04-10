const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/auth");

const {
    getUser,
    creatUser,
    editUser,
    getUsers,
    deleteUser
} = require("../controllers/users");

router
  .route("/")
  .get(protect, getUsers)
  .post(protect, creatUser);

router
  .route("/:id")
  .get(protect, getUser)
  .put(protect, editUser)
  .delete(protect, deleteUser);

module.exports = router;
