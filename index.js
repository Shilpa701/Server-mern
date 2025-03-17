import express from 'express'
import mongoose  from 'mongoose'
import cors from 'cors'
import dotenv  from 'dotenv'
import appRoute from './routes/auth.js'
import listingRoutes from './routes/listing.js'
import bookingRoutes from './routes/booking.js'
import userRoutes from './routes/userRoutes.js'
import adminRoutes from "./routes/adminRoutes.js"; // Import admin routes
import testimony from './routes/testimony.js'
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
 
app.use(express.json());



const allowedOrigins = [
  'http://localhost:5173', 
  'https://rental-application-68uf.vercel.app' 
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  })
);





app.use('/auth',appRoute)
app.use('/properties',listingRoutes)
app.use("/api", bookingRoutes)
app.use("/api",userRoutes)
app.use("/api/admin", adminRoutes); // Register admin routes
app.use("/test",testimony)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

const PORT = process.env.PORT || 5000;



// app.use("/uploads", express.static("public/uploads"));

const connectDB = async ()=>{
  try {
    await mongoose.connect(process.env.MONGO_DB);
    console.log("Connected to MongoDB successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1); // Exit the process on connection failure
  }
}

connectDB();

app.listen(PORT,()=>{
    console.log(`Start server running on ${PORT}`);
    
})

app.get('/',(req,res)=>{
    res.status(200).json("SERVER")
})