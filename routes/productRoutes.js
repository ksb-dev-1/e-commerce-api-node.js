import express from "express";
import {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
} from "../controllers/productController.js";
import {
  authenticateUser,
  authorizeUser,
} from "../middlewares/authentication.js";

const router = express.Router();

router.post("/createProduct", authenticateUser, authorizeUser("admin"), createProduct);
router.get("/", authenticateUser, getAllProducts);
router.get("/:id", authenticateUser, getSingleProduct);
router.patch("/updateProduct", authenticateUser, authorizeUser("admin"), updateProduct);
router.delete("/deleteProduct", authenticateUser, authorizeUser("admin"), deleteProduct);
router.post("/uploadImage", authenticateUser, authorizeUser("admin"), uploadImage);

export default router;
