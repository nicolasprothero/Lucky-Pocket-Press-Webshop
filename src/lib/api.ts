import { Product, Collection } from '@/types';

const SHOPIFY_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const SHOPIFY_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

async function shopifyFetch(query: string, variables: Record<string, unknown> = {}) {
  if (!SHOPIFY_DOMAIN || !SHOPIFY_TOKEN) {
    throw new Error('Shopify configuration missing');
  }

  const response = await fetch(`https://${SHOPIFY_DOMAIN}/api/2024-10/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Shopify API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  
  if (data.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
  }

  return data;
}

export async function getProducts(first: number = 20, after?: string): Promise<{
  products: Product[];
  hasNextPage: boolean;
  endCursor: string | null;
}> {
  const query = `
    query GetProducts($first: Int!, $after: String) {
      products(first: $first, after: $after) {
        edges {
          node {
            id
            title
            handle
            description
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 3) {
              edges {
                node {
                  id
                  url
                  altText
                }
              }
            }
            variants(first: 5) {
              edges {
                node {
                  id
                  title
                  availableForSale
                  price {
                    amount
                    currencyCode
                  }
                  selectedOptions {
                    name
                    value
                  }
                }
              }
            }
            options {
              id
              name
              values
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `;

  try {
    const data = await shopifyFetch(query, { first, after });
    return {
      products: data.data?.products?.edges?.map((edge: { node: Product }) => edge.node) || [],
      hasNextPage: data.data?.products?.pageInfo?.hasNextPage || false,
      endCursor: data.data?.products?.pageInfo?.endCursor || null,
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return {
      products: [],
      hasNextPage: false,
      endCursor: null,
    };
  }
}

export async function getProductByHandle(handle: string): Promise<Product | null> {
  const query = `
    query GetProductByHandle($handle: String!) {
      productByHandle(handle: $handle) {
        id
        title
        description
        handle
        images(first: 10) {
          edges {
            node {
              id
              url
              altText
            }
          }
        }
        variants(first: 20) {
          edges {
            node {
              id
              title
              price {
                amount
                currencyCode
              }
              compareAtPrice {
                amount
                currencyCode
              }
              availableForSale
              selectedOptions {
                name
                value
              }
            }
          }
        }
        options {
          id
          name
          values
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
          maxVariantPrice {
            amount
            currencyCode
          }
        }
      }
    }
  `;

  try {
    const data = await shopifyFetch(query, { handle });
    return data.data?.productByHandle || null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export async function getCollections(first: number = 10): Promise<Collection[]> {
  const query = `
    query GetCollections($first: Int!) {
      collections(first: $first) {
        edges {
          node {
            id
            title
            description
            handle
            image {
              url
              altText
            }
            products(first: 3) {
              edges {
                node {
                  id
                  title
                  handle
                  images(first: 1) {
                    edges {
                      node {
                        url
                        altText
                      }
                    }
                  }
                  priceRange {
                    minVariantPrice {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const data = await shopifyFetch(query, { first });
    return data.data?.collections?.edges?.map((edge: { node: Collection }) => edge.node) || [];
  } catch (error) {
    console.error('Error fetching collections:', error);
    return [];
  }
}

export async function getCollectionByHandle(
  handle: string,
  first: number = 20,
  after?: string
): Promise<{
  collection: Collection | null;
  hasNextPage: boolean;
  endCursor: string | null;
}> {
  const query = `
    query GetCollectionByHandle($handle: String!, $first: Int!, $after: String) {
      collectionByHandle(handle: $handle) {
        id
        title
        description
        handle
        image {
          url
          altText
        }
        products(first: $first, after: $after) {
          edges {
            node {
              id
              title
              description
              handle
              images(first: 3) {
                edges {
                  node {
                    id
                    url
                    altText
                  }
                }
              }
              variants(first: 5) {
                edges {
                  node {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    compareAtPrice {
                      amount
                      currencyCode
                    }
                    availableForSale
                    selectedOptions {
                      name
                      value
                    }
                  }
                }
              }
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
                maxVariantPrice {
                  amount
                  currencyCode
                }
              }
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    }
  `;

  try {
    const data = await shopifyFetch(query, { handle, first, after });
    const collection = data.data?.collectionByHandle;

    return {
      collection,
      hasNextPage: collection?.products?.pageInfo?.hasNextPage || false,
      endCursor: collection?.products?.pageInfo?.endCursor || null,
    };
  } catch (error) {
    console.error('Error fetching collection:', error);
    return {
      collection: null,
      hasNextPage: false,
      endCursor: null,
    };
  }
}

export function formatPrice(amount: string, currencyCode: string): string {
  const price = parseFloat(amount);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(price);
}

export async function createCheckout(lineItems: Array<{ variantId: string; quantity: number }>): Promise<string> {
  const query = `
    mutation cartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart {
          id
          checkoutUrl
          lines(first: 250) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                  }
                }
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    input: {
      lines: lineItems.map(item => ({
        merchandiseId: item.variantId,
        quantity: item.quantity
      }))
    }
  };

  try {
    const data = await shopifyFetch(query, variables);
    
    if (data.data?.cartCreate?.userErrors?.length > 0) {
      const errors = data.data.cartCreate.userErrors;
  throw new Error(`Cart errors: ${errors.map((e: { message: string }) => e.message).join(', ')}`);
    }

    const cart = data.data?.cartCreate?.cart;
    if (!cart?.checkoutUrl) {
      throw new Error('Failed to create cart checkout');
    }

    return cart.checkoutUrl;
  } catch (error) {
    console.error('Error creating checkout:', error);
    throw error;
  }
}