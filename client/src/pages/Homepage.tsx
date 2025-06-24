import Hero from "@/components/Hero";
import ListingGrid from "@/components/ListingGrid";
import { SearchBar } from "@/components/SearchBar";
import { Suspense } from "react";

function Homepage() {
  return (
    <div className="min-h-screen">
      <Hero />

      <div className="container mx-auto px-4 py-8">
        <SearchBar />
        <Suspense fallback={<div>Loading listings...</div>}>
          <ListingGrid />
        </Suspense>
      </div>
    </div>
  );
}

export default Homepage;
