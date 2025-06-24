import type { Booking } from "@/types/types.ts";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Props {
  booking: Booking;
  onDelete?: (id: string) => void;
}

const BookingCard: React.FC<Props> = ({ booking, onDelete }) => {
  const navigate = useNavigate();

  const statusColor =
    booking.status === "cancelled" ? "text-red-600" : "text-green-600";

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent navigating to details

    if (onDelete) onDelete(booking._id); // Remove from frontend
  };

  return (
    <Card
      onClick={() => navigate(`/booking/${booking._id}`)}
      className="rounded-2xl shadow-md hover:shadow-xl transition cursor-pointer relative border-b-5 border-rose-400"
    >
      <CardContent className="p-6 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Booking</h3>
          <Badge variant="outline">{booking.status}</Badge>
        </div>

        <p className="text-gray-500 text-sm">
          ID:{" "}
          <span className="text-muted-foreground break-all">{booking._id}</span>
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          <p>
            <strong>Check-in:</strong>{" "}
            {new Date(booking.checkInDate).toLocaleDateString()}
          </p>
          <p>
            <strong>Check-out:</strong>{" "}
            {new Date(booking.checkOutDate).toLocaleDateString()}
          </p>
          <p>
            <strong>Phone:</strong> {booking.phone}
          </p>
          <p>
            <strong>Total Price:</strong> ₹{booking.totalPrice}
          </p>
          <p className={`capitalize font-semibold ${statusColor}`}>
            {booking.status}
          </p>
        </div>

        {booking.status === "cancelled" && onDelete && (
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-4 right-4 text-red-600 hover:bg-red-100"
            onClick={handleDelete}
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default BookingCard;
