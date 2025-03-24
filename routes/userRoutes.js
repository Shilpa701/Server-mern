
import express from 'express'
import User from '../model/User.js'
const router = express.Router();
// GET all users
router.get("/users/user", async (req, res) => {
  console.log("inside user");
  
  try {
    const users = await User.find({}, "username email");
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
});


export default router;
