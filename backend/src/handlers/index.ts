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
    const { description, links } = req.body;

    const handle = slug(req.body.handle, "");

    const handleExist = await User.findOne({ handle });

    if (handleExist && handleExist.email !== req.user.email) {
      const error = new Error("Nombre de usuario no disponible");
      return res.status(409).json({ error: error.message });
    }

    req.user.description = description;
    req.user.handle = handle;
    req.user.links = links;

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
    const [, files] = await form.parse(req);

    const fileArray = files.file;
    if (!fileArray || fileArray.length === 0) {
      return res
        .status(400)
        .json({ error: "No se proporcionó ningún archivo en la clave 'file'" });
    }

    const result = await cloudinary.uploader.upload(fileArray[0].filepath, {
      public_id: uuid(),
    });

    req.user.image = result.secure_url;
    await req.user.save();

    return res.json({ image: result.secure_url });
  } catch (error: any) {
    console.error("Error en Cloudinary:", error);
    return res.status(500).json({
      error: error.message || "Hubo un error al procesar la imagen",
    });
  }
};

export const getUserHandle = async (req: Request, res: Response) => {
  try {
    const { handle } = req.params;

    const user = await User.findOne({ handle }).select(
      "-_id -__v -password -email",
    );

    if (!user) {
      const error = new Error("El usuario no existe");
      return res.status(404).json({ error: error.message });
    }

    return res.status(200).json(user);
  } catch (e) {
    const error = new Error("Hubo un error al buscar la ruta del usuario");
    return res.status(500).json({ error: error.message });
  }
};

export const searchUserHandle = async (req: Request, res: Response) => {
  try {
    console.log(req.body.handle);

    const { handle } = req.body;

    const userExist = await User.findOne({ handle });

    if (userExist) {
      const error = new Error(`El usuario ${handle} ya esta tomado`);
      return res.status(409).json({ error: error.message });
    }

    res.send(`El usuario ${handle} esta disponible`);
  } catch (e) {
    const error = new Error("Hubo un error al buscar la ruta del usuario");
    return res.status(500).json({ error: error.message });
  }
};
