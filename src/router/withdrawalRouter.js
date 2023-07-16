// Import express and router
const express = require("express")
const router = express.Router()

// Import controller functions
const withdrawaController = require("../controller/withdrawalController")

// Import upload
const uploadMiddle = require("../middleware/upload.js");

// Import auth
const authMiddle = require("../middleware/auth");

// Routes
router.get("/", withdrawaController.getAllWithdrawals)
router.get("/:id", withdrawaController.getDetailWithdrawal)
router.post("/", withdrawaController.addWithdrawal)
router.put("/:id", withdrawaController.editWithdrawal)
router.delete("/:id", withdrawaController.deleteWithdrawal)

// Export
module.exports = router