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
    // Add homepage class to body
    document.body.classList.add('homepage');
    
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
    
    // Cleanup function to remove homepage class
    return () => {
      document.body.classList.remove('homepage');
    };
  }, []);

  return (
    <div className="home-page">
    </div>
  );
}