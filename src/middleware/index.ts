import jwt from "jsonwebtoken";
import { config } from "dotenv";
import client from "../lib/db_connection";
import { NextFunction, Request, Response } from "express";

config();

class Auth {
  static async authenticate(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization?.replace("Bearer", "").trim();
      const decoded: any = jwt.verify(
        token as string,
        process.env.JWT_SECRET as string
      );
      const result = await client.query("SELECT * FROM users WHERE id = $1", [
        decoded.data.id,
      ]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "User does not exist" });
      }
      res.cookie("user", decoded.data); // keep user's decoded data in cookies
      return next();
    } catch (error) {
      return res
        .status(401)
        .json({ error: "You are not authorised to access this resource" });
    }
  }
}

export default Auth;
