import StatusPage from "@/components/StatusComponent";
import { useNavigate } from "react-router-dom";

export default function RefundSuccess() {
  const navigate = useNavigate();
  return (
    <StatusPage
      type="refund"
      title="Refund Successful"
      message="Your refund has been processed and will reflect in your account soon."
      buttonText="Go to Bookings"
      onClick={() => navigate("/bookings")}
    />
  );
}
