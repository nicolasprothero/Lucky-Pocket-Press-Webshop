'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { formatPrice } from '@/lib/api';
import { useCart } from '@/context/CartContext';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  
  const firstImage = product.images.edges[0]?.node;
  const minPrice = product.priceRange.minVariantPrice;
  const firstVariant = product.variants.edges[0]?.node;

  const handleAddToCart = async () => {
    if (!firstVariant) return;
    
    setIsAdding(true);
    
    try {
      addItem({
        id: `${product.id}-${firstVariant.id}`,
        productId: product.id,
        variantId: firstVariant.id,
        title: product.title,
        price: parseFloat(firstVariant.price.amount),
        quantity: 1,
        image: firstImage?.url,
        variant: {
          title: firstVariant.title,
          selectedOptions: firstVariant.selectedOptions || []
        }
      });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="product-card">
      {/* Clickable Image Area */}
      <Link href={`/product/${product.handle}`} className="product-image-link">
        <div className="product-image-container">
          {firstImage ? (
            <Image
              src={firstImage.url}
              alt={firstImage.altText || product.title}
              fill
              className="product-image"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="product-no-image">
              No Image
            </div>
          )}
        </div>
      </Link>
      
      <div className="product-details">
        {/* Clickable Title */}
        <Link href={`/product/${product.handle}`} className="product-title-link">
          <h3 className="product-title">
            {product.title}
          </h3>
        </Link>
        
        <p className="product-description">
          {product.description}
        </p>
        
        <div className="product-info-row">
          <span className="product-price">
            {formatPrice(minPrice.amount, minPrice.currencyCode)}
          </span>
          <span className="product-variants">
            {product.variants.edges.length} variant{product.variants.edges.length !== 1 ? 's' : ''}
          </span>
        </div>
        
        {/* Add to Cart Button - Independent of Link */}
        <button
          onClick={handleAddToCart}
          disabled={isAdding || !firstVariant || !firstVariant.availableForSale}
          className={`add-to-cart-btn ${
            isAdding 
              ? 'add-to-cart-btn-adding' 
              : !firstVariant || !firstVariant.availableForSale 
                ? 'add-to-cart-btn-disabled' 
                : 'add-to-cart-btn-available'
          }`}
        >
          {isAdding ? 'Adding...' : firstVariant?.availableForSale ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
};