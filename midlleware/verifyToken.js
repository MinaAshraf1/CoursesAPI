const jwt = require("jsonwebtoken");

const appError = require("../utils/appError");
const httpStatusText = require("../utils/httpStatusText");

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['Authorization'] || req.headers['authorization'];

    if(!authHeader) {
        const error = appError.create('token is required', 401, httpStatusText.ERROR);
        return next(error);
    }

    const token = authHeader.split(' ')[1];

    // console.log("token ", token);

    try{
        const decodedToken = jwt.verify(token, process.env.JWT_SECURE_KEY); //decode token
        // console.log("decodedToken ", decodedToken);
        req.token = decodedToken;
    
        next();
    } catch(e) {
        const error = appError.create(e, 401, httpStatusText.ERROR);
        return next(error);
    }
}

module.exports = verifyToken;