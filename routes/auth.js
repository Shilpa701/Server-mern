import express from 'express'
import {register,generateOpt,verifyOtp} from '../controller/auth.js'
import { login } from '../controller/auth.js';
import User from '../model/User.js';
import jwt from 'jsonwebtoken'; // ✅ Import as default


const router = express.Router();

//register
router.post('/register',register);

router.post('/login',login)

//generate
router.post('/generate-otp',generateOpt);

//verify otp
router.post('/verify-otp',verifyOtp);


router.get('/api/auth/is-auth', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    console.log("Received Token:", token); 
    
    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }
  
    try {
        const decoded = jwt.verify(token, process.env.JWTPASSWORD);
        console.log("Decoded Token:", decoded);
        
        const user = await User.findById(decoded.userId).select("-password");
        
        if (user) {
          res.json({
            success: true,
            userId: user._id,
            userName: user.username  || user.email || "Unknown User",
          });
        
        } else {
          res.status(401).json({ success: false, message: "Invalid token" });
        }
    } catch (error) {
      console.error("Auth error:", error);
      res.status(401).json({ success: false, message: "Token verification failed" });
    }
  });
  

export default router;