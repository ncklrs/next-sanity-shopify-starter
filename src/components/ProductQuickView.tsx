"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { useQuickView } from "@/contexts/QuickViewContext";
import { useCart } from "@/contexts/CartContext";
import { getProductByHandle, formatPrice, type ShopifyProduct } from "@/lib/shopify";
import VariantSelector, { type VariantOption } from "@/components/ui/variant-selector";
import QuantitySelector from "@/components/ui/quantity-selector";
import { XIcon } from "@/components/icons";

export function ProductQuickView() {
  const { isOpen, currentProductHandle, closeQuickView } = useQuickView();
  const { addItem } = useCart();
  const [isMounted, setIsMounted] = useState(false);
  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Handle mounting for portal
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Fetch product data when modal opens
  useEffect(() => {
    if (isOpen && currentProductHandle) {
      setIsLoading(true);
      setError(null);
      setQuantity(1);
      setCurrentImageIndex(0);

      getProductByHandle(currentProductHandle)
        .then((data) => {
          if (data) {
            setProduct(data);
            // Auto-select first available variant
            const firstAvailableVariant = data.variants.edges.find(
              (edge) => edge.node.availableForSale
            );
            if (firstAvailableVariant) {
              setSelectedVariantId(firstAvailableVariant.node.id);

              // Set initial color and size from first variant
              const colorOption = firstAvailableVariant.node.selectedOptions.find(
                (opt) => opt.name.toLowerCase() === "color"
              );
              const sizeOption = firstAvailableVariant.node.selectedOptions.find(
                (opt) => opt.name.toLowerCase() === "size"
              );

              if (colorOption) setSelectedColor(colorOption.value);
              if (sizeOption) setSelectedSize(sizeOption.value);
            }
          } else {
            setError("Product not found");
          }
        })
        .catch((err) => {
          console.error("Failed to fetch product:", err);
          setError("Failed to load product");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isOpen, currentProductHandle]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeQuickView();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, closeQuickView]);

  // Update selected variant when color or size changes
  useEffect(() => {
    if (!product) return;

    const matchingVariant = product.variants.edges.find((edge) => {
      const variant = edge.node;
      const colorMatch = selectedColor
        ? variant.selectedOptions.find(
            (opt) => opt.name.toLowerCase() === "color" && opt.value === selectedColor
          )
        : true;
      const sizeMatch = selectedSize
        ? variant.selectedOptions.find(
            (opt) => opt.name.toLowerCase() === "size" && opt.value === selectedSize
          )
        : true;
      return colorMatch && sizeMatch;
    });

    if (matchingVariant) {
      setSelectedVariantId(matchingVariant.node.id);
    }
  }, [selectedColor, selectedSize, product]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeQuickView();
    }
  };

  const handleAddToCart = () => {
    if (!product || !selectedVariantId) return;

    setIsAddingToCart(true);

    const selectedVariant = product.variants.edges.find(
      (edge) => edge.node.id === selectedVariantId
    )?.node;

    if (!selectedVariant) return;

    // addItem expects (merchandiseId, quantity)
    addItem(selectedVariant.id, quantity);

    // Show success feedback
    setTimeout(() => {
      setIsAddingToCart(false);
      closeQuickView();
    }, 500);
  };

  if (!isMounted || !isOpen) return null;

  // Get color and size options from product
  const getColorOptions = (): VariantOption[] => {
    if (!product) return [];

    const colorValues = new Set<string>();
    const colorOptions: VariantOption[] = [];

    product.variants.edges.forEach((edge) => {
      const variant = edge.node;
      const colorOption = variant.selectedOptions.find(
        (opt) => opt.name.toLowerCase() === "color"
      );

      if (colorOption && !colorValues.has(colorOption.value)) {
        colorValues.add(colorOption.value);

        // Check if this color is available in any size
        const isAvailable = product.variants.edges.some((v) => {
          const hasColor = v.node.selectedOptions.find(
            (opt) => opt.name.toLowerCase() === "color" && opt.value === colorOption.value
          );
          return hasColor && v.node.availableForSale;
        });

        colorOptions.push({
          id: colorOption.value,
          name: colorOption.value,
          value: colorOption.value,
          color: colorOption.value.toLowerCase(),
          inStock: isAvailable,
        });
      }
    });

    return colorOptions;
  };

  const getSizeOptions = (): VariantOption[] => {
    if (!product) return [];

    const sizeValues = new Set<string>();
    const sizeOptions: VariantOption[] = [];

    product.variants.edges.forEach((edge) => {
      const variant = edge.node;
      const sizeOption = variant.selectedOptions.find(
        (opt) => opt.name.toLowerCase() === "size"
      );

      if (sizeOption && !sizeValues.has(sizeOption.value)) {
        sizeValues.add(sizeOption.value);

        // Check if this size is available with current color
        const isAvailable = selectedColor
          ? product.variants.edges.some((v) => {
              const hasSize = v.node.selectedOptions.find(
                (opt) => opt.name.toLowerCase() === "size" && opt.value === sizeOption.value
              );
              const hasColor = v.node.selectedOptions.find(
                (opt) => opt.name.toLowerCase() === "color" && opt.value === selectedColor
              );
              return hasSize && hasColor && v.node.availableForSale;
            })
          : product.variants.edges.some((v) => {
              const hasSize = v.node.selectedOptions.find(
                (opt) => opt.name.toLowerCase() === "size" && opt.value === sizeOption.value
              );
              return hasSize && v.node.availableForSale;
            });

        sizeOptions.push({
          id: sizeOption.value,
          name: sizeOption.value,
          value: sizeOption.value,
          inStock: isAvailable,
        });
      }
    });

    return sizeOptions;
  };

  const colorOptions = getColorOptions();
  const sizeOptions = getSizeOptions();

  const selectedVariant = product?.variants.edges.find(
    (edge) => edge.node.id === selectedVariantId
  )?.node;

  const images = product?.images.edges.map((edge) => edge.node) || [];
  const currentImage = images[currentImageIndex];

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300"
      onClick={handleBackdropClick}
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        className={`w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-[var(--background)] border border-[var(--border)] rounded-2xl shadow-2xl transition-all duration-300 ${
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        {/* Close Button */}
        <button
          onClick={closeQuickView}
          className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-[var(--foreground)] transition-colors"
          aria-label="Close quick view"
        >
          <XIcon className="w-5 h-5" />
        </button>

        {isLoading ? (
          <div className="flex items-center justify-center p-16">
            <div className="w-12 h-12 border-4 border-[var(--accent-cyan)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center p-16 text-center">
            <p className="text-lg text-red-500 mb-4">{error}</p>
            <button
              onClick={closeQuickView}
              className="btn btn-secondary"
            >
              Close
            </button>
          </div>
        ) : product ? (
          <div className="grid md:grid-cols-2 gap-8 p-8">
            {/* Left Column - Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-[var(--background-tertiary)]">
                {currentImage && (
                  <Image
                    src={currentImage.url}
                    alt={currentImage.altText || product.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                )}
              </div>

              {/* Thumbnail Gallery */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {images.map((image, index) => (
                    <button
                      key={image.url}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative flex-shrink-0 w-20 h-20 overflow-hidden rounded-lg border-2 transition-all ${
                        index === currentImageIndex
                          ? "border-[var(--accent-cyan)] ring-2 ring-[var(--accent-cyan)]"
                          : "border-[var(--border)] hover:border-[var(--foreground-subtle)]"
                      }`}
                    >
                      <Image
                        src={image.url}
                        alt={image.altText || `${product.title} ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column - Product Details */}
            <div className="flex flex-col space-y-6">
              {/* Title and Price */}
              <div>
                <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">
                  {product.title}
                </h2>
                {selectedVariant && (
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-gradient">
                      {formatPrice(
                        selectedVariant.priceV2.amount,
                        selectedVariant.priceV2.currencyCode
                      )}
                    </span>
                    {selectedVariant.compareAtPriceV2 && (
                      <span className="text-lg text-[var(--foreground-muted)] line-through">
                        {formatPrice(
                          selectedVariant.compareAtPriceV2.amount,
                          selectedVariant.compareAtPriceV2.currencyCode
                        )}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Short Description */}
              {product.description && (
                <p className="text-[var(--foreground-muted)] line-clamp-3">
                  {product.description}
                </p>
              )}

              {/* Variant Selector */}
              {(colorOptions.length > 0 || sizeOptions.length > 0) && (
                <VariantSelector
                  colorOptions={colorOptions.length > 0 ? colorOptions : undefined}
                  sizeOptions={sizeOptions.length > 0 ? sizeOptions : undefined}
                  selectedColor={selectedColor || undefined}
                  selectedSize={selectedSize || undefined}
                  onColorChange={setSelectedColor}
                  onSizeChange={setSelectedSize}
                />
              )}

              {/* Quantity Selector */}
              <QuantitySelector
                value={quantity}
                onChange={setQuantity}
                label="Quantity"
                min={1}
                max={99}
              />

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={!selectedVariant?.availableForSale || isAddingToCart}
                className="btn btn-primary btn-lg w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAddingToCart
                  ? "Adding..."
                  : !selectedVariant?.availableForSale
                  ? "Out of Stock"
                  : "Add to Cart"}
              </button>

              {/* View Full Details Link */}
              <Link
                href={`/products/${product.handle}`}
                className="text-center text-sm font-medium text-[var(--accent-cyan)] hover:text-[var(--accent-violet)] transition-colors underline"
                onClick={closeQuickView}
              >
                View full details
              </Link>

              {/* Product Meta */}
              <div className="pt-4 border-t border-[var(--border)] space-y-2 text-sm text-[var(--foreground-muted)]">
                {product.vendor && (
                  <div className="flex justify-between">
                    <span>Vendor:</span>
                    <span className="text-[var(--foreground)]">{product.vendor}</span>
                  </div>
                )}
                {product.productType && (
                  <div className="flex justify-between">
                    <span>Type:</span>
                    <span className="text-[var(--foreground)]">{product.productType}</span>
                  </div>
                )}
                {selectedVariant?.availableForSale !== undefined && (
                  <div className="flex justify-between">
                    <span>Availability:</span>
                    <span
                      className={
                        selectedVariant.availableForSale
                          ? "text-green-500"
                          : "text-red-500"
                      }
                    >
                      {selectedVariant.availableForSale ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

export default ProductQuickView;
