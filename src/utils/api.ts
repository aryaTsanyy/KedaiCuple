/** @format */

import axios from "axios";
import { Product, Category } from "../../types";
import { API_URL } from "@env";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;

export const fetchCategories = async (): Promise<Category[]> => {
  const response = await axios.get(`${API_URL}/categories`);
  return response.data;
};

export const fetchProducts = async (categoryId?: string): Promise<Product[]> => {
  let url = `${API_URL}/products`;
  if (categoryId) {
    url = `${API_URL}/products/category/${categoryId}`;
  }
  const response = await axios.get(url);
  return response.data;
};

export const fetchProductsByCategory = async (categorySlug?: string, limit?: number): Promise<Product[]> => {
  try {
    const response = await axios.get(`${API_URL}/products`, {
      params: {
        category: categorySlug,
        limit,
      }, // Kirim parameter kategori jika ada
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const fetchFeaturedProducts = async (): Promise<Product[]> => {
  const response = await axios.get(`${API_URL}/products/featured`);
  return response.data;
};
export const fetchCart = async (token: string): Promise<any> => {
  try {
    console.log("Token dikirim", token);
    const response = await axios.get(`${API_URL}/cart`, {
      headers: {
        Authorization: `Bearer ${token}`, // Kirim token autentikasi
      },
    });

    const mappedCart = response.data.map((item: any) => ({
      _id: item.product._id,
      name: item.product.name,
      image: item.product.image,
      price: item.product.price,
      quantity: item.quantity,
    }));

    return mappedCart;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      // Jika keranjang kosong, kembalikan array kosong
      return [];
    }
    throw error; // Lempar error untuk ditangani di tempat lain
  }
};
