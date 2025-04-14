/** @format */

export interface Category {
  _id: string;
  name: string;
  slug: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  priceRange?: {
    min: number;
    max: number;
  };
  imageUrl: string;
  category: Category | string;
  featured: boolean;
}

export interface StoreInfo {
  name: string;
  address: string;
  phone?: string;
  imageUrl?: string;
  latitude?: number;
  longitude?: number;
  openingHours?: {
    open: string;
    close: string;
  };
}
export interface CartItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  notes: string;
}
