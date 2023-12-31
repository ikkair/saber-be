// Import express and router
const express = require("express")
const router = express.Router()

// Import controller functions
const withdrawaController = require("../controller/withdrawalController")

// Import upload
const uploadMiddle = require("../middleware/upload.js");

// Import auth
const authMiddle = require("../middleware/auth");
const withdrawMiddle = require("../middleware/withdrawalMiddleware");

// Routes
router.get("/", withdrawaController.getAllWithdrawals)
router.get("/:id", withdrawaController.getDetailWithdrawal)
router.post("/", 
                authMiddle.protect,
                authMiddle.notCourier,
                withdrawMiddle.ifUser,
                withdrawMiddle.isOldEnough,
                withdrawMiddle.isBalanceEnough,
                withdrawaController.addWithdrawal
            )
// Withdrawal cannot be edited
// router.put("/:id", withdrawaController.editWithdrawal)
// Withdrawal cannot be deleted
// router.delete("/:id", withdrawaController.deleteWithdrawal)

// Export
module.exports = router