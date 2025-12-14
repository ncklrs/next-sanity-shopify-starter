"use client";

import SizeGuide from "./SizeGuide";

/**
 * Example usage of the SizeGuide component
 *
 * This component demonstrates how to integrate the SizeGuide
 * into product pages with different product types.
 */
export default function SizeGuideExample() {
  return (
    <div className="container mx-auto px-4 py-12 space-y-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="display-lg mb-8 text-center">Size Guide Examples</h1>

        {/* Example 1: Default Tops Size Guide */}
        <div className="card mb-8">
          <h2 className="heading-md mb-4">Example 1: Tops</h2>
          <p className="text-[var(--foreground-muted)] mb-4">
            Default size guide for tops with chest, waist, and length measurements.
          </p>
          <SizeGuide productType="tops" />
        </div>

        {/* Example 2: Bottoms Size Guide */}
        <div className="card mb-8">
          <h2 className="heading-md mb-4">Example 2: Bottoms</h2>
          <p className="text-[var(--foreground-muted)] mb-4">
            Default size guide for bottoms with waist, hips, and inseam measurements.
          </p>
          <SizeGuide productType="bottoms" />
        </div>

        {/* Example 3: Shoes Size Guide */}
        <div className="card mb-8">
          <h2 className="heading-md mb-4">Example 3: Shoes</h2>
          <p className="text-[var(--foreground-muted)] mb-4">
            Shoe size conversion chart with US, EU, and UK sizes.
          </p>
          <SizeGuide productType="shoes" />
        </div>

        {/* Example 4: Accessories Size Guide */}
        <div className="card mb-8">
          <h2 className="heading-md mb-4">Example 4: Accessories</h2>
          <p className="text-[var(--foreground-muted)] mb-4">
            Size guide for accessories like belts, scarves, etc.
          </p>
          <SizeGuide productType="accessories" />
        </div>

        {/* Example 5: Custom Size Chart */}
        <div className="card mb-8">
          <h2 className="heading-md mb-4">Example 5: Custom Size Chart</h2>
          <p className="text-[var(--foreground-muted)] mb-4">
            You can provide custom size data for specialized products.
          </p>
          <SizeGuide
            productType="tops"
            customSizes={[
              { size: "Small", chest: "34-36 / 86-91", waist: "28-30 / 71-76", length: "27 / 69" },
              { size: "Medium", chest: "38-40 / 97-102", waist: "32-34 / 81-86", length: "28 / 71" },
              { size: "Large", chest: "42-44 / 107-112", waist: "36-38 / 91-97", length: "29 / 74" },
            ]}
          />
        </div>

        {/* Integration Example */}
        <div className="card bg-[var(--gradient-primary-soft)] border-[var(--border-focus)]">
          <h2 className="heading-md mb-4">Integration in Product Pages</h2>
          <p className="text-[var(--foreground-muted)] mb-4">
            Typically, you would add the SizeGuide component near the size selector
            on your product pages:
          </p>
          <div className="bg-[var(--surface)] rounded-lg p-6 border border-[var(--border)]">
            <pre className="text-sm overflow-x-auto">
              <code>{`// In your product page component
import SizeGuide from "@/components/SizeGuide";

export default function ProductPage() {
  return (
    <div className="product-details">
      {/* ... product info ... */}

      <div className="size-selector">
        <label>Select Size</label>
        <div className="flex items-center gap-4">
          <select>
            <option>Select a size</option>
            <option>XS</option>
            <option>S</option>
            <option>M</option>
            <option>L</option>
            <option>XL</option>
          </select>

          {/* Add Size Guide here */}
          <SizeGuide productType="tops" />
        </div>
      </div>

      {/* ... rest of product page ... */}
    </div>
  );
}`}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
