import express from "express";
import {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
} from "../controllers/reviewController.js";
import { authenticateUser } from "../middlewares/authentication.js";

const router = express.Router();

router.post("/", authenticateUser, createReview);
router.get("/", getAllReviews);
router.get("/:id", getSingleReview);
router.patch("/:id", authenticateUser, updateReview);
router.delete("/:id", authenticateUser, deleteReview);

export default router;
