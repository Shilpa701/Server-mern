

import express from "express";
const router = express.Router();

import Property from '../model/Listing.js'
import User from '../model/User.js'
import Booking from "../model/Booking.js";


// Get total count of approved properties
router.get("/approved-properties-count", async (req, res) => {
    try {
        const count = await Property.countDocuments({ status: "Approved" });
        res.status(200).json({ total: count });
    } catch (err) {
        console.error("Error fetching approved properties count:", err);
        res.status(500).json({ message: "Failed to fetch approved properties count", error: err.message });
    }
});

// Get total count of users
router.get("/total-users", async (req, res) => {
    try {
        const count = await User.countDocuments();
        res.status(200).json({ total: count });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch total users", error: err.message });
    }
});



// ✅ Get total count of bookings
router.get("/total-bookings", async (req, res) => {
    try {
      const count = await Booking.countDocuments();
      res.status(200).json({ total: count });
    } catch (err) {
      console.error("Error fetching total bookings count:", err);
      res.status(500).json({ message: "Failed to fetch total bookings", error: err.message });
    }
  });



export default router;
