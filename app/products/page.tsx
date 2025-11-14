import Link from "next/link";
import React from "react";

const page = () => {
  const products = [
    {
      id: 1,
      name: "book",
    },
    {
      id: 2,
      name: "pencil",
    },
    {
      id: 3,
      name: "eraser",
    },
  ];
  return (
    <div className="mx-auto h-screen p-4">
      <h1>This is my products page</h1>
      <div className="flex flex-wrap gap-2 items-center justify-center max-w-6xl">
        {products.map((product) => (
          <div className="flex flex-col gap-3 p-4">
            <Link href={`/product/${product.id}`}>
            <h1 key={product.id} >{product.name}</h1>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default page;
