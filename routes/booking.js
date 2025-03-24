import express from "express";
import Booking from "../model/Booking.js";
import User from "../model/User.js";
import Listing from "../model/Listing.js";

const router = express.Router();


// router.post("/booking", async (req, res) => {
//   console.log("Received Booking Data:", req.body); // ✅ Check customerId
  
//   try {
//     const { customerId, hostId, listingId, startDate, endDate, totalPrice } = req.body;

//     if (!customerId) {
//       return res.status(400).json({ message: "Customer ID is required!" });
//     }

//     const customerExists = await User.findById(customerId);
//     if (!customerExists) {
//       return res.status(404).json({ message: "Customer not found!" });
//     }

//     const newBooking = new Booking({
//       customerId,
//       hostId,
//       listingId,
//       startDate,
//       endDate,
//       totalPrice,
//     });

//     await newBooking.save();

//     //  Populate customer details before sending response
//     const populatedBooking = await Booking.findById(newBooking._id).populate("customerId", "username email");

//     res.status(201).json(populatedBooking);
//   } catch (error) {
//     console.error("Error creating booking:", error);
//     res.status(500).json({ message: "Error creating booking", error: error.message });
//   }
// });


import { createBooking} from "../controller/bookingController.js";
import Review from "../model/Review.js";
import { createReview, getReviews } from "../controller/reviewController.js";

router.post("/booking",createBooking);


//  22-03-25
router.post("/api/booking", async (req, res) => {
  try {
    const { listingId, startDate, endDate } = req.body;

    // Check if there is an existing booking with overlapping dates
    const overlappingBooking = await Booking.findOne({
      listingId,
      $or: [
        { startDate: { $lte: endDate }, endDate: { $gte: startDate } },
      ],
    });

    if (overlappingBooking) {
      return res.status(400).json({ message: "These dates are already booked!" });
    }

    // Proceed with booking if no overlap
    const newBooking = new Booking(req.body);
    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});




router.get("/api/bookings/:listingId", async (req, res) => {
  try {
    const { listingId } = req.params;

    console.log("Fetching bookings for:", listingId); // Debugging

    // Ensure listingId is in correct ObjectId format
    const bookings = await Booking.find({ listingId: listingId });

    console.log("Fetched bookings:", bookings); // Debugging

    if (!bookings || bookings.length === 0) {
      return res.status(200).json({ alreadyBooked: false, dates: [] });
    }

    // Extract booked dates
    const bookedDates = bookings.map((booking) => ({
      startDate: booking.startDate,
      endDate: booking.endDate,
    }));

    res.status(200).json({ alreadyBooked: true, dates: bookedDates });

  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Internal server error" });
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




//2.....



// Endpoint to check if a property is already booked
router.get("/api/check", async (req, res) => {
  try {
    const { listingId, startDate, endDate } = req.query;

    // Validate query parameters
    if (!listingId || !startDate || !endDate) {
      return res.status(400).json({
        message: "Missing required query parameters: listingId, startDate, endDate",
      });
    }

    console.log("Received Check Request:", { listingId, startDate, endDate });

    // Convert dates to UTC and validate
    const startDateUTC = new Date(startDate);
    const endDateUTC = new Date(endDate);

    if (isNaN(startDateUTC.getTime())) {
      return res.status(400).json({ message: "Invalid startDate" });
    }
    if (isNaN(endDateUTC.getTime())) {
      return res.status(400).json({ message: "Invalid endDate" });
    }

    console.log("Converted Dates:", { startDateUTC, endDateUTC });

    // Check for overlapping bookings
    const overlappingBooking = await Booking.findOne({
      listingId,
      $or: [
        // Case 1: New booking starts during an existing booking
        { startDate: { $lte: endDateUTC }, endDate: { $gte: startDateUTC } },
        // Case 2: New booking ends during an existing booking
        { startDate: { $gte: startDateUTC, $lte: endDateUTC } },
        // Case 3: New booking completely overlaps an existing booking
        { endDate: { $gte: startDateUTC, $lte: endDateUTC } },
      ],
    });

    if (overlappingBooking) {
      return res.status(200).json({
        alreadyBooked: true,
        overlappingBooking,
      });
    }

    return res.status(200).json({
      alreadyBooked: false,
    });
  } catch (error) {
    console.error("Error checking for overlapping bookings:", error);
    res.status(500).json({ message: "Server error", error });
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



//reviewss


// Fetch reviews for a listing

// Route to fetch reviews for a property
// router.get('/reviews/:listingId', async (req, res) => {
//   try {
//     const reviews = await Review.find({ listingId: req.params.listingId }).populate('userName', 'username');
//     res.json(reviews);
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to fetch reviews' });
//   }
// });

// // Route to submit a review
// router.post('/reviews', async (req, res) => {
//   try {
//     console.log('Request Body:', req.body); // Log the request body
//     const { listingId, userId, userName, comment, date } = req.body;
//     const newReview = new Review({ listingId, userId, userName, comment, date });
//     await newReview.save();
//     res.status(201).json(newReview);
//   } catch (error) {
//     console.error('Error submitting review:', error);
//     res.status(500).json({ message: 'Failed to submit review' });
//   }
// });



router.post('/', createReview); // Add a new review
router.get('/:listingId', getReviews); 







export default router;
