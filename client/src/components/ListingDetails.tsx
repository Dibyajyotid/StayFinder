import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Wifi,
  Car,
  Tv,
  Coffee,
  Bath,
  Waves,
  Bed,
  Home,
  ChevronLeft,
  ChevronRight,
  MapPin,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Listing } from "@/types/types";
import { Button } from "./ui/button";
import BookingModal from "./BookingModal";
import { toast } from "sonner";
import { useAuth } from "./auth-provider";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import UpdateListingModal from "./UpdateListingModal";
import LoginPromptDialog from "./LoginPromptDialog";
// import ListingMap from "./ListingMap";
// import { geocodeAddress } from "@/lib/geocode";

const amenityIcons = {
  WiFi: Wifi,
  Parking: Car,
  TV: Tv,
  Kitchen: Coffee,
  Bathroom: Bath,
  Pool: Waves,
};

function ListingDetails() {
  const { id } = useParams();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  // const [coordinates, setCoordinates] = useState<{
  //   lat: number;
  //   lng: number;
  // } | null>(null);

  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetch(`https://stayfinder-backend-591n.onrender.com/api/listing/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setListing(data.data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (!listing?.images?.length) return;
    const interval = setInterval(() => {
      setCurrentImage((prev) =>
        prev === listing.images.length - 1 ? 0 : prev + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [listing?.images]);

  //for the map geocode
  // useEffect(() => {
  //   if (!listing) return;

  //   const fullAddress = `${listing.address}, ${listing.city}, ${listing.state}, ${listing.country}`;
  //   console.log(fullAddress)
  //   geocodeAddress(fullAddress)
  //     .then((coords) => {
  //       setCoordinates(coords);
  //     })
  //     .catch((err) => {
  //       console.error("Geocoding failed", err);
  //     });
  // }, [listing]);

  const handleDelete = async () => {
    const token = localStorage.getItem("token")
    const res = await fetch(
      `https://stayfinder-backend-591n.onrender.com/api/listing/${id}`,
      {
        method: "DELETE",
        {
          "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
        },
      }
    );

    const data = await res.json();

    if (res.ok) {
      toast.success("Listing deleted successfully");
      navigate("/dashboard");
    } else {
      toast.error(data.message || "Failed to delete listing");
    }
  };

  const showPrev = () =>
    setCurrentImage((prev) =>
      prev === 0 ? listing!.images.length - 1 : prev - 1
    );

  const showNext = () =>
    setCurrentImage((prev) =>
      prev === listing!.images.length - 1 ? 0 : prev + 1
    );

  const openGoogleMaps = () => {
    if (!listing) return;
    const address = `${listing.address}, ${listing.city}, ${listing.state}, ${listing.country}`;
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      address
    )}`;
    window.open(url, "_blank");
  };

  const isHost = user?._id === listing?.host?._id;

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="rounded-2xl shadow-md p-6 animate-pulse space-y-4">
          <div className="h-60 bg-gray-300 rounded-xl" />
          <div className="h-6 bg-gray-300 w-1/2 rounded" />
          <div className="h-4 bg-gray-200 w-3/4 rounded" />
          <div className="h-4 bg-gray-200 w-1/2 rounded" />
          <div className="h-4 bg-gray-200 w-2/3 rounded" />
        </Card>
      </div>
    );
  }

  if (!listing) return <div className="p-6">Listing not found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="rounded-2xl shadow-md overflow-hidden">
        {/* Image Slider */}
        <div className="relative w-full h-60 overflow-hidden">
          <div
            className="flex transition-transform duration-700 ease-in-out h-full"
            style={{
              transform: `translateX(-${currentImage * 100}%)`,
              // width: `${listing.images.length * 100}%`,
            }}
          >
            {listing.images.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`Listing image ${index + 1}`}
                className="w-full h-60 object-cover flex-shrink-0"
              />
            ))}
          </div>

          {listing.images.length > 1 && (
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
        </div>

        <CardContent className="p-6 space-y-6 border-l-4 border-rose-500">
          <div className="flex items-center justify-between border-l-5 pl-5 border-zinc-600">
            <div>
              <h2 className="text-xl font-semibold">
                {listing.propertyType} hosted by {listing.host?.userName}
              </h2>
              <div className="flex items-center space-x-4 text-gray-600 mt-1">
                <span className="flex items-center">
                  <Bed className="h-4 w-4 mr-1" /> {listing.bedrooms} bedrooms
                </span>
                <span className="flex items-center">
                  <Bath className="h-4 w-4 mr-1" /> {listing.bathrooms}{" "}
                  bathrooms
                </span>
              </div>
            </div>
            <Avatar className="h-12 w-12">
              <AvatarImage src={listing.host?.avatar} />
              <AvatarFallback className="font-bold">
                {listing.host?.userName?.toUpperCase().charAt(0) || "H"}
              </AvatarFallback>
            </Avatar>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-3 border-l-4 border-zinc-600 pl-5">
              About this place
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Located in{" "}
              <span className="font-bold">
                {listing.address} in {listing.city},{listing.state},{" "}
                {listing.country}
              </span>
              . {listing.description} At the price of just{" "}
              <span className="font-bold">₹{listing.price} per night</span>
            </p>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-4 border-l-4 border-zinc-600 pl-5">
              What this place offers
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {(listing.amenities || []).map((amenity) => {
                const Icon =
                  amenityIcons[amenity as keyof typeof amenityIcons] || Home;
                return (
                  <div key={amenity} className="flex items-center space-x-3">
                    <Icon className="h-5 w-5 text-gray-600" />
                    <span>{amenity}</span>
                  </div>
                );
              })}
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
                  {listing.address}, {listing.city}, {listing.state},{" "}
                  {listing.country}
                </p>
              </div>
            </div>

            <Separator className="mt-2" />

            <div className="flex items-center gap-6 mt-6 justify-between">
              <Button
                className="mt-4 hover:cursor-pointer"
                onClick={() => {
                  user ? setShowModal(true) : setShowLoginAlert(true);
                }}
              >
                Book Now
              </Button>

              {isHost && (
                <div className="flex items-center gap-6">
                  <div className="mt-4 hover:cursor-pointer">
                    <UpdateListingModal
                      listing={listing}
                      onSuccess={(updatedListing) => setListing(updatedListing)}
                    />
                  </div>
                  <AlertDialog
                    open={showAlertDialog}
                    onOpenChange={setShowAlertDialog}
                  >
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        className="mt-4 hover:cursor-pointer"
                      >
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you sure you want to delete this listing?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          remove your listing from the platform.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </div>

            <BookingModal
              open={showModal}
              onClose={() => setShowModal(false)}
              listing={listing}
            />

            {/* make this a component so that i can use anywhere but this code is here so that i can see and...i dont know */}
            {/* <AlertDialog open={showLoginAlert} onOpenChange={setShowLoginAlert}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Please log in to continue</AlertDialogTitle>
                  <AlertDialogDescription>
                    You must be logged in to book this listing.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => navigate("/login")}>
                    Log In
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog> */}
            {/* instead of the above code this is what now i have to use  */}
            <LoginPromptDialog
              open={showLoginAlert}
              onOpenChange={setShowLoginAlert}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ListingDetails;
