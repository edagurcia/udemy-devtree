import type { Request, Response } from "express";
import slug from "slug";
import { checkPassword, hashPassword } from "../utils/auth";
import User from "../models/User";
import { generateJWT } from "../utils/jwt";
//* Cloudinary para subida de archivos desde backend */
import formidable from "formidable";
import cloudinary from "../config/cloudinary";
import { v4 as uuid } from "uuid";

export const registerUser = async (req: Request, res: Response) => {
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

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    const error = new Error("El usuario no existe");
    return res.status(404).json({ error: error.message });
  }

  const isPasswordCorrect = await checkPassword(password, user.password);

  if (!isPasswordCorrect) {
    const error = new Error("Contraseña incorrecta");
    return res.status(404).json({ error: error.message });
  }

  res.status(200).json({
    success: true,
    msg: "Autenticado...",
    jwt: generateJWT({ id: user._id }),
  });
};

export const getUserProfile = async (req: Request, res: Response) => {
  res.json(req.user);
};

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const { description } = req.body;

    const handle = slug(req.body.handle, "");

    const handleExist = await User.findOne({ handle });

    if (handleExist && handleExist.email !== req.user.email) {
      const error = new Error("Nombre de usuario no disponible");
      return res.status(409).json({ error: error.message });
    }

    req.user.description = description;
    req.user.handle = handle;

    await req.user.save();

    res.status(201).send("Perfil actualizado correctamente");
  } catch (e) {
    const error = new Error("Hubo un error");
    return res.status(500).json({ error: error.message });
  }
};

export const uploadAvatarImage = async (req: Request, res: Response) => {
  try {
    const form = formidable({ multiples: false });
    form.parse(req, (error, fields, files) => {
      cloudinary.uploader.upload(
        files.file[0].filepath,
        { public_id: uuid() },
        async function (error, result) {
          if (error) {
            const error = new Error(
              "Hubo un error al intentar subir la imagen",
            );
            return res.status(500).json({ error: error.message });
          }

          if (result) {
            console.log(result.secure_url);
          }
        },
      );
    });
  } catch (e) {
    const error = new Error("Hubo un error");
    return res.status(500).json({ error: error.message });
  }
};
