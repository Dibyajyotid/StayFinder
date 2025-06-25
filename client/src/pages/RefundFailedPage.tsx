import StatusPage from "@/components/StatusComponent";
import { useNavigate } from "react-router-dom";

export default function RefundFailed() {
  const navigate = useNavigate();
  return (
    <StatusPage
      type="warning"
      title="Refund Failed"
      message="We couldn't process your refund. Please contact support."
      buttonText="Contact Support"
      onClick={() => navigate("/support")}
    />
  );
}
