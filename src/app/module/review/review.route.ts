import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { ReviewController } from "./review.controller";
import { ReviewValidation } from "./review.validation";

const router = Router();

router.get("/", ReviewController.getAllReviews);
router.get(
  "/my-reviews",
  checkAuth(Role.PATIENT, Role.DOCTOR),
  ReviewController.myReviews,
);
router.post(
  "/",
  checkAuth(Role.PATIENT),
  validateRequest(ReviewValidation.createReviewZodSchema),
  ReviewController.giveReview,
);
router.patch(
  "/:id",
  checkAuth(Role.PATIENT),
  validateRequest(ReviewValidation.updateReviewZodSchema),
  ReviewController.updateReview,
);
router.delete("/:id", checkAuth(Role.PATIENT), ReviewController.deleteReview);

export const ReviewRoutes = router;
