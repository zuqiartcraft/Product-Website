"use client";

import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/product/${product.id}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
        <div className="relative h-64 bg-gray-100 dark:bg-gray-700">
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
            {product.name}
          </h3>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
            {product.short_description}
          </p>

          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
              ${product.price}
            </span>
            {product.size && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {product.size}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
