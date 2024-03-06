import { StatusCodes } from "http-status-codes";

import User from "../models/User.js";
import jwtUtils from "../utils/index.js";
import CustomError from "../errors/index.js";

// Register user
const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new CustomError.BadRequestError(
      "Please provide name, email and password"
    );
  }

  const emailAlreadyExists = await User.findOne({ email });

  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError("Email already exists");
  }

  // Assign role as "admin" fro first account
  const isFirstAccount = (await User.countDocuments({})) === 0;

  const role = isFirstAccount ? "admin" : "user";

  const user = await User.create({ name, email, password, role });

  // This function returns what user fields we can send after successful registration
  const tokenUser = jwtUtils.createTokenUser(user);

  // This function generates JWT and attaches cookie to response object with generated JWT
  jwtUtils.attatchCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.CREATED).json({ user: tokenUser });
};

// Login User
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError.BadRequestError("Please provide email and password");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError.UnauthenticatedError("Invalid email");
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("Invalid password");
  }

  // This function returns what user fields we can send after successful registration
  const tokenUser = jwtUtils.createTokenUser(user);

  // This function generates JWT and attaches cookie to response object with generated JWT
  jwtUtils.attatchCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.OK).json({ user: tokenUser });
};

// Logout user
const logout = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(StatusCodes.OK).json({ message: "User Logged Out" });
};

export { register, login, logout };
