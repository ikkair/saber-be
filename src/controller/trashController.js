// Import model
const trashModel = require("../model/trashModel")

// Import random id
const { v4: uuidv4 } = require("uuid")

// Import Helper for Template Response
const commonResponse = require("../common/response")

// Import upload google
const {
    updatePhoto,
    uploadPhoto,
    deletePhoto,
} = require("../config/googleDrive.config");

const getAllTrashes = async (req, res) => {
    // Set params as const
    const queryLimit = req.query.limit
    try {
        const selectResult = await trashModel.selectAllTrashes(queryLimit)
        if (selectResult.rowCount > 0){
            return commonResponse.response(res, selectResult.rows, 200, "Get all trashes success")
        } else {
            return commonResponse.response(res, null, 404, "No trashes available")
        }
    } catch (error) {
        console.log(error)
        return commonResponse.response(res, null, 500, "Failed to get all trashes")
    }
}

const getDetailTrash = async (req, res) => {
    // Set param id as const
    const queryId = req.params.id
    try {
        const selectResult = await trashModel.selectDetailTrash(queryId)
        // Check the affected row
        if (selectResult.rowCount > 0) {
            return commonResponse.response(res, selectResult.rows, 200, "Get detail trash success")
        } else {
            return commonResponse.response(res, selectResult.rows, 404, "Trash not found")
        }
    } catch (error) {
        console.log(error)
        return commonResponse.response(res, null, 500, "Failed to get detail trash")
    }
}

const addTrash = async (req, res) => {
    // Generate Id
    req.body.queryId = uuidv4()
    try {
        if(req.file){
            const uploadResult = await uploadPhoto(req.file);
            const parentPath = process.env.GOOGLE_DRIVE_PHOTO_PATH;
            req.body.queryFilename = parentPath.concat(uploadResult.id + "/view");
        }
        const insertResult = await trashModel.insertTrash(req.body)
        return commonResponse.response(res, insertResult.rows, 200, "Trash added")
    } catch (error) {
        console.log(error)
        if (error.detail && error.detail.includes('is not present in table "pickups".')) {
            return commonResponse.response(res, null, 400, "Pickup id is not present in table pickups")
        } else if(error.detail && error.detail.includes('is not present in table "trash_types".')) {
            return commonResponse.response(res, null, 400, "Type id is not present in table trash type")
        } else {
            return commonResponse.response(res, null, 500, "Failed to add trash")
        }
    }
}

const editTrash = async (req, res) => {
    // Set param id as const
    const queryId = req.params.id
    req.body.queryId = queryId
    // Declare variable for holding query result
    let selectResult
    try {
        selectResult = await trashModel.selectDetailTrash(queryId)
        if (selectResult.rowCount < 1) {
            return commonResponse.response(res, null, 404, "Trash not found")
        }
    } catch (error) {
        console.log(error)
        return commonResponse.response(res, null, 500, "Failed to get data trash")
    }
    // Update the old photo
    const oldPhoto = selectResult.rows[0].photo;
    if (req.file) {
        try {
            if (oldPhoto != "undefined" && oldPhoto != "photo.jpg" && oldPhoto != "" && oldPhoto != "null") {
                const oldPhotoId = oldPhoto.split("/")[5];
                const updateResult = await updatePhoto(
                    req.file,
                    oldPhotoId
                );
                const parentPath = process.env.GOOGLE_DRIVE_PHOTO_PATH;
                req.body.queryFilename = parentPath.concat(updateResult.id);
            } else {
                const uploadResult = await uploadPhoto(req.file);
                const parentPath = process.env.GOOGLE_DRIVE_PHOTO_PATH;
                req.body.queryFilename = parentPath.concat(uploadResult.id + "/view");
            }
        } catch (error) {
            console.log(error)
            return commonResponse.response(res, null, 500, "Failed to update user photo")
        }
    } else {
        req.body.queryFilename = oldPhoto
    }
    // Update other field
    try {
        const updateResult = await trashModel.updateTrash(req.body)
        if (updateResult.rowCount > 0) {
            return commonResponse.response(res, updateResult.rows, 200, "Trash edited")
        } else {
            return commonResponse.response(res, null, 404, "Trash not found")
        }
    } catch (error) {
        console.log(error)
        if (error.detail && error.detail.includes('is not present in table "trash_types".')) {
            return commonResponse.response(res, null, 400, "Type id is not present in table trash type")
        } else {
            return commonResponse.response(res, null, 500, "Failed to update trash")
        }
    }
}

const deleteTrash = async (req, res) => {
    // Set param id as const
    const queryId = req.params.id
    // Declare variable for holding query result
    let selectResult
    try {
        selectResult = await trashModel.selectDetailTrash(queryId)
        if (selectResult.rowCount < 1) {
            return commonResponse.response(res, null, 404, "Trash not found")
        }
    } catch (error) {
        console.log(error)
        return commonResponse.response(res, null, 500, "Failed to get data trash")
    }
    try {
        const deleteResult = await trashModel.deleteTrash(queryId)
        const oldPhoto = selectResult.rows[0].photo;
        if (oldPhoto != "undefined" && oldPhoto != "photo.jpg" && oldPhoto != "") {
            const oldPhotoId = oldPhoto.split("/")[5];
            await deletePhoto(oldPhotoId);
        }
        return commonResponse.response(res, deleteResult.rows, 200, "Trash deleted")
    } catch (error) {
        console.log(error)
        return commonResponse.response(res, null, 500, "Failed to delete trash")
    }
}

module.exports = {
    getAllTrashes,
    getDetailTrash,
    addTrash,
    editTrash,
    deleteTrash
}
