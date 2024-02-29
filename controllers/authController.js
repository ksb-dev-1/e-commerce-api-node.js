import { StatusCodes } from "http-status-codes";
import User from "../models/User.js";
import CustomErrors from "../errors/index.js";
import jwtUtils from "../utils/index.js";

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

  jwtUtils.createJWT(res, user._id);

  res.status(StatusCodes.CREATED).json({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
};

const login = (req, res) => {
  res.send("Login User");
};

const logout = (req, res) => {
  res.send("Logout User");
};

export { register, login, logout };
