export interface Product {
  id: string;
  name: string;
  short_description: string;
  long_description: string;
  size: string;
  image_url: string | string[]; // Can be single URL string or array of URLs
  price: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Helper function to always get array of images
export function getProductImages(product: Product): string[] {
  if (!product.image_url) return [];

  // If it's already an array
  if (Array.isArray(product.image_url)) {
    return product.image_url;
  }

  // If it's a string, try to parse as JSON
  if (typeof product.image_url === "string") {
    try {
      const parsed = JSON.parse(product.image_url);
      return Array.isArray(parsed) ? parsed : [product.image_url];
    } catch {
      // If parsing fails, treat as single URL
      return [product.image_url];
    }
  }

  return [];
}
