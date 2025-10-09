
'use client';

import { useEffect, useState } from 'react';
import { getProducts } from '@/lib/api';
import { ProductCard } from '@/components/ProductCard';
import { Product } from '@/types';
import './page.css';

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const { products } = await getProducts(20);
        setProducts(products);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) {
    return (
      <div className="shop-page">
        <div className="shop-container">
          <div className="shop-header">
            <h1 className="shop-title">SHOP</h1>
          </div>
          <div className="loading-state">
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="shop-page">
      <div className="shop-container">
        <div className="shop-header">
          <h1 className="shop-title">SHOP</h1>
        </div>

        {products.length > 0 ? (
          <div className="products-grid">
            {products.map((product, index) => (
              <div
                key={product.id}
                className="product-card-wrapper"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p className="empty-state-text">No products are available at this time.<br/>Please check back later!</p>
          </div>
        )}
      </div>
    </div>
  );
}