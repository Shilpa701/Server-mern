import express from 'express';
import multer from 'multer';
import Listing from "../model/Listing.js"; // Fixed import
import User from '../model/User.js';

const router = express.Router();

/* Configuration Multer for File Upload */
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Use the original file name
    },
});

const upload = multer({ storage });

/* CREATE LISTING */
router.post("/create", upload.array("listingPhotos"), async (req, res) => {
    try {
        /* Take the information from the form */
        const {
           creator,
            category,
            type,
            streetAddress,
            city,
            state,
            pincode,
            country,
            landmark,
            guestCount,
            bedroomCount,
            bedCount,
            bathroomCount,
            amenities,
            title,
            description,
            highlight,
            highlightDesc,
            price,
        } = req.body;

        let amenitiesArray;
        try {
         amenitiesArray = JSON.parse(req.body.amenities); 
        } catch (error) {
            return res.status(400).json({ message: "Invalid amenities format. Must be a JSON array." });
        }

        // Check if user exists
        // const user = await User.findById(userId);
        // if (!user) {
        //     return res.status(404).json({ message: "User not found" });
        // }

        // Handle file uploads
        const listingPhotos = req.files;
        if (!listingPhotos || listingPhotos.length === 0) {
            return res.status(400).json({ message: "No files uploaded." });
        }
        // const listingPhotoPaths = listingPhotos.map((file) => file.path);
        const listingPhotoPaths = listingPhotos.map((file) => `/uploads/${file.filename}`);

        // Create new listing
        const newListing = new Listing({
           creator,
            category,
            type,
            streetAddress,
            city,
            state,
            pincode,
            country,
            landmark,
            guestCount,
            bedroomCount,
            bedCount,
            bathroomCount,
            amenities:amenitiesArray,
            listingPhotoPaths,
            title,
            description,
            highlight,
            highlightDesc,
            price,
        });

        await newListing.save();
        res.status(200).json(newListing);
    } catch (err) {
        console.error("Error creating listing:", err);
        res.status(409).json({ message: "Failed to create listing", error: err.message });
    }
});






/* GET LISTINGS BY CATEGORY */
router.get("/", async (req, res) => {
    try {
        const qCategory = req.query.category?.trim(); // Trim whitespace for better handling
        let filter = qCategory ? { category: qCategory } : {};

        const listings = await Listing.find(filter).populate("creator"); 

        res.status(200).json(listings);
    } catch (err) {
        console.error("Error fetching listings:", err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
});



/* LISTING DETAILS */
router.get("/:listingId", async (req, res) => {
    try {
      const { listingId } = req.params
      const listing = await Listing.findById(listingId).populate("creator")
      res.status(202).json(listing)
    } catch (err) {
      res.status(404).json({ message: "Listing can not found!", error: err.message })
    }
  })


  router.get("/properties", async (req, res) => {
    try {
        const listings = await Listing.find().populate("creator");
        res.status(200).json(listings);
    } catch (err) {
        console.error("Error fetching all properties:", err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
});








router.get("/search/:search", async (req, res) => {
    const { search } = req.params;

    try {
        let listings = [];

        if (search === "all") {
            listings = await Listing.find({ status: "Approved" }); 
        } else {
            listings = await Listing.find({
                city: { $regex: search, $options: "i" },
                status: "Approved"
            });
        }

        res.status(200).json(listings);
    } catch (err) {
        console.error("Error fetching listings:", err);
        res.status(404).json({ message: "Failed to fetch listings", error: err.message });
    }
});







export default router;
