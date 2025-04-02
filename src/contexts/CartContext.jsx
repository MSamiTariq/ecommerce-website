import { createContext, useState, useContext, useEffect } from "react";

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    // Initialize cart from localStorage if available
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  // Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);
  
  // Add item to cart
  const addToCart = (item, quantity, selectedSize) => {
    setCartItems((prevItems) => {
      // Check if item with same id and size already exists
      const existingItemIndex = prevItems.findIndex(
        (cartItem) => cartItem.id === item.id && cartItem.selectedSize.name === selectedSize.name
      );

      if (existingItemIndex > -1) {
        // If exists, update quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      } else {
        // If doesn't exist, add new item
        return [...prevItems, { ...item, quantity, selectedSize }];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (itemId, sizeName) => {
    setCartItems((prevItems) => 
      prevItems.filter(
        (item) => !(item.id === itemId && item.selectedSize.name === sizeName)
      )
    );
  };

  // Update item quantity
  const updateQuantity = (itemId, sizeName, newQuantity) => {
    setCartItems((prevItems) => 
      prevItems.map((item) => 
        item.id === itemId && item.selectedSize.name === sizeName
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  // Get cart total
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = typeof item.price === 'string' 
        ? parseFloat(item.price.replace(/[^\d.]/g, ''))
        : item.price;
      return total + price * item.quantity;
    }, 0);
  };

  // Get total number of items in cart
  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
} 