import type { Listing } from "@/types/types";
import { useEffect, useState } from "react";
import ListingCard from "./ListingCard";

function ListingGrid() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://stayfinder-backend-591n.onrender.com/api/listing")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setListings(data.data);
        } else {
          console.error("Unexpected data format:", data);
          setListings([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching Listings", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-300 rounded-lg h-48 mb-4"></div>
            <div className="space-y-2">
              <div className="bg-gray-300 h-4 rounded"></div>
              <div className="bg-gray-300 h-4 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 pl-4 border-l-4 border-l-rose-500">
        Featured Listings
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.isArray(listings) &&
          listings.map((listing) => (
            <ListingCard key={listing._id} listing={listing} />
          ))}
      </div>
    </div>
  );
}

export default ListingGrid;
