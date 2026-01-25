import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.meddleware.js";
import { Router } from "express";

import {
	uploadAVideo,
	getAllVideo,
	updateVideo,
	togglePulishVideo,
	deleteVideo,
	getVideoById,
} from "../controllers/video.controller.js";

const router = Router();
router.use(verifyJWT);

router
	.route("/")
	.get(getAllVideo)
	.post(
		upload.fields([
			{ name: "videoFile", maxCount: 1 },
			{ name: "thumbnail", maxCount: 1 },
		]),
		uploadAVideo,
	);
router
	.route("/:videoId")
	.get(getVideoById)
	.patch(
		upload.fields([
			{ name: "videoFile", maxCount: 1 },
			{ name: "thumbnail", maxCount: 1 },
		]),
		updateVideo,
	)
	.delete(deleteVideo);
router.route("/toggle-video").patch(togglePulishVideo);

export default router;
