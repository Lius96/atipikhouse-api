const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/auth");

const {
    getUser,
    creatUser,
    editUser,
    getUsers,
    deleteUser,
    updateUserPass,
    getUserByEmail,
    confirmedUser
} = require("../controllers/users");

router
  .route("/")
  .get(protect, getUsers)
  .post(creatUser);

router
  .route("/:id")
  .get(getUser)
  .put(protect, editUser)
  .delete(protect, deleteUser);

router
  .route("/pass")
  .post(getUserByEmail)

router
  .route("/pass/:id")
  .put(protect, updateUserPass);

router
  .route('/confirmation/:token')
  .put(confirmedUser)

module.exports = router;
