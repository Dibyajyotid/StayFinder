import StatusPage from "@/components/StatusComponent";
import { useNavigate } from "react-router-dom";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  return (
    <StatusPage
      type="success"
      title="Payment Successful"
      message="Your payment has been processed successfully."
      buttonText="Go to Bookings"
      onClick={() => navigate("/bookings")}
    />
  );
}
