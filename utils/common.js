import { httpCode, codes } from "./const.js";

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
    return res.status(httpCode).json(responseData);
}

