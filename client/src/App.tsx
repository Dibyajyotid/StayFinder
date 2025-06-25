import { Route, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import SearchResults from "./components/SearchResults";
import MyBookingsPage from "./pages/MyBookingsPage";
import BookingDetails from "./components/BookingDetails";
import ListingDetails from "./components/ListingDetails";
import { Toaster } from "./components/ui/sonner";
import Dashboard from "./pages/Dashboard";
import ProfilePage from "./pages/PofilePage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import PaymentCancelPage from "./pages/PaymentFailedPage";
import RefundSuccess from "./pages/RefundSuccessPage";
import RefundFailed from "./pages/RefundFailedPage";
import SupportPage from "./pages/Support";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/bookings" element={<MyBookingsPage />} />
        <Route path="/booking/:id" element={<BookingDetails />} />
        <Route path="/listing/:id" element={<ListingDetails />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/success" element={<PaymentSuccessPage />} />
        <Route path="/cancel" element={<PaymentCancelPage />} />
        <Route path="/refund-success" element={<RefundSuccess />} />
        <Route path="/refund-fail" element={<RefundFailed />} />
        <Route path="/support" element={<SupportPage />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
