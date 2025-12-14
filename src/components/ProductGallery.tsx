"use client";

import { useState, useEffect, useCallback, useRef, type TouchEvent } from "react";
import Image from "next/image";

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface ProductGalleryProps {
  images: Array<{
    url: string;
    altText?: string;
    width?: number;
    height?: number;
  }>;
  productTitle: string;
}

// ============================================================================
// Loading Skeleton Component
// ============================================================================

const GallerySkeleton = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
      {/* Main image skeleton */}
      <div className="lg:col-span-10 order-2 lg:order-1">
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-[var(--surface)] animate-pulse border border-[var(--border)]" />
      </div>

      {/* Thumbnails skeleton */}
      <div className="lg:col-span-2 order-1 lg:order-2">
        <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto pb-2 lg:pb-0 lg:max-h-[600px]">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex-shrink-0 w-20 h-20 lg:w-full lg:h-auto lg:aspect-square rounded-lg bg-[var(--surface)] animate-pulse border border-[var(--border)]"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// Lightbox Component
// ============================================================================

interface LightboxProps {
  images: ProductGalleryProps["images"];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
  productTitle: string;
}

const Lightbox = ({
  images,
  currentIndex,
  onClose,
  onNext,
  onPrevious,
  productTitle,
}: LightboxProps) => {
  const currentImage = images[currentIndex];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrevious();
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose, onNext, onPrevious]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image gallery lightbox"
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 md:top-8 md:right-8 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all focus:outline-none focus:ring-2 focus:ring-white/50"
        aria-label="Close lightbox"
      >
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      {/* Previous Button */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrevious();
          }}
          className="absolute left-4 md:left-8 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-white/50"
          disabled={currentIndex === 0}
          aria-label="Previous image"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      )}

      {/* Next Button */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="absolute right-4 md:right-8 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-white/50"
          disabled={currentIndex === images.length - 1}
          aria-label="Next image"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      )}

      {/* Image Container */}
      <div
        className="relative max-w-7xl max-h-[90vh] mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={currentImage.url}
          alt={currentImage.altText || `${productTitle} - Image ${currentIndex + 1}`}
          width={currentImage.width || 1200}
          height={currentImage.height || 1200}
          className="max-w-full max-h-[90vh] object-contain rounded-lg"
          quality={95}
          priority
        />
      </div>

      {/* Counter */}
      {images.length > 1 && (
        <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium">
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// ProductGallery Component
// ============================================================================

export default function ProductGallery({ images, productTitle }: ProductGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const mainImageRef = useRef<HTMLDivElement>(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  // Handle single image case
  const hasMultipleImages = images.length > 1;

  // Handle keyboard navigation
  useEffect(() => {
    if (!hasMultipleImages) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        goToNext();
      } else if (e.key === "ArrowLeft") {
        goToPrevious();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, images.length, hasMultipleImages]);

  // Navigation functions
  const goToNext = useCallback(() => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsZoomed(false);
    }
  }, [currentIndex, images.length]);

  const goToPrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setIsZoomed(false);
    }
  }, [currentIndex]);

  const goToImage = useCallback((index: number) => {
    setCurrentIndex(index);
    setIsZoomed(false);
  }, []);

  // Touch event handlers for swipe
  const onTouchStart = (e: TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }
  };

  // Lightbox handlers
  const openLightbox = useCallback(() => {
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  const handleNextInLightbox = useCallback(() => {
    setCurrentIndex((prev) => Math.min(prev + 1, images.length - 1));
  }, [images.length]);

  const handlePreviousInLightbox = useCallback(() => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  // Handle image load
  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const currentImage = images[currentIndex];

  // Show skeleton while loading
  if (isLoading && currentIndex === 0) {
    return (
      <>
        <GallerySkeleton />
        <div className="hidden">
          <Image
            src={currentImage.url}
            alt={currentImage.altText || `${productTitle} - Image 1`}
            width={currentImage.width || 800}
            height={currentImage.height || 800}
            onLoad={handleImageLoad}
            priority
          />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
        {/* Thumbnails - Vertical on desktop, Horizontal on mobile */}
        {hasMultipleImages && (
          <div className="lg:col-span-2 order-1 lg:order-2">
            <div
              className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto pb-2 lg:pb-0 lg:max-h-[600px] scrollbar-thin"
              role="tablist"
              aria-label="Product image thumbnails"
            >
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      goToImage(index);
                    }
                  }}
                  className={`flex-shrink-0 w-20 h-20 lg:w-full lg:h-auto lg:aspect-square rounded-lg overflow-hidden border-2 transition-all focus:outline-none focus:ring-2 focus:ring-[var(--accent-violet)] ${
                    index === currentIndex
                      ? "border-[var(--accent-violet)] scale-105 shadow-lg"
                      : "border-[var(--border)] hover:border-[var(--border-hover)] opacity-60 hover:opacity-100"
                  }`}
                  role="tab"
                  aria-selected={index === currentIndex}
                  aria-label={`View image ${index + 1} of ${images.length}`}
                >
                  <Image
                    src={image.url}
                    alt={image.altText || `${productTitle} thumbnail ${index + 1}`}
                    width={100}
                    height={100}
                    className="w-full h-full object-cover"
                    sizes="100px"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main Image Display */}
        <div
          className={`order-2 lg:order-1 ${
            hasMultipleImages ? "lg:col-span-10" : "lg:col-span-12"
          }`}
        >
          <div
            ref={mainImageRef}
            className="relative aspect-square rounded-2xl overflow-hidden bg-[var(--surface)] border border-[var(--border)] group cursor-pointer"
            onClick={openLightbox}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            role="button"
            aria-label="Click to view full screen"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openLightbox();
              }
            }}
          >
            <Image
              src={currentImage.url}
              alt={currentImage.altText || `${productTitle} - Image ${currentIndex + 1}`}
              fill
              className={`object-cover transition-transform duration-500 ${
                isZoomed ? "scale-110" : "scale-100"
              }`}
              sizes="(max-width: 1024px) 100vw, 80vw"
              quality={90}
              priority={currentIndex === 0}
            />

            {/* Zoom indicator overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300">
              <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-sm text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10 3h4v4M14 3l-5 5m-3 5H2v-4m4 4l-5-5" />
                </svg>
                <span>Click to expand</span>
              </div>
            </div>

            {/* Navigation arrows for mobile */}
            {hasMultipleImages && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPrevious();
                  }}
                  className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 hover:bg-white text-[#0a0a0f] transition-all opacity-0 group-hover:opacity-100 disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[var(--accent-violet)]"
                  disabled={currentIndex === 0}
                  aria-label="Previous image"
                  tabIndex={-1}
                >
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNext();
                  }}
                  className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 hover:bg-white text-[#0a0a0f] transition-all opacity-0 group-hover:opacity-100 disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[var(--accent-violet)]"
                  disabled={currentIndex === images.length - 1}
                  aria-label="Next image"
                  tabIndex={-1}
                >
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              </>
            )}

            {/* Image counter */}
            {hasMultipleImages && (
              <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-sm text-white text-sm font-medium">
                {currentIndex + 1} / {images.length}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          images={images}
          currentIndex={currentIndex}
          onClose={closeLightbox}
          onNext={handleNextInLightbox}
          onPrevious={handlePreviousInLightbox}
          productTitle={productTitle}
        />
      )}
    </>
  );
}
