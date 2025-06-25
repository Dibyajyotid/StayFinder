// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { useState } from "react";
// import { toast } from "sonner";

// interface BookingModalProps {
//   open: boolean;
//   onClose: () => void;
//   listing: {
//     _id: string;
//     title: string;
//     price: number;
//     address: string;
//     city: string;
//     state: string;
//     country: string;
//   };
// }

// const BookingModal = ({ open, onClose, listing }: BookingModalProps) => {
//   const [form, setForm] = useState({
//     phone: "",
//     checkInDate: "",
//     checkOutDate: "",
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async () => {
//     const res = await fetch(
//       `http://localhost:2000/api/booking/${listing._id}`,
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify(form),
//       }
//     );

//     const data = await res.json();
//     if (data.success) {
//       toast.success("Booking successful");
//       onClose();
//     } else {
//       toast.error(data.message || "Booking failed");
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={onClose}>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Confirm Booking</DialogTitle>
//         </DialogHeader>

//         <div className="space-y-2">
//           <p className="text-sm text-muted-foreground">
//             <strong>{listing.title}</strong> in {listing.city}, {listing.state}
//           </p>
//           <p className="text-sm">Price: ₹{listing.price} per night</p>

//           <div className="space-y-2 pt-4">
//             <Label htmlFor="phone">Phone</Label>
//             <Input
//               id="phone"
//               name="phone"
//               type="text"
//               placeholder="Enter phone number"
//               value={form.phone}
//               onChange={handleChange}
//             />

//             <Label htmlFor="checkInDate">Check-in</Label>
//             <Input
//               id="checkInDate"
//               name="checkInDate"
//               type="date"
//               value={form.checkInDate}
//               onChange={handleChange}
//             />

//             <Label htmlFor="checkOutDate">Check-out</Label>
//             <Input
//               id="checkOutDate"
//               name="checkOutDate"
//               type="date"
//               value={form.checkOutDate}
//               onChange={handleChange}
//             />
//           </div>
//         </div>

//         <DialogFooter className="pt-4">
//           <Button onClick={handleSubmit}>Book Now</Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default BookingModal;

// BookingModal.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
  listing: {
    _id: string;
    title: string;
    price: number;
    address: string;
    city: string;
    state: string;
    country: string;
  };
}

const BookingModal = ({ open, onClose, listing }: BookingModalProps) => {
  const [form, setForm] = useState({
    phone: "",
    checkInDate: "",
    checkOutDate: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.phone || !form.checkInDate || !form.checkOutDate) {
      return toast.error("Please fill in all the fields.");
    }

    if (!/^\d{10}$/.test(form.phone)) {
      return toast.error("Invalid phone number. It should be 10 digits.");
    }

    const checkIn = new Date(form.checkInDate);
    const checkOut = new Date(form.checkOutDate);

    if (checkIn >= checkOut) {
      return toast.error("Check-in date must be before check-out date.");
    }
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:2000/api/booking/checkout-session/${listing._id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ ...form, listingId: listing._id }),
        }
      );

      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.message || "Failed to start payment");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Booking</DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            <strong>{listing.title}</strong> in {listing.city}, {listing.state}
          </p>
          <p className="text-sm">Price: ₹{listing.price} per night</p>

          <div className="space-y-2 pt-4">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              type="text"
              placeholder="Enter phone number"
              value={form.phone}
              onChange={handleChange}
            />

            <Label htmlFor="checkInDate">Check-in</Label>
            <Input
              id="checkInDate"
              name="checkInDate"
              type="date"
              value={form.checkInDate}
              onChange={handleChange}
            />

            <Label htmlFor="checkOutDate">Check-out</Label>
            <Input
              id="checkOutDate"
              name="checkOutDate"
              type="date"
              value={form.checkOutDate}
              onChange={handleChange}
            />
          </div>
        </div>

        <DialogFooter className="pt-4">
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Processing" : "Book Now"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
