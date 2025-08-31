import ProductDetailsClient from "@/components/ProductDetailsClient";


type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  stock: number;
};

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // ✅ fixed for Next.js 15

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const res = await fetch(`http://localhost:3000/api/products/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: "no-store",
  });
  

  if (!res.ok) {
    throw new Error("Failed to fetch product");
  }



  const product: Product = await res.json();

  return <ProductDetailsClient product={product} />;
}
