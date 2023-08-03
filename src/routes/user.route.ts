import { Router } from "express";
import UserController from "../controllers/user.controller";
import Auth from "../middleware/index";

const userRoute = Router();

userRoute.get("/:id", Auth.authenticate, UserController.profile);
userRoute.post("/:id/follow", Auth.authenticate, UserController.follow);
userRoute.post("/:id/unfollow", Auth.authenticate, UserController.unfollow);

export default userRoute;
