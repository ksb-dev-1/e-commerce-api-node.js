import express from "express";
import {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadProductImageLocal,
  uploadProductImageCloud,
} from "../controllers/productController.js";
import {
  authenticateUser,
  authorizeUser,
} from "../middlewares/authentication.js";
import { getSingleProductReviews } from "../controllers/reviewController.js";

const router = express.Router();

router.post(
  "/createProduct",
  authenticateUser,
  authorizeUser("admin"),
  createProduct
);
router.get("/", authenticateUser, getAllProducts);
router.get("/:id", authenticateUser, getSingleProduct);
router.patch(
  "/updateProduct/:id",
  authenticateUser,
  authorizeUser("admin"),
  updateProduct
);
router.delete(
  "/deleteProduct/:id",
  authenticateUser,
  authorizeUser("admin"),
  deleteProduct
);
router.post(
  "/uploadImageLocal",
  authenticateUser,
  authorizeUser("admin"),
  uploadProductImageLocal
);
router.post(
  "/uploadImageCloud",
  authenticateUser,
  authorizeUser("admin"),
  uploadProductImageCloud
);
router.get("/:id/reviews", getSingleProductReviews);

export default router;
