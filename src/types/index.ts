export interface Product {
  id: string;
  title: string;
  description: string;
  handle: string;
  images: {
    edges: Array<{
      node: {
        id: string;
        url: string;
        altText: string | null;
      };
    }>;
  };
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        price: {
          amount: string;
          currencyCode: string;
        };
        compareAtPrice?: {
          amount: string;
          currencyCode: string;
        } | null;
        availableForSale: boolean;
        selectedOptions: Array<{
          name: string;
          value: string;
        }>;
      };
    }>;
  };
  options: Array<{
    id: string;
    name: string;
    values: string[];
  }>;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
}

export interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
  variant: {
    title: string;
    selectedOptions: Array<{
      name: string;
      value: string;
    }>;
  };
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

export interface Collection {
  id: string;
  title: string;
  description: string;
  handle: string;
  image?: {
    url: string;
    altText: string | null;
  };
  products: {
    edges: Array<{
      node: Product;
    }>;
  };
}

export interface Event {
  title: string;
  location: string;
  date: string;
  'end date'?: string;
  link: string;
  'image link': string;
}

export interface Retailer {
  name: string;
  location: string;
  region: string;
  link: string;
}

export interface ArchiveBook {
  title: string;
  info: string;
  year: string;
  image: string;
}

export interface ArchiveEvent {
  title: string;
  info: string;
  year: string;
  image: string;
}

export interface ArchiveMerch {
  title: string;
  info: string;
  year: string;
  image: string;
}

export type ArchiveItem = ArchiveBook | ArchiveEvent | ArchiveMerch;

export type ArchiveCategory = 'books' | 'events' | 'merch';