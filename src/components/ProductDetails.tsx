'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/types';
import { formatPrice } from '@/lib/api';
import { useCart } from '@/context/CartContext';
import './ProductDetails.css';

interface ProductDetailsProps {
  product: Product;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const { addItem } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const selectedVariant = product.variants.edges[selectedVariantIndex]?.node;
  const images = product.images.edges;

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    
    setIsAdding(true);
    
    try {
      addItem({
        id: `${product.id}-${selectedVariant.id}`,
        productId: product.id,
        variantId: selectedVariant.id,
        title: product.title,
        price: parseFloat(selectedVariant.price.amount),
        quantity: quantity,
        image: images[selectedImageIndex]?.node.url,
        variant: {
          title: selectedVariant.title,
          selectedOptions: selectedVariant.selectedOptions || []
        }
      });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="product-details">
      {/* Images */}
      <div className="product-images">
        {/* Main Image */}
        <div className="main-image-container">
          {images[selectedImageIndex] ? (
            <Image
              src={images[selectedImageIndex].node.url}
              alt={images[selectedImageIndex].node.altText || product.title}
              width={600}
              height={600}
              className="main-image"
            />
          ) : (
            <div className="no-image">
              No Image
            </div>
          )}
        </div>

        {/* Thumbnail Images */}
        {images.length > 1 && (
          <div className="thumbnails-grid">
            {images.map((image, index) => (
              <button
                key={image.node.id}
                onClick={() => setSelectedImageIndex(index)}
                className={`thumbnail-btn ${
                  selectedImageIndex === index ? 'thumbnail-selected' : 'thumbnail-unselected'
                }`}
              >
                <Image
                  src={image.node.url}
                  alt={image.node.altText || `${product.title} ${index + 1}`}
                  width={150}
                  height={150}
                  className="thumbnail-image"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="product-info">
        <div className="product-header">
          <h1 className="product-title">{product.title}</h1>
          <div className="product-price">
            {selectedVariant && formatPrice(selectedVariant.price.amount, selectedVariant.price.currencyCode)}
          </div>
          <div className="product-description">
            <p>{product.description}</p>
          </div>
        </div>

        {/* Variants */}
        {product.variants.edges.length > 1 && (
          <div className="variants-section">
            <h3 className="section-title">Options</h3>
            <div className="variants-grid">
              {product.variants.edges.map((variant, index) => (
                <button
                  key={variant.node.id}
                  onClick={() => setSelectedVariantIndex(index)}
                  disabled={!variant.node.availableForSale}
                  className={`variant-btn ${
                    selectedVariantIndex === index ? 'variant-selected' : 'variant-unselected'
                  } ${!variant.node.availableForSale ? 'variant-disabled' : ''}`}
                >
                  <div className={`variant-title ${
                    selectedVariantIndex === index ? 'variant-title-selected' : 'variant-title-unselected'
                  }`}>
                    {variant.node.title}
                  </div>
                  <div className={`variant-price ${
                    selectedVariantIndex === index ? 'variant-price-selected' : 'variant-price-unselected'
                  }`}>
                    {formatPrice(variant.node.price.amount, variant.node.price.currencyCode)}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity */}
        <div className="quantity-section">
          <h3 className="section-title">Quantity</h3>
          <div className="quantity-controls">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="quantity-btn"
            >
              −
            </button>
            <span className="quantity-display">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="quantity-btn"
            >
              +
            </button>
          </div>
        </div>

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          disabled={isAdding || !selectedVariant || !selectedVariant.availableForSale}
          className={`add-to-cart-btn ${
            isAdding || !selectedVariant || !selectedVariant.availableForSale 
              ? 'add-to-cart-disabled' 
              : 'add-to-cart-available'
          }`}
        >
          {isAdding
            ? 'Adding...'
            : selectedVariant?.availableForSale
            ? 'Add to Cart'
            : 'Out of Stock'
          }
        </button>

        {/* Product Details */}
        <div className="details-section">
          <h3 className="section-title">Product Details</h3>
          <div className="details-list">
            {selectedVariant?.selectedOptions?.map((option) => (
              <div key={option.name} className="detail-item">
                <span className="detail-label">{option.name}:</span>
                <span className="detail-value">{option.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};