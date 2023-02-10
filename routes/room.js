import express from "express";
import { roomController } from "../controllers/index.js";
import authenticateService from "../services/authenticate.js";
import roleService from "../services/role.js";
import { wrapResponse } from "./common.js";

const router = express.Router();
const handle = () => {
  // GetRoom
  router.get(
    "/get-room",
    authenticateService.middleWare.checkToken,
    (req, res, next) =>
      req.query["roomId"]
        ? wrapResponse(
            roleService.middleWare.checkPermissionChatInRoom("roomId", "query")
          )(req, res, next)
        : next(),
    wrapResponse(roomController.onGetRooms)
  );

  router.get("/hello", (req, res) => {
    return res.json({
      text: "hello",
    });
  });

  return router;
};

export default {
  handle,
};
