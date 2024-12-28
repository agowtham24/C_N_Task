import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import Config from "../config";
declare module "express-serve-static-core" {
  interface Request {
    user?: string | JwtPayload;
  }
}

export class Jwt {
  static secret: string = Config.JWT_SECRET || "defaultSecretKey";

  static async verifyToken(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      jwt.verify(token, Jwt.secret, (err, decoded) => {
        if (err) {
          return res.status(400).json({ error: "Please login again" });
        }
        req.user = decoded;
        next();
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Generate a JWT token
  static async generateToken(
    data: Record<string, any>,
    expiresIn: string = "1d"
  ) {
    try {
      const token = await jwt.sign(data, this.secret, { expiresIn });
      return token;
    } catch (error: any) {
      console.error("Error generating token:", error.message);
      throw new Error("Token generation failed");
    }
  }
}
