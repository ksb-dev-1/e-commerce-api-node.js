import express from "express";
import {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
} from "../controllers/userController.js";
import {
  authenticateUser,
  authorizeUser,
} from "../middlewares/authentication.js";

const router = express.Router();

router.get("/", authenticateUser, authorizeUser("admin"), getAllUsers);
router.get("/showMe", authenticateUser, showCurrentUser);
router.patch("/updateUser", authenticateUser, updateUser);
router.patch("/updateUserPassword", authenticateUser, updateUserPassword);
router.get("/:id", authenticateUser, getSingleUser);

export default router;
