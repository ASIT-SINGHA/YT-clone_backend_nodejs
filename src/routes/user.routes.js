import express, { Router } from "express";
import {
	loginUser,
	logOutUser,
	registerUser,
	refreshAccessToken,
	changedCurrentPassword,
	getCurrentUser,
	updateUserAccoundDetails,
	updateUserAvatar,
	updateUserCoverImage,
	getUserChannelProfile,
	getWatchHistory,
	createChannel
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.meddleware.js";

const router = Router();
router.use(express.json({ limit: "16kb" }));

router.route("/register").post(
	upload.fields([
		{
			name: "avatar",
			maxCount: 1,
		},
		{
			name: "coverImage",
			maxCount: 1,
		},
	]),
	registerUser,
);
router.route("/login").post(upload.none(), loginUser);
router.route("/logout").post(upload.none(), verifyJWT, logOutUser);
router.route("/refresh-token").post(refreshAccessToken);
router
	.route("/change-password")
	.post(upload.none(), verifyJWT, changedCurrentPassword);
router.route("/get-user").get(verifyJWT, getCurrentUser);
router
	.route("/update-accound-details")
	.patch(verifyJWT, upload.none(), updateUserAccoundDetails);
router
	.route("/update-avatar")
	.patch(verifyJWT, upload.single("avatar"), updateUserAvatar);
router
	.route("/update-coverImage")
	.patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage);

router.route("/c/:username").get(verifyJWT, getUserChannelProfile);
router.route("/watch-history").get(upload.none(), verifyJWT, getWatchHistory);
router.route("/create-channel").post(upload.none(), verifyJWT, createChannel);

export default router;
