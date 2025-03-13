
import express from 'express'
import User from '../model/User.js'
const router = express.Router();
// GET all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, "username email"); // Fetch only name & email
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

export default router;
