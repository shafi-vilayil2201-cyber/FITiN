
import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext.jsx";
import { toast } from "react-toastify";
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState([]);
  const[wishList,setWishList] = useState([])


  useEffect(() => {
    const fetchUserCart = async () => {
      if (!user || !user.id) return;
      try {
        const res = await axios.get(`http://localhost:3000/users/${user.id}`);
        setCart(res.data.cart || []);
      } catch (error) {
        console.error("Error fetching user cart:", error);
      }
    };
    fetchUserCart();
  }, [user]);


  const syncCartToBackend = async (updatedCart) => {
    if (!user || !user.id) return;
    try {
      await axios.patch(`http://localhost:3000/users/${user.id}`, {
        cart: updatedCart,
      });
    } catch (error) {
      console.error("Error syncing cart:", error);
    }
  };


  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      let updatedCart;
      if (existingItem) {
        updatedCart = prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedCart = [...prevCart, { ...product, quantity: 1 }];
      }
      syncCartToBackend(updatedCart);
      return updatedCart;
    });
    toast.success("Added to cart!");
  };
  
  const removeFromCart = (id) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((item) => item.id !== id);
      syncCartToBackend(updatedCart);
      return updatedCart;
    });
  };


  const increaseQty = (id) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      );
      syncCartToBackend(updatedCart);
      return updatedCart;
    });
  };


  const decreaseQty = (id) => {
    setCart((prevCart) => {
      const updatedCart = prevCart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
            : item
        )
        .filter((item) => item.quantity > 0);
      syncCartToBackend(updatedCart);
      return updatedCart;
      
    });
    toast.success("Quantity Decreased");
  };


  const clearCart = () => {
    setCart([]);
    syncCartToBackend([]);
  };


  const proceedToBuy = async () => {
    try {
      for (let item of cart) {
        const newStock = Math.max(item.stock - item.quantity, 0);
        await axios.patch(`http://localhost:3000/products/${item.id}`, {
          stock: newStock,
        });
      }
      toast.success("Purchase successful ");
      
      clearCart();
    } catch (error) {
      console.error("Error updating stock:", error);
      alert("Failed to process purchase");
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
        proceedToBuy,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};