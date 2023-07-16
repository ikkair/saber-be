// Import model
const withdrawalModel = require("../model/withdrawalModel")

// Import random id
const { v4: uuidv4 } = require("uuid")

// Import Helper for Template Response
const commonResponse = require("../common/response")

const getAllWithdrawals = async (req, res) => {
    // Set params as const
    const queryLimit = req.query.limit
    try {
        const selectResult = await withdrawalModel.selectAllWithdrawals(queryLimit)
        if (selectResult.rowCount > 0){
            return commonResponse.response(res, selectResult.rows, 200, "Get all withdrawals success")
        } else {
            return commonResponse.response(res, null, 404, "No withdrawal available")
        }
    } catch (error) {
        console.log(error)
        return commonResponse.response(res, null, 500, "Failed to get all withdrawals")
    }
}

const getDetailWithdrawal = async (req, res) => {
    // Set param id as const
    const queryId = req.params.id
    try {
        const selectResult = await withdrawalModel.selectDetailWithdrawal(queryId)
        // Check the affected row
        if (selectResult.rowCount > 0) {
            return commonResponse.response(res, selectResult.rows, 200, "Get detail withdrawal success")
        } else {
            return commonResponse.response(res, selectResult.rows, 404, "Withdrawal not found")
        }
    } catch (error) {
        console.log(error)
        return commonResponse.response(res, null, 500, "Failed to get detail withdrawal")
    }
}

const addWithdrawal = async (req, res) => {
    // Generate Id
    req.body.queryId = uuidv4()
    try {
        const insertResult = await withdrawalModel.insertWithdrawal(req.body)
        return commonResponse.response(res, insertResult.rows, 200, "Withdrawal added")
    } catch (error) {
        console.log(error)
        if (error.detail && error.detail.includes('is not present in table "users".')) {
            return commonHelper.response(res, null, 400, "User id is not present in table users")
        } else {
            return commonHelper.response(res, null, 500, "Failed to add withdrawal")
        }
    }
}

const editWithdrawal = async (req, res) => {
    // Set param id as const
    const queryId = req.params.id
    req.body.queryId = queryId
    // Update other field
    try {
        const updateResult = await withdrawalModel.updateWithdrawal(req.body)
        if (updateResult.rowCount > 0) {
            return commonResponse.response(res, updateResult.rows, 200, "Withdrawal edited")
        } else {
            return commonResponse.response(res, null, 404, "Withdrawal not found")
        }
    } catch (error) {
        console.log(error)
        if (error.detail && error.detail.includes('already exists.')) {
            return commonResponse.response(res, null, 400, "Withdrawal name already exist")
        } else {
            return commonResponse.response(res, null, 500, "Failed to update withdrawal")
        }
    }
}

const deleteWithdrawal = async (req, res) => {
    // Set param id as const
    const queryId = req.params.id
    try {
        const deleteResult = await withdrawalModel.deleteWithdrawal(queryId)
        if (deleteResult.rowCount > 0) {
            return commonResponse.response(res, deleteResult.rows, 200, "Withdrawal deleted")
        } else {
            return commonResponse.response(res, null, 404, "Withdrawal not found")
        }
    } catch (error) {
        console.log(error)
        return commonResponse.response(res, null, 500, "Failed to delete withdrawal")
    }
}

module.exports = {
    getAllWithdrawals,
    getDetailWithdrawal,
    addWithdrawal,
    editWithdrawal,
    deleteWithdrawal
}