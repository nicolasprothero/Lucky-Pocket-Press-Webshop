'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import './CartSummary.css';

export const CartSummary: React.FC = () => {
  const { cart, removeItem, updateQuantity, clearCart, checkout, isLoading } = useCart();
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const handleCheckout = async () => {
    try {
      setCheckoutError(null);
      await checkout();
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : 'Failed to create checkout');
    }
  };

  if (cart.totalItems === 0) {
    return (
      <div className="cart-empty">
        <h2 className="cart-empty-title">Cart Summary</h2>
        <p className="cart-empty-text">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="cart-summary">
      <div className="cart-summary-header">
        <h2 className="cart-summary-title">Cart Summary</h2>
        <button
          onClick={clearCart}
          className="clear-cart-btn"
        >
          Clear Cart
        </button>
      </div>
      
      <div className="cart-items">
        {cart.items.map((item) => (
          <div key={item.id} className="cart-item">
            <div className="item-details">
              <h3 className="item-title">{item.title}</h3>
              {item.variant.title !== 'Default' && (
                <p className="item-variant">{item.variant.title}</p>
              )}
              <p className="item-price">${item.price.toFixed(2)} each</p>
            </div>
            
            <div className="item-controls">
              <div className="quantity-controls">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="quantity-btn"
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <span className="quantity-display">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="quantity-btn"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="remove-btn"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="cart-footer">
        <div className="total-row">
          <span>Total: </span>
          <span>${cart.totalPrice.toFixed(2)}</span>
        </div>
        <div className="items-count">
          {cart.totalItems} item{cart.totalItems !== 1 ? 's' : ''}
        </div>
        
        {checkoutError && (
          <div className="checkout-error">
            <p className="checkout-error-text">{checkoutError}</p>
          </div>
        )}
        
        <button
          onClick={handleCheckout}
          disabled={isLoading || cart.totalItems === 0}
          className="checkout-btn"
        >
          {isLoading ? 'Creating checkout...' : 'Checkout with Shopify'}
        </button>
      </div>
    </div>
  );
};