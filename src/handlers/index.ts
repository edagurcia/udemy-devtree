import type { Request, Response } from "express";
import { validationResult } from "express-validator";
import slug from "slug";
import { hashPassword } from "../utils/auth";
import User from "../models/User";

export const registerUser = async (req: Request, res: Response) => {
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  const userExist = await User.findOne({ email });

  if (userExist) {
    const error = new Error("Esta dirección de correo ya esta registrado");

    return res.status(409).json({ error: error.message });
  }

  const handle = slug(req.body.handle, "");

  const handleExist = await User.findOne({ handle });

  if (handleExist) {
    const error = new Error("Nombre de usuario no disponible");

    return res.status(409).json({ error: error.message });
  }

  const user = new User(req.body);
  user.password = await hashPassword(password);
  user.handle = handle;

  await user.save();

  res
    .status(201)
    .json({ success: true, msg: "Usuario registrado correctamente" });
};
