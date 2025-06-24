import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { Listing } from "@/types/types";
import ListingCard from "@/components/ListingCard";
import Hero from "./Hero";
import { SearchBar } from "./SearchBar";

function SearchResults() {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const query = new URLSearchParams();

    const location = searchParams.get("location");
    const checkIn = searchParams.get("checkIn");
    const checkOut = searchParams.get("checkOut");
    const priceMin = searchParams.get("priceMin");
    const priceMax = searchParams.get("priceMax");

    if (location) query.set("location", location);
    if (checkIn) query.set("checkIn", checkIn);
    if (checkOut) query.set("checkOut", checkOut);
    if (priceMin) query.set("priceMin", priceMin);
    if (priceMax) query.set("priceMax", priceMax);

    fetch(`http://localhost:2000/api/listing/search?${query.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Search response:", data);
        if (data.success && Array.isArray(data.listings)) {
          setResults(data.listings);
        } else {
          console.error("Unexpected search response:", data);
          setResults([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Search failed:", err);
        setLoading(false);
      });
  }, [searchParams]);

  return (
    <div className="min-h-screen">
      <Hero />
      <div className="container mx-auto px-4 py-8">
        <SearchBar />
        <h2 className="text-2xl font-bold mb-6">Search Results</h2>

        {loading ? (
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
        ) : results.length === 0 ? (
          <p className="text-rose-500">No listings found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {results.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchResults;
