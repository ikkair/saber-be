const jwt = require("jsonwebtoken");

const generateToken = (payload) => {
    const verifyOpts = {
        expiresIn: "3h",
        issuer: "saber",
    };
    const token = jwt.sign(payload, process.env.SECRET_KEY_JWT, verifyOpts);
    return token;
};

const generateVerificationToken = (payload) => {
    const verifyOpts = {
        expiresIn: "5m",
        issuer: "saber",
    };
    const token = jwt.sign(payload, process.env.SECRET_KEY_JWT, verifyOpts);
    return token;
};

const generateRefreshToken = (payload) => {
    const verifyOpts = {
        expiresIn: "1d",
    };
    const token = jwt.sign(payload, process.env.SECRET_KEY_JWT, verifyOpts);
    return token;
};

module.exports = { generateToken, generateRefreshToken, generateVerificationToken };
