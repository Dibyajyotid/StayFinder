import StatusPage from "@/components/StatusComponent";
import { useNavigate } from "react-router-dom";


export default function PaymentFailed() {
  const navigate = useNavigate();
  return (
    <StatusPage
      type="error"
      title="Payment Failed"
      message="Something went wrong with your payment. Please try again."
      buttonText="Retry Payment"
      onClick={() => navigate("/checkout")}
    />
  );
}
