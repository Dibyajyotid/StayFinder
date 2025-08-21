// import jwt from "jsonwebtoken";
// import User from "../models/User.model.js";
// import Booking from "../models/Booking.model.js";
// import Listing from "../models/Listing.model.js";

// //verify middleware
// export const protectRoute = async (req, res, next) => {
//   try {
//     const token = req.cookies.jwt;

//     if (!token) {
//       return res
//         .status(401)
//         .json({ message: "Unauthorized - No Token Provided" });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     if (!decoded) {
//       return res.status(401).json({ message: "Unauthorized - Invalid Token" });
//     }

//     const user = await User.findById(decoded.userId).select("-password");

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     req.user = user;

//     next();
//   } catch (error) {
//     console.log("Error in protectRoute middleware: ", error.message);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// //ensuring own listing
// export const isListingOwner = async (req, res, next) => {
//   const listing = await Listing.findById(req.params.id);
//   if (!listing) return res.status(404).json({ message: "Listing not found" });

//   // Check if current user is the owner
//   if (listing.host.toString() !== req.user._id.toString()) {
//     return res
//       .status(403)
//       .json({ message: "Not authorized to modify this listing" });
//   }
//   next();
// };

// //is booking owner
// export const isBookingOwner = async (req, res, next) => {
//   const bookingId = req.params.id;
//   const userId = req.user._id;

//   try {
//     const booking = await Booking.findById(bookingId);

//     if (!booking) {
//       res.status(404).json({
//         success: false,
//         message: "Booking Not Found",
//       });
//     }

//     if (booking.userId.toString() != userId.toString()) {
//       return res.status(403).json({
//         success: false,
//         message: "Forbidden: Not the owner of this booking",
//       });
//     }

//     req.booking = booking;

//     next();
//   } catch (error) {
//     console.error("Error in isBookingOwner middleware:", error);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };

import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import Booking from "../models/Booking.model.js";
import Listing from "../models/Listing.model.js";

// verify middleware
export const protectRoute = async (req, res, next) => {
  try {
    let token;

    // look for "Authorization: Bearer <token>"
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No Token Provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protectRoute middleware: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ensuring own listing
export const isListingOwner = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (listing.host.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to modify this listing" });
    }

    next();
  } catch (error) {
    console.error("Error in isListingOwner middleware:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ensuring own booking
export const isBookingOwner = async (req, res, next) => {
  try {
    const bookingId = req.params.id;
    const userId = req.user._id;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking Not Found",
      });
    }

    if (booking.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Not the owner of this booking",
      });
    }

    req.booking = booking;
    next();
  } catch (error) {
    console.error("Error in isBookingOwner middleware:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

