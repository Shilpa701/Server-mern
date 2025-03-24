import Booking from "../model/Booking.js";// Import your Booking model

// Function to check for overlapping bookings
const checkOverlap = async (listingId, startDate, endDate) => {
  const overlappingBooking = await Booking.findOne({
    listingId,
    $or: [
      // Case 1: New booking starts during an existing booking
      { startDate: { $lte: new Date(endDate) }, endDate: { $gte: new Date(startDate) } },
      // Case 2: New booking ends during an existing booking
      { startDate: { $gte: new Date(startDate), $lte: new Date(endDate) } },
      // Case 3: New booking completely overlaps an existing booking
      { endDate: { $gte: new Date(startDate), $lte: new Date(endDate) } }
    ]
  });

  return overlappingBooking;
};

// Create a new booking
const createBooking = async (req, res) => {
  const { listingId, startDate, endDate } = req.body;

  try {
    // Check for overlapping bookings
    const overlappingBooking = await checkOverlap(listingId, startDate, endDate);

    if (overlappingBooking) {
      return res.status(400).json({
        message: "Overlapping booking found",
        overlappingBooking,
      });
    }

    // Create the new booking
    const newBooking = new Booking(req.body);
    await newBooking.save();

    res.status(201).json({
      message: "Booking created successfully",
      booking: newBooking,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Export the functions
export { createBooking, checkOverlap };



