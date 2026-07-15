import {
  collection,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase/config";


export interface Product {

  id: string;

  name: string;

  slug?: string;

  category?: string;

  price: number;

  description?: string;

  images?: string[];

  image?: string;

  status?: string;

  sizes?: string[];

  colors?: string[];

  stock?: Record<string, number>;

  totalStock?: number;

  createdAt?: any;

  updatedAt?: any;
}



function mapProduct(
  id: string,
  data: any
): Product {

  return {

    id,

    name: data.name ?? "",

    slug: data.slug ?? "",

    category: data.category ?? "",

    price: Number(data.price ?? 0),

    description: data.description ?? "",

    images:
      Array.isArray(data.images)
        ? data.images
        : [],


    image:
      data.image ??
      (
        Array.isArray(data.images) &&
        data.images.length > 0
          ? data.images[0]
          : ""
      ),


    status:
      data.status ?? "active",


    sizes:
      Array.isArray(data.sizes)
        ? data.sizes
        : [],


    colors:
      Array.isArray(data.colors)
        ? data.colors
        : [],


    stock:
      data.stock ?? {},


    totalStock:
      Number(data.totalStock ?? 0),


    createdAt:
      data.createdAt ?? null,


    updatedAt:
      data.updatedAt ?? null,

  };
}



export const serverProductService = {


  async getProducts(): Promise<Product[]> {


    const snapshot = await getDocs(
      collection(db, "products")
    );


    return snapshot.docs.map(
      (doc) =>
        mapProduct(
          doc.id,
          doc.data()
        )
    );

  },



  async getProductById(
    id: string
  ): Promise<Product | null> {


    const productRef =
      doc(
        db,
        "products",
        id
      );


    const snapshot =
      await getDoc(productRef);



    if (!snapshot.exists()) {

      return null;

    }



    return mapProduct(
      snapshot.id,
      snapshot.data()
    );

  }

};