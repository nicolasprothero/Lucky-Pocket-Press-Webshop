'use client';

import React, { useState, useEffect } from 'react';
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
  const [selectedOptions, setSelectedOptions] = useState<{ [optionName: string]: string }>({});
  const [isAdding, setIsAdding] = useState(false);

  const optionNames = product.options?.map(opt => opt.name) || [];

  const selectedVariant = product.variants.edges.find(variantEdge => {
    return optionNames.every(optionName => {
      const selected = selectedOptions[optionName];
      return variantEdge.node.selectedOptions.some(
        (opt: { name: string; value: string }) => opt.name === optionName && opt.value === selected
      );
    });
  })?.node;
  useEffect(() => {
    if (product.options) {
      const defaults: { [optionName: string]: string } = {};
      product.options.forEach(option => {
        defaults[option.name] = option.values[0];
      });
      setSelectedOptions(defaults);
    }
  }, [product.options]);

  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionName]: value,
    }));
  };
  const images = product.images.edges;

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

  // Split description into paragraphs based on {{New Line}} markers
  const paragraphs = cleanDescription.split('{{New Line}}').filter(p => p.trim());
  
  // Debug logs
  console.log('Original description:', product.description);
  console.log('Clean description:', cleanDescription);
  console.log('Contains {{New Line}}:', cleanDescription.includes('{{New Line}}'));
  console.log('Paragraphs after split:', paragraphs);

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
      <div className="details-images">
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

        {images.length > 1 && (
          <div className="details-thumbnails-container">
            <div className="details-thumbnails-scroll">
              {images.map((image, index) => (
                <button
                  key={image.node.id}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`details-thumbnail-btn ${selectedImageIndex === index ? 'details-thumbnail-selected' : 'details-thumbnail-unselected'
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
            {paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph.trim()}</p>
            ))}
          </div>
        </div>

        {product.options && product.options.length > 0 && product.variants.edges.length > 1 && (
          <div className="details-variants-section">
            {product.options.map(option => (
              <div key={option.name} className="details-option-group">
                <div className="details-option-label">{option.name}</div>
                <div className="details-option-values">
                  {option.values.map(value => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleOptionChange(option.name, value)}
                      className={`details-variant-btn ${selectedOptions[option.name] === value
                          ? 'details-variant-selected'
                          : 'details-variant-unselected'
                        }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={handleAddToCart}
          disabled={isAdding || !selectedVariant || !selectedVariant.availableForSale}
          className={`details-add-to-cart-btn ${isAdding || !selectedVariant || !selectedVariant.availableForSale
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