import jwt from "jsonwebtoken";

// Create JSON Web Token (JWT)
const createJWT = ({payload}) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  return token;
};

// Attatch cookie to response object with generated JWT
const attatchCookiesToResponse = ({res, user}) => {
  const token = createJWT({payload: user});

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
