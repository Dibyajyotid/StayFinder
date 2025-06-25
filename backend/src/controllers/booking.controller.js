import Booking from "../models/Booking.model.js";
import Listing from "../models/Listing.model.js";

import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//get single booking
export const getBooking = async (req, res) => {
  const { id } = req.params;

  try {
    const booking = await Booking.findById(id).populate("listingId");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking Not Found",
      });
    }

    // Check if the booking belongs to the logged-in user
    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access to this booking",
      });
    }

    await booking.populate({
      path: "listingId",
      populate: {
        path: "host",
        select: "userName email",
      },
    });

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error("Error getting booking:", error);
    res.status(500).json({ success: false, message: "Failed to get booking" });
  }
};

//get all booking
export const getAllBookings = async (req, res) => {
  try {
    const userId = req.user._id;
    const bookings = await Booking.find({ userId });

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No Bookings Found",
      });
    }

    res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    console.error("Error getting booking:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch all bookings" });
  }
};

//create booking
// export const createBooking = async (req, res) => {
//   const userId = req.user._id;
//   const { listingId } = req.params;
//   const { phone, checkInDate, checkOutDate } = req.body;

//   try {
//     if (!userId) {
//       return res.status(404).json({
//         success: false,
//         message: "Unauthorized Access",
//       });
//     }

//     if (!phone || !checkInDate || !checkOutDate) {
//       return res.status(400).json({
//         success: false,
//         message: "Please provide all required fields",
//       });
//     }

//     const contactRegex = /^\d{10}$/;
//     if (!contactRegex.test(phone.toString())) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid host contact number",
//       });
//     }

//     const checkIn = new Date(checkInDate);
//     const checkOut = new Date(checkOutDate);

//     //checking if checkin date is before checkout date
//     if (checkIn >= checkOut) {
//       return res.status(400).json({
//         success: false,
//         message: "Check-in date must be before check-out date",
//       });
//     }

//     //preven overlapping booking
//     const overlappingBooking = await Booking.findOne({
//       listingId,
//       status: "confirmed",
//       $or: [
//         {
//           checkInDate: { $lt: checkOut },
//           checkOutDate: { $gt: checkIn },
//         },
//       ],
//     });

//     if (overlappingBooking) {
//       return res.status(409).json({
//         success: false,
//         message: "Listing already booked for the selected dates",
//       });
//     }

//     //calculating total price
//     const listing = await Listing.findById(listingId);
//     if (!listing) {
//       return res.status(404).json({
//         success: false,
//         message: "Listing not found",
//       });
//     }

//     const ONE_DAY = 1000 * 60 * 60 * 24;
//     const nights = Math.ceil((checkOut - checkIn) / ONE_DAY);
//     const totalPrice = nights * listing.price;

//     const newBooking = new Booking({
//       userId,
//       listingId,
//       phone,
//       totalPrice,
//       checkInDate,
//       checkOutDate,
//     });

//     await newBooking.save();

//     res.status(201).json({
//       success: true,
//       message: "Booking created successfully",
//       booking: newBooking,
//     });
//   } catch (error) {
//     console.error("Error creating booking:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to create booking",
//     });
//   }
// };

//cancel booking
// export const cancelBooking = async (req, res) => {
//   const booking = req.booking;

//   try {
//     // await Booking.findByIdAndDelete(booking._id);
//     booking.status = "cancelled";
//     await booking.save();

//     res.status(200).json({
//       success: true,
//       message: "Booking cancelled successfully",
//     });
//   } catch (error) {
//     console.error("Error cancelling booking:", err);
//     res
//       .status(500)
//       .json({ success: false, message: "Failed to cancel booking" });
//   }
// };

export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking)
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });

    if (booking.status !== "confirmed")
      return res
        .status(400)
        .json({ success: false, message: "Cannot refund unconfirmed booking" });

    const refund = await stripe.refunds.create({
      payment_intent: booking.stripePaymentIntentId, // Use session.payment_intent from webhook
    });

    console.log("🔁 Stripe refund response:", refund);

    booking.status = "cancelled";
    await booking.save();

    res
      .status(200)
      .json({ success: true, message: "Booking cancelled and refunded" });
  } catch (error) {
    console.error("Cancel Booking Error:", error);
    res.status(500).json({ success: false, message: "Cancel failed" });
  }
};

//delete booking
// export const deleteBooking = async (req, res) => {
//   const booking = req.booking;

//   try {
//     if (booking.status !== "cancelled") {
//       return res.status(400).json({
//         success: false,
//         message: "Only cancelled bookings can be deleted",
//       });
//     }
//     await Booking.findByIdAndDelete(booking._id);

//     res.status(200).json({
//       success: true,
//       message: "Booking deleted successfully",
//     });
//   } catch (error) {
//     console.error("Error deleting booking:", err);
//     res
//       .status(500)
//       .json({ success: false, message: "Failed to delete booking" });
//   }
// };

//marking the booking as deleted
export const markBookingDeleted = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { $set: { isDeleted: true } },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    booking.isDeleted = true;
    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking marked as deleted",
    });
  } catch (error) {
    console.error("Error marking booking as deleted:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//for stripe
export const createCheckoutSession = async (req, res) => {
  const userId = req.user._id;
  const { listingId } = req.params;
  const { phone, checkInDate, checkOutDate } = req.body;

  try {
    // Validate listing
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res
        .status(404)
        .json({ success: false, message: "Listing not found" });
    }

    // Check for existing non-cancelled bookings
    const existing = await Booking.findOne({
      userId,
      listingId,
      checkInDate,
      checkOutDate,
      status: { $ne: "cancelled" },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Booking already exists for these dates",
      });
    }

    // Calculate total price
    const ONE_DAY = 1000 * 60 * 60 * 24;
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const nights = Math.ceil((checkOut - checkIn) / ONE_DAY);
    const totalPrice = nights * listing.price;

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: listing.title,
              description: `Stay from ${checkInDate} to ${checkOutDate}`,
            },
            unit_amount: totalPrice * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:5173/cancel`,
      metadata: {
        userId: userId.toString(),
        listingId: listingId.toString(),
        phone: phone.toString(),
        checkInDate,
        checkOutDate,
        totalPrice: totalPrice.toString(),
      },
    });

    res.json({ success: true, url: session.url });
  } catch (error) {
    console.error("Error creating Stripe session:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to create payment session" });
  }
};

//webhook function controller
export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature error:", err.message); //debugging log
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log("Webhook received:", event.type); //debugging log

  if (event.type === "checkout.session.completed") {
    const data = event.data.object;

    console.log("Session data received:", data); //debugging log

    try {
      const existing = await Booking.findOne({
        userId: data.metadata.userId,
        listingId: data.metadata.listingId,
        checkInDate: data.metadata.checkInDate,
        checkOutDate: data.metadata.checkOutDate,
        status: { $ne: "cancelled"}
      });

      if (existing) {
        console.log("Booking already exists.");
        return res.status(200).end();
      }

      const booking = new Booking({
        userId: data.metadata.userId,
        listingId: data.metadata.listingId,
        phone: data.metadata.phone,
        checkInDate: data.metadata.checkInDate,
        checkOutDate: data.metadata.checkOutDate,
        totalPrice: data.metadata.totalPrice,
        stripeSessionId: data.id,
        stripePaymentIntentId: data.payment_intent,
        status: "confirmed",
      });

      await booking.save();
      console.log("Booking confirmed via Stripe");
    } catch (err) {
      console.error("Error inside booking creation:", err);
    }
  }

  res.status(200).end();
};
