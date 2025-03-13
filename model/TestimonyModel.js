import mongoose  from "mongoose";

const testimonySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
  
    message:{
        type:String,
        required:true
    },
    status:{
        type:String,
      
        enum: ["Pending", "Approved", "Rejected"],
        default:"Pending"
    },

})

const testimonials = mongoose.model("testimonials",testimonySchema)
export default testimonials;