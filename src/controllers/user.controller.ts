import { Request, Response } from "express";
import client from "../lib/db_connection";

class UserController {
  static async follow(req: Request, res: Response) {
    try {
      const current_user = req.cookies.user;
      const { id } = req.params;

      // check if already following
      const result = await client.query(
        "SELECT * FROM followers WHERE user_id = $1 AND follower_id = $2",
        [id, current_user.id]
      );
      if (result.rows.length > 0) {
        return res.status(400).json({ error: "Already following user" });
      }

      await client.query(
        "INSERT INTO followers (user_id,follower_id) VALUES ($1, $2) RETURNING *",
        [id, current_user.id]
      );
      return res
        .status(200)
        .json({ success: `You are now following user ${id}` });
    } catch (error) {
      console.error(error);
    }
  }

  static async unfollow(req: Request, res: Response) {
    try {
      const current_user = req.cookies.user;
      const { id } = req.params;

      // check if already following
      const result = await client.query(
        "SELECT * FROM followers WHERE user_id = $1 AND follower_id = $2",
        [id, current_user.id]
      );
      if (result.rows.length === 0) {
        return res
          .status(400)
          .json({ error: "You are not following this user" });
      }

      await client.query(
        "DELETE FROM followers WHERE user_id = $1 AND follower_id = $2",
        [id, current_user.id]
      );
      return res
        .status(200)
        .json({ success: `You have unfollowed user ${id}` });
    } catch (error) {
      console.error(error);
    }
  }
}

export default UserController;
