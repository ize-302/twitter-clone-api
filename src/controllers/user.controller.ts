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

  static async profile(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // grab user detail
      const users = await client.query("SELECT * FROM users WHERE id = $1", [
        id,
      ]);
      if (users.rows.length === 0) {
        return res.status(404).json({ error: "User does not exist" });
      }

      // grab followers count
      const followers = await client.query(
        "SELECT * FROM followers WHERE user_id = $1",
        [id]
      );
      // grab accounts user is following
      const following = await client.query(
        "SELECT * FROM followers WHERE follower_id = $1",
        [id]
      );

      delete users.rows[0].password;
      const user_data = {
        ...users.rows[0],
        followers: followers.rows.length,
        following: following.rows.length,
      };

      return res.status(200).json(user_data);
    } catch (error) {
      console.error(error);
    }
  }
}

export default UserController;
