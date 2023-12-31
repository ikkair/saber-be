const jwt = require("jsonwebtoken");
const commonResponse = require("../common/response");

const onlyCourier = (req, res, next) => {
    if (req.payload.role !== 'courier'){
        return commonResponse.response(res, null, 403, "Insufficient privilage")
    }
    next()
}

const onlyAdmin = (req, res, next) => {
    if (req.payload.role !== 'admin'){
        return commonResponse.response(res, null, 403, "Insufficient privilage")
    }
    next()
}

const notCourier = (req, res, next) => {
    if (req.payload.role == 'courier'){
        return commonResponse.response(res, null, 403, "Insufficient privilage")
    }
    next()
}

const protect = (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization) {
            token = req.headers.authorization.split(" ")[1];
            let decoded = jwt.verify(token, process.env.SECRET_KEY_JWT);
            req.payload = decoded;
            next();
        } else {
            commonResponse.response(
                res,
                null,
                401,
                "Unauthorized, server needed a token"
            );
        }
    } catch (error) {
        if (error && error.name === "JsonWebTokenError") {
            commonResponse.response(res, null, 401, "Token invalid");
        } else if (error && error.name === "TokenExpiredError") {
            commonResponse.response(res, null, 403, "Token expired");
        } else {
            commonResponse.response(res, null, 401, "Token not active");
        }
    }
};

module.exports = { 
    protect,
    notCourier,
    onlyAdmin,
    onlyCourier
};
