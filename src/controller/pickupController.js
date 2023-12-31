// Import model
const pickupModel = require("../model/pickupModel")
const userModel = require("../model/userModel")

// Import random id
const { v4: uuidv4 } = require("uuid")

// Import Helper for Template Response
const commonResponse = require("../common/response")

const getAllPickups = async (req, res) => {
    // Set params as const
    const queryLimit = req.query.limit
    try {
        const selectResult = await pickupModel.selectAllPickups(queryLimit)
        if (selectResult.rowCount > 0) {
            return commonResponse.response(res, selectResult.rows, 200, "Get all pickups success")
        } else {
            return commonResponse.response(res, null, 404, "No pickups available")
        }
    } catch (error) {
        console.log(error)
        return commonResponse.response(res, null, 500, "Failed to get all pickups")
    }
}

const getDetailPickup = async (req, res) => {
    // Set param id as const
    const queryId = req.params.id
    try {
        const selectResult = await pickupModel.selectDetailPickup(queryId)
        // Check the affected row
        if (selectResult.rowCount > 0) {
            return commonResponse.response(res, selectResult.rows, 200, "Get detail pickup success")
        } else {
            return commonResponse.response(res, selectResult.rows, 404, "Pickup not found")
        }
    } catch (error) {
        console.log(error)
        return commonResponse.response(res, null, 500, "Failed to get detail pickup")
    }
}

const addPickup = async (req, res) => {
    if (req.payload.role == "user") {
        // Get user id from jwt
        req.body.user_id = req.payload.id
    }
    // Generate Id
    req.body.queryId = uuidv4()
    try {
        const insertResult = await pickupModel.insertPickup(req.body)
        return commonResponse.response(res, insertResult.rows, 200, "Pickup added")
    } catch (error) {
        console.log(error)
        if (error.detail && error.detail.includes('is not present in table "users".')) {
            return commonResponse.response(res, null, 400, "User id is not present in table users")
        } else {
            return commonResponse.response(res, null, 500, "Failed to add pickup")
        }
    }
}

const editPickupCourierStatus = async (req, res) => {
    try {
        if (req.body.status == "success") {
            const result = await pickupModel.selectWaitingTrashes(req.body.pickup_id)
            if (result.rows[0].count > 0) {
                return commonResponse.response(res, null, 403, "Currently, there are still some trash items that have not been accepted")
            }
            await pickupModel.updatePickupBalance({ queryId: req.body.pickup_id })
            const updateResult = await pickupModel.updatePickupCourier(req.body)
            await userModel.updateUserBalance({queryId: req.body.user_id})
            if (updateResult.rowCount > 0) {
                return commonResponse.response(res, updateResult.rows, 200, "Pickup edited")
            } else {
                return commonResponse.response(res, null, 404, "Pickup not found")
            }
        } else {
            const updateResult = await pickupModel.updatePickupCourier(req.body)
            if (updateResult.rowCount > 0) {
                return commonResponse.response(res, updateResult.rows, 200, "Pickup edited")
            } else {
                return commonResponse.response(res, null, 404, "Pickup not found")
            }
        }
    } catch (error) {
        console.log(error)
        return commonResponse.response(res, null, 500, "Failed to update pickup")
    }
}

const editPickup = async (req, res) => {
    // Set param id as const
    const queryId = req.params.id
    req.body.queryId = queryId
    // Update other field
    try {
        const updateResult = await pickupModel.updatePickup(req.body)
        if (updateResult.rowCount > 0) {
            return commonResponse.response(res, updateResult.rows, 200, "Pickup edited")
        } else {
            return commonResponse.response(res, null, 404, "Pickup not found")
        }
    } catch (error) {
        console.log(error)
        return commonResponse.response(res, null, 500, "Failed to update pickup")
    }
}

const deletePickup = async (req, res) => {
    // Set param id as const
    const queryId = req.params.id
    try {
        const deleteResult = await pickupModel.deletePickup(queryId)
        if (deleteResult.rowCount > 0) {
            return commonResponse.response(res, deleteResult.rows, 200, "Pickup deleted")
        } else {
            return commonResponse.response(res, null, 404, "Pickup not found")
        }
    } catch (error) {
        console.log(error)
        return commonResponse.response(res, null, 500, "Failed to delete pickup")
    }
}

module.exports = {
    getAllPickups,
    getDetailPickup,
    addPickup,
    editPickup,
    editPickupCourierStatus,
    deletePickup
}