import jwt from "jsonwebtoken";
import config from "../config/index.js";
import { buildErrorResponseData, buildResponse, buildUnAuthorizedResponse } from "../utils/common.js";
import { httpCode, codes } from '../utils/const.js';
import logger from "./logger.js";

const jwtErrors = {
    EXPIRE_TIME: "TokenExpiredError",
    INVALID: "JsonWebTokenError",
    NOT_BEFORE: "NotBeforeError",
    IS_DESTROYED: "IsDestroyedError",
}
const secretCode = config.jwt.secretCode;
const secretCodeBlackList = config.jwt.secretCodeBlackList;
const expriesIn = config.jwt.expireTime;
const adminId = config.admin.id;
const adminUserName = config.admin.userName;;
const adminToken = config.admin.token;
const jwtTag = "JWT_CHECK";

const buildToken = (data) => {
    return jwt.sign(data, secretCode, { expiresIn: expriesIn });
}

const verifyToken = (token) => {
    // Check is admin
    if (token === adminToken) {
        logger.Info(jwtTag, "Token is admin");
        return { id: adminId, userName: adminUserName }
    }

    let data = jwt.verify(token, secretCode);
    // Check is destroyed
    try {
        var destroyData = jwt.verify(token, secretCodeBlackList);
        if (destroyData) {
            throw new Error(jwtErrors.IS_DESTROYED)
        }
    } catch (error) { }
    return data
}

const destroyToken = (token) => {
    try {
        let data = jwt.verify(token, secretCode);
        if (data) {
            jwt.sign(data, secretCodeBlackList, { expiresIn: expriesIn });
        }
    } catch (error) { }
    return
}

const setTokenToRes = (res, data) => {
    res.locals.user = data
}

const checkToken = (req, res, next) => {
    const token = req.headers.token;
    if (token) {
        // Check is user
        try {
            const data = verifyToken(token)

            logger.Info(jwtTag, "Token is user: " + data);
            setTokenToRes(res, data);
            return next();
        } catch (error) {
            logger.Error(jwtTag, "Error parse token", error);

            switch (error.name) {
                case jwtErrors.EXPIRE_TIME:
                    return buildResponse(res, httpCode.UNAUTHORIZED, buildErrorResponseData(codes.TOKEN_EXPIRED, "Token expired"));
                case jwtErrors.IS_DESTROYED:
                    return buildUnAuthorizedResponse(res, "Token is destroyed");
                default:
                    return buildUnAuthorizedResponse(res, "Invalid token");
            }
        }
    } else {
        // Not token
        return buildUnAuthorizedResponse(res, "No token provided");
    }
};

export default {
    buildToken,
    verifyToken,
    destroyToken,
    middleWare: {
        checkToken
    }
}