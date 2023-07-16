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
router.post("/", pickupController.addPickup)
router.put("/:id", pickupController.editPickup)
router.delete("/:id", pickupController.deletePickup)

// Export
module.exports = router