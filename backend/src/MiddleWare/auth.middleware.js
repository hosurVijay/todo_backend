import jwt from "jsonwebtoken";
import { User } from "../Models/user.model.js";
import { asyncHandler } from "../Utills/asyncHandler.js";
import { ApiError } from "../Utills/apiError.js";

const verifyUser = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Unauthorized access.");
  }

  const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  const user = await User.findById(decodedToken._id).select(
    "-password -refreshToken"
  );

  if (!user) {
    throw new ApiError(401, "Invalid Access Token.");
  }

  req.user = user;
  next();
});

export { verifyUser };
