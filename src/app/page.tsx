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
      HOME
    </div>
  );
}