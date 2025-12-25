// types/cart.ts
export type CartItem = {
id: string; // product _id
name: string;
price: number; // unit price in smallest unit or normal number; here normal number
image?: string;
qty: number; // quantity in cart
stock?: number; // optional limit (if you track stock)
variantId?: string; // to distinguish variations (size/color)
variantLabel?: string; // e.g., "M / Red"
};

export type CartState = {
items: CartItem[];
};