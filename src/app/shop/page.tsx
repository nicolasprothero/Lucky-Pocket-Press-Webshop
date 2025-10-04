import { getProducts } from '@/lib/api';
import { Product } from '@/types';
import { ProductCard } from '@/components/ProductCard';
import './page.css';

export default async function ShopPage() {
  const { products } = await getProducts(20);

  return (
    <div className="shop-page">
      <div className="shop-container">
        {/* Header */}
        <div className="shop-header">
          <h1 className="shop-title">Shop All Products</h1>
          <p className="shop-subtitle">Discover our full collection</p>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p className="empty-state-text">No products available</p>
          </div>
        )}
      </div>
    </div>
  );
}