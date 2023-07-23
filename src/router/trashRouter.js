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
router.post("/", trashController.addTrash)
router.put("/:id", trashController.editTrash)
router.delete("/:id", trashController.deleteTrash)

// Export
module.exports = router