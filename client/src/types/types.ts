export interface Listing {
  _id: string;
  title: string;
  description: string;
  address: string;
  city: string;
  state: string;
  country: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  propertyType: "Apartment" | "House" | "Villa" | "Cabin";
  images: string[];
  amenities: string[];
  hostPhone: number;
  host: {
    _id: string;
    userName: string;
    email: string;
    avatar: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface Booking {
  isDeleted: boolean;
  _id: string;
  userId: string;
  listingId: Listing;
  phone: number;
  totalPrice: number;
  checkInDate: string;
  checkOutDate: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
  updatedAt: string;
  __v: number;
}
