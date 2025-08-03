import { asyncHandler } from "../Utills/asyncHandler.js";
import { ApiError } from "../Utills/apiError.js";
import { ApiResponse } from "../Utills/apiResponse.js";
import { User } from "../Models/user.model.js";
import uploadOnCloudinary from "../Utills/cloudinary.js";
import { Todo } from "../Models/todo.models.js";

const generateAccessRefreshToken = async (userID) => {
  try {
    const user = await User.findById(userID);
    const refreshToken = await user.generateRefreshToken();
    const accessToken = await user.generateAccessToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating Access token and Refresh token."
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { username, password, fullname, email, confirmPassword } = req.body;

  if (
    [username, fullname, password, email, confirmPassword].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required.");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(400, "User already exist.");
  }
  if (password !== confirmPassword) {
    throw new ApiError(400, "Password and Confirm password does't match.");
  }

  // const avatarLocalpath = req.files?.avatar[0]?.path;

  // if (!avatarLocalpath) {
  //   throw new ApiError(400, "Avatar is required");
  // }

  // const avatar = await uploadOnCloudinary(avatarLocalpath);

  // if (!avatar) {
  //   throw new ApiError(
  //     400,
  //     "Something went wrong while uplaoding the Avatar. \n Please try again."
  //   );
  // }

  const user = await User.create({
    fullname,
    username: username.toLowerCase(),
    password,
    email,
    // avatar: avatar.url,
  });

  const { accessToken, refreshToken } = await generateAccessRefreshToken(
    user._id
  );

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(
      500,
      "Something went wrong while registering the user. \n Please try again after some time."
    );
  }

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    sameSite: "Lax",
    secure: false,
    maxAge: 10 * 24 * 60 * 60 * 1000,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "User was Created successfully", createdUser));
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, password, email } = req.body;

  if (!(username || email)) {
    throw new ApiError(400, "Username or Email is required.");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(400, "No such User found.");
  }

  const validatePassword = await user.isPasswordCorrect(password);
  if (!validatePassword) {
    throw new ApiError(400, "Invalid Password.");
  }

  const { accessToken, refreshToken } = await generateAccessRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!loggedInUser) {
    throw new ApiError(400, "Failed to login. \n Try again.");
  }

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "Lax",
    maxAge: 10 * 24 * 60 * 60 * 1000,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "User logged in Successfully", loggedInUser));
});

const logOutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  const option = {
    httpOnly: true,
    secure: false,
  };

  return res
    .status(200)
    .clearCookie("refreshToken", option)
    .clearCookie("accessToken", option)
    .json(new ApiResponse(200, "User loggedOut successfully", null));
});

const getUser = asyncHandler(async (req, res) => {
  const user = req.user;
  const todo = await Todo.find({ owner: user._id });
  return res
    .status(200)
    .json(new ApiResponse(200, "User fetched successfully", { user, todo }));
});

const updateUserDetails = asyncHandler(async (req, res) => {
  const { username, email } = req.body;

  if (!username || !email) {
    throw new ApiError(400, "Email and username is required.");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        username: username,
        email: email,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, "Account details upadted successfully", user));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.files?.avatar?.[0].path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required.");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, "Avatar updated Successfully.", user));
});
const changeUserPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid Old Password!");
  }
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, "Password Successfully updated.", {}));
});

export {
  registerUser,
  loginUser,
  logOutUser,
  getUser,
  updateUserDetails,
  updateUserAvatar,
  changeUserPassword,
  generateAccessRefreshToken,
};
