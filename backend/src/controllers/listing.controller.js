import Listing from "../models/Listing.model.js";
import cloudinary from "../lib/cloudinary.js";
import Booking from "../models/Booking.model.js";

export const getAllListings = async (req, res) => {
  try {
    const listings = await Listing.find({});

    res.status(200).json({
      success: true,
      data: listings,
    });
  } catch (error) {
    console.error("Error in get All Listing controller", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

//get single listings
export const getListing = async (req, res) => {
  const id = req.params.id;

  try {
    const listing = await Listing.findById(id).populate(
      "host",
      "userName email avatar"
    );

    if (!listing) {
      return res
        .status(404)
        .json({ success: false, message: "Listing not found" });
    }

    res.status(200).json({
      success: true,
      data: listing,
    });
  } catch (error) {
    console.error("Error in get Listing controller", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//create listing
export const addListing = async (req, res) => {
  const {
    title,
    description,
    address,
    city,
    state,
    country,
    price,
    bedrooms,
    bathrooms,
    propertyType,
    images,
    hostPhone,
    amenities,
  } = req.body;

  const host = req.user._id;

  try {
    if (
      !title ||
      !description ||
      !address ||
      !city ||
      !state ||
      !country ||
      !price ||
      !bedrooms ||
      !bathrooms ||
      !hostPhone
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing Required Fields",
      });
    }

    if (
      isNaN(price) ||
      isNaN(bedrooms) ||
      isNaN(bathrooms) ||
      isNaN(hostPhone)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Price, bedrooms, bathrooms, and host contact number must be numbers",
      });
    }

    if (amenities && !Array.isArray(amenities)) {
      return res.status(400).json({
        success: false,
        message: "Amenities must be an array",
      });
    }

    const contactRegex = /^\d{10}$/;
    if (!contactRegex.test(hostPhone.toString())) {
      return res.status(400).json({
        success: false,
        message: "Invalid host contact number",
      });
    }

    if (parseFloat(price) < 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be positive",
      });
    }

    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ error: "At least one image is required." });
    }

    //upload base64 images to cloudinary
    const uploadedImages = await Promise.all(
      images.map((base64) =>
        cloudinary.uploader.upload(base64, {
          folder: `stayFinder/listings/user_${host}`,
        })
      )
    );

    const imageUrls = uploadedImages.map((img) => img.secure_url);

    const newListing = new Listing({
      title,
      description,
      address,
      city,
      state,
      country,
      price,
      bedrooms,
      bathrooms,
      propertyType,
      images: imageUrls,
      host,
      hostPhone,
      amenities: amenities || [],
    });

    if (newListing) {
      await newListing.save();

      res.status(201).json({
        success: true,
        _id: newListing._id,
        title: newListing.title,
        description: newListing.description,
        address: newListing.address,
        city: newListing.city,
        state: newListing.state,
        country: newListing.country,
        price: `₹ ${newListing.price}`,
        bedrooms: newListing.bedrooms,
        bathrooms: newListing.bathrooms,
        propertyType: newListing.propertyType,
        images: newListing.images,
        amenities: newListing.amenities,
        host: newListing.host,
        hostPhone: newListing.hostPhone,
      });
    }
  } catch (error) {
    console.error("Error creating listing:", error);
    res.status(500).json({ error: "Server error" });
  }
};

//updating listing
export const updateListing = async (req, res) => {
  try {
    const listingId = req.params.id;
    const host = req.user._id;

    const listing = await Listing.findById(listingId);

    if (!listing) {
      return res.status(400).json({
        success: false,
        message: "Listing Not Found",
      });
    }

    const {
      title,
      description,
      address,
      city,
      state,
      country,
      price,
      bedrooms,
      bathrooms,
      propertyType,
      images,
      hostPhone,
      amenities,
    } = req.body;

    // let imageUrls = listing.images;
    const MAX_IMAGES = 10;
    let newImageUrls = [];

    if (images && Array.isArray(images) && images.length > 0) {
      const currentCount = listing.images.length;

      if (currentCount + images.length > MAX_IMAGES) {
        return res.status(400).json({
          success: false,
          message: `Maximum ${MAX_IMAGES} images are allowed. You already have ${currentCount}.`,
        });
      }

      const uploadedImages = await Promise.all(
        images.map((base64) =>
          cloudinary.uploader.upload(base64, {
            folder: `stayFinder/listings/user_${host}`,
          })
        )
      );

      newImageUrls = uploadedImages.map((img) => img.secure_url);
    }

    //appending new images and avoiding duplication
    if (newImageUrls.length > 0) {
      listing.images = Array.from(
        new Set([...listing.images, ...newImageUrls])
      );
    }

    // Update fields (only if provided)
    listing.title = title ?? listing.title;
    listing.description = description ?? listing.description;
    listing.address = address ?? listing.address;
    listing.city = city ?? listing.city;
    listing.state = state ?? listing.state;
    listing.country = country ?? listing.country;
    listing.price = price ?? listing.price;
    listing.bedrooms = bedrooms ?? listing.bedrooms;
    listing.bathrooms = bathrooms ?? listing.bathrooms;
    listing.propertyType = propertyType ?? listing.propertyType;
    listing.hostPhone = hostPhone ?? listing.hostPhone;
    listing.amenities = amenities ?? listing.amenities;

    await listing.save();
    await listing.populate("host", "userName email avatar");
    res.status(200).json({
      success: true,
      message: "Listing updated successfully",
      listing,
    });
  } catch (error) {
    console.error("Error updating listing:", err);
    res.status(500).json({ error: "Server error" });
  }
};

//delete listing
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const deleteListing = async (req, res) => {
  const { id } = req.params;

  try {
    const bookings = await Booking.find({ listingId: id, status: "confirmed" });

    // Refund each confirmed booking
    for (const booking of bookings) {
      if (booking.stripePaymentIntentId) {
        try {
          await stripe.refunds.create({
            payment_intent: booking.stripePaymentIntentId,
          });
          booking.status = "cancelled";
          await booking.save();
        } catch (err) {
          console.error(
            `Refund failed for booking ${booking._id}:`,
            err.message
          );
        }
      }
    }

    // Now delete the listing
    const deletedListing = await Listing.findByIdAndDelete(id);

    if (!deletedListing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Listing deleted and all related bookings refunded",
    });
  } catch (error) {
    console.error("Error deleting accommodation:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete accommodation" });
  }
};

//search Listings
export const searchListings = async (req, res) => {
  const { location, priceMin, priceMax, checkIn, checkOut } = req.query;

  const query = {};
  try {
    if (location) {
      query.$or = [
        { city: { $regex: location, $options: "i" } },
        { state: { $regex: location, $options: "i" } },
        { country: { $regex: location, $options: "i" } },
      ];
    }

    if (priceMin || priceMax) {
      query.price = {};
      if (priceMin) query.price.$gte = Number(priceMin);
      if (priceMax) query.price.$lte = Number(priceMax);
    }

    console.log("Search query:", query); // debugging log

    // Get all listings matching location and price
    let listings = await Listing.find(query);

    // If a date is provided, filter out listings that are booked on that date
    if (checkIn && checkOut) {
      const inDate = new Date(checkIn);
      const outDate = new Date(checkOut);

      // Get all bookings that overlap with requested range
      const bookings = await Booking.find({
        status: "confirmed",
        $or: [
          {
            checkIn: { $lt: outDate },
            checkOut: { $gt: inDate },
          },
        ],
      });

      const bookedListingIds = bookings.map((b) => b.listingId.toString());

      listings = listings.filter(
        (listing) => !bookedListingIds.includes(listing._id.toString())
      );
    }

    res.status(200).json({ success: true, listings });
  } catch (error) {
    console.error("Error in searchListings:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//getting listing only host by the user
export const getHostListings = async (req, res) => {
  try {
    const listings = await Listing.find({ host: req.user._id });
    res.status(200).json({ success: true, data: listings });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
