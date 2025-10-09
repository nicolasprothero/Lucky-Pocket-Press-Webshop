import { getProductByHandle, getProducts } from '@/lib/api';
import { Product } from '@/types';
import { ProductDetails } from '@/components/ProductDetails';
import { ProductCard } from '@/components/ProductCard';
import { notFound } from 'next/navigation';
import './page.css';

interface ProductPageProps {
  params: Promise<{
    handle: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { handle } = await params;
  const product = await getProductByHandle(handle);

  if (!product) {
    notFound();
  }

  // Fetch related products (excluding current product)
  const { products: allProducts } = await getProducts(10); // Get 10 products to have more options
  const relatedProducts = allProducts
    .filter(p => p.id !== product.id) // Exclude current product
    .slice(0, 3); // Take first 3 different products

  return (
    <div className="product-page">
      <div className="product-container">
        <ProductDetails product={product} />
      </div>
      
      {/* Related Products Section */}
      <div className="related-products-section">
        <div className="related-products-container">
          <p className="related-products-title">Related Products</p>
          <div className="related-products-grid">
            {relatedProducts.map((relatedProduct) => (
              <div key={relatedProduct.id} className="related-product-item">
                <ProductCard product={relatedProduct} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}