'use client';

import { useState, useEffect } from 'react';
import { getProducts } from '@/lib/api';
import { Product } from '@/types';
import { ProductCard } from '@/components/ProductCard';
import Link from 'next/link';
import './page.css';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        const result = await getProducts(4); // Get 4 featured products
        setFeaturedProducts(result.products);
      } catch (err) {
        console.error('Error loading featured products:', err);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedProducts();
  }, []);

  return (
    <div className="home-page">
      <div className="home-container">
        {/* Hero Section */}
        <section className="hero-section">
          <h1 className="hero-title">Welcome to LLP Webshop</h1>
          <p className="hero-subtitle">Discover our amazing collection of products</p>
          <Link href="/shop" className="hero-cta">
            Shop Now
          </Link>
        </section>

        {/* Featured Products Section */}
        <section className="featured-section">
          <div className="featured-header">
            <h2 className="featured-title">Featured Products</h2>
            <p className="featured-subtitle">Check out our most popular items</p>
          </div>

          {loading ? (
            <div className="loading-state">
              <p className="loading-text">Loading featured products...</p>
            </div>
          ) : featuredProducts.length > 0 ? (
            <>
              <div className="featured-products-grid">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <div className="view-all-container">
                <Link href="/shop" className="view-all-link">
                  View All Products →
                </Link>
              </div>
            </>
          ) : (
            <div className="loading-state">
              <p className="loading-text">No featured products available</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}