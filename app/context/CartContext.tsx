'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  name: string;
  brand?: string;
  image?: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: any, quantity: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('abaar_cart');
    if (savedCart) setItems(JSON.parse(savedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem('abaar_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: any, quantity: number) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i);
      }
      return [...prev, { id: product.id, name: product.name, brand: product.brand, image: product.image, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => setItems(prev => prev.filter(i => i.id !== id));
  const updateQuantity = (id: string, q: number) => {
    if (q < 1) return;
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity: q } : i));
  };
  const clearCart = () => setItems([]);
  const getTotalItems = () => items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, isCartOpen, setIsCartOpen, addToCart, removeFromCart, updateQuantity, clearCart, getTotalItems }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};