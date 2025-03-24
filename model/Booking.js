




import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    customerId: { 
      type: mongoose.Schema.Types.ObjectId,  // ✅ Store as ObjectId
      ref: "User",  // ✅ Reference "User" model
   
    },
    hostId: { 
      type: mongoose.Schema.Types.ObjectId,  
      ref: "User", 
      required: true 
    },
    listingId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Listing", 
      required: true 
    },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    totalPrice: { type: Number, required: true },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;

