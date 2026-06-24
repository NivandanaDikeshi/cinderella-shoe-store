export interface Product {
  id?: string;

  name: string;
  slug: string;
  sku: string;

  categoryId: string;

  price: number;
  discountPrice?: number;

  description: string;

  sizes: string[];
  colors: string[];

  images: string[];

  featured: boolean;
  preOrder: boolean;

  estimatedDelivery: string;

  status: "active" | "hidden";

  stock: {
    [size: string]: {
      [color: string]: number;
    };
  };

  createdAt?: Date;
}