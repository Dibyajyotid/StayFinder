import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Booking } from "@/types/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MapPin, XCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "./ui/skeleton";
import { Wifi, Car, Tv, Coffee, Bath, Waves, Home } from "lucide-react";
import { Separator } from "./ui/separator";
import { toast } from "sonner";

const amenityIcons = {
  WiFi: Wifi,
  Parking: Car,
  TV: Tv,
  Kitchen: Coffee,
  Bathroom: Bath,
  Pool: Waves,
};

function BookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
  const token = localStorage.getItem("token"); // ✅ get token

  fetch(`https://stayfinder-backend-591n.onrender.com/api/booking/${id}`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        setBooking(data.data);
      } else {
        setError(data.message || "Failed to fetch booking");
      }
      setLoading(false);
    })
    .catch(() => {
      setError("Something went wrong");
      setLoading(false);
    });
}, [id]);

  const handleCancel = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `https://stayfinder-backend-591n.onrender.com/api/booking/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "application/json",
        },
      }
    );

    const data = await res.json();

    if (res.ok) {
      navigate("/refund-success");
      toast.success("Booking is cancelled and refunded");
    } else {
      toast.error(data.message);
      navigate("/refund-fail");
    }
  } catch {
    toast.error("Something went wrong");
  }
};


  const images = booking?.listingId.images ?? [];

  useEffect(() => {
    if (!images.length) return;

    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images]);

  const showPrev = () =>
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  const showNext = () =>
    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  if (loading)
    return (
      <div className="container mx-auto px-4 py-8 space-y-6">
        <Skeleton className="w-full h-80 rounded-xl" />

        <div className="space-y-4">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-3/4" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>

          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );

  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!booking) return <div className="p-4">No booking found</div>;

  const checkIn = new Date(booking.checkInDate);
  const checkOut = new Date(booking.checkOutDate);

  const nights =
    (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24);

  const pricePerNight = booking.totalPrice / nights;

  const openGoogleMaps = () => {
    if (!booking.listingId) return;
    const address = `${booking.listingId.address}, ${booking.listingId.city}, ${booking.listingId.state}, ${booking.listingId.country}`;
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      address
    )}`;
    window.open(url, "_blank");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="rounded-2xl shadow-md overflow-hidden">
        <div className="relative w-full h-80 overflow-hidden">
          <div
            className="flex transition-transform duration-700 ease-in-out h-full"
            style={{
              transform: `translateX(-${currentImage * 100}%)`,
              // width: `${images.length * 100}%`,
            }}
          >
            {images.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`Image ${index}`}
                className="w-full h-full object-cover flex-shrink-0"
                // style={{ width: `${100 / images.length}%` }}
              />
            ))}
          </div>

          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={showPrev}
                className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full shadow"
              >
                <ChevronLeft size={20} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={showNext}
                className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full shadow"
              >
                <ChevronRight size={20} />
              </Button>
            </>
          )}

          <Badge className="absolute top-2 left-2">
            {booking.listingId.propertyType}
          </Badge>
        </div>

        <CardContent className="p-6 space-y-3 border-l-5 border-rose-500">
          <div className="border-l-4 border-zinc-600 pl-4">
            <h3 className="text-2xl font-bold">{booking.listingId.title}</h3>
            <p className="text-gray-600">
              {booking.listingId.address}, {booking.listingId.city},{" "}
              {booking.listingId.state}, {booking.listingId.country}
            </p>
          </div>
          <Separator />

          <div className="pt-4 space-y-6 text-sm text-gray-700">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
              <div>
                <p className="text-muted-foreground text-xs font-medium mb-1">
                  Booking ID
                </p>
                <p className="font-medium">{booking._id}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs font-medium mb-1">
                  Check-in
                </p>
                <p className="font-medium">
                  {new Date(booking.checkInDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs font-medium mb-1">
                  Check-out
                </p>
                <p className="font-medium">
                  {new Date(booking.checkOutDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs font-medium mb-1">
                  Phone
                </p>
                <p className="font-medium">{booking.phone}</p>
              </div>
              <div>
                <p className="text-base font-medium">
                  Total Price: ₹{booking.totalPrice.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  (at ₹{pricePerNight.toFixed(0).toLocaleString()}/night for{" "}
                  {nights} nights)
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs font-medium mb-1">
                  Status
                </p>
                <p
                  className={`capitalize font-semibold ${
                    booking.status === "cancelled"
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {booking.status}
                </p>
              </div>
            </div>

            <div className="border-t pt-6 space-y-4">
              <div>
                <h4 className="text-lg font-semibold border-l-4 border-zinc-600 pl-4">
                  Listing Details
                </h4>
                <Separator className="mt-3" />
                <p className="text-gray-600 mt-1">
                  {booking.listingId.description}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
                <div>
                  <p className="text-muted-foreground text-xs font-medium mb-1">
                    Bedrooms
                  </p>
                  <p className="font-medium">{booking.listingId.bedrooms}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs font-medium mb-1">
                    Bathrooms
                  </p>
                  <p className="font-medium">{booking.listingId.bathrooms}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs font-medium mb-1">
                    Price
                  </p>
                  <p className="font-medium">{booking.listingId.price}</p>
                </div>
                {/* <div>
                  <p className="text-muted-foreground text-xs font-medium mb-1">
                    Amenities
                  </p>
                  <p className="font-medium">{booking.listingId.amenities}</p>
                </div> */}
                <div>
                  <p className="text-muted-foreground text-xs font-medium mb-1">
                    Amenities
                  </p>
                  <div className="flex flex-wrap gap-3 mt-2">
                    {booking.listingId.amenities?.map((amenity: string) => {
                      const Icon =
                        amenityIcons[amenity as keyof typeof amenityIcons] ||
                        Home;
                      return (
                        <div
                          key={amenity}
                          className="flex items-center gap-1 text-sm text-gray-600"
                        >
                          <Icon className="h-4 w-4" />
                          <span>{amenity}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <p className="text-muted-foreground text-xs font-medium mb-1">
                    Host Phone
                  </p>
                  <p className="font-medium">{booking.listingId.hostPhone}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs font-medium mb-1">
                    Hosted By
                  </p>
                  <p className="font-medium">
                    {booking.listingId.host?.userName} (
                    {booking.listingId.host?.email})
                  </p>
                </div>
              </div>
            </div>

            <Separator className="my-4" />

            <div>
              <h3 className="text-lg font-semibold mb-4 border-l-4 border-zinc-600 pl-5">
                Location
              </h3>

              <div className="space-y-2">
                <Button
                  variant={"outline"}
                  onClick={openGoogleMaps}
                  className="flex items-center gap-2 w-full sm:w-auto"
                >
                  <MapPin className="h-4 w-4" />
                  Open in Google Maps
                </Button>
                <p className="text-sm text-muted-foreground">
                  {booking.listingId.address}, {booking.listingId.city},{" "}
                  {booking.listingId.state}, {booking.listingId.country}
                </p>
              </div>
            </div>
          </div>

          {booking.status !== "cancelled" && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="mt-4 flex items-center"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Cancel Booking
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. Your booking will be
                    permanently cancelled.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>No</AlertDialogCancel>
                  <AlertDialogAction onClick={handleCancel}>
                    Yes, Cancel
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default BookingDetails;
