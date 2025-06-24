import Booking from "../models/Booking.model.js";
import Listing from "../models/Listing.model.js";

export const getDashboardStats = async (req, res) => {
  const hostId = req.user._id;

  try {
    const listings = await Listing.find({ host: hostId });
    const listingIds = listings.map((l) => l._id);

    const bookings = await Booking.find({ listingId: { $in: listingIds } });

    const totalListings = listings.length;
    const activeListings = listings.length;
    const totalBookings = bookings.length;
    const totalEarnings = bookings
      .filter((b) => b.status === "confirmed")
      .reduce((sum, b) => sum + b.totalPrice, 0);

    const cancelledBookings = bookings.filter(
      (b) => b.status === "cancelled"
    ).length;

    res.status(200).json({
      success: true,
      data: {
        totalListings,
        activeListings,
        totalBookings,
        totalEarnings,
        cancelledBookings,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
    });
  }
};
