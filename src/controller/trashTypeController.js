// Import model
const trashTypeModel = require("../model/trashTypeModel")

// Import random id
const { v4: uuidv4 } = require("uuid")

// Import Helper for Template Response
const commonResponse = require("../common/response")

const getAllTrashTypes = async (req, res) => {
    // Set params as const
    const queryLimit = req.query.limit
    try {
        const selectResult = await trashTypeModel.selectAllTrashTypes(queryLimit)
        if (selectResult.rowCount > 0){
            return commonResponse.response(res, selectResult.rows, 200, "Get all trash types success")
        } else {
            return commonResponse.response(res, null, 404, "No trash type available")
        }
    } catch (error) {
        console.log(error)
        return commonResponse.response(res, null, 500, "Failed to get all trash type")
    }
}

const getDetailTrashType = async (req, res) => {
    // Set param id as const
    const queryId = req.params.id
    try {
        const selectResult = await trashTypeModel.selectDetailTrashType(queryId)
        // Check the affected row
        if (selectResult.rowCount > 0) {
            return commonResponse.response(res, selectResult.rows, 200, "Get detail trash type success")
        } else {
            return commonResponse.response(res, selectResult.rows, 404, "Trash type not found")
        }
    } catch (error) {
        console.log(error)
        return commonResponse.response(res, null, 500, "Failed to get detail trash type")
    }
}

const addTrashType = async (req, res) => {
    // Generate Id
    req.body.queryId = uuidv4()
    try {
        const insertResult = await trashTypeModel.insertTrashType(req.body)
        return commonResponse.response(res, insertResult.rows, 200, "Trash type added")
    } catch (error) {
        console.log(error)
        if (error.detail && error.detail.includes('already exists.')) {
            return commonResponse.response(res, null, 400, "Trash type name already exist")
        } else {
            return commonResponse.response(res, null, 500, "Failed to add trash type")
        }
    }
}

const editTrashType = async (req, res) => {
    // Set param id as const
    const queryId = req.params.id
    req.body.queryId = queryId
    // Update other field
    try {
        const updateResult = await trashTypeModel.updateTrashType(req.body)
        if (updateResult.rowCount > 0) {
            return commonResponse.response(res, updateResult.rows, 200, "Trash type edited")
        } else {
            return commonResponse.response(res, null, 404, "Trash type not found")
        }
    } catch (error) {
        console.log(error)
        if (error.detail && error.detail.includes('already exists.')) {
            return commonResponse.response(res, null, 400, "Trash type name already exist")
        } else {
            return commonResponse.response(res, null, 500, "Failed to update trash type")
        }
    }
}

const deleteTrashType = async (req, res) => {
    // Set param id as const
    const queryId = req.params.id
    try {
        const deleteResult = await trashTypeModel.deleteTrashType(queryId)
        if (deleteResult.rowCount > 0) {
            return commonResponse.response(res, deleteResult.rows, 200, "Trash type deleted")
        } else {
            return commonResponse.response(res, null, 404, "Trash not found")
        }
    } catch (error) {
        console.log(error)
        return commonResponse.response(res, null, 500, "Failed to delete trash")
    }
}

module.exports = {
    getAllTrashTypes,
    getDetailTrashType,
    addTrashType,
    editTrashType,
    deleteTrashType
}