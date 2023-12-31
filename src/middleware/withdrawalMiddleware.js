// Import model
const userModel = require("../model/userModel")

// Import Helper for Template Response
const commonResponse = require("../common/response")

const isBalanceEnough = async (req, res, next) => {
    try {
        const selectResult = await userModel.selectDetailUser(req.payload.id)
        if (selectResult.rowCount < 1){
            return commonResponse.response(res, null, 400, "User id is not present in table users")
        }
        if (selectResult.rows[0].balance < 50000){
            return commonResponse.response(res, null, 403, "Minimum balance to withdraw is 50000")
        }
        if (selectResult.rows[0].balance < req.body.amount){
            return commonResponse.response(res, null, 400, "User balance is not enough")
        }
        next()
    } catch (error) {
        console.log(error)
        return commonResponse.response(res, null, 500, "Failed to get user balance")
    }
}


const ifUser = (req, res, next) => {
    if (req.payload.role == 'user'){
        req.body.user_id = req.payload.id
    }
    next()
}

const isOldEnough = async (req, res, next) => {
    let date;
    const minimumDays = 30;
    try {
        result = await userModel.selectCreationDate(req.body.user_id);
        date = new Date(result.rows[0].creation_date)
        date = date.setTime(date.getTime() + (24 * 60 * 60 * 1000 * minimumDays))
    } catch (error) {
        console.log(error)
        return commonResponse.response(res, null, 404, "Failed to get creation date")
    }
    if (date < (new Date).getTime()){
        next()
          } else {
        return commonResponse.response(res, null, 403, `Withdrawals only allowed after ${minimumDays} Days of account creation`)
    }

}

module.exports = {
    ifUser,
    isOldEnough,
    isBalanceEnough
}