import { StatusCodes } from "http-status-codes";
import User from "../models/User.js";
import CustomErrors from "../errors/index.js";
import jwtUtils from "../utils/index.js";
import CustomAPIError from "../errors/custom-api.js";

const register = async (req, res) => {
  const { name, email, password } = req.body;

  const isEmailExists = await User.findOne({ email });

  if (isEmailExists) {
    throw new CustomErrors.BadRequestError("Email already exists!");
  }

  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? "admin" : "user";

  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  jwtUtils.attatchCookiesToResponse(res, user);

  const userFieldsToSend = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  }

  res.status(StatusCodes.CREATED).json({
    user: userFieldsToSend
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomErrors.BadRequestError("Please provide email and password.");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomErrors.UnauthenticatedError("Email doesn't exist!");
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new CustomErrors.UnauthenticatedError("Incorrect password");
  }

  jwtUtils.attatchCookiesToResponse(res, user);

  const userFieldsToSend = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  }

  res.status(StatusCodes.OK).json({
    user: userFieldsToSend
  });
};

const logout = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(StatusCodes.OK).json({ message: "User Logged Out" });
};

export { register, login, logout };
