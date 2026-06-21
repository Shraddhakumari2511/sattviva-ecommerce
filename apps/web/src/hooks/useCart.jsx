import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { formatCurrency } from '@/api/EcommerceApi';

const CartContext = createContext();

const CART_STORAGE_KEY = 'e-commerce-cart';

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);

      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      return [];
    }
  });

  useEffect(() => {
  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) return;

      const response = await fetch(
        "http://localhost:5000/api/cart",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!data.success || !data.cart) return;

      const formattedItems = data.cart.items.map(item => ({
        product: {
          ...item.product,
          image: item.product.images?.[0] || "/images/logo.png",
        },
        variant: {
          id: item.product._id,
          title: item.product.category,
          price_formatted: `₹${item.product.price}`,
          inventory_quantity: item.product.stock,
        },
        quantity: item.quantity,
      }));

      setCartItems(formattedItems);

    } catch (error) {
      console.error("Cart fetch error:", error);
    }
  };

  fetchCart();
}, []);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = useCallback((product, variant, quantity, availableQuantity) => {
    return new Promise((resolve, reject) => {
      if (variant.manage_inventory) {
        const existingItem = cartItems.find(item => item.variant.id === variant.id);
        const currentCartQuantity = existingItem ? existingItem.quantity : 0;
        if ((currentCartQuantity + quantity) > availableQuantity) {
          const error = new Error(`Not enough stock for ${product.title} (${variant.title}). Only ${availableQuantity} left.`);
          reject(error);
          return;
        }
      }

      setCartItems(prevItems => {
        const existingItem = prevItems.find(item => item.variant.id === variant.id);
        if (existingItem) {
          return prevItems.map(item =>
            item.variant.id === variant.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        return [...prevItems, { product, variant, quantity }];
      });
      resolve();
    });
  }, [cartItems]);

  const removeFromCart = useCallback(async (variantId) => {
  try {
    const token = localStorage.getItem("token");

    await fetch(
      `http://localhost:5000/api/cart/remove/${variantId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setCartItems(prevItems =>
      prevItems.filter(
        item => item.variant.id !== variantId
      )
    );
  } catch (error) {
    console.error(error);
  }
}, []);

  const updateQuantity = useCallback(
  async (variantId, quantity) => {
    try {
      const token = localStorage.getItem("token");

      await fetch(
        "http://localhost:5000/api/cart/update",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            productId: variantId,
            quantity,
          }),
        }
      );

      setCartItems(prevItems =>
        prevItems.map(item =>
          item.variant.id === variantId
            ? { ...item, quantity }
            : item
        )
      );
    } catch (error) {
      console.error(error);
    }
  },
  []
);

  const clearCart = useCallback(() => {
  setCartItems([]);

  localStorage.removeItem(
    CART_STORAGE_KEY
  );
}, []);

  const getCartTotal = useCallback(() => {
  const total = cartItems.reduce(
    (sum, item) =>
      sum +
      item.product.price * item.quantity,
    0
  );

  return `₹${total}`;
}, [cartItems]);

  const value = useMemo(() => ({
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
  }), [cartItems, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
};