import { Request, Response, Router } from "express";
import authRoute from "./auth.route";
import tweetRoute from "./tweet.route";
import userRoute from "./user.route";

const mainRoute = Router();

mainRoute.get("/", (req: Request, res: Response) =>
  res.status(200).json({ message: "Surprise MF!" })
);

mainRoute.use("/tweet", tweetRoute);
mainRoute.use("/auth", authRoute);
mainRoute.use("/user", userRoute);

export default mainRoute;
