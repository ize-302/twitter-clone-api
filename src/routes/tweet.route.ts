import { Router } from "express";
import TweetController from "../controllers/tweet.controller";
import Auth from "../middleware/index";

const tweetRoute = Router();

tweetRoute.post("/", Auth.authenticate, TweetController.newTweet);

export default tweetRoute;
