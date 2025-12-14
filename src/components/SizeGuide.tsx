"use client";

import { useState } from "react";
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from "./ui/modal";
import Button from "./ui/Button";

type ProductType = "tops" | "bottoms" | "shoes" | "accessories";
type MeasurementUnit = "inches" | "cm";

interface SizeChartRow {
  size: string;
  chest?: string;
  waist?: string;
  hips?: string;
  inseam?: string;
  length?: string;
  usSize?: string;
  euSize?: string;
  ukSize?: string;
}

interface SizeGuideProps {
  productType?: ProductType;
  customSizes?: SizeChartRow[];
}

const defaultSizeCharts: Record<ProductType, SizeChartRow[]> = {
  tops: [
    { size: "XS", chest: "32-34 / 81-86", waist: "24-26 / 61-66", length: "26 / 66" },
    { size: "S", chest: "34-36 / 86-91", waist: "26-28 / 66-71", length: "27 / 69" },
    { size: "M", chest: "36-38 / 91-97", waist: "28-30 / 71-76", length: "28 / 71" },
    { size: "L", chest: "38-40 / 97-102", waist: "30-32 / 76-81", length: "29 / 74" },
    { size: "XL", chest: "40-42 / 102-107", waist: "32-34 / 81-86", length: "30 / 76" },
    { size: "XXL", chest: "42-44 / 107-112", waist: "34-36 / 86-91", length: "31 / 79" },
  ],
  bottoms: [
    { size: "XS", waist: "24-26 / 61-66", hips: "34-36 / 86-91", inseam: "28 / 71" },
    { size: "S", waist: "26-28 / 66-71", hips: "36-38 / 91-97", inseam: "29 / 74" },
    { size: "M", waist: "28-30 / 71-76", hips: "38-40 / 97-102", inseam: "30 / 76" },
    { size: "L", waist: "30-32 / 76-81", hips: "40-42 / 102-107", inseam: "31 / 79" },
    { size: "XL", waist: "32-34 / 81-86", hips: "42-44 / 107-112", inseam: "32 / 81" },
    { size: "XXL", waist: "34-36 / 86-91", hips: "44-46 / 112-117", inseam: "33 / 84" },
  ],
  shoes: [
    { size: "US 6", usSize: "6", euSize: "36", ukSize: "3.5" },
    { size: "US 7", usSize: "7", euSize: "37", ukSize: "4.5" },
    { size: "US 8", usSize: "8", euSize: "38-39", ukSize: "5.5" },
    { size: "US 9", usSize: "9", euSize: "40", ukSize: "6.5" },
    { size: "US 10", usSize: "10", euSize: "41", ukSize: "7.5" },
    { size: "US 11", usSize: "11", euSize: "42-43", ukSize: "8.5" },
    { size: "US 12", usSize: "12", euSize: "44", ukSize: "9.5" },
  ],
  accessories: [
    { size: "XS", length: "52 / 132" },
    { size: "S", length: "54 / 137" },
    { size: "M", length: "56 / 142" },
    { size: "L", length: "58 / 147" },
    { size: "XL", length: "60 / 152" },
    { size: "XXL", length: "62 / 157" },
  ],
};

const measurementGuides: Record<ProductType, { title: string; steps: string[] }> = {
  tops: {
    title: "How to Measure for Tops",
    steps: [
      "Chest: Measure around the fullest part of your chest, keeping the tape horizontal.",
      "Waist: Measure around your natural waistline, keeping the tape comfortably loose.",
      "Length: Measure from the highest point of your shoulder to the desired length.",
    ],
  },
  bottoms: {
    title: "How to Measure for Bottoms",
    steps: [
      "Waist: Measure around your natural waistline where you normally wear your pants.",
      "Hips: Measure around the fullest part of your hips, about 8 inches below your waist.",
      "Inseam: Measure from the crotch seam to the bottom of your ankle.",
    ],
  },
  shoes: {
    title: "How to Measure for Shoes",
    steps: [
      "Stand on a piece of paper with your heel against a wall.",
      "Mark the longest part of your foot on the paper.",
      "Measure the distance from the wall to the mark.",
      "Compare your measurement to our size chart.",
    ],
  },
  accessories: {
    title: "How to Measure for Accessories",
    steps: [
      "Length: Use a flexible measuring tape to measure around the intended area.",
      "For belts, measure your waist where you'll wear it.",
      "For scarves, consider your preferred drape length.",
    ],
  },
};

const sizingNotes: Record<ProductType, string> = {
  tops: "Our tops run true to size. If you're between sizes, we recommend sizing up for a more relaxed fit.",
  bottoms: "Our bottoms have a modern fit. For a looser fit, consider sizing up.",
  shoes: "Our shoes are sized in US sizing. If you're between sizes, we recommend sizing up for comfort.",
  accessories: "Measurements shown are for the product itself. Choose based on your preferred fit and style.",
};

export default function SizeGuide({ productType = "tops", customSizes }: SizeGuideProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [unit, setUnit] = useState<MeasurementUnit>("inches");

  const sizeChart = customSizes || defaultSizeCharts[productType];
  const measureGuide = measurementGuides[productType];
  const note = sizingNotes[productType];

  const renderSizeChart = () => {
    if (productType === "shoes") {
      return (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="py-3 px-4 text-left font-semibold text-[var(--foreground)]">
                  US Size
                </th>
                <th className="py-3 px-4 text-left font-semibold text-[var(--foreground)]">
                  EU Size
                </th>
                <th className="py-3 px-4 text-left font-semibold text-[var(--foreground)]">
                  UK Size
                </th>
              </tr>
            </thead>
            <tbody>
              {sizeChart.map((row, index) => (
                <tr
                  key={index}
                  className="border-b border-[var(--border)] hover:bg-[var(--surface-hover)] transition-colors"
                >
                  <td className="py-3 px-4 text-[var(--foreground-muted)]">{row.usSize}</td>
                  <td className="py-3 px-4 text-[var(--foreground-muted)]">{row.euSize}</td>
                  <td className="py-3 px-4 text-[var(--foreground-muted)]">{row.ukSize}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (productType === "accessories") {
      return (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="py-3 px-4 text-left font-semibold text-[var(--foreground)]">
                  Size
                </th>
                <th className="py-3 px-4 text-left font-semibold text-[var(--foreground)]">
                  Length (in / cm)
                </th>
              </tr>
            </thead>
            <tbody>
              {sizeChart.map((row, index) => (
                <tr
                  key={index}
                  className="border-b border-[var(--border)] hover:bg-[var(--surface-hover)] transition-colors"
                >
                  <td className="py-3 px-4 font-semibold text-[var(--foreground)]">{row.size}</td>
                  <td className="py-3 px-4 text-[var(--foreground-muted)]">{row.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (productType === "tops") {
      return (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="py-3 px-4 text-left font-semibold text-[var(--foreground)]">
                  Size
                </th>
                <th className="py-3 px-4 text-left font-semibold text-[var(--foreground)]">
                  Chest (in / cm)
                </th>
                <th className="py-3 px-4 text-left font-semibold text-[var(--foreground)]">
                  Waist (in / cm)
                </th>
                <th className="py-3 px-4 text-left font-semibold text-[var(--foreground)]">
                  Length (in / cm)
                </th>
              </tr>
            </thead>
            <tbody>
              {sizeChart.map((row, index) => (
                <tr
                  key={index}
                  className="border-b border-[var(--border)] hover:bg-[var(--surface-hover)] transition-colors"
                >
                  <td className="py-3 px-4 font-semibold text-[var(--foreground)]">{row.size}</td>
                  <td className="py-3 px-4 text-[var(--foreground-muted)]">{row.chest}</td>
                  <td className="py-3 px-4 text-[var(--foreground-muted)]">{row.waist}</td>
                  <td className="py-3 px-4 text-[var(--foreground-muted)]">{row.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="py-3 px-4 text-left font-semibold text-[var(--foreground)]">Size</th>
              <th className="py-3 px-4 text-left font-semibold text-[var(--foreground)]">
                Waist (in / cm)
              </th>
              <th className="py-3 px-4 text-left font-semibold text-[var(--foreground)]">
                Hips (in / cm)
              </th>
              <th className="py-3 px-4 text-left font-semibold text-[var(--foreground)]">
                Inseam (in / cm)
              </th>
            </tr>
          </thead>
          <tbody>
            {sizeChart.map((row, index) => (
              <tr
                key={index}
                className="border-b border-[var(--border)] hover:bg-[var(--surface-hover)] transition-colors"
              >
                <td className="py-3 px-4 font-semibold text-[var(--foreground)]">{row.size}</td>
                <td className="py-3 px-4 text-[var(--foreground-muted)]">{row.waist}</td>
                <td className="py-3 px-4 text-[var(--foreground-muted)]">{row.hips}</td>
                <td className="py-3 px-4 text-[var(--foreground-muted)]">{row.inseam}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
        Size Guide
      </Button>

      <Modal open={isOpen} onClose={() => setIsOpen(false)}>
        <ModalBackdrop>
          <ModalContent size="lg">
            <ModalHeader>
              <ModalTitle>Size Guide</ModalTitle>
              <ModalCloseButton />
            </ModalHeader>

            <ModalBody>
              <div className="space-y-8">
                {/* Size Chart */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="heading-md">Size Chart</h3>
                    {productType !== "shoes" && (
                      <div className="flex gap-2 bg-[var(--surface)] rounded-full p-1 border border-[var(--border)]">
                        <button
                          onClick={() => setUnit("inches")}
                          className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                            unit === "inches"
                              ? "bg-[var(--accent-violet)] text-white"
                              : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                          }`}
                        >
                          Inches
                        </button>
                        <button
                          onClick={() => setUnit("cm")}
                          className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                            unit === "cm"
                              ? "bg-[var(--accent-violet)] text-white"
                              : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                          }`}
                        >
                          CM
                        </button>
                      </div>
                    )}
                  </div>
                  {renderSizeChart()}
                </div>

                {/* How to Measure */}
                <div className="bg-[var(--surface)] rounded-xl p-6 border border-[var(--border)]">
                  <div className="flex gap-6">
                    <div className="flex-1">
                      <h3 className="heading-md mb-4">{measureGuide.title}</h3>
                      <ol className="space-y-3">
                        {measureGuide.steps.map((step, index) => (
                          <li key={index} className="flex gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--gradient-primary-soft)] text-[var(--accent-violet)] font-semibold text-sm flex items-center justify-center">
                              {index + 1}
                            </span>
                            <span className="text-[var(--foreground-muted)] leading-relaxed">
                              {step}
                            </span>
                          </li>
                        ))}
                      </ol>
                    </div>
                    <div className="flex-shrink-0 hidden md:flex items-center justify-center w-48 h-48 bg-[var(--background)] rounded-lg border border-[var(--border)]">
                      <svg
                        width="120"
                        height="120"
                        viewBox="0 0 120 120"
                        fill="none"
                        className="text-[var(--accent-violet)]"
                      >
                        <path
                          d="M60 10 L80 30 L80 80 L60 100 L40 80 L40 30 Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                          strokeDasharray="4 4"
                          opacity="0.3"
                        />
                        <circle cx="60" cy="30" r="15" stroke="currentColor" strokeWidth="2" fill="none" />
                        <line x1="60" y1="45" x2="60" y2="70" stroke="currentColor" strokeWidth="2" />
                        <line x1="40" y1="50" x2="80" y2="50" stroke="currentColor" strokeWidth="2" />
                        <line x1="60" y1="70" x2="45" y2="95" stroke="currentColor" strokeWidth="2" />
                        <line x1="60" y1="70" x2="75" y2="95" stroke="currentColor" strokeWidth="2" />
                        <path
                          d="M 30 50 L 35 45"
                          stroke="currentColor"
                          strokeWidth="1"
                          opacity="0.5"
                        />
                        <path
                          d="M 90 50 L 85 45"
                          stroke="currentColor"
                          strokeWidth="1"
                          opacity="0.5"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Sizing Notes */}
                <div className="flex gap-3 p-4 bg-[var(--gradient-primary-soft)] rounded-lg border border-[var(--border-focus)]">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="flex-shrink-0 mt-0.5 text-[var(--accent-violet)]"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-[var(--foreground)] mb-1">Sizing Note</h4>
                    <p className="text-sm text-[var(--foreground-muted)] leading-relaxed">{note}</p>
                  </div>
                </div>
              </div>
            </ModalBody>
          </ModalContent>
        </ModalBackdrop>
      </Modal>
    </>
  );
}
