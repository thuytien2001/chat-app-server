import { myPrisma } from '../models/index.js';
import { buildErrorResponseData, buildResponse, buildSuccessResponse } from '../utils/common.js';
import { httpCode, codes } from '../utils/const.js';
import authenticateService from '../services/authenticate.js'

export default {
    onLogin: async (req, res) => {
        const {
            username,
            password,
        } = req.query;
        if (!username && !password) {
            return buildResponse(
                res,
                httpCode.BAD_REQUEST,
                buildErrorResponseData(
                    codes.INTERNAL,
                    `Username or password is required`
                )
            )
        }

        // Find user
        const user = await myPrisma.user.findFirst({
            where: {
                userName: username,
                password: password,
            },
            select: {
                id: true,
                userName: true,
                name: true,
                imageUri: true,
            }
        });
        if (!user) {
            return buildResponse(
                res,
                httpCode.NOT_FOUND,
                buildErrorResponseData(
                    codes.NOT_FOUND,
                    `Not found user with username = ${username}, password = ${password}`
                )
            )
        }
        // Build token
        const token = authenticateService.buildToken({ id: user.id, userName: user.userName });

        return buildSuccessResponse(
            res,
            {
                token: token,
                user: user,
            }
        )
    },
}