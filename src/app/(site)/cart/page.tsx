import { Metadata } from "next";
import CartPageContent from "./CartPageContent";

export const metadata: Metadata = {
  title: "Shopping Cart | Shop",
  description: "Review your cart and checkout",
};

export default function CartPage() {
  return <CartPageContent />;
}
