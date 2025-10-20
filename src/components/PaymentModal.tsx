"use client";

import { useState } from "react";
import {
  X,
  ArrowLeft,
  ArrowRight,
  CreditCard,
  Building2,
  QrCode,
} from "lucide-react";
import Image from "next/image";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
  productPrice: number;
}

type PaymentStep = "select" | "google-pay" | "bank-transfer" | "confirmation";
type PaymentMethod = "google-pay" | "bank-transfer" | null;

export default function PaymentModal({
  isOpen,
  onClose,
  productId,
  productName,
  productPrice,
}: PaymentModalProps) {
  const [step, setStep] = useState<PaymentStep>("select");
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(null);
  const [buyerName, setBuyerName] = useState("");
  const [buyerAddress, setBuyerAddress] = useState("");

  if (!isOpen) return null;

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method);
    if (method === "google-pay") {
      setStep("google-pay");
    } else if (method === "bank-transfer") {
      setStep("bank-transfer");
    }
  };

  const handleBack = () => {
    if (step === "google-pay" || step === "bank-transfer") {
      setStep("select");
      setSelectedMethod(null);
    } else if (step === "confirmation") {
      if (selectedMethod === "google-pay") {
        setStep("google-pay");
      } else {
        setStep("bank-transfer");
      }
    }
  };

  const handleNext = () => {
    if (step === "google-pay" || step === "bank-transfer") {
      setStep("confirmation");
    }
  };

  const handleWhatsApp = () => {
    const whatsappUrl =
      process.env.NEXT_PUBLIC_WHATSAPP_URL || "https://wa.me/";
    const message = `Payment for - ${productName}
Product ID - ${productId}
Amount - $${productPrice}
Buyer Name - ${buyerName}
Buyer Address - ${buyerAddress}
Transaction ID - 

Note: Please don't forget to attach the transaction screenshot`;
    window.open(`${whatsappUrl}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const handleClose = () => {
    setStep("select");
    setSelectedMethod(null);
    setBuyerName("");
    setBuyerAddress("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {step === "select" && "Select Payment Method"}
            {step === "google-pay" && "Google Pay"}
            {step === "bank-transfer" && "Bank Transfer"}
            {step === "confirmation" && "Complete Payment"}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Payment Gateway Note */}
          <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Automated payment gateways will be implemented soon. For now,
              please use manual payment methods below.
            </p>
          </div>

          {/* Step 1: Select Payment Method */}
          {step === "select" && (
            <div className="space-y-4">
              <button
                onClick={() => handleMethodSelect("google-pay")}
                className="w-full p-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors flex items-center gap-4"
              >
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <QrCode className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    Google Pay / UPI
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Pay using UPI apps
                  </p>
                </div>
              </button>

              <button
                onClick={() => handleMethodSelect("bank-transfer")}
                className="w-full p-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors flex items-center gap-4"
              >
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    Bank Transfer
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Direct bank transfer
                  </p>
                </div>
              </button>

              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                More payment options coming soon
              </p>
            </div>
          )}

          {/* Step 2: Google Pay */}
          {step === "google-pay" && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2">
                  Scan QR Code
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Use any UPI app to scan and pay
                </p>
                {process.env.NEXT_PUBLIC_GOOGLE_PAY_QR_URL && (
                  <div className="relative w-64 h-64 mx-auto bg-white p-4 rounded-lg">
                    <Image
                      src={process.env.NEXT_PUBLIC_GOOGLE_PAY_QR_URL}
                      alt="Google Pay QR Code"
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Or pay directly via UPI
                </p>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    UPI ID
                  </p>
                  <p className="font-mono font-semibold text-gray-900 dark:text-gray-100">
                    {process.env.NEXT_PUBLIC_GOOGLE_PAY_PHONE_NUMBER ||
                      "Not configured"}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Amount to Pay:
                </p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  ${productPrice}
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Bank Transfer */}
          {step === "bank-transfer" && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-4">
                Bank Details
              </h3>

              <div className="space-y-3">
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Bank Name
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    {process.env.NEXT_PUBLIC_BANK_NAME || "Not configured"}
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Account Holder Name
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    {process.env.NEXT_PUBLIC_BANK_ACCOUNT_HOLDER_NAME ||
                      "Not configured"}
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Account Number
                  </p>
                  <p className="font-mono font-semibold text-gray-900 dark:text-gray-100">
                    {process.env.NEXT_PUBLIC_BANK_ACCOUNT_NUMBER ||
                      "Not configured"}
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    IFSC Code
                  </p>
                  <p className="font-mono font-semibold text-gray-900 dark:text-gray-100">
                    {process.env.NEXT_PUBLIC_BANK_IFSC_CODE || "Not configured"}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Amount to Transfer:
                </p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  ${productPrice}
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === "confirmation" && (
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                <CreditCard className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Payment Completed?
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  We will verify the payment and then we will ship the product.
                  Please share the following with us on WhatsApp:
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-left space-y-2">
                <p className="text-sm text-gray-900 dark:text-gray-100">
                  <span className="font-semibold">1.</span> Payment screenshot
                </p>
                <p className="text-sm text-gray-900 dark:text-gray-100">
                  <span className="font-semibold">2.</span> Transaction
                  number/ID
                </p>
                <p className="text-sm text-gray-900 dark:text-gray-100">
                  <span className="font-semibold">3.</span> Product ID:{" "}
                  <span className="font-mono text-xs">{productId}</span>
                </p>
                <p className="text-sm text-gray-900 dark:text-gray-100">
                  <span className="font-semibold">4.</span> Product Name:{" "}
                  <span className="font-medium">{productName}</span>
                </p>
                <p className="text-sm text-gray-900 dark:text-gray-100">
                  <span className="font-semibold">5.</span> Your Name
                </p>
                <p className="text-sm text-gray-900 dark:text-gray-100">
                  <span className="font-semibold">6.</span> Your Address
                </p>
              </div>

              {/* Buyer Information Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    required
                    placeholder="Enter your full name"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your Address *
                  </label>
                  <textarea
                    value={buyerAddress}
                    onChange={(e) => setBuyerAddress(e.target.value)}
                    required
                    placeholder="Enter your complete delivery address"
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                  />
                </div>
              </div>

              <button
                onClick={handleWhatsApp}
                disabled={!buyerName.trim() || !buyerAddress.trim()}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                Share on WhatsApp
              </button>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        {step !== "select" && (
          <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex gap-3 flex-shrink-0">
            <button
              onClick={handleBack}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            {step !== "confirmation" && (
              <button
                onClick={handleNext}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function MessageCircle({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
    </svg>
  );
}
