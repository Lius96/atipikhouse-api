const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/auth");

const {
    getEquipment,
    getEquipments,
    creatEquipment,
    editEquipment,
    deleteEquipment
} = require("../controllers/equipement");

router
  .route("/")
  .get(getEquipments)
  .post(protect, creatEquipment);

router
  .route("/:id")
  .get(getEquipment)
  .put(protect, editEquipment)
  .delete(protect, deleteEquipment);

module.exports = router;
