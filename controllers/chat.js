import { buildResponse, buildSuccessResponseData } from "../utils/common.js";
import { codes, httpCode } from "../utils/const.js";

export default {
    onLoadRoom: async (req, res) => {
        return buildResponse(
            res,
            httpCode.SUCCESS,
            buildSuccessResponseData(codes.SUCCESS_WITHOUT_ARGS, "OK", {})
        )
    },

    onSendMessage: async (req, res) => {
        
    },
};