// Import model
const userModel = require("../model/userModel")

// Import jwt
const jwt = require("jsonwebtoken");

// Import random id
const { v4: uuidv4 } = require("uuid")

// Import Template Response
const commonResponse = require("../common/response")

// Import hash
const bcrypt = require("bcryptjs");

// Import Helper for authentication
const commonAuth = require("../common/auth");

// Import Helper for Email
const { sendMail } = require("../config/mail");

// Import upload google
const {
    updatePhoto,
    uploadPhoto,
    deletePhoto,
} = require("../config/googleDrive.config");

const getAllUsers = async (req, res) => {
    try {
        const selectResult = await userModel.selectAllUsers()
        if (selectResult.rowCount > 0) {
            return commonResponse.response(res, selectResult.rows, 200, "Get all users success")
        } else {
            return commonResponse.response(res, null, 404, "No user available")
        }
    } catch (error) {
        console.log(error)
        return commonResponse.response(res, null, 500, "Failed to get all user")
    }
}

const getDetailUser = async (req, res) => {
    // Set param id as const
    const queryId = req.params.id
    try {
        const selectResult = await userModel.selectDetailUser(queryId)
        // Check the affected row
        if (selectResult.rowCount > 0) {
            delete selectResult.rows[0].password
            return commonResponse.response(res, selectResult.rows, 200, "Get detail user success")
        } else {
            return commonResponse.response(res, selectResult.rows, 404, "User not found")
        }
    } catch (error) {
        console.log(error)
        return commonResponse.response(res, null, 500, "Failed to get detail user")
    }
}

const verificationUser = async (req, res) => {
    const token = req.query.token;
    let payload;
    try {
        payload = jwt.verify(token, process.env.SECRET_KEY_JWT);
    } catch (error) {
        if (error && error.name === "JsonWebTokenError") {
            return commonResponse.response(res, null, 401, "Token invalid");
        } else if (error && error.name === "TokenExpiredError") {
            return commonResponse.response(res, null, 403, "Token expired");
        } else {
            console.log(error)
            return commonResponse.response(res, null, 401, "Token not active");
        }
    }
    try {
        const result = await userModel.selectUserByEmail(payload.email);
        if (result.rowCount > 0) {
            return commonResponse.response(
                res,
                null,
                400,
                "Email already verified"
            );
        }
    } catch (err) {
        console.log(err);
        return commonResponse.response(res, null, 500, err.detail);
    }
    // Generate Id
    payload.queryId = uuidv4()
    try {
        const insertResult = await userModel.insertUser(payload)
        return commonResponse.response(res, insertResult.rows, 200, "User added")
    } catch (error) {
        console.log(error)
        return commonResponse.response(res, null, 500, "Failed to add user")
    }
}

const loginUser = async (req, res) => {
    let selectResult
    try {
        selectResult = await userModel.selectUserByEmail(req.body.email.toLowerCase())
        if (selectResult.rowCount < 1) {
            return commonResponse.response(res, null, 404, "Email not found")
        }
    } catch (error) {
        console.log(error)
        return commonResponse.response(res, null, 500, "Failed to get detail email")
    }
    // Check password
    const isPasswordValid = bcrypt.compareSync(
        req.body.password,
        selectResult.rows[0].password
    )
    delete selectResult.rows[0].password
    if(!isPasswordValid){
        return commonResponse.response(res, null, 400, "Password invalid")
    }
    const payload = {
        id: selectResult.rows[0].id,
        role: "user"
    };
    const token = commonAuth.generateToken(payload);
    const refreshToken = commonAuth.generateRefreshToken(payload);
    selectResult.rows[0].role = "user"
    selectResult.rows[0].token = token
    selectResult.rows[0].refreshToken = refreshToken
    return commonResponse.response(res, selectResult.rows, 200, "Login success")
}

const registerUser = async (req, res) => {
    // Email lowecase
    req.body.email = req.body.email.toLowerCase();
    try {
        const result = await userModel.selectUserByEmail(req.body.email);
        if (result.rowCount > 0) {
            return commonResponse.response(res, null, 400, "Email already used");
        }
    } catch (err) {
        console.log(err);
        return commonResponse.response(res, null, 500, err.detail);
    }
    // Creating hash password
    const salt = bcrypt.genSaltSync(10);
    req.body.queryPwd = bcrypt.hashSync(req.body.password, salt);
    const payload = {
        name: req.body.name,
        email: req.body.email,
        queryPwd: req.body.queryPwd
    }
    const token = commonAuth.generateVerificationToken(payload)
    sendMail(token, req.body.email);
    commonResponse.response(res, null, 200, "Check your email");
}

const editUser = async (req, res) => {
    // Set param id as const
    const queryId = req.payload.id
    req.body.queryId = queryId
    // Declare variable for holding query result
    let selectResult
    try {
        selectResult = await userModel.selectDetailUser(queryId)
        if (selectResult.rowCount < 1) {
            return commonResponse.response(res, null, 404, "User not found")
        }
    } catch (error) {
        console.log(error)
        return commonResponse.response(res, null, 500, "Failed to get data user")
    }
    // Update the old photo
    const oldPhoto = selectResult.rows[0].photo;
    if (req.file) {
        try {
            if (oldPhoto != "undefined" && oldPhoto != "photo.jpg" && oldPhoto != "") {
                const oldPhotoId = oldPhoto.split("=")[1];
                const updateResult = await updatePhoto(
                    req.file,
                    oldPhotoId
                );
                const parentPath = process.env.GOOGLE_DRIVE_PHOTO_PATH;
                req.body.queryFilename = parentPath.concat(updateResult.id);
            } else {
                const uploadResult = await uploadPhoto(req.file);
                const parentPath = process.env.GOOGLE_DRIVE_PHOTO_PATH;
                req.body.queryFilename = parentPath.concat(uploadResult.id);
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
        const updateResult = await userModel.updateUser(req.body)
        return commonResponse.response(res, updateResult.rows, 200, "User edited")
    } catch (error) {
        console.log(error)
        if (error.detail && error.detail.includes('already exists.')) {
            return commonResponse.response(res, null, 400, "User name already exist")
        } else {
            return commonResponse.response(res, null, 500, "Failed to update user")
        }
    }

}

const deleteUser = async (req, res) => {
    // Set param id as const
    const queryId = req.params.id
    // Declare variable for holding query result
    let selectResult
    try {
        selectResult = await userModel.selectDetailUser(queryId)
        if (selectResult.rowCount < 1) {
            return commonResponse.response(res, null, 404, "User not found")
        }
    } catch (error) {
        console.log(error)
        return commonResponse.response(res, null, 500, "Failed to get data user")
    }
    // Declare variable for holding query result
    let deleteResult
    try {
        deleteResult = await userModel.deleteUser(queryId)
        const oldPhoto = selectResult.rows[0].photo;
        if (oldPhoto != "undefined" && oldPhoto != "photo.jpg" && oldPhoto != "") {
            const oldPhotoId = oldPhoto.split("=")[1];
            await deletePhoto(oldPhotoId);
        }
        return commonResponse.response(res, deleteResult.rows, 200, "User deleted")
    } catch (error) {
        console.log(error)
        return commonResponse.response(res, null, 500, "Failed to delete user")
    }

}

module.exports = {
    getAllUsers,
    getDetailUser,
    verificationUser,
    loginUser,
    registerUser,
    editUser,
    deleteUser
}