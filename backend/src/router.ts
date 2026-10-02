import { Router } from "express";
import { body } from "express-validator";
import { handleInputErrors } from "./middleware/validation";
import {
  login,
  registerUser,
  getUserProfile,
  updateUserProfile,
  uploadAvatarImage,
  getUserHandle,
  searchUserHandle,
} from "./handlers";
import { authenticate } from "./middleware/auth";

const router = Router();

//* Auth y registro de usuarios */

router.post(
  "/auth/register",
  body("handle").notEmpty().withMessage("El handle es obligatorio"),
  body("name").notEmpty().withMessage("El nombre es obligatorio"),
  body("email").isEmail().withMessage("Correo no valido"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("La contraseña debe ser mínimo de 8 caracteres"),
  handleInputErrors,
  registerUser,
);

router.post(
  "/auth/login",
  body("email").isEmail().withMessage("Correo no valido"),
  body("password").notEmpty().withMessage("La contraseña es obligatoria"),
  handleInputErrors,
  login,
);

router.get("/auth/me", authenticate, getUserProfile);

router.patch(
  "/auth/me",
  body("handle").notEmpty().withMessage("El handle es obligatorio"),
  authenticate,
  updateUserProfile,
);

router.post("/auth/avatar", authenticate, uploadAvatarImage);

router.get("/:handle", getUserHandle);

router.post(
  "/search",
  body("handle").notEmpty().withMessage("El handle es obligatorio"),
  handleInputErrors,
  searchUserHandle,
);

export default router;
