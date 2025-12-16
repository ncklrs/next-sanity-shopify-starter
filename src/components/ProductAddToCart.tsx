"use client";

import { useCart } from "@/contexts/CartContext";
import AddToCartButton from "@/components/ui/add-to-cart-button";

interface ProductAddToCartProps {
  variantId: string;
  availableForSale: boolean;
}

export default function ProductAddToCart({
  variantId,
  availableForSale,
}: ProductAddToCartProps) {
  const { addItem } = useCart();

  const handleAddToCart = async () => {
    await addItem(variantId, 1);
  };

  return (
    <AddToCartButton
      onAddToCart={handleAddToCart}
      disabled={!availableForSale}
      fullWidth
      size="lg"
    >
      {availableForSale ? "Add to Cart" : "Sold Out"}
    </AddToCartButton>
  );
}
