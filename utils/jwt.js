import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";

const createJWT = (userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  return token;
};

const attatchCookiesToResponse = (res, user) => {
  const token = createJWT(user._id);

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    signed: true,
    sameSite: "strict",
    maxAge: 1 * 24 * 60 * 60 * 1000,
  });
}

const isTokenValid = ({ token }) => jwt.verify(token, process.env.JWT_SECRET);

export { createJWT, attatchCookiesToResponse, isTokenValid };
