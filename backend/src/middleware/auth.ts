import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User, { type TUser } from "../models/User";

// definir el objeto user para poder utilizarlo en toda la REST API

declare global {
  namespace Express {
    interface Request {
      user?: TUser;
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const bearer = req.headers.authorization;

  if (!bearer) {
    const error = new Error("No autorizado");

    return res.status(401).json({ error: error.message });
  }

  const [, token] = bearer.split(" ");

  if (!token) {
    const error = new Error("No se encontró un token");

    return res.status(401).json({ error: error.message });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (typeof decoded === "object" && decoded.id) {
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        const error = new Error("El usuario no existe");

        return res.status(404).json({ error: error.message });
      }

      req.user = user;

      next();
    }
  } catch (error) {
    return res.status(500).json({ error: "Token no valido" });
  }
};
