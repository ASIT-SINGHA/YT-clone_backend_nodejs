import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.meddleware.js";
import {
	getSubscriber,
	toggleSubscription,
	getChannel,
} from "../controllers/subscription.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();
router.use(verifyJWT);
// router.route("/c/:channelId").get(getSubscriber).post(toggleSubscription);
// router.route("/u/:subscriberId").get(getChannel);

router.route("/toggle-subscription/:channelId").post(toggleSubscription);
router.route("/get-subscriber").get(getSubscriber);
router.route("/get-channel").get(getChannel);

export default router;
