import { Request, Response, Router } from "express";
import authRoute from "./auth.route";
import tweetRoute from "./tweet.route";

const mainRoute = Router();

mainRoute.get("/", (req: Request, res: Response) =>
  res.status(200).json({ message: "Surprise MF!" })
);

mainRoute.use("/tweet", tweetRoute);
mainRoute.use("/auth", authRoute);

export default mainRoute;
