import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { toast } from "sonner";
import ListingForm from "@/components/ListingForm";
import type { Listing } from "@/types/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/components/auth-provider";
import LoginPromptDialog from "@/components/LoginPromptDialog";

interface Stats {
  totalListings: number;
  activeListings: number;
  totalBookings: number;
  totalEarnings: number;
  cancelledBookings: number;
}

function Dashboard() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [listingsRes, statsRes] = await Promise.all([
          fetch(
            "https://stayfinder-backend-591n.onrender.com/api/listing/host/listings",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
          fetch(
            "https://stayfinder-backend-591n.onrender.com/api/dashboard/stats",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
        ]);

        const listingsData = await listingsRes.json();
        const statsData = await statsRes.json();

        if (listingsData.success) setListings(listingsData.data);
        if (statsData.success) setStats(statsData.data);
      } catch {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="mt-2 mb-5 pl-3 text-2xl font-bold text-gray-800 border-l-4 border-rose-500">
          Host Dashboard
        </h2>
        <Dialog open={open} onOpenChange={setOpen}>
          {user ? (
            <DialogTrigger asChild>
              <Button>Add Listing</Button>
            </DialogTrigger>
          ) : (
            <Button onClick={() => setShowLoginAlert(true)}>Add Listing</Button>
          )}
          <DialogContent>
            <ListingForm
              onSuccess={(listing: Listing) => {
                setListings((prev) => [listing, ...prev]);
                toast.success("Listing added successfully");
                setOpen(false);
              }}
              onClose={() => setOpen(false)}
            />
          </DialogContent>
        </Dialog>

        <LoginPromptDialog
          open={showLoginAlert}
          onOpenChange={setShowLoginAlert}
        />
      </div>

      {/* Stats Section */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-b-4 border-b-rose-400">
            <CardContent className="p-4">
              <p className="text-muted-foreground text-sm">Total Listings</p>
              <p className="text-2xl font-bold">{stats.totalListings}</p>
            </CardContent>
          </Card>
          <Card className="border-b-4 border-b-rose-400">
            <CardContent className="p-4">
              <p className="text-muted-foreground text-sm">Active Listings</p>
              <p className="text-2xl font-bold">{stats.activeListings}</p>
            </CardContent>
          </Card>
          <Card className="border-b-4 border-b-rose-400">
            <CardContent className="p-4">
              <p className="text-muted-foreground text-sm">Total Bookings</p>
              <p className="text-2xl font-bold">{stats.totalBookings}</p>
            </CardContent>
          </Card>
          <Card className="border-b-4 border-b-rose-400">
            <CardContent className="p-4">
              <p className="text-muted-foreground text-sm">
                Cancelled Bookings
              </p>
              <p className="text-2xl font-bold">{stats.cancelledBookings}</p>
            </CardContent>
          </Card>
          <Card className="border-b-4 border-b-rose-400">
            <CardContent className="p-4">
              <p className="text-muted-foreground text-sm">Total Earnings</p>
              <p className="text-2xl font-bold">
                ₹{stats.totalEarnings.toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Listing Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-48 w-full rounded-md" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          ))}
        </div>
      ) : listings.length === 0 ? (
        <p className="text-muted-foreground">No listings yet.</p>
      ) : (
        <>
          <Separator />

          <h2 className="mt-2 mb-5 pl-3 text-2xl font-bold text-gray-800 border-l-4 border-rose-500">
            Listings
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <Card
                key={listing._id}
                onClick={() => navigate(`/listing/${listing._id}`)}
                className="cursor-pointer hover:shadow-lg transition border-b-6 border-b-rose-400"
              >
                <img
                  src={listing.images?.[0] || "/placeholder.svg"}
                  alt={listing.title}
                  className="h-48 w-full object-cover"
                />
                <CardContent className="p-4 space-y-1">
                  <h3 className="font-semibold text-lg truncate">
                    {listing.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {listing.city}, {listing.state}
                  </p>
                  <p className="text-sm font-medium">
                    ₹{listing.price} / night
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
