import express from "express";
import {
  authenticateUser,
  authorizeUser,
} from "../middlewares/authentication.js";
import {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
} from "../controllers/orderController.js";

const router = express.Router();

router.get("/", authenticateUser, authorizeUser("admin"), getAllOrders);
router.get("/all", authenticateUser, getCurrentUserOrders);
router.get("/:id", authenticateUser, getSingleOrder);
router.post("/createOrder", authenticateUser, createOrder);
router.patch("/updateOrder/:id", authenticateUser, updateOrder);

export default router;
