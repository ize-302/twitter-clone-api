import { Request, Response } from "express";
import client from "../lib/db_connection";
import bcrypt from "bcrypt";
import {
  registrationSchema,
  loginSchema,
} from "../lib/validationSchemas/auth.schemas";
import dotenv from "dotenv";
import { generateAccessToken, generateRefreshToken } from "../helpers";

dotenv.config();

const saltRounds: number = 10;

class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { username, display_name, password } = req.body;
      const validateSchema = registrationSchema.validate({
        username,
        display_name,
        password,
      });
      if (validateSchema.error)
        return res
          .status(400)
          .json({ validateSchema: validateSchema.error?.message });

      // check if username exists
      const result = await client.query(
        "SELECT * FROM users WHERE username = $1",
        [username]
      );
      if (result.rows.length > 0)
        return res
          .status(400)
          .json({ error: "username is already in use, try another" });

      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedpassword = bcrypt.hashSync(password, salt);

      await client.query(
        "INSERT INTO users (username, display_name, password) VALUES ($1, $2, $3) RETURNING *",
        [username, display_name, hashedpassword]
      );
      res
        .status(200)
        .json({ success: "Account has been created. Proceed to login" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Something went wrong" });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;
      const validateSchema = loginSchema.validate({
        username,
        password,
      });
      if (validateSchema.error)
        return res.status(400).json({ error: validateSchema.error?.message });

      // check if user exists
      const result = await client.query(
        "SELECT * FROM users WHERE username = $1",
        [username]
      );
      if (result.rows.length === 0)
        return res.status(400).json({ error: "Incorrect username / password" });

      // match password
      const passwordMatches = bcrypt.compareSync(
        password,
        result.rows[0].password
      );
      if (!passwordMatches)
        return res.status(400).json({ error: "Incorrect username / password" });

      // generate jwt
      const accessToken = await generateAccessToken(result.rows[0]);
      const refreshToken = await generateRefreshToken();

      // save refreshtoken in db
      await client.query(
        "INSERT INTO refreshtokens (user_id, token) VALUES ($1, $2)",
        [result.rows[0]?.id, refreshToken]
      );

      res.status(200).json({
        accessToken,
        refreshToken,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Something went wrong" });
    }
  }
}

export default AuthController;
