import axios from "axios";

const API_URL = "http://localhost:3000";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

export const getAllProducts = async () => {
  const response = await api.get("/products");
  return response.data;
};

export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const getAllUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};

export const getUserByEmail = async (email) => {
  const response = await api.get(`/users?email=${email}`);
  return response.data[0];
};

export const registerUser = async (userData) => {
  const response = await api.post("/users", userData);
  return response.data;
};

export const loginUser = async (email, password) => {
  const response = await api.get(`/users?email=${email}&password=${password}`);
  return response.data.length > 0 ? response.data[0] : null;
};


export const addToWishlistAPI = async (userId, product) => {
  const res = await api.get(`/users/${userId}`);
  const user = res.data;

  const wishlist = Array.isArray(user.wishlist) ? user.wishlist : [];
  const existing = wishlist.find((item) => String(item.id) === String(product.id));
  if (existing) return user;

  const updatedUser = {
    ...user,
    wishlist: [...wishlist, product],
  };

  await api.patch(`/users/${userId}`, { wishlist: updatedUser.wishlist });
  return updatedUser;
};


export const getWishlist = async (userId) => {
  const res = await api.get(`/users/${userId}`);
  return Array.isArray(res.data.wishlist) ? res.data.wishlist : [];
};


export const removeFromWishlistAPI = async (userId, productId) => {
  const res = await api.get(`/users/${userId}`);
  const user = res.data;

  const wishlist = Array.isArray(user.wishlist) ? user.wishlist : [];
  const updatedWishlist = wishlist.filter((item) => String(item.id) !== String(productId));

  await api.patch(`/users/${userId}`, { wishlist: updatedWishlist });
  return { ...user, wishlist: updatedWishlist };
};

export default api;