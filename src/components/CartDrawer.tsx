'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import './CartDrawer.css';
import Image from 'next/image';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, onOpen }) => {
  const { cart, removeItem, updateQuantity, clearCart, checkout, isLoading } = useCart();
  const [checkoutError, setCheckoutError] = React.useState<string | null>(null);
  const [hasMounted, setHasMounted] = React.useState(false);

  React.useEffect(() => {
    setHasMounted(true);
  }, []);



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
      <div
        className={`cart-backdrop ${isOpen ? 'cart-backdrop-visible' : ''}`}
        onClick={onClose}
      />

      <div
        className={`cart-drawer ${isOpen ? 'cart-drawer-open' : 'cart-drawer-closed'}`}
      >
        <button
          onClick={() => !isOpen && onOpen()}
          className="cart-tab"
          aria-label="Open cart"
        >
          <Image src="/svg/cart.svg" alt="Cart" className="cart-tab-icon" width={32} height={32} />
          {hasMounted && cart.totalItems > 0 && (
            <span className="cart-tab-badge">
              {cart.totalItems}
            </span>
          )}
        </button>
        <div className="cart-drawer-content">
          <div className="cart-header">
            <div className="cart-title-section">
              <span className="cart-title">YOUR SHOPPING CART</span>
            </div>
            <button
              onClick={onClose}
              className="cart-close-btn"
            >
              CLOSE
            </button>
          </div>

          <div className="cart-content">
            {cart.totalItems === 0 ? (
              <div className="cart-empty">
                <h3 className="cart-empty-title">Your cart is empty</h3>
                <p className="cart-empty-text">Check out our products in the shop!</p>
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
                      <div className="cart-item-top">
                        <div className="cart-item-image">
                          {item.image && (
                            <Image src={item.image} alt={item.title} width={64} height={64} />
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