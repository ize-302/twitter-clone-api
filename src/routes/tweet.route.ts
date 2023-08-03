import { Router } from "express";
import TweetController from "../controllers/tweet.controller";
import Auth from "../middleware/index";

const tweetRoute = Router();

tweetRoute.post("/", Auth.authenticate, TweetController.newTweet);
tweetRoute.delete("/:id", Auth.authenticate, TweetController.deleteTweet);
tweetRoute.post(
  "/:id/like",
  Auth.authenticate,
  TweetController.toggleLikeTweet
);

export default tweetRoute;
