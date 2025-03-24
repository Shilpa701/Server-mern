import Review from '../model/Review.js';

// Create a new review
export const createReview = async (req, res) => {
  
    try {
      console.log("Received review data:", req.body); // Debugging
  
      const { listingId, userId, name, comment } = req.body;
  
      if (!listingId || !userId || !name || !comment) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      const newReview = new Review({ listingId, userId, name, comment, date: new Date() });
      await newReview.save();
  
      res.status(201).json(newReview);
    } catch (error) {
      console.error("Error in review submission:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  




export const getReviews = async(req,res)=>{

  try {
    const reviews = await Review.find({ listingId: req.params.listingId });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Failed to get reviews", error });
  }

}


