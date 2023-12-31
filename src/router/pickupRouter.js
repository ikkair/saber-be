// Import express and router
const express = require("express")
const router = express.Router()

// Import controller functions
const pickupController = require("../controller/pickupController")

// Import upload
const uploadMiddle = require("../middleware/upload.js");

// Import auth
const authMiddle = require("../middleware/auth");

// Routes
router.get("/", pickupController.getAllPickups)
router.get("/:id", pickupController.getDetailPickup)
router.post("/", authMiddle.protect, authMiddle.notCourier, pickupController.addPickup)
router.put("/:id", authMiddle.protect, pickupController.editPickup)
router.put("/courier/status", authMiddle.protect, authMiddle.onlyCourier, pickupController.editPickupCourierStatus)
router.delete("/:id", authMiddle.protect, authMiddle.notCourier, pickupController.deletePickup)

// Export
module.exports = router
