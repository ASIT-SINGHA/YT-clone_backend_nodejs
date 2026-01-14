import { Router } from "express";
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
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.meddleware.js";

const router = Router();

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
  registerUser
);
router.route("/login").post(upload.none(), loginUser);
router.route("/logout").post(verifyJWT, logOutUser);
router.route("/refresh-token").post(refreshAccessToken);
router
  .route("/change-password")
  .post(verifyJWT, upload.none(), changedCurrentPassword);
router.route("/get-user").post(verifyJWT, getCurrentUser);
router
  .route("/update-accound-details")
  .post(verifyJWT, upload.none(), updateUserAccoundDetails);
router
  .route("/update-avatar")
  .post(
    verifyJWT,
   upload.fields(
    [{
      name: "avatar",
      maxCount: 1,
    }]),
    updateUserAvatar
  );
router.route("/update-coverImage").post(verifyJWT,
   upload.fields(
    [{
      name: "coverImage",
      maxCount: 1,
    }]),updateUserCoverImage);

export default router;
