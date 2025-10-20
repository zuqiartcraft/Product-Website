"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Product, getProductImages } from "@/types/product";
import Header from "@/components/Header";
import ImageCarousel from "@/components/ImageCarousel";
import PaymentModal from "@/components/PaymentModal";
import { ArrowLeft, ShoppingCart, MessageCircle } from "lucide-react";
import Link from "next/link";

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", params.id)
        .eq("is_active", true)
        .single();

      if (error) throw error;
      setProduct(data);
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = () => {
    setShowPaymentModal(true);
  };

  const handleWhatsApp = () => {
    const whatsappUrl =
      process.env.NEXT_PUBLIC_WHATSAPP_URL || "https://wa.me/";
    const message = `Hi! I'm interested in ${product?.name}`;
    window.open(`${whatsappUrl}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const productImages = product ? getProductImages(product) : [];

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-300 dark:bg-gray-700 rounded"></div>
              <div className="space-y-4">
                <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Product not found
          </h1>
          <Link
            href="/"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Back to products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            {/* Image Section */}
            <div className="relative h-96 md:h-[500px] bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
              <ImageCarousel
                images={productImages}
                alt={product.name}
                className="h-full"
                priority
              />
            </div>

            {/* Details Section */}
            <div className="flex flex-col">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                {product.name}
              </h1>

              <div className="mb-6">
                <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                  ${product.price}
                </span>
              </div>

              {/* Short Description */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Description
                </h2>
                <p className="text-gray-700 dark:text-gray-300">
                  {product.short_description}
                </p>
              </div>

              {/* Long Description */}
              <div className="mb-6 flex-1">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Details
                </h2>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {product.long_description}
                </p>
              </div>

              {/* Specifications */}
              {product.size && (
                <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Specifications
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Size:
                      </span>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {product.size}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleBuyNow}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Buy Now
                </button>
                <button
                  onClick={handleWhatsApp}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  Chat on WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Modal */}
        {product && (
          <PaymentModal
            isOpen={showPaymentModal}
            onClose={() => setShowPaymentModal(false)}
            productId={product.id}
            productName={product.name}
            productPrice={product.price}
          />
        )}
      </main>
    </div>
  );
}
