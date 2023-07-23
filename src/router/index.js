// Import express and router
const express = require("express");
const router = express.Router();

// Import route
const userRouter = require("./userRouter");
const withdrawalRouter = require("./withdrawalRouter");
const pickupRouter = require("./pickupRouter");
const trashRouter = require("./trashRouter");
const trashTypeRouter = require("./trashTypeRouter");

// Use route
router.use("/users", userRouter);
router.use("/withdrawals", withdrawalRouter);
router.use("/pickups", pickupRouter);
router.use("/trashes", trashRouter);
router.use("/trash_types", trashTypeRouter);

// Export router
module.exports = router;