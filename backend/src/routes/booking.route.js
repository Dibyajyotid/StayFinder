import express from "express";
import {
  isBookingOwner,
  protectRoute,
} from "../middlewares/auth.middleware.js";
import {
  cancelBooking,
  createCheckoutSession,
  getAllBookings,
  getBooking,
  markBookingDeleted,
  stripeWebhook,
} from "../controllers/booking.controller.js";

const router = express.Router();

router.get("/", protectRoute, getAllBookings);
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

router.patch(
  "/mark-delete/:id",
  protectRoute,
  isBookingOwner,
  markBookingDeleted
);
router.get("/:id", protectRoute, getBooking);
router.post("/checkout-session/:listingId", protectRoute, createCheckoutSession);

router.delete("/:id", protectRoute, isBookingOwner, cancelBooking);
// router.delete("/delete/:id", protectRoute, isBookingOwner, deleteBooking);

export default router;
