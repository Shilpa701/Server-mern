import User from '../model/User.js'
// like buildin provided by node.js
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs';

import {sendOtp} from '../utils/sendMail.js'

export const register = async (req,res)=>{
        const {username,email,password} = req.body;

        try{

            const existUser = await User.findOne({email})
            if(existUser){
                return   res.status(400).json({message:'User already exist'})
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({username,email,password:hashedPassword})
            await newUser.save();
            return res.status(201).json({message:'User registered successfilly'})

        }catch(err){
            return res.status(500).json({message:'Server error'})
        }
}

export const login = async (req, res) => {
  console.log("Inside Login Controller");

  const { email, password } = req.body;
  console.log("User trying to login:", email);

  try {
      const existingUser = await User.findOne({ email });

      if (!existingUser) {
          return res.status(404).json({ message: "User not found" });
      }

      // Compare hashed password
      const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
      if (!isPasswordCorrect) {
          return res.status(401).json({ message: "Invalid email or password" });
      }

      // Generate a JWT token
      const token = jwt.sign(
          { userId: existingUser._id, email: existingUser.email,role:existingUser.role },
          process.env.JWTPASSWORD,
          { expiresIn: "24h" }
      );

      res.status(200).json({
          message: "Login successful",
          user: { id: existingUser._id, username: existingUser.username, email: existingUser.email,role:existingUser.role },
          token
      });

  } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
  }
};


    
  




export const generateOpt = async (req,res)=>{

    const {email} = req.body;
try{
    const user = await User.findOne({email});

    if(!user){
        return res.status(400).json({message:'User not found'});
    }

    // const otp= crypto.randomInt(100000,999999).toString();
    const otp = crypto.randomInt(100000, 999999).toString();
    console.log('Generated OTP:', otp);

    user.otp = otp;console.log(otp);
  
    
    user.optExpires = Date.now() + 10*60*1000;
    await user.save();

    await sendOtp(email,otp);
    console.log(`Sending OTP to ${email}: ${otp}`);
    return res.status(200).json({message:'OTP sent to email'});
}catch(err){
    return res.status(500).json({message:'Server error'})
}
}


  




  

export const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    try {
        console.log(`Verifying OTP for ${email}: ${otp}`);

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        console.log(`Stored OTP: ${user.otp}, Expires At: ${user.optExpires}`);

        if (!user.otp || user.otp !== otp || user.optExpires < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        // Clear OTP after successful verification
        user.otp = null;
        user.optExpires = null;
        await user.save();

        

        return res.status(200).json({ message: "OTP verified, logged in successfully" });

    } catch (err) {
        console.error("Error in OTP verification:", err);
        return res.status(500).json({ message: "Server error" });
    }
};


