import express from "express";
import { createReview, getReviews } from "../controller/reviewController.js";


const router = express.Router();




router.post('/', createReview); // Add a new review
router.get('/:listingId', getReviews); 







export default router;