import { buildResponse, buildErrorResponseData, codes, httpCode } from '../utils/common.js';

export function wrapResponse(handleFunc) {
    return async (req, res, next) => {
        try {
            await handleFunc(req, res);
        } catch (error) {
            logger.error(error, req);

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
