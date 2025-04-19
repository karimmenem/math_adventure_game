const pool = require("../config/db");

const profileController = {
  // Get user profile
  async getProfile(req, res) {
    try {
      const userId = req.user.userId;

      // First get username from users table
      const userQuery = "SELECT username FROM users WHERE user_id = $1";
      const userResult = await pool.query(userQuery, [userId]);

      if (userResult.rows.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const username = userResult.rows[0].username;

      // Then get profile data
      const profileQuery = `
        SELECT avatar, username_color AS "usernameColor"
        FROM user_profiles
        WHERE user_id = $1
      `;
      const profileResult = await pool.query(profileQuery, [userId]);

      // If profile doesn't exist yet, return defaults
      // If profile doesn't exist yet, return defaults
      if (profileResult.rows.length === 0) {
        return res.json({
          username: username,
          avatar: "default", // Changed from 'avatar1' to 'default'
          usernameColor: "#FFFFFF", // Changed from #4CAF50 to #FFFFFF
        });
      }

      // Return combined data
      res.json({
        username: username,
        avatar: profileResult.rows[0].avatar,
        usernameColor: profileResult.rows[0].usernameColor,
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ message: "Server error when fetching profile" });
    }
  },

  // Update user profile
  async updateProfile(req, res) {
    try {
      const userId = req.user.userId;
      const { username, avatar, usernameColor } = req.body;

      // Validate input
      if (!username) {
        return res.status(400).json({ message: "Username is required" });
      }

      // Check if username already exists (if changing username)
      const checkQuery =
        "SELECT user_id FROM users WHERE username = $1 AND user_id != $2";
      const checkResult = await pool.query(checkQuery, [username, userId]);

      if (checkResult.rows.length > 0) {
        return res.status(409).json({ message: "Username already exists" });
      }

      // Begin transaction
      await pool.query("BEGIN");

      // Update username in users table
      await pool.query("UPDATE users SET username = $1 WHERE user_id = $2", [
        username,
        userId,
      ]);

      // Check if profile exists
      const profileCheck = await pool.query(
        "SELECT 1 FROM user_profiles WHERE user_id = $1",
        [userId]
      );

      if (profileCheck.rows.length === 0) {
        // Insert new profile
        await pool.query(
          "INSERT INTO user_profiles (user_id, avatar, username_color) VALUES ($1, $2, $3)",
          [userId, avatar, usernameColor]
        );
      } else {
        // Update existing profile
        await pool.query(
          "UPDATE user_profiles SET avatar = $1, username_color = $2 WHERE user_id = $3",
          [avatar, usernameColor, userId]
        );
      }

      // Commit transaction
      await pool.query("COMMIT");

      res.json({
        message: "Profile updated successfully",
        username,
        avatar,
        usernameColor,
      });
    } catch (error) {
      // Rollback transaction on error
      await pool.query("ROLLBACK");
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Server error when updating profile" });
    }
  },
};

module.exports = profileController;
