import testimonials from '../model/TestimonyModel.js';
import  Listing from '../model/Listing.js'
import { log } from 'console';
export const addTestimonyController = async (req, res) => {
    console.log("Inside addTestimonyController");
    const { name, email, message } = req.body;
    try {
        const newTestimony = new testimonials({ name, email, message });
        await newTestimony.save();
        res.status(200).json(newTestimony);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



export const getAllTestimonyController = async(req,res)=>{
    console.log("Inside GetAllTEstimnycontroller");
    try{
      const   allFeedbacks = await testimonials.find()
        res.status(200).json(allFeedbacks)

    }catch(err){

    res.status(401).json(err)

    }

    
    
}

export const UpdateFeedbackStatusController = async (req, res) => {
    console.log("Inside UpdateFeedbackStatusController");
  
    // Get feedback ID from URL parameter
    const { id } = req.params;
    const { status } = req.query;
  
    try {
      // Validate status value
      if (!["Approved", "Rejected", "Pending"].includes(status)) {
        return res.status(400).json({ error: "Invalid status value" });
      }
  
      // Find the existing feedback
      const existingFeedback = await testimonials.findById(id);
      if (!existingFeedback) {
        return res.status(404).json({ error: "Feedback not found" });
      }
  
      // Update status and save
      existingFeedback.status = status;
      await existingFeedback.save();
  
      res.status(200).json(existingFeedback);
    } catch (err) {
      console.error("Error updating feedback status:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };



  // get all approved testimony - no need jwt middleware
export const getAllApprovedController = async(req,res)=>{
    console.log("Inside GetAllTEstimnycontroller");
    try{
     const  allApprovedFeedback = await testimonials.find({status:"Approved"})
        res.status(200).json(allApprovedFeedback )

    }catch(err){

     res.status(401).json(err)

    }
}


export const deleteTestimonyController = async (req, res) => {
  console.log("Inside DeleteController");
  
  try {
      const { id } = req.params;
      await testimonials.findByIdAndDelete(id);
      res.status(200).json({ message: "Feedback deleted successfully" });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};







export const UpdatePropertyStatusController = async (req, res) => {
    console.log("Inside UpdatePropertyStatusController");
  
    const { id } = req.params; // Property ID
    const { status } = req.body; // Status from request body
  
    try {
      //  Convert status to the correct case
      const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase(); // "approved" -> "Approved"
  
      //  Validate status against allowed values
      if (!["Pending", "Approved", "Rejected"].includes(formattedStatus)) {
        return res.status(400).json({ error: "Invalid status value" });
      }
  
      //  Use `.set()` to only update status without requiring all fields
      const updatedProperty = await Listing.findByIdAndUpdate(
        id,
        { $set: { status: formattedStatus } }, // Only update status
        { new: true, runValidators: true } // Return updated document, enforce validation
      );
  
      if (!updatedProperty) {
        return res.status(404).json({ error: "Property not found" });
      }
  
      res.status(200).json({ message: "Status updated successfully", property: updatedProperty });
    } catch (err) {
      console.error("Error updating property status:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  



  
  // get all approved property - no need jwt middleware
export const getAllApprovedPropertyController = async(req,res)=>{
    console.log("Inside GetAllTproperties");
    try{
     const  allPropertyApproved = await Listing.find({status:"Approved"})
        res.status(200).json(allPropertyApproved)

    }catch(err){

     res.status(401).json(err)

    }
}



export const deletePropertyController = async (req, res) => {
  console.log("Inside deletePropertyController");
  
  try {
      const { id } = req.params;
      await Listing.findByIdAndDelete(id);
      res.status(200).json({ message: "Property deleted successfully" });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

