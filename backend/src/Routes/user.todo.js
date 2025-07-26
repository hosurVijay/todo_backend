import { Router } from "express";
import {
  getUser,
  logOutUser,
  loginUser,
  registerUser,
  updateUserAvatar,
  updateUserDetails,
  changeUserPassword,
  generateAccessRefreshToken,
} from "../Controller/user.controller.js";
import { upload } from "../MiddleWare/multer.middleware.js";
import { verifyUser } from "../MiddleWare/auth.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser);

router.route("/logout").post(verifyUser, logOutUser);
router.route("/refresh-token").post(generateAccessRefreshToken);
router.route("/change-password").post(verifyUser, changeUserPassword);
router.route("/current-user").get(verifyUser, getUser);
router.route("/update-user-details").patch(verifyUser, updateUserDetails);
router
  .route("/update-user-avatar")
  .patch(verifyUser, upload.single("avatar"), updateUserAvatar);

export default router;
