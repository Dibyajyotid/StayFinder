import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import { connectDB } from "./lib/db.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import listingRoutes from "./routes/listing.route.js";
import bookingRoutes from "./routes/booking.route.js";
import dashboardRoute from "./routes/dashboard.route.js";
import { stripeWebhook } from "./controllers/booking.controller.js";

dotenv.config();
const app = express();

app.post(
  "/api/booking/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

const PORT = process.env.PORT || 2000;

//auth
app.use("/api/auth", authRoutes);

//listing
app.use("/api/listing", listingRoutes);

//booking
app.use("/api/booking", bookingRoutes);

//dashboard
app.use("/api/dashboard", dashboardRoute);

app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
  connectDB();
});
