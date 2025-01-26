import React, { createContext, useContext, useState } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  restaurantId: string;
  restaurantName: string;
  image: string;
  specialInstructions?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  updateInstructions: (itemId: string, instructions: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalAmount: number;
  currentRestaurant: { id: string; name: string } | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [currentRestaurant, setCurrentRestaurant] = useState<{ id: string; name: string } | null>(null);

  const addItem = (newItem: Omit<CartItem, 'quantity'>) => {
    // Check if adding from a different restaurant
    if (items.length > 0 && items[0].restaurantId !== newItem.restaurantId) {
      if (window.confirm('Adding items from a different restaurant will clear your current cart. Continue?')) {
        setItems([{ ...newItem, quantity: 1 }]);
        setCurrentRestaurant({ id: newItem.restaurantId, name: newItem.restaurantName });
      }
      return;
    }

    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === newItem.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      if (prevItems.length === 0) {
        setCurrentRestaurant({ id: newItem.restaurantId, name: newItem.restaurantName });
      }
      return [...prevItems, { ...newItem, quantity: 1 }];
    });
  };

  const removeItem = (itemId: string) => {
    setItems(prevItems => {
      const newItems = prevItems.filter(item => item.id !== itemId);
      if (newItems.length === 0) {
        setCurrentRestaurant(null);
      }
      return newItems;
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity === 0) {
      removeItem(itemId);
      return;
    }
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const updateInstructions = (itemId: string, instructions: string) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, specialInstructions: instructions } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setCurrentRestaurant(null);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        updateInstructions,
        clearCart,
        totalItems,
        totalAmount,
        currentRestaurant,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 