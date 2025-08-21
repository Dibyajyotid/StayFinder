import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { Listing } from "@/types/types";
import { X } from "lucide-react";

interface UpdateListingModalProps {
  listing: Listing;
  onSuccess: (updatedListing: Listing) => void;
}

export default function UpdateListingModal({
  listing,
  onSuccess,
}: UpdateListingModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: listing.title,
    description: listing.description,
    price: listing.price.toString(),
    bedrooms: listing.bedrooms.toString(),
    bathrooms: listing.bathrooms.toString(),
    amenities: listing.amenities.join(", "),
    hostPhone: listing.hostPhone?.toString() || "",
  });

  // Store selected images as base64 strings
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (imagePreviews.length >= 10) {
      toast.error("You can only upload up to 10 images");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreviews((prev) => [...prev, reader.result as string]);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (index: number) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(
        `https://stayfinder-backend-591n.onrender.com/api/listing/${listing._id}`,
        {
          method: "PUT",
          headers: { 
            "Content-Type": "application/json",
              Authorization: token ? `Bearer ${token}` : ""
          },
          body: JSON.stringify({
            ...form,
            price: Number(form.price),
            bedrooms: Number(form.bedrooms),
            bathrooms: Number(form.bathrooms),
            hostPhone: Number(form.hostPhone),
            amenities: form.amenities
              .split(",")
              .map((a) => a.trim())
              .filter(Boolean),
            images: imagePreviews,
          }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        toast.success("Listing updated successfully");
        onSuccess(data.listing);
        setOpen(false);
        setImagePreviews([]);
      } else {
        toast.error(data.message || "Failed to update listing");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Update</Button>
      </DialogTrigger>
      <DialogContent className="space-y-4 max-h-[90vh] overflow-y-auto">
        <div>
          <Label>Title</Label>
          <Input name="title" value={form.title} onChange={handleChange} />
        </div>
        <div>
          <Label>Description</Label>
          <Input
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label>Price</Label>
          <Input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label>Bedrooms</Label>
          <Input
            name="bedrooms"
            type="number"
            value={form.bedrooms}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label>Bathrooms</Label>
          <Input
            name="bathrooms"
            type="number"
            value={form.bathrooms}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label>Amenities (comma separated)</Label>
          <Input
            name="amenities"
            value={form.amenities}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label>Host Phone</Label>
          <Input
            name="hostPhone"
            value={form.hostPhone}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label>Add Images (up to 10)</Label>
          <Input type="file" accept="image/*" onChange={handleImageChange} />
        </div>

        {/* Show selected image previews */}
        {imagePreviews.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mt-4">
            {imagePreviews.map((img, index) => (
              <div key={index} className="relative group">
                <img
                  src={img}
                  alt={`preview-${index}`}
                  className="w-full h-24 object-cover rounded"
                />
                <button
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-red-500 hover:text-white"
                  type="button"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Updating..." : "Update Listing"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
