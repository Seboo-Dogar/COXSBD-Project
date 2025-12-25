"use client";

import {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
  ReactNode,
} from "react";

// Types
export type CartItem = {
  id: string;
  name: string;
  price: number;
  image?: string;
  variantId?: string;
  variantLabel?: string;
  stock?: number;
  qty: number;
  passengers?: number;
};

export type CartContextValue = {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  addToCart: (item: Omit<CartItem, "qty">, qty?: number) => void;
  updateQty: (id: string, qty: number, variantId?: string) => void;
  removeFromCart: (id: string, variantId?: string) => void;
  clearCart: () => void;
};

// Context
const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("cart");
      console.log("Loading cart from localStorage:", stored);
      if (stored) {
        const parsedItems = JSON.parse(stored);
        setItems(Array.isArray(parsedItems) ? parsedItems : []);
      }
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
      setItems([]);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    if (isInitialized) {
      console.log("Saving cart to localStorage:", items);
      localStorage.setItem("cart", JSON.stringify(items));
    }
  }, [items, isInitialized]);

  // Helper function to generate a unique key for cart items
  const getItemKey = (id: string, variantId?: string) => {
    return variantId ? `${id}-${variantId}` : id;
  };

  // Add to cart - DEBUGGED VERSION
  const addToCart: CartContextValue["addToCart"] = (item, qty = 1) => {
    console.log("Adding to cart:", { item, qty });

    setItems((prev) => {
      // Create a unique key for the item being added
      const newItemKey = getItemKey(item.id, item.variantId);

      // Check if item already exists in cart
      const existingIndex = prev.findIndex(
        (existingItem) =>
          getItemKey(existingItem.id, existingItem.variantId) === newItemKey
      );

      console.log("Existing item index:", existingIndex);

      if (existingIndex >= 0) {
        // Item exists, update quantity
        const updatedItems = [...prev];
        const existingItem = updatedItems[existingIndex];
        const targetQty = Math.max(1, existingItem.qty + qty);
        const cappedQty = item.stock
          ? Math.min(targetQty, item.stock)
          : targetQty;

        updatedItems[existingIndex] = {
          ...existingItem,
          qty: cappedQty,
        };

        console.log("Updated existing item:", updatedItems[existingIndex]);
        return updatedItems;
      } else {
        // Item doesn't exist, add new item
        const initialQty = Math.max(1, qty);
        const cappedQty = item.stock
          ? Math.min(initialQty, item.stock)
          : initialQty;

        const newItem = { ...item, qty: cappedQty };
        console.log("Adding new item:", newItem);
        return [...prev, newItem];
      }
    });
  };

  // Update quantity
  const updateQty: CartContextValue["updateQty"] = (id, qty, variantId) => {
    console.log("Updating quantity:", { id, qty, variantId });

    setItems((prev) => {
      const itemKey = getItemKey(id, variantId);
      const itemIndex = prev.findIndex(
        (item) => getItemKey(item.id, item.variantId) === itemKey
      );

      if (itemIndex < 0) {
        console.log("Item not found for update");
        return prev;
      }

      const updatedItems = [...prev];
      const item = updatedItems[itemIndex];
      const clamped = Math.max(1, qty);
      const capped = item.stock ? Math.min(clamped, item.stock) : clamped;

      updatedItems[itemIndex] = { ...item, qty: capped };
      console.log("Updated item quantity:", updatedItems[itemIndex]);
      return updatedItems;
    });
  };

  // Remove from cart
  const removeFromCart: CartContextValue["removeFromCart"] = (
    id,
    variantId
  ) => {
    console.log("Removing from cart:", { id, variantId });

    setItems((prev) => {
      const itemKey = getItemKey(id, variantId);
      const filteredItems = prev.filter(
        (item) => getItemKey(item.id, item.variantId) !== itemKey
      );

      console.log("Items after removal:", filteredItems);
      return filteredItems;
    });
  };

  // Clear cart
  const clearCart = () => {
    console.log("Clearing cart");
    setItems([]);
  };

  // Derived values
  const subtotal = useMemo(
    () => items.reduce((sum, it) => sum + it.price * it.qty, 0),
    [items]
  );

  const totalItems = useMemo(
    () => items.reduce((sum, it) => sum + it.qty, 0),
    [items]
  );

  const value: CartContextValue = {
    items,
    totalItems,
    subtotal,
    addToCart,
    updateQty,
    removeFromCart,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// Hook
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
