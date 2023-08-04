import { Request, Response } from "express";
import client from "../lib/db_connection";

class UserController {
  static async follow(req: Request, res: Response) {
    try {
      const current_user = req.cookies.user;
      const { id } = req.params;

      const users = await client.query(
        "SELECT id, username, display_name FROM users WHERE id = $1",
        [id]
      );
      if (users.rows.length === 0) {
        return res.status(404).json({ error: "User does not exist" });
      }

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
      const users = await client.query(
        "SELECT id, username, display_name FROM users WHERE id = $1",
        [id]
      );
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

  static async followers(req: Request, res: Response) {
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
        "SELECT follower_id FROM followers WHERE user_id = $1",
        [id]
      );

      if (followers.rows.length === 0) {
        return res.status(200).json([]);
      }
      const followers_id = followers.rows
        .map((follower: { follower_id: string }) => follower.follower_id)
        .join(",")
        .toString();

      const followers_info = await client.query(
        "SELECT id, username, display_name FROM users WHERE id IN ($1)",
        [followers_id]
      );
      return res.status(200).json(followers_info.rows);
    } catch (error) {
      console.error(error);
    }
  }

  static async following(req: Request, res: Response) {
    try {
      const { id } = req.params;
      // grab user detail
      const users = await client.query("SELECT * FROM users WHERE id = $1", [
        id,
      ]);
      if (users.rows.length === 0) {
        return res.status(404).json({ error: "User does not exist" });
      }

      const following = await client.query(
        "SELECT user_id FROM followers WHERE follower_id = $1",
        [id]
      );

      if (following.rows.length === 0) {
        return res.status(200).json([]);
      }

      const followings_id = following.rows
        .map((following: { user_id: string }) => following.user_id)
        .join(",")
        .toString();

      const followings_info = await client.query(
        "SELECT id, username, display_name FROM users WHERE id IN ($1)",
        [followings_id]
      );
      return res.status(200).json(followings_info.rows);
    } catch (error) {
      console.error(error);
    }
  }
}

export default UserController;
