import { serverProductService } from "@/services/serverProductService";
import ProductClient from "./product-client";


type Props = {
  params: Promise<{ id: string }>;
};


// Convert Firestore data → safe JSON
function sanitize(doc: any) {
  return JSON.parse(
    JSON.stringify(doc, (key, value) => {
      if (value?.seconds) {
        return new Date(
          value.seconds * 1000
        ).toISOString();
      }

      return value;
    })
  );
}


export default async function Page({
  params,
}: Props) {


  const { id } = await params;


  // Get single product from SERVER service
  const rawProduct =
    await serverProductService.getProductById(id);



  if (!rawProduct) {

    return (

      <div className="text-center py-20">

        <h1 className="text-red-500 text-2xl font-bold">
          Product not found
        </h1>

      </div>

    );

  }



  const product = sanitize(rawProduct);



  return (

    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">

      <ProductClient
        product={product}
      />

    </div>

  );

}