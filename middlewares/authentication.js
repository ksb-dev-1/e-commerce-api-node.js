import CustomError from "../errors/index.js";
import { isTokenValid } from "../utils/jwt.js";

// Authenticate user
const authenticateUser = (req, res, next) => {
  const token = req.signedCookies.jwt;

  if (!token) {
    throw new CustomError.UnauthenticatedError("Authentication Invalid");
  }

  try {
    const { userId, name, email, role } = isTokenValid({ token });
    req.user = { userId, name, email, role };
    next();
  } catch (error) {
    throw new CustomError.UnauthenticatedError("Authentication Invalid");
  }
};

// Authorize user
const authorizeUser = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomError.UnauthorizedError(
        "Not authorized to access this route."
      );
    }
    next();
  };
};

export { authenticateUser, authorizeUser };
