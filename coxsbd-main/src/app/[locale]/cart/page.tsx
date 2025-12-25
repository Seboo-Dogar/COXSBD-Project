// app/cart/page.tsx - ENHANCED VERSION
"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useCart } from "@/context/cartContext";
import { formatCurrency } from "@/lib/currency";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsletterSignup from "@/components/Newsletter";
import { X, Plus, Minus, ShoppingBag, ArrowLeft, Heart } from "lucide-react";

export default function CartPage() {
  const { items, addToCart, updateQty, removeFromCart, clearCart } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Ensure we're on client to avoid hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  const subtotal = items.reduce((sum, it) => sum + it.price * it.qty, 0);
  const shipping = subtotal > 200 ? 0 : 50;
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax - discount;

  const applyPromoCode = () => {
    if (!promoCode) return;
    setIsApplyingPromo(true);
    setTimeout(() => {
      if (promoCode.toUpperCase() === "SAVE10") {
        setDiscount(subtotal * 0.1);
      } else if (promoCode.toUpperCase() === "FREESHIP") {
        setDiscount(shipping);
      } else {
        alert("Invalid promo code");
      }
      setIsApplyingPromo(false);
    }, 500);
  };

  const continueShopping = () => window.history.back();
  const handleCheckout = () => alert("Proceeding to checkout!");

  // Test function to add sample items
  const addTestItems = () => {
    // Add different products
    addToCart({
      id: "product-1",
      name: "Toyota Corolla",
      price: 40,
      image: "/images/car.png",
    });

    // Add same product but different variant
    addToCart({
      id: "product-1",
      name: "Toyota Corolla",
      price: 45,
      image: "/images/car.png",
      variantId: "premium",
      variantLabel: "Premium Package",
    });

    // Add completely different product
    addToCart({
      id: "product-2",
      name: "Honda Civic",
      price: 42,
      image: "/images/car2.png",
    });
  };

  if (!isClient) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <button
            onClick={continueShopping}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft size={18} className="mr-1" />
            Continue Shopping
          </button>
          <h1 className="text-2xl font-bold ml-4">Shopping Cart</h1>
          <div className="ml-auto bg-gray-100 px-3 py-1 rounded-full text-sm">
            {items.length} {items.length === 1 ? "item" : "items"}
          </div>

          {/* Test button - remove in production */}
          <button
            onClick={addTestItems}
            className="ml-4 bg-gray-200 px-3 py-1 rounded text-xs"
          >
            Add Test Items
          </button>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">
              Looks like you haven't added any items to your cart yet.
            </p>
            <button
              onClick={continueShopping}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="md:col-span-2 bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Cart Items</h2>
                <button
                  onClick={clearCart}
                  className="text-sm text-red-600 hover:text-red-800 flex items-center transition-colors"
                >
                  Clear Cart
                </button>
              </div>

              <ul className="divide-y">
                {items.map((it, index) => (
                  <li
                    key={`${it.id}-${it.variantId || "default"}-${index}`}
                    className="py-6 flex items-start gap-4 transition-opacity duration-300"
                  >
                    {it.image ? (
                      <div className="relative w-24 h-24">
                        <Image
                          src={it.image}
                          alt={it.name}
                          width={96}
                          height={96}
                          className="rounded-md object-cover border"
                        />
                        <button
                          onClick={() => {}}
                          className="absolute -top-2 -right-2 bg-white p-1 rounded-full shadow-md hover:text-red-500 transition-colors"
                        >
                          <Heart size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="w-24 h-24 bg-gray-100 rounded-md flex items-center justify-center">
                        <ShoppingBag size={32} className="text-gray-300" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="font-medium line-clamp-1">{it.name}</div>
                      {it.variantLabel && (
                        <div className="text-sm text-gray-500 mt-1">
                          {it.variantLabel}
                        </div>
                      )}
                      <div className="mt-2 text-lg font-semibold text-blue-700">
                        {formatCurrency(it.price)}
                      </div>

                      <div className="mt-3 flex items-center gap-4">
                        <div className="flex items-center border rounded-lg overflow-hidden">
                          <button
                            onClick={() =>
                              updateQty(it.id, it.qty - 1, it.variantId)
                            }
                            className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 transition-colors"
                            disabled={it.qty <= 1}
                          >
                            <Minus size={16} />
                          </button>
                          <input
                            type="number"
                            min={1}
                            value={it.qty}
                            onChange={(e) => {
                              const v = parseInt(e.target.value || "1", 10);
                              if (v > 0) updateQty(it.id, v, it.variantId);
                            }}
                            className="w-12 text-center border-x py-1"
                          />
                          <button
                            onClick={() =>
                              updateQty(it.id, it.qty + 1, it.variantId)
                            }
                            className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 transition-colors"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(it.id, it.variantId)}
                          className="text-red-600 hover:text-red-800 flex items-center transition-colors"
                        >
                          <X size={16} className="mr-1" />
                          Remove
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-semibold">
                        {formatCurrency(it.price * it.qty)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        ID: {it.id}
                        {it.variantId && ` | Variant: ${it.variantId}`}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Promo Code */}
              <div className="pt-6 border-t mt-6">
                <h3 className="font-medium mb-3">Promo Code</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={applyPromoCode}
                    disabled={isApplyingPromo || !promoCode}
                    className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isApplyingPromo ? "Applying..." : "Apply"}
                  </button>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <aside className="bg-white rounded-xl shadow p-6 h-fit sticky top-4">
              <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal ({items.length} items)</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? "Free" : formatCurrency(shipping)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between font-semibold text-lg border-t mt-4 pt-4">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>

              <button
                onClick={handleCheckout}
                className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Proceed to Checkout
              </button>
            </aside>
          </div>
        )}
      </div>

      <NewsletterSignup />
      <Footer />
    </>
  );
}
