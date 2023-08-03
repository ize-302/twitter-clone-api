import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import randtoken from "rand-token";

dotenv.config();

const privateKey = process.env.JWT_SECRET as string;

interface Idata {
  username: string;
  display_name: string;
  password?: string;
}
export const generateAccessToken = (data: Idata) => {
  delete data.password;
  const token = jwt.sign({ data: data }, privateKey, {
    expiresIn: 300,
  });
  return token;
};

export const generateRefreshToken = () => {
  return randtoken.generate(16);
};
