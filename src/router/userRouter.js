// Import express and router
const express = require("express")
const router = express.Router()

// Import controller functions
const userController = require("../controller/userController")

// Import upload
const uploadMiddle = require("../middleware/upload.js");

// Import auth
const authMiddle = require("../middleware/auth");

// Routes
router.get("/", userController.getAllUsers)
router.get("/:id", userController.getDetailUser)
router.get("/auth/verification", userController.verificationUser)
router.post("/login", userController.loginUser)
router.post("/register", userController.registerUser)
router.put("/", authMiddle.protect, uploadMiddle.single("photo"), userController.editUser)
router.delete("/:id", userController.deleteUser)

// Export
module.exports = router