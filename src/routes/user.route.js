import express from "express";
import trimRequest from "trim-request";
import { searchUsers } from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/authMiddleware.js";
const router = express.Router();


router.route("/").get(trimRequest.all, authMiddleware, searchUsers);

// router.route("/sent/:userId").get(trimRequest.all, authMiddleware, getSentFriendRequests);
// router.route("/:userId").get(trimRequest.all, authMiddleware, getFriends);
// router.route("/send-by-vehicle").post(trimRequest.all, authMiddleware, sendFriendRequests);
// router.route("/accept-by-vehicle").post(trimRequest.all, authMiddleware, acceptFriendRequestByVehicle);

export default router;
