import { Router } from "express";
import { body } from "express-validator";
import { registerUser } from "./handlers";

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
  registerUser,
);

export default router;
