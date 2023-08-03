import { Request, Response } from "express";
import { tweetSchema } from "../lib/validationSchemas/tweet.schema";
import client from "../lib/db_connection";

class TweetController {
  static async newTweet(req: Request, res: Response) {
    try {
      const { user } = req.cookies;

      const { tweet } = req.body;
      const validateSchema = tweetSchema.validate({
        tweet,
      });
      if (validateSchema.error)
        return res.status(400).json({ error: validateSchema.error?.message });

      await client.query(
        "INSERT INTO tweets (user_id,tweet) VALUES ($1, $2) RETURNING *",
        [user.id, tweet]
      );
      return res.status(200).json({ success: "Tweet sent!" });
    } catch (error) {
      console.error(error);
    }
  }

  static async deleteTweet(req: Request, res: Response) {
    try {
      const { user } = req.cookies;
      const { id } = req.params;

      await client.query("DELETE FROM tweets WHERE id = $1 AND user_id = $2", [
        id,
        user.id,
      ]);
      return res.status(200).json({ success: "Tweet has been deleted!" });
    } catch (error) {
      console.error(error);
    }
  }
}

export default TweetController;
