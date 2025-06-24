import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import type { Listing } from "@/types/types";
import { Link } from "react-router-dom";

interface ListingCardProps {
  listing: Listing;
}

function ListingCard({ listing }: ListingCardProps) {
  return (
    <Link to={`/listing/${listing._id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer border-b-4 border-b-rose-400">
        {/* Image */}
        <div className="relative">
          <img
            src={listing.images[0] || "/placeholder.svg"}
            alt={listing.title}
            width={400}
            height={250}
            className="w-full h-48 object-cover"
          />
          <Badge className="absolute top-2 left-2 bg-white text-black">
            {listing.propertyType}
          </Badge>
        </div>

        {/* Content */}
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2 text-sm text-gray-500">
            <div className="flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              {listing.city}, {listing.state}
            </div>
            {listing.host && typeof listing.host === "object" && (
              <div className="italic">Host: {listing.host.userName}</div>
            )}
          </div>

          <h3 className="font-semibold text-lg mb-2 line-clamp-2">
            {listing.title}
          </h3>

          <div className="flex items-center justify-between text-sm">
            <div>
              <span className="text-lg font-bold">₹{listing.price}</span>
              <span className="text-gray-500"> / night</span>
            </div>
            <div className="text-gray-500">
              {listing.bedrooms} bed • {listing.bathrooms} bath
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default ListingCard;
