import { useState } from "react";
import { format } from "date-fns";
import { MapPin, CalendarIcon, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

export function SearchBar() {
  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (location) params.set("location", location);
    if (checkIn) params.set("checkIn", checkIn.toISOString());
    if (checkOut) params.set("checkOut", checkOut.toISOString());
    if (priceMin) params.set("priceMin", priceMin);
    if (priceMax) params.set("priceMax", priceMax);

    window.location.href = `/search?${params.toString()}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Where are you going?"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="pl-10"
          />
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <div className="w-full h-10 px-3 py-2 border rounded-md text-sm text-gray-700 flex items-center gap-2 cursor-pointer">
              <CalendarIcon className="h-4 w-4 text-gray-500" />
              <span className="truncate">
                {checkIn ? format(checkIn, "MMM dd") : "Check in"}
              </span>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={checkIn}
              onSelect={setCheckIn}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <div className="w-full h-10 px-3 py-2 border rounded-md text-sm text-gray-700 flex items-center gap-2 cursor-pointer">
              <CalendarIcon className="h-4 w-4 text-gray-500" />
              <span className="truncate">
                {checkOut ? format(checkOut, "MMM dd") : "Check out"}
              </span>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={checkOut}
              onSelect={setCheckOut}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <div className="w-full h-10 px-3 py-2 border rounded-md flex items-center gap-2 text-sm text-gray-700">
          ₹
          <input
            type="number"
            placeholder="Min price"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            className="w-full bg-transparent focus:outline-none"
          />
        </div>

        <div className="w-full h-10 px-3 py-2 border rounded-md flex items-center gap-2 text-sm text-gray-700">
          ₹
          <input
            type="number"
            placeholder="Max price"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            className="w-full bg-transparent focus:outline-none"
          />
        </div>

        <Button
          onClick={handleSearch}
          className="bg-rose-500 hover:bg-rose-600 col-span-full md:col-span-1"
        >
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
      </div>
    </div>
  );
}
