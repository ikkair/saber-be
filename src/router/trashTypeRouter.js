// Import express and router
const express = require("express")
const router = express.Router()

// Import controller functions
const trashTypeController = require("../controller/trashTypeController")

// Import upload
const uploadMiddle = require("../middleware/upload.js");

// Import auth
const authMiddle = require("../middleware/auth");

// Routes
router.get("/", trashTypeController.getAllTrashTypes)
router.get("/:id", trashTypeController.getDetailTrashType)
router.post("/", authMiddle.protect, authMiddle.onlyAdmin, trashTypeController.addTrashType)
router.put("/:id", authMiddle.protect, authMiddle.onlyAdmin, trashTypeController.editTrashType)
router.delete("/:id", authMiddle.protect, authMiddle.onlyAdmin, trashTypeController.deleteTrashType)

// Export
module.exports = router