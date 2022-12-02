import { buildResponse, buildErrorResponseData, } from '../utils/common.js';
import { codes, httpCode } from '../utils/const.js';
import logger from '../services/logger.js';

export function wrapResponse(handleFunc) {
    return async (req, res, next) => {
        try {
            await handleFunc(req, res, next);
        } catch (error) {
            logger.Error(error.message || error);

            var errorCode = codes.INTERNAL
            var errorMessage = "Unexpected error on server"
            return buildResponse(
                res,
                httpCode.SERVER_ERROR,
                buildErrorResponseData(errorCode, errorMessage)
            );
        }
    };
}
