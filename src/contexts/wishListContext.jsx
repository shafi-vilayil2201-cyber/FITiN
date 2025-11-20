// src/contexts/wishListContext.jsx
import React, { createContext, useEffect, useState, useContext } from "react";
import { getWishlist, addToWishlistAPI, removeFromWishlistAPI } from "../services/api";
import { toast } from "react-toastify";
import { AuthContext } from "./AuthContext"; // Make sure you have this context providing `user`

export const WishlistContext = createContext();

export const WishlistProvider = ({ children, localWishlist = [] }) => {
  const { user } = useContext(AuthContext); // Get logged-in user
  const userId = user?.id;

  const [wishList, setWishlist] = useState([]);

  // Merge local wishlist with DB wishlist
  const mergeLocalWithDB = async (dbWishlist) => {
    for (let item of localWishlist) {
      if (!dbWishlist.some((i) => String(i.id) === String(item.id))) {
        try {
          await addToWishlistAPI(userId, item);
        } catch (err) {
          console.error("Failed to merge item into wishlist:", err);
        }
      }
    }
  };

  // Fetch wishlist from DB and merge with local
  const refreshWishlist = async () => {
    if (!userId) {
      setWishlist([]);
      return;
    }
    try {
      const dbWishlist = (await getWishlist(userId)) || [];
      await mergeLocalWithDB(dbWishlist);
      const updatedWishlist = (await getWishlist(userId)) || [];
      setWishlist(updatedWishlist);
    } catch (err) {
      console.error("Failed to refresh wishlist:", err);
      setWishlist([]);
    }
  };

  useEffect(() => {
    refreshWishlist();
  }, [userId]);

  const addToWishlist = async (product) => {
    if (!userId) {
      toast.info("Please log in to add items to your wishlist!");
      return;
    }
    if (wishList.some((i) => String(i.id) === String(product.id))) return;

    const minimalProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
    };

    // Optimistic UI update
    setWishlist((prev) => [...prev, minimalProduct]);
    toast.success("Added to wishlist!");

    try {
      await addToWishlistAPI(userId, minimalProduct);
    } catch (err) {
      console.error("Failed to add to wishlist:", err);
      toast.error("Failed to add to wishlist");
      // rollback
      setWishlist((prev) => prev.filter((i) => i.id !== product.id));
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!userId) return;

    // Optimistic UI update
    setWishlist((prev) => prev.filter((i) => i.id !== productId));
    toast.info("Removed from wishlist");

    try {
      await removeFromWishlistAPI(userId, productId);
    } catch (err) {
      console.error("Failed to remove wishlist item:", err);
      toast.error("Failed to remove item");
      await refreshWishlist(); // rollback
    }
  };

  return (
    <WishlistContext.Provider
      value={{ wishList, addToWishlist, removeFromWishlist, refreshWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};