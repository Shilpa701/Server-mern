import express from "express";
import Booking from "../model/Booking.js";
import User from "../model/User.js";
import Listing from "../model/Listing.js";

const router = express.Router();


router.post("/booking", async (req, res) => {
  console.log("Received Booking Data:", req.body); // ✅ Check customerId
  
  try {
    const { customerId, hostId, listingId, startDate, endDate, totalPrice } = req.body;

    if (!customerId) {
      return res.status(400).json({ message: "Customer ID is required!" });
    }

    const customerExists = await User.findById(customerId);
    if (!customerExists) {
      return res.status(404).json({ message: "Customer not found!" });
    }

    const newBooking = new Booking({
      customerId,
      hostId,
      listingId,
      startDate,
      endDate,
      totalPrice,
    });

    await newBooking.save();

    // ✅ Populate customer details before sending response
    const populatedBooking = await Booking.findById(newBooking._id).populate("customerId", "username email");

    res.status(201).json(populatedBooking);
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Error creating booking", error: error.message });
  }
});







router.get("/:userId/dashboard", async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log("Fetching dashboard for userId:", userId); // ✅ Debugging

    // Fetch properties where the user is the creator (owner)
    const properties = await Listing.find({ creator: userId,status: "Approved" });
    console.log("Properties found:", properties); // ✅ Debugging

    // Fetch bookings where the user is the customer
    const bookings = await Booking.find({ customerId: userId })
      .populate("listingId", "title price city streetAddress")
      .populate("customerId", "username email");
    console.log("Bookings found:", bookings); // ✅ Debugging

    // Fetch bookings where the user's property is booked by others (received bookings)
    const receivedBookings = await Booking.find({ hostId: userId })
      .populate("listingId", "title price")
      .populate("customerId", "username email");
    console.log("Received Bookings found:", receivedBookings); // ✅ Debugging

    res.json({ properties, bookings, receivedBookings });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ message: "Server error" });
  }
});





router.get("/owner/:ownerId/bookings", async (req, res) => {
  try {
    const ownerId = req.params.ownerId;

    // Fetch bookings where hostId (property owner) matches ownerId
    const bookings = await Booking.find({ hostId: ownerId })
      .populate("listingId", "title price") // Get property details
      .populate("customerId", "username email"); // Get customer details

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found for this owner." });
    }

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Error fetching bookings", error: error.message });
  }
});


router.get("/check", async (req, res) => {
  try {
    const { customerId, listingId } = req.query;

    const existingBooking = await Booking.findOne({ customerId, listingId });
    if (existingBooking) {
      return res.json({ alreadyBooked: true });
    }
    res.json({ alreadyBooked: false });
  } catch (error) {
    console.error("Error checking booking:", error);
    res.status(500).json({ message: "Server error" });
  }
});



router.get("/all", async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("customerId", "username email") // Fetch user details
      .populate("listingId", "title price city streetAddress") // Fetch listing details
      .populate("hostId", "username email"); // Fetch host details

    res.json(bookings); // Send all bookings as response
  } catch (error) {
    console.error("Error fetching all bookings:", error);
    res.status(500).json({ message: "Server error" });
  }
});




router.delete("/bookings/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Booking.findByIdAndDelete(id);
    res.status(200).json({ message: "Booking canceled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to cancel booking" });
  }
});








export default router;
