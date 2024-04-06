// Import express and router
const express = require("express")
const router = express.Router()

// Import controller functions
const trashController = require("../controller/trashController")

// Import upload
const uploadMiddle = require("../middleware/upload.js");

// Import auth
const authMiddle = require("../middleware/auth");

// Routes
router.get("/", trashController.getAllTrashes)
router.get("/:id", trashController.getDetailTrash)
router.post("/", authMiddle.protect, authMiddle.notCourier, uploadMiddle.single("photo"), trashController.addTrash)
router.put("/:id", authMiddle.protect, uploadMiddle.single("photo"), trashController.editTrash)
router.delete("/:id", authMiddle.protect, authMiddle.notCourier, trashController.deleteTrash)

// Export
module.exports = router
