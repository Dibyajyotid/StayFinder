import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import type { Listing } from "@/types/types";
import { X } from "lucide-react";

interface ListingFormProps {
  onSuccess: (listing: Listing) => void;
  onClose: () => void;
}

export default function ListingForm({ onSuccess, onClose }: ListingFormProps) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    address: "",
    city: "",
    state: "",
    country: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    propertyType: "",
    hostPhone: "",
    amenities: [] as string[],
  });

  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const allAmenities = ["WiFi", "Parking", "TV", "Kitchen", "Bathroom", "Pool"];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || images.length >= 10) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImages((prev) => [...prev, reader.result as string]);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:2000/api/listing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          bedrooms: Number(form.bedrooms),
          bathrooms: Number(form.bathrooms),
          hostPhone: Number(form.hostPhone),
          images,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Listing created successfully!");
        onSuccess(data);
        onClose();
      } else {
        toast.error(data.message || "Failed to create listing");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* All form inputs remain unchanged */}
        <div>
          <Label>Title</Label>
          <Input name="title" value={form.title} onChange={handleChange} />
        </div>
        <div>
          <Label>Property Type</Label>
          <Input
            name="propertyType"
            value={form.propertyType}
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
          <Label>Host Phone</Label>
          <Input
            name="hostPhone"
            type="text"
            value={form.hostPhone}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label>Address</Label>
          <Input name="address" value={form.address} onChange={handleChange} />
        </div>
        <div>
          <Label>City</Label>
          <Input name="city" value={form.city} onChange={handleChange} />
        </div>
        <div>
          <Label>State</Label>
          <Input name="state" value={form.state} onChange={handleChange} />
        </div>
        <div>
          <Label>Country</Label>
          <Input name="country" value={form.country} onChange={handleChange} />
        </div>

        <div className="sm:col-span-2">
          <Label className="mb-2 block">Amenities</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {allAmenities.map((amenity) => (
              <label key={amenity} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="amenities"
                  value={amenity}
                  checked={form.amenities.includes(amenity)}
                  onChange={(e) => {
                    const { checked, value } = e.target;
                    setForm((prev) => ({
                      ...prev,
                      amenities: checked
                        ? [...prev.amenities, value]
                        : prev.amenities.filter((a) => a !== value),
                    }));
                  }}
                />
                {amenity}
              </label>
            ))}
          </div>
        </div>

        <div className="sm:col-span-2">
          <Label>Description</Label>
          <Textarea
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <div className="sm:col-span-2 space-y-2">
          <Label>Add Images (max 10)</Label>
          <Input type="file" accept="image/*" onChange={handleImageChange} />
          <div className="flex flex-wrap gap-3">
            {images.map((img, i) => (
              <div key={i} className="relative w-24 h-24">
                <img
                  src={img}
                  alt={`img-${i}`}
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(i)}
                  className="absolute top-0 right-0 bg-black bg-opacity-70 text-white rounded-full p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Button onClick={handleSubmit} disabled={loading} className="w-full">
        {loading ? "Submitting..." : "Submit Listing"}
      </Button>
    </div>
  );
}
