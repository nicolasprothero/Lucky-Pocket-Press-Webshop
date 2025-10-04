'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import './CartDrawer.css';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, onOpen }) => {
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
        {/* Cart Tab Button - now inside the drawer */}
        <button
          onClick={() => !isOpen && onOpen()}
          className="cart-tab"
          aria-label="Open cart"
        >
          <svg className="cart-tab-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 8.5M7 13v0a2 2 0 002 2h8a2 2 0 002-2v0" />
          </svg>
          {cart.totalItems > 0 && (
            <span className="cart-tab-badge">
              {cart.totalItems}
            </span>
          )}
        </button>
        <div className="cart-drawer-content">
          {/* Header */}
          <div className="cart-header">
            <div className="cart-title-section">
              <span className="cart-title">CART &gt; LUCKY POCKET PRESS</span>
            </div>
            <button
              onClick={onClose}
              className="cart-close-btn"
            >
              CLOSE
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
                    Clear Cart
                  </button>
                </div>

                <div className="cart-items-list">
                  {cart.items.map((item) => (
                    <div key={item.id} className="cart-item">
                      {/* Top div with image and product details */}
                      <div className="cart-item-top">
                        <div className="cart-item-image">
                          {item.image && (
                            <img src={item.image} alt={item.title} />
                          )}
                        </div>
                        <div className="cart-item-info">
                          <div className="cart-item-title">{item.title}</div>
                          <div className="cart-item-price">${item.price.toFixed(2)}</div>
                        </div>
                        <div className="cart-item-remove-container">
                          <button
                            onClick={() => removeItem(item.id)}
                            className="cart-item-remove"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                      
                      {/* Bottom div with quantity controls */}
                      <div className="cart-item-bottom">
                        <div className="cart-item-qty-section">
                          <span className="qty-label">QTY: {item.quantity}</span>
                        </div>
                        <div className="cart-item-controls">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="quantity-btn"
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
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
                {isLoading ? 'CHECKING OUT...' : 'CHECKOUT'}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};