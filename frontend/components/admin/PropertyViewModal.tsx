"use client";

import React, { useState } from "react";
import { Property } from "@/types";
import { getPropertyImageUrl } from "@/lib/image-utils";
import {
  X,
  Check,
  Building,
  MapPin,
  DollarSign,
  Calendar,
  Home,
  Star,
  Phone,
  Mail,
  User,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
} from "lucide-react";

interface PropertyViewModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove?: (propertyId: string) => void;
  onReject?: (propertyId: string) => void;
  isLoading?: boolean;
}

export default function PropertyViewModal({
  property,
  isOpen,
  onClose,
  onApprove,
  onReject,
  isLoading = false,
}: PropertyViewModalProps) {
  console.log("PropertyViewModal render:", { isOpen, property: !!property });

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!isOpen || !property) {
    console.log("PropertyViewModal not rendering:", {
      isOpen,
      property: !!property,
    });
    return null;
  }

  const handlePreviousImage = () => {
    if (property.images && property.images.length > 0) {
      setSelectedImageIndex((prev) =>
        prev === 0 ? property.images!.length - 1 : prev - 1
      );
    }
  };

  const handleNextImage = () => {
    if (property.images && property.images.length > 0) {
      setSelectedImageIndex((prev) =>
        prev === property.images!.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case "apartment":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "house":
        return "bg-green-100 text-green-800 border-green-200";
      case "villa":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "office":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Property Details
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Complete property information and management
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Property Header Section */}
          <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-6 mb-6 border border-gray-200">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 bg-gray-200 rounded-xl flex items-center justify-center border-4 border-white shadow-lg overflow-hidden">
                {property.images && property.images.length > 0 ? (
                  <img
                    src={getPropertyImageUrl(property.images[0])}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Building size={40} className="text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {property.title}
                </h3>
                <div className="flex items-center gap-2 mb-3">
                  <MapPin size={16} className="text-gray-500" />
                  <p className="text-gray-600 font-medium">
                    {property.location?.neighborhood &&
                    property.location?.subCity &&
                    property.location?.city &&
                    property.location?.region
                      ? `${property.location.neighborhood}, ${property.location.subCity}, ${property.location.city}, ${property.location.region}`
                      : property.location?.neighborhood ||
                        property.location?.subCity ||
                        property.location?.city ||
                        property.location?.region ||
                        "Location not specified"}
                  </p>
                </div>
                <div className="flex gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                      property.moderationStatus
                    )}`}
                  >
                    {property.moderationStatus}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${getTypeColor(
                      property.type
                    )}`}
                  >
                    {property.type}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Image Gallery Section */}
          {property.images && property.images.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <ImageIcon size={20} className="text-gray-600" />
                Property Images ({property.images.length})
              </h4>

              {/* Main Image Display */}
              <div className="relative mb-4">
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={getPropertyImageUrl(
                      property.images[selectedImageIndex]
                    )}
                    alt={`${property.title} - Image ${selectedImageIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Navigation Arrows */}
                {property.images.length > 1 && (
                  <>
                    <button
                      onClick={handlePreviousImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                {property.images.length > 1 && (
                  <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                    {selectedImageIndex + 1} / {property.images.length}
                  </div>
                )}
              </div>

              {/* Thumbnail Navigation */}
              {property.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {property.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => handleImageClick(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        index === selectedImageIndex
                          ? "border-black"
                          : "border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      <img
                        src={getPropertyImageUrl(image)}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Information Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Basic Information */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Building size={20} className="text-gray-600" />
                Basic Information
              </h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-600">ID</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Property ID</p>
                    <p className="font-medium text-gray-900">{property.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <DollarSign size={16} className="text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Price</p>
                    <p className="font-medium text-gray-900">
                      ${property.price?.toLocaleString() || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <Home size={16} className="text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Type</p>
                    <p className="font-medium text-gray-900">
                      {property.type || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <Calendar size={16} className="text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Created</p>
                    <p className="font-medium text-gray-900">
                      {new Date(
                        String(property.createdAt)
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin size={20} className="text-gray-600" />
                Location Information
              </h4>
              <div className="space-y-4">
                {property.location?.neighborhood && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <MapPin size={16} className="text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Neighborhood</p>
                      <p className="font-medium text-gray-900">
                        {property.location.neighborhood}
                      </p>
                    </div>
                  </div>
                )}
                {property.location?.subCity && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-gray-600">S</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Sub City</p>
                      <p className="font-medium text-gray-900">
                        {property.location.subCity}
                      </p>
                    </div>
                  </div>
                )}
                {property.location?.city && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-gray-600">C</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">City</p>
                      <p className="font-medium text-gray-900">
                        {property.location.city}
                      </p>
                    </div>
                  </div>
                )}
                {property.location?.region && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-gray-600">R</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Region</p>
                      <p className="font-medium text-gray-900">
                        {property.location.region}
                      </p>
                    </div>
                  </div>
                )}
                {!property.location?.neighborhood &&
                  !property.location?.subCity &&
                  !property.location?.city &&
                  !property.location?.region && (
                    <div className="text-center py-8">
                      <MapPin
                        size={32}
                        className="text-gray-400 mx-auto mb-2"
                      />
                      <p className="text-gray-500">
                        No location information available
                      </p>
                    </div>
                  )}
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Home size={20} className="text-gray-600" />
              Property Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {property.description && (
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500 mb-2">Description</p>
                  <p className="text-gray-900 leading-relaxed">
                    {property.description}
                  </p>
                </div>
              )}
              {property.features?.bedrooms && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-600">B</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Bedrooms</p>
                    <p className="font-medium text-gray-900">
                      {property.features.bedrooms}
                    </p>
                  </div>
                </div>
              )}
              {property.features?.bathrooms && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-600">B</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Bathrooms</p>
                    <p className="font-medium text-gray-900">
                      {property.features.bathrooms}
                    </p>
                  </div>
                </div>
              )}
              {property.features?.area && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-600">A</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Area</p>
                    <p className="font-medium text-gray-900">
                      {property.features.area} sq ft
                    </p>
                  </div>
                </div>
              )}
              {property.owner && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <User size={16} className="text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Owner</p>
                    <p className="font-medium text-gray-900">
                      {property.owner.name || "N/A"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <div className="flex gap-3">
              {property.moderationStatus === "pending" &&
                onApprove &&
                onReject && (
                  <>
                    <button
                      onClick={() => onApprove(property.id)}
                      disabled={isLoading}
                      className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors"
                    >
                      <Check size={18} />
                      Approve Property
                    </button>
                    <button
                      onClick={() => onReject(property.id)}
                      disabled={isLoading}
                      className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors"
                    >
                      <X size={18} />
                      Reject Property
                    </button>
                  </>
                )}

              {property.moderationStatus === "approved" && onReject && (
                <button
                  onClick={() => onReject(property.id)}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors"
                >
                  <X size={18} />
                  Reject Property
                </button>
              )}

              {property.moderationStatus === "rejected" && onApprove && (
                <button
                  onClick={() => onApprove(property.id)}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors"
                >
                  <Check size={18} />
                  Approve Property
                </button>
              )}
            </div>

            <button
              onClick={onClose}
              className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
