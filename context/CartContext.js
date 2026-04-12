import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const savedCart = localStorage.getItem('luchemCart');
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      setCart(parsedCart);
      updateTotals(parsedCart);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('luchemCart', JSON.stringify(cart));
    updateTotals(cart);
  }, [cart]);

  const updateTotals = (cartItems) => {
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    setCartTotal(total);
    setCartCount(count);
  };

  const addToCart = (product, quantity = 1) => {
    setCart(currentCart => {
      const existingItem = currentCart.find(item => item.id === product.id && item.type === product.type);
      if (existingItem) {
        return currentCart.map(item =>
          item.id === product.id && item.type === product.type
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...currentCart, { 
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        image_url: product.image_url,
        size: product.size,
        category: product.category,
        type: product.type || 'product'
      }];
    });
  };

  const removeFromCart = (productId, type) => {
    setCart(currentCart => currentCart.filter(item => !(item.id === productId && item.type === type)));
  };

  const updateQuantity = (productId, type, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId, type);
      return;
    }
    setCart(currentCart =>
      currentCart.map(item =>
        item.id === productId && item.type === type ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const formatZAR = (amount) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <CartContext.Provider value={{
      cart,
      cartTotal,
      cartCount,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      formatZAR
    }}>
      {children}
    </CartContext.Provider>
  );
};
