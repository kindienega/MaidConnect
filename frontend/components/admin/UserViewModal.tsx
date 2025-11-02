"use client";

import React from "react";
import { User } from "@/types";
import {
  X,
  Check,
  Shield,
  User as UserIcon,
  Phone,
  Mail,
  Calendar,
  Building,
  Star,
  Award,
} from "lucide-react";

interface UserViewModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (userId: string) => void;
  onDisapprove: (userId: string) => void;
  onUpgradeToAdmin: (userId: string) => void;
  isLoading?: boolean;
}

export default function UserViewModal({
  user,
  isOpen,
  onClose,
  onApprove,
  onDisapprove,
  onUpgradeToAdmin,
  isLoading = false,
}: UserViewModalProps) {
  if (!isOpen || !user) return null;

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

  const getRoleColor = (role: string) => {
    switch (role) {
      case "SuperAdmin":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Admin":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Broker":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "User":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">User Details</h2>
            <p className="text-sm text-gray-600 mt-1">
              Complete user information and management
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
          {/* Profile Section */}
          <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-6 mb-6 border border-gray-200">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center border-4 border-white shadow-lg overflow-hidden">
                {user.profilePhoto ? (
                  <img
                    src={user.profilePhoto}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserIcon size={40} className="text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {user.name}
                </h3>
                <div className="flex items-center gap-2 mb-3">
                  <Mail size={16} className="text-gray-500" />
                  <p className="text-gray-600 font-medium">{user.email}</p>
                </div>
                <div className="flex gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                      user.status
                    )}`}
                  >
                    {user.status}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${getRoleColor(
                      user.role
                    )}`}
                  >
                    {user.role}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Information Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Basic Information */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <UserIcon size={20} className="text-gray-600" />
                Basic Information
              </h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-600">ID</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">User ID</p>
                    <p className="font-medium text-gray-900">{user.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <Phone size={16} className="text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900">
                      {user.phone || "N/A"}
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
                      {new Date(String(user.createdAt)).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        user.isActive ? "bg-green-500" : "bg-red-500"
                      }`}
                    ></div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-medium text-gray-900">
                      {user.isActive ? "Active" : "Inactive"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Mail size={20} className="text-gray-600" />
                Contact Information
              </h4>
              <div className="space-y-4">
                {user.contactInfo?.whatsapp && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-green-600">
                        W
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">WhatsApp</p>
                      <p className="font-medium text-gray-900">
                        {user.contactInfo.whatsapp}
                      </p>
                    </div>
                  </div>
                )}
                {user.contactInfo?.telegram && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-blue-600">T</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Telegram</p>
                      <p className="font-medium text-gray-900">
                        {user.contactInfo.telegram}
                      </p>
                    </div>
                  </div>
                )}
                {user.telegramId && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-blue-600">
                        ID
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Telegram ID</p>
                      <p className="font-medium text-gray-900">
                        {user.telegramId}
                      </p>
                    </div>
                  </div>
                )}
                {!user.contactInfo?.whatsapp &&
                  !user.contactInfo?.telegram &&
                  !user.telegramId && (
                    <div className="text-center py-8">
                      <Mail size={32} className="text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">
                        No contact information available
                      </p>
                    </div>
                  )}
              </div>
            </div>
          </div>

          {/* Broker Information (if applicable) */}
          {user.role === "Broker" && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Building size={20} className="text-gray-600" />
                Broker Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {user.companyName && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <Building size={16} className="text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Company</p>
                      <p className="font-medium text-gray-900">
                        {user.companyName}
                      </p>
                    </div>
                  </div>
                )}
                {user.yearsOfExperience && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <Award size={16} className="text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Experience</p>
                      <p className="font-medium text-gray-900">
                        {user.yearsOfExperience} years
                      </p>
                    </div>
                  </div>
                )}
                {user.rating && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <Star size={16} className="text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Rating</p>
                      <p className="font-medium text-gray-900">
                        {user.rating}/5
                      </p>
                    </div>
                  </div>
                )}
                {user.activeListings && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-gray-600">L</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Active Listings</p>
                      <p className="font-medium text-gray-900">
                        {user.activeListings}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <div className="flex gap-3">
              {user.status === "pending" && (
                <>
                  <button
                    onClick={() => onApprove(user.id)}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors"
                  >
                    <Check size={18} />
                    Approve User
                  </button>
                  <button
                    onClick={() => onDisapprove(user.id)}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors"
                  >
                    <X size={18} />
                    Disapprove User
                  </button>
                </>
              )}

              {user.status === "approved" && (
                <button
                  onClick={() => onDisapprove(user.id)}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors"
                >
                  <X size={18} />
                  Disapprove User
                </button>
              )}

              {user.status === "rejected" && (
                <button
                  onClick={() => onApprove(user.id)}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors"
                >
                  <Check size={18} />
                  Approve User
                </button>
              )}

              {user.role !== "SuperAdmin" && user.role !== "Admin" && (
                <button
                  onClick={() => onUpgradeToAdmin(user.id)}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors"
                >
                  <Shield size={18} />
                  Upgrade to Admin
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

