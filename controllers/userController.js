import { StatusCodes } from "http-status-codes";
import User from "../models/User.js";
import jwtUtils from "../utils/index.js";
import CustomError from "../errors/index.js";

// Get all users
const getAllUsers = async (req, res) => {
  const users = await User.find({ role: "user" }).select("-password");
  res.status(StatusCodes.OK).json({ users });
};

// Get a single user
const getSingleUser = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id }).select("-password");

  if (!user) {
    throw new CustomError.NotFoundError(`No user with id ${req.params.id}`);
  }

  // Only admin or logged in user can get this info
  jwtUtils.checkPermissions(req.user, user._id);

  res.status(StatusCodes.OK).json({ user });
};

// Show current user
const showCurrentUser = (req, res) => {
  //console.log(req.user)
  res.status(StatusCodes.OK).json({ user: req.user });
};

// Update user
const updateUser = async (req, res) => {
  const { email, name } = req.body;

  if (!email || !name) {
    throw new CustomError.BadRequestError("Please provide all values");
  }

  // Update using findOneAndUpdate
  // const user = await User.findOneAndUpdate(
  //   {_id: req.user.userId},
  //   {name, email},
  //   {new: true, runValidators: true}
  // )

  // Update using user.save()
  const user = await User.findOne({ _id: req.user.userId });

  user.email = email;
  user.name = name;

  await user.save();

  // This function returns what user fields we can send after successful registration
  const tokenUser = jwtUtils.createTokenUser(user);

  // This function generates JWT and attaches cookie to response object with generated JWT
  jwtUtils.attatchCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.OK).json({ user: tokenUser });
};

// Update user password
const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError(
      "Please provide oldPassword and newPassword"
    );
  }

  const user = await User.findOne({ _id: req.user.userId });

  const isPasswordCorrect = await user.comparePassword(oldPassword);

  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials");
  }

  user.password = newPassword;

  await user.save();

  res.status(StatusCodes.OK).json({ msg: "Password updated successfully" });
};

export {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
