'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Cart, CartItem } from '@/types';
import { createCheckout } from '@/lib/api';

interface CartState {
    cart: Cart;
    isLoading: boolean;
}

type CartAction =
    | { type: 'ADD_ITEM'; payload: CartItem }
    | { type: 'REMOVE_ITEM'; payload: string }
    | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
    | { type: 'CLEAR_CART' }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'LOAD_CART'; payload: Cart };

interface CartContextType extends CartState {
    addItem: (item: CartItem) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    checkout: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.cart.items.findIndex(
        item => item.id === action.payload.id
      );

      let updatedItems;
      if (existingItemIndex >= 0) {
        updatedItems = state.cart.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        updatedItems = [...state.cart.items, action.payload];
      }

      const totalItems = updatedItems.reduce((total, item) => total + item.quantity, 0);
      const totalPrice = updatedItems.reduce((total, item) => total + (item.price * item.quantity), 0);

      return {
        ...state,
        cart: {
          items: updatedItems,
          totalItems,
          totalPrice,
        },
      };
    }
    case 'REMOVE_ITEM': {
      const updatedItems = state.cart.items.filter(item => item.id !== action.payload);
      const totalItems = updatedItems.reduce((total, item) => total + item.quantity, 0);
      const totalPrice = updatedItems.reduce((total, item) => total + (item.price * item.quantity), 0);

      return {
        ...state,
        cart: {
          items: updatedItems,
          totalItems,
          totalPrice,
        },
      };
    }
    case 'UPDATE_QUANTITY': {
      const updatedItems = state.cart.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      ).filter(item => item.quantity > 0);

      const totalItems = updatedItems.reduce((total, item) => total + item.quantity, 0);
      const totalPrice = updatedItems.reduce((total, item) => total + (item.price * item.quantity), 0);

      return {
        ...state,
        cart: {
          items: updatedItems,
          totalItems,
          totalPrice,
        },
      };
    }
    case 'CLEAR_CART':
      return {
        ...state,
        cart: {
          items: [],
          totalItems: 0,
          totalPrice: 0,
        },
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'LOAD_CART':
      return {
        ...state,
        cart: action.payload,
      };
    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    cart: {
      items: [],
      totalItems: 0,
      totalPrice: 0,
    },
    isLoading: false,
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: parsedCart });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.cart));
  }, [state.cart]);

  const addItem = (item: CartItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const checkout = async () => {
    if (state.cart.items.length === 0) {
      throw new Error('Cart is empty');
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Convert cart items to Shopify line items format
      const lineItems = state.cart.items.map(item => ({
        variantId: item.variantId,
        quantity: item.quantity
      }));

      // Create checkout and get the URL
      const checkoutUrl = await createCheckout(lineItems);
      
      // Redirect to Shopify checkout
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Checkout error:', error);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  return (
    <CartContext.Provider
      value={{
        ...state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        checkout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};