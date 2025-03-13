import express from 'express'
import {register,generateOpt,verifyOtp} from '../controller/auth.js'
import { login } from '../controller/auth.js';

const router = express.Router();

//register
router.post('/register',register);

router.post('/login',login)

//generate
router.post('/generate-otp',generateOpt);

//verify otp
router.post('/verify-otp',verifyOtp);

export default router;