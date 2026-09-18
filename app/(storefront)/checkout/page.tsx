"use client";

// ─── Luxury Multi-Step Checkout Page ──────────────────────────────────────────
// Apple-level multi-step checkout experience featuring:
//   • CheckoutSteps           — Step indicator wizard (Shipping → Delivery → Payment)
//   • CheckoutShippingForm    — Step 1: Address & contact info
//   • CheckoutDeliveryForm    — Step 2: Service options & concierge instructions
//   • CheckoutPaymentForm     — Step 3: Payment method (COD, JazzCash Installments, Card)
//   • CheckoutSummary         — Sticky order summary sidebar with promo codes
//   • CheckoutSuccess         — Rotating gold mark confirmation screen

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/features/cart/store";
import { processCheckout } from "@/features/checkout/actions";
import { createInstallmentPlan } from "@/features/installments/actions";
import { toast } from "sonner";
import CheckoutSteps, { CheckoutStep } from "@/components/storefront/checkout/CheckoutSteps";
import CheckoutShippingForm, { ShippingData } from "@/components/storefront/checkout/CheckoutShippingForm";
import CheckoutDeliveryForm, { DeliveryData } from "@/components/storefront/checkout/CheckoutDeliveryForm";
import CheckoutPaymentForm, { PaymentData } from "@/components/storefront/checkout/CheckoutPaymentForm";
import CheckoutSummary from "@/components/storefront/checkout/CheckoutSummary";
import CheckoutSuccess from "@/components/storefront/checkout/CheckoutSuccess";

export default function CheckoutPage() {
  const { items, cartTotal, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState<CheckoutStep>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccessId, setOrderSuccessId] = useState<string | null>(null);

  // Form State
  const [shippingData, setShippingData] = useState<ShippingData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
  });

  const [deliveryData, setDeliveryData] = useState<DeliveryData>({
    method: "STANDARD",
    instructions: "",
  });

  const [paymentData, setPaymentData] = useState<PaymentData>({
    method: "COD",
    installmentMonths: 3,
  });

  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountPct: number } | null>(null);

  const flatShipping = 50.0;
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (orderSuccessId) {
    return <CheckoutSuccess orderId={orderSuccessId} />;
  }

  if (items.length === 0) {
    router.push("/cart");
    return null;
  }

  const subtotal = cartTotal();

  // Final submit handler (bound to hidden form element)
  const handleFinalSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isProcessing) return;
    setIsProcessing(true);

    const formData = new FormData();
    formData.set("firstName", shippingData.firstName);
    formData.set("lastName", shippingData.lastName);
    formData.set("email", shippingData.email);
    formData.set("phone", shippingData.phone);
    formData.set("address", shippingData.address);
    formData.set("city", shippingData.city);
    formData.set("zipCode", shippingData.zipCode);
    formData.set("paymentMethod", paymentData.method);

    if (appliedCoupon) {
      formData.set("couponCode", appliedCoupon.code);
    }

    const loadingToast = toast.loading("Processing your collection order...");

    const res = await processCheckout(items, formData);

    if (res.success && paymentData.method === "INSTALLMENT" && res.orderId) {
      const planRes = await createInstallmentPlan({
        orderId: res.orderId,
        numberOfMonths: paymentData.installmentMonths,
      });
      if (!planRes.success) {
        toast.error("Order created, but installment plan setup requires support follow-up.");
      }
    }

    setIsProcessing(false);

    if (res.success) {
      toast.success("Order authorized successfully!", { id: loadingToast });
      clearCart();
      setOrderSuccessId(res.orderId as string);
    } else {
      toast.error(res.error || "Failed to process order", { id: loadingToast });
      if (res.error?.includes("logged in")) {
        router.push("/auth/login?callbackUrl=/checkout");
      }
    }
  };

  return (
    <div className="bg-[var(--lm-surface-primary)] text-[var(--lm-text-primary)] min-h-screen pt-36 pb-28">
      
      {/* Hidden submit form */}
      <form id="checkout-form" onSubmit={handleFinalSubmit} className="hidden" />

      <div className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-20">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-px w-8 bg-[var(--lm-accent-primary)] opacity-50" />
              <span
                className="text-[8.5px] uppercase tracking-[0.6em] text-[var(--lm-accent-text)] opacity-70"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Secure Atelier Express
              </span>
            </div>
            <h1
              className="text-[var(--lm-text-primary)] text-4xl sm:text-5xl font-light tracking-tight leading-none"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              Checkout
            </h1>
          </div>
        </div>

        {/* Step Indicator Wizard */}
        <CheckoutSteps
          currentStep={currentStep}
          onStepClick={(s) => setCurrentStep(s)}
        />

        {/* Main Grid: Form Left + Sticky Summary Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Multi-Step Forms */}
          <div className="lg:col-span-7">
            {currentStep === 1 && (
              <CheckoutShippingForm
                initialData={shippingData}
                onNext={(data) => {
                  setShippingData(data);
                  setCurrentStep(2);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            )}

            {currentStep === 2 && (
              <CheckoutDeliveryForm
                initialData={deliveryData}
                onNext={(data) => {
                  setDeliveryData(data);
                  setCurrentStep(3);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                onBack={() => setCurrentStep(1)}
              />
            )}

            {currentStep === 3 && (
              <CheckoutPaymentForm
                initialData={paymentData}
                totalAmount={subtotal}
                isProcessing={isProcessing}
                onUpdatePayment={setPaymentData}
                onBack={() => setCurrentStep(2)}
              />
            )}
          </div>

          {/* Right Column: Sticky Summary */}
          <div className="lg:col-span-5">
            <CheckoutSummary
              items={items}
              subtotal={subtotal}
              flatShipping={flatShipping}
              deliveryMethod={deliveryData.method}
              appliedCoupon={appliedCoupon}
              onApplyCoupon={setAppliedCoupon}
              isProcessing={isProcessing}
            />
          </div>

        </div>

      </div>
    </div>
  );
}
