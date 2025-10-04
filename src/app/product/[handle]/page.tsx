import { getProductByHandle } from '@/lib/api';
import { Product } from '@/types';
import { ProductDetails } from '@/components/ProductDetails';
import { notFound } from 'next/navigation';
import './page.css';

interface ProductPageProps {
  params: {
    handle: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductByHandle(params.handle);

  if (!product) {
    notFound();
  }

  return (
    <div className="product-page">
      <div className="product-container">
        <ProductDetails product={product} />
      </div>
    </div>
  );
}