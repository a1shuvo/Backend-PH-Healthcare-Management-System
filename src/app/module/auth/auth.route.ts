import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middleware/checkAuth";
import { AuthController } from "./auth.controller";

const router = Router();

router.get(
  "/me",
  checkAuth(Role.ADMIN, Role.DOCTOR, Role.PATIENT, Role.SUPER_ADMIN),
  AuthController.getMe,
);
router.post("/register", AuthController.registerPatient);
router.post("/login", AuthController.loginUser);
router.post("/refresh-token", AuthController.getNewToken);
router.post(
  "/change-password",
  checkAuth(Role.ADMIN, Role.DOCTOR, Role.PATIENT, Role.SUPER_ADMIN),
  AuthController.changePassword,
);

export const AuthRoutes = router;
