// Import express and router
const express = require("express");
const router = express.Router();

// Import route
const userRouter = require("./userRouter");
const withdrawalRouter = require("./withdrawalRouter");
const pickupRouter = require("./pickupRouter");

// Use route
router.use("/users", userRouter);
router.use("/withdrawals", withdrawalRouter);
router.use("/pickups", pickupRouter);

// Export router
module.exports = router;