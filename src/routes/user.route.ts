import { Router } from "express";
import UserController from "../controllers/user.controller";
import Auth from "../middleware/index";

const userRoute = Router();

userRoute.get("/:id", Auth.authenticate, UserController.profile);
userRoute.post("/:id/follow", Auth.authenticate, UserController.follow);
userRoute.post("/:id/unfollow", Auth.authenticate, UserController.unfollow);
userRoute.get("/:id/followers", Auth.authenticate, UserController.followers);
userRoute.get("/:id/following", Auth.authenticate, UserController.following);

export default userRoute;
