"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { getPropertyImageUrl } from "@/lib/image-utils";

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );

  const openImageModal = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeImageModal = () => {
    setSelectedImageIndex(null);
  };

  const nextImage = () => {
    if (selectedImageIndex !== null && selectedImageIndex < images.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (selectedImageIndex !== null && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      closeImageModal();
    } else if (e.key === "ArrowRight") {
      nextImage();
    } else if (e.key === "ArrowLeft") {
      prevImage();
    }
  };

  const renderImageLayout = () => {
    if (images.length === 1) {
      return (
        <div
          className="relative aspect-[16/9] overflow-hidden rounded-lg cursor-pointer"
          onClick={() => openImageModal(0)}
        >
          <Image
            src={getPropertyImageUrl(images[0])}
            alt={title}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              console.error(
                "Image failed to load:",
                getPropertyImageUrl(images[0])
              );
              // Fallback to placeholder
              e.currentTarget.src = "/placeholder-property.jpg";
            }}
          />
        </div>
      );
    }

    if (images.length === 2) {
      return (
        <div className="grid grid-cols-2 gap-3">
          {images.map((img, i) => (
            <div
              key={i}
              className="relative aspect-[4/3] overflow-hidden rounded-lg cursor-pointer"
              onClick={() => openImageModal(i)}
            >
              <Image
                src={getPropertyImageUrl(img)}
                alt={`${title} - Image ${i + 1}`}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  console.error(
                    "Image failed to load:",
                    getPropertyImageUrl(img)
                  );
                  e.currentTarget.src = "/placeholder-property.jpg";
                }}
              />
            </div>
          ))}
        </div>
      );
    }

    if (images.length === 3) {
      return (
        <div className="grid grid-cols-3 gap-3">
          {images.map((img, i) => (
            <div
              key={i}
              className="relative aspect-[4/3] overflow-hidden rounded-lg cursor-pointer"
              onClick={() => openImageModal(i)}
            >
              <Image
                src={getPropertyImageUrl(img)}
                alt={`${title} - Image ${i + 1}`}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      );
    }

    if (images.length === 4) {
      return (
        <div className="grid grid-cols-2 gap-3">
          {images.map((img, i) => (
            <div
              key={i}
              className="relative aspect-[4/3] overflow-hidden rounded-lg cursor-pointer"
              onClick={() => openImageModal(i)}
            >
              <Image
                src={getPropertyImageUrl(img)}
                alt={`${title} - Image ${i + 1}`}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      );
    }

    if (images.length === 5) {
      return (
        <div className="space-y-3">
          {/* Main large image */}
          <div
            className="relative aspect-[16/9] overflow-hidden rounded-lg cursor-pointer"
            onClick={() => openImageModal(0)}
          >
            <Image
              src={getPropertyImageUrl(images[0])}
              alt={`${title} - Main Image`}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
          {/* 4 smaller images in a row */}
          <div className="grid grid-cols-4 gap-3">
            {images.slice(1).map((img, i) => (
              <div
                key={i + 1}
                className="relative aspect-[4/3] overflow-hidden rounded-lg cursor-pointer"
                onClick={() => openImageModal(i + 1)}
              >
                <Image
                  src={getPropertyImageUrl(img)}
                  alt={`${title} - Image ${i + 2}`}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      );
    }

    // For 5 or more images: big image at top, scrollable smaller images underneath
    return (
      <div className="space-y-3">
        {/* Main large image */}
        <div
          className="relative aspect-[16/9] overflow-hidden rounded-lg cursor-pointer"
          onClick={() => openImageModal(0)}
        >
          <Image
            src={getPropertyImageUrl(images[0])}
            alt={`${title} - Main Image`}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
        {/* Thumbnails: fixed size, scrollable if overflow */}
        <div className="overflow-x-auto min-w-0">
          <div className="flex gap-3 pb-2">
            {images.slice(1).map((img, i) => (
              <div
                key={i + 1}
                className="relative w-28 h-24 flex-shrink-0 overflow-hidden rounded-lg cursor-pointer"
                onClick={() => openImageModal(i + 1)}
              >
                <Image
                  src={getPropertyImageUrl(img)}
                  alt={`${title} - Image ${i + 2}`}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Property Images</h2>
        <span className="text-sm text-gray-500">{images.length} photos</span>
      </div>

      {renderImageLayout()}

      {/* Image Modal */}
      {selectedImageIndex !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
          onClick={closeImageModal}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <div className="relative max-w-4xl max-h-[90vh] mx-4">
            {/* Close button */}
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Navigation arrows */}
            {selectedImageIndex > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-colors"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            )}

            {selectedImageIndex < images.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-colors"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            )}

            {/* Image */}
            <Image
              src={getPropertyImageUrl(images[selectedImageIndex])}
              alt={`${title} - Image ${selectedImageIndex + 1}`}
              width={800}
              height={600}
              className="max-w-full max-h-[90vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Image counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full">
              {selectedImageIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
