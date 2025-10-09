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
  const [isAdding, setIsAdding] = useState(false);

  const selectedVariant = product.variants.edges[selectedVariantIndex]?.node;
  const images = product.images.edges;

  // Extract author from description if it starts with {{}}
  const extractAuthorFromDescription = (description: string) => {
    const authorMatch = description.match(/^\{\{(.+?)\}\}/);
    if (authorMatch) {
      const author = authorMatch[1];
      const cleanDescription = description.replace(/^\{\{.+?\}\}\s*/, '');
      return { author, cleanDescription };
    }
    return { author: null, cleanDescription: description };
  };

  const { author, cleanDescription } = extractAuthorFromDescription(product.description);

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
        quantity: 1,
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
    <div className="details-container">
      {/* Images */}
      <div className="details-images">
        {/* Main Image */}
        <div className="details-main-image-container">
          {images[selectedImageIndex] ? (
            <Image
              src={images[selectedImageIndex].node.url}
              alt={images[selectedImageIndex].node.altText || product.title}
              width={600}
              height={600}
              className="details-main-image"
            />
          ) : (
            <div className="details-no-image">
              No Image
            </div>
          )}
        </div>

        {/* Thumbnail Images */}
        {images.length > 1 && (
          <div className="details-thumbnails-container">
            <div className="details-thumbnails-scroll">
              {images.map((image, index) => (
                <button
                  key={image.node.id}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`details-thumbnail-btn ${
                    selectedImageIndex === index ? 'details-thumbnail-selected' : 'details-thumbnail-unselected'
                  }`}
                >
                  <Image
                    src={image.node.url}
                    alt={image.node.altText || `${product.title} ${index + 1}`}
                    width={150}
                    height={150}
                    className="details-thumbnail-image"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="details-info">
        <div className="details-header">
          <h1 className="details-title">{product.title}</h1>
          <div className="details-price">
            {selectedVariant && formatPrice(selectedVariant.price.amount, selectedVariant.price.currencyCode)}
          </div>
          {author && (
            <div className="details-author">by {author}</div>
          )}
          <div className="details-description">
            <p>{cleanDescription}</p>
          </div>
        </div>

        {/* Variants */}
        {product.variants.edges.length > 1 && (
          <div className="details-variants-section">
            <h3 className="details-section-title">Options</h3>
            <div className="details-variants-grid">
              {product.variants.edges.map((variant, index) => (
                <button
                  key={variant.node.id}
                  onClick={() => setSelectedVariantIndex(index)}
                  disabled={!variant.node.availableForSale}
                  className={`details-variant-btn ${
                    selectedVariantIndex === index ? 'details-variant-selected' : 'details-variant-unselected'
                  } ${!variant.node.availableForSale ? 'details-variant-disabled' : ''}`}
                >
                  <div className={`details-variant-title ${
                    selectedVariantIndex === index ? 'details-variant-title-selected' : 'details-variant-title-unselected'
                  }`}>
                    {variant.node.title}
                  </div>
                  <div className={`details-variant-price ${
                    selectedVariantIndex === index ? 'details-variant-price-selected' : 'details-variant-price-unselected'
                  }`}>
                    {formatPrice(variant.node.price.amount, variant.node.price.currencyCode)}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          disabled={isAdding || !selectedVariant || !selectedVariant.availableForSale}
          className={`details-add-to-cart-btn ${
            isAdding || !selectedVariant || !selectedVariant.availableForSale 
              ? 'details-add-to-cart-disabled' 
              : 'details-add-to-cart-available'
          }`}
        >
          {isAdding
            ? 'Adding...'
            : selectedVariant?.availableForSale
            ? 'Add to Cart'
            : 'Out of Stock'
          }
        </button>
      </div>
    </div>
  );
};