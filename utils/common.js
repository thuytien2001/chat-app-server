import { httpCode, codes, utils } from "./const.js";
import logger from '../services/logger.js'
import util from 'util';

const isEmpty = (object) => Object.keys(object).length === 0

export const getRequestString = (req) => {
    var result = util.format('METHOD: %s, URL: %s', req.method, req.url)
    if (!isEmpty(req.body)) {
        result += util.format(', BODY: %s', req.body)
    }
    if (!isEmpty(req.params)) {
        result += util.format(', PARAMS: %s', req.params)
    }
    if (!isEmpty(req.query)) {
        result += util.format(', QUERY: %s', req.query)
    }
    return result
}

export function getUserInfo(res) {
    return res.locals.user
}

export function setUserInfo(res, data) {
    res.locals.user = data
}

export function buildSuccessResponseData(code, message, data) {
    return {
        code: code,
        message: message,
        data: data,
    };
}

export function buildErrorResponseData(code, message) {
    return {
        code: code,
        message: message,
    };
}

export function buildResponse(res, httpCode, responseData) {
    logger.Info("request", getRequestString(res.req), "response", httpCode, responseData)
    return res.status(httpCode).json(responseData);
}

export function buildSuccessResponse(res, data) {
    return buildResponse(res, httpCode.SUCCESS, buildSuccessResponseData(codes.SUCCESS_WITHOUT_ARGS, "OK", data))
}

export function buildUnAuthorizedResponse(res, mesage = null) {
    if (mesage) {
        return buildResponse(res, httpCode.UNAUTHORIZED, buildSuccessResponseData(codes.UNAUTHORIZED, mesage, null));
    }
    return buildResponse(res, httpCode.UNAUTHORIZED, buildSuccessResponseData(codes.UNAUTHORIZED, "Không có quyền truy cập", null));
}
