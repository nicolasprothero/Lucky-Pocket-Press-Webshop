'use client';

import React, { useState, useRef, useEffect } from 'react';
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
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [shouldMarquee, setShouldMarquee] = useState(false);
  
  const firstImage = product.images.edges[0]?.node;
  const minPrice = product.priceRange.minVariantPrice;
  const firstVariant = product.variants.edges[0]?.node;

  // Check if title overflows and set up marquee
  useEffect(() => {
    const checkOverflow = () => {
      const titleElement = titleRef.current;
      const containerElement = titleElement?.parentElement; // Get the container
      if (!titleElement || !containerElement) return;

      // Reset any existing animation
      setShouldMarquee(false);
      titleElement.style.animationDuration = '';

      // Check if text is overflowing the container
      const isOverflowing = titleElement.scrollWidth > containerElement.clientWidth;
      
      if (isOverflowing) {
        // Calculate animation duration based on overflow amount
        const overflowAmount = titleElement.scrollWidth - containerElement.clientWidth;
        const duration = Math.max(4, Math.min(8, overflowAmount / 20)); // Between 4-8 seconds
        
        // Set custom CSS property for the scroll distance (just the overflow amount, no extra padding)
        titleElement.style.setProperty('--scroll-distance', `-${overflowAmount}px`);
        titleElement.style.animationDuration = `${duration}s`;
        
        // Wait 1 second before starting marquee
        setTimeout(() => {
          setShouldMarquee(true);
        }, 1000);
      }
    };

    checkOverflow();
  }, [product.title]);

  // Parse description to extract author and content
  const parseDescription = (description: string) => {
    const authorMatch = description.match(/^\{\{\s*([^}]+)\s*\}\}\s*/);
    
    if (authorMatch) {
      const author = authorMatch[1].trim();
      const content = description.replace(authorMatch[0], '').trim();
      return { author, description: content };
    }
    
    return { author: null, description };
  };

  const { author, description } = parseDescription(product.description);

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
      {/* Big Image */}
      <div className="card-image-container">
        {firstImage ? (
          <Image
            src={firstImage.url}
            alt={firstImage.altText || product.title}
            fill
            className="card-image"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="card-no-image">
            No Image
          </div>
        )}
      </div>
      
      <div className="card-details">
        {/* Title */}
        <div>
          <div className="card-title-container">
            <h3 
              ref={titleRef} 
              className={`card-title ${shouldMarquee ? 'card-title-marquee' : ''}`}
            >
              {product.title}
            </h3>
          </div>
          
          <div className="card-info-row">
            <div className="card-text-content">
              {author ? (
                <>
                  <p className="card-author">
                    {author}
                  </p>
                </>
              ) : (
                <span className="card-price-no-author">
                  {formatPrice(minPrice.amount, minPrice.currencyCode)}
                </span>
              )}
            </div>
            {author && (
              <span className="card-price">
                {formatPrice(minPrice.amount, minPrice.currencyCode)}
              </span>
            )}
          </div>
        </div>
        
        
        {/* Two Buttons Side by Side */}
        <div className="card-button-row">
          <Link href={`/product/${product.handle}`} className="card-view-btn">
            View Product
          </Link>
          <button
            onClick={handleAddToCart}
            disabled={isAdding || !firstVariant || !firstVariant.availableForSale}
            className={`card-add-btn ${
              isAdding 
                ? 'card-add-btn-adding' 
                : !firstVariant || !firstVariant.availableForSale 
                  ? 'card-add-btn-disabled' 
                  : 'card-add-btn-available'
            }`}
          >
            {isAdding ? 'Adding...' : firstVariant?.availableForSale ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  );
};