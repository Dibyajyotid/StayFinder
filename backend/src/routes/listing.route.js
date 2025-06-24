import express from "express";
import {
  isListingOwner,
  protectRoute,
} from "../middlewares/auth.middleware.js";
import {
  addListing,
  deleteListing,
  getAllListings,
  getHostListings,
  getListing,
  searchListings,
  updateListing,
} from "../controllers/listing.controller.js";

const router = express.Router();

//rule in express - static routes come first befor edynamic
//static routes
router.get("/", getAllListings);
router.get("/search", searchListings);
router.get("/host/listings", protectRoute, getHostListings);
router.post("/", protectRoute, addListing);

//dynamic routes
router.get("/:id", getListing);
router.put("/:id", protectRoute, isListingOwner, updateListing);
router.delete("/:id", protectRoute, isListingOwner, deleteListing);

export default router;
