import { Router } from "express";
import type { Request, Response } from "express";

const router = Router();

//* Auth y registro de usuarios */

router.post("/auth/register", (res: Response, req: Request) => {
  console.log("registrar usuario");
});

export default router;
