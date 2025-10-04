'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import './CartDrawer.css';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { cart, removeItem, updateQuantity, clearCart, checkout, isLoading } = useCart();
  const [checkoutError, setCheckoutError] = React.useState<string | null>(null);

  const handleCheckout = async () => {
    try {
      setCheckoutError(null);
      await checkout();
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : 'Failed to create checkout');
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`cart-backdrop ${isOpen ? 'cart-backdrop-visible' : ''}`}
        onClick={onClose}
      />

      {/* Cart Drawer */}
      <div
        className={`cart-drawer ${isOpen ? 'cart-drawer-open' : 'cart-drawer-closed'}`}
      >
        <div className="cart-drawer-content">
          {/* Header */}
          <div className="cart-header">
            <div className="cart-title-section">
              <span className="cart-title">🛒 Cart</span>
              <span className="cart-count-badge">
                {cart.totalItems}
              </span>
            </div>
            <button
              onClick={onClose}
              className="cart-close-btn"
            >
              ×
            </button>
          </div>

          {/* Cart Content */}
          <div className="cart-content">
            {cart.totalItems === 0 ? (
              <div className="cart-empty">
                <div className="cart-empty-icon">🛒</div>
                <h3 className="cart-empty-title">Your cart is empty</h3>
                <p className="cart-empty-text">Add some products to get started!</p>
              </div>
            ) : (
              <div className="cart-items-container">
                <div className="cart-items-header">
                  <span className="cart-items-count">
                    {cart.totalItems} item{cart.totalItems !== 1 ? 's' : ''}
                  </span>
                  <button
                    onClick={clearCart}
                    className="cart-clear-btn"
                  >
                    🗑️ Clear all
                  </button>
                </div>

                <div className="cart-items-list">
                  {cart.items.map((item) => (
                    <div key={item.id} className="cart-item">
                      <div className="cart-item-details">
                        <h3 className="cart-item-title">{item.title}</h3>
                        {item.variant.title !== 'Default' && (
                          <p className="cart-item-variant">{item.variant.title}</p>
                        )}
                        <p className="cart-item-price">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>
                      
                      <div className="cart-item-controls">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="cart-item-remove"
                        >
                          ×
                        </button>
                        
                        <div className="quantity-controls">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="quantity-btn"
                            disabled={item.quantity <= 1}
                          >
                            −
                          </button>
                          <span className="quantity-display">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="quantity-btn"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          {cart.totalItems > 0 && (
            <div className="cart-footer">
              <div className="cart-total">
                <span className="cart-total-label">Total:</span>
                <span className="cart-total-amount">
                  ${cart.totalPrice.toFixed(2)}
                </span>
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
          )}
        </div>
      </div>
    </>
  );
};