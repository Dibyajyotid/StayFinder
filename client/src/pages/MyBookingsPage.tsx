import { useEffect, useState } from "react";
import type { Booking } from "@/types/types.ts";
import BookingCard from "@/components/BookingCard";
import BookingCardSkeleton from "@/components/BookingCardSkeleton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const LOCAL_STORAGE_KEY = "removedCancelledBookings";

function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [removedCancelledBookings, setRemovedCancelledBookings] = useState<
    string[]
  >(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      return stored && stored !== "null" && stored !== "undefined"
        ? JSON.parse(stored)
        : [];
    } catch (e) {
      console.error("Failed to parse localStorage data:", e);
      return [];
    }
  });
  const [showRemoved, setShowRemoved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // useEffect(() => {
  //   localStorage.setItem(
  //     LOCAL_STORAGE_KEY,
  //     JSON.stringify(removedCancelledBookings)
  //   );
  // }, [removedCancelledBookings]);

  useEffect(() => {
    const token = localStorage.getItem("token")
    fetch("https://stayfinder-backend-591n.onrender.com/api/booking", {
      method: "GET"
      headers: {
      "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "", 
      },
      
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const fetchedBookings = data.data as Booking[];
          setBookings(fetchedBookings);

          const deletedIds = fetchedBookings
            .filter((b) => b.isDeleted === true)
            .map((b: { _id: any }) => b._id);

          setRemovedCancelledBookings(deletedIds);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(deletedIds));
        } else {
          setError(data.message || "Failed to fetch bookings");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Something went wrong");
        setLoading(false);
      });
  }, []);

  const handleLocalDelete = async (id: string) => {
    setRemovedCancelledBookings((prev) => {
      const updated = [...prev, id];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    try {
      const res = await fetch(
        `https://stayfinder-backend-591n.onrender.com/api/booking/mark-delete/${id}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );
      const data = await res.json();

      if (res.ok) {
        toast.success("Booking marked as deleted");
      } else {
        toast.error(data.message || "Failed to mark booking as deleted");
      }
    } catch (error) {
      console.error("Failed to update backend isDeleted", error);
      toast.error("Something went wrong while deleting");
    }
  };

  const visibleBookings = bookings.filter(
    (b) =>
      !(b.status === "cancelled" && removedCancelledBookings.includes(b._id))
  );

  const removedCancelled = bookings.filter(
    (b) => b.status === "cancelled" && removedCancelledBookings.includes(b._id)
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 border-l-5 border-l-rose-500">
        <h2 className="pl-3 text-2xl font-bold">My Bookings</h2>
        <p className="text-gray-600 mt-1 pl-3">
          Review and manage your recent bookings
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <BookingCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          {visibleBookings.length === 0 ? (
            <p className="text-muted-foreground mb-5">
              You don’t have any bookings yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {visibleBookings.map((booking) => (
                <BookingCard
                  key={booking._id}
                  booking={booking}
                  onDelete={handleLocalDelete}
                />
              ))}
            </div>
          )}

          {removedCancelled.length > 0 && (
            <div className="mb-6">
              <Button
                variant="outline"
                onClick={() => setShowRemoved((prev) => !prev)}
                className="pl-4 border-l-4 border-l-rose-500 hover:cursor-pointer"
              >
                {showRemoved
                  ? "Hide Removed Bookings"
                  : "Show Removed Bookings"}
              </Button>
            </div>
          )}

          {showRemoved && removedCancelled.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-3 text-red-600">
                Removed Cancelled Bookings
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {removedCancelled.map((booking) => (
                  <BookingCard
                    key={booking._id}
                    booking={booking}
                    // onDelete={handleLocalDelete}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default MyBookingsPage;
