"use client";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "@/lib/firebase/config";
import { FirebaseError } from "firebase/app";


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



/**
 * Get all products from Firestore
 */
export async function getProducts(): Promise<Product[]> {

  try {


    // Firestore collection name
    const productsRef = collection(
      db,
      "products"
    );


    // Get documents
    const snapshot = await getDocs(
      productsRef
    );



    const products: Product[] =
      snapshot.docs.map((doc) => {


        const data = doc.data();



        return {


          id: doc.id,


          name:
            data.name ?? "",



          slug:
            data.slug ?? "",



          category:
            data.category ?? "",



          price:
            Number(data.price ?? 0),



          description:
            data.description ?? "",



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
            Number(
              data.totalStock ?? 0
            ),



          createdAt:
            data.createdAt ?? null,



          updatedAt:
            data.updatedAt ?? null,


        };


      });



    console.log(
      "Products loaded:",
      products.length
    );


    return products;



  } catch (error) {


    if (error instanceof FirebaseError) {


      console.error(
        "Firestore Error Code:",
        error.code
      );


      console.error(
        "Firestore Error Message:",
        error.message
      );


    } else {


      console.error(
        "Unknown Firestore Error:",
        error
      );


    }



    return [];


  }

}