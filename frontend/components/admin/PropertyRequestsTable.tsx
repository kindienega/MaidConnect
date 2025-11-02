"use client";

import React, { useMemo, useState, useRef, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { downloadCSV } from "@/lib/utils";
import {
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Eye,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Search,
  Download,
  Clock,
  Play,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Building,
  DollarSign,
  FileText,
} from "lucide-react";
import { IPropertyRequest } from "@/types";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdatePropertyRequestStatus } from "@/hooks/usePropertyRequestActions";

interface PropertyRequestsTableProps {
  propertyRequests: IPropertyRequest[];
  onRefresh?: () => void;
}

const STATUS = ["All", "pending", "in-progress", "completed", "rejected"];
const PROPERTY_TYPES = ["All", "apartment", "house", "commercial", "office"];
const ROWS_PER_PAGE_OPTIONS = [10, 50, 100];
const DEFAULT_ROWS_PER_PAGE = 10;

// Available status options for updating (excluding current status)
const getAvailableStatuses = (currentStatus: string) => {
  const allStatuses = ["pending", "in-progress", "completed", "rejected"];
  return allStatuses.filter((status) => status !== currentStatus);
};

// Get icon and styling for each status
const getStatusConfig = (status: string) => {
  switch (status) {
    case "pending":
      return {
        icon: Clock,
        label: "Mark Pending",
        className: "text-amber-600 hover:bg-amber-50 hover:text-amber-700",
        iconClassName: "text-amber-600",
      };
    case "in-progress":
      return {
        icon: Play,
        label: "Mark In Progress",
        className: "text-blue-600 hover:bg-blue-50 hover:text-blue-700",
        iconClassName: "text-blue-600",
      };
    case "completed":
      return {
        icon: CheckCircle,
        label: "Mark Completed",
        className: "text-green-600 hover:bg-green-50 hover:text-green-700",
        iconClassName: "text-green-600",
      };
    case "rejected":
      return {
        icon: XCircle,
        label: "Mark Rejected",
        className: "text-red-600 hover:bg-red-50 hover:text-red-700",
        iconClassName: "text-red-600",
      };
    default:
      return {
        icon: AlertCircle,
        label: "Unknown Status",
        className: "text-gray-600 hover:bg-gray-50 hover:text-gray-700",
        iconClassName: "text-gray-600",
      };
  }
};

function getStatusLabel(propertyRequest: IPropertyRequest) {
  switch (propertyRequest.status) {
    case "completed":
      return { label: "Completed", color: "text-green-600" };
    case "in-progress":
      return { label: "In Progress", color: "text-blue-600" };
    case "pending":
      return { label: "Pending", color: "text-yellow-600" };
    case "rejected":
      return { label: "Rejected", color: "text-red-600" };
    default:
      return { label: "Pending", color: "text-yellow-600" };
  }
}

export default function PropertyRequestsTable({
  propertyRequests,
  onRefresh,
}: PropertyRequestsTableProps) {
  const [status, setStatus] = useState("All");
  const [type, setType] = useState("All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [actionOpen, setActionOpen] = useState<string | null>(null);
  const [actionDirection, setActionDirection] = useState<"up" | "down">("down");
  const [selectedRequest, setSelectedRequest] =
    useState<IPropertyRequest | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const actionBtnRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const actionDropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>(
    {}
  );

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE);

  // Use the mutation hook
  const updateStatusMutation = useUpdatePropertyRequestStatus();

  // Close dropdown on outside click
  useEffect(() => {
    if (!actionOpen) return;
    function handleClick(e: MouseEvent) {
      const btn = actionBtnRefs.current[actionOpen!];
      const dropdown = actionDropdownRefs.current[actionOpen!];
      if (btn && btn.contains(e.target as Node)) {
        return;
      }
      if (dropdown && dropdown.contains(e.target as Node)) {
        return;
      }
      setActionOpen(null);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [actionOpen]);

  // Filtering, searching, sorting
  const filtered = useMemo(() => {
    let data = [...propertyRequests];

    if (status !== "All") {
      data = data.filter((p) => p.status === status);
    }

    if (type !== "All") {
      data = data.filter((p) => p.type === type);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      data = data.filter(
        (p) =>
          (p.name?.toLowerCase() || "").includes(searchLower) ||
          (p.email?.toLowerCase() || "").includes(searchLower) ||
          (p.location?.toLowerCase() || "").includes(searchLower) ||
          (p.description?.toLowerCase() || "").includes(searchLower)
      );
    }

    data.sort((a, b) => {
      if (sortBy === "name") {
        if (sortDir === "asc")
          return (a.name || "").localeCompare(b.name || "");
        return (b.name || "").localeCompare(a.name || "");
      }
      if (sortBy === "createdAt") {
        if (sortDir === "asc")
          return String(a.createdAt).localeCompare(String(b.createdAt));
        return String(b.createdAt).localeCompare(String(a.createdAt));
      }
      return 0;
    });

    return data;
  }, [propertyRequests, status, type, search, sortBy, sortDir]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const paginated = filtered.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  // Export handler
  const handleExport = () => {
    downloadCSV(filtered, "property-requests.csv");
  };

  // Action handlers
  const handleView = (request: IPropertyRequest) => {
    setSelectedRequest(request);
    setIsViewModalOpen(true);
    setActionOpen(null);
  };

  const handleStatusUpdate = async (
    requestId: string,
    newStatus: "pending" | "in-progress" | "completed" | "rejected"
  ) => {
    try {
      await updateStatusMutation.mutateAsync({
        propertyId: requestId,
        data: { status: newStatus },
      });
      setActionOpen(null);
      if (onRefresh) onRefresh();
    } catch (error) {
      // Error handling is done in the mutation hook
      console.error("Failed to update status:", error);
    }
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (value: string) => {
    const newRowsPerPage = parseInt(value);
    setRowsPerPage(newRowsPerPage);
    setPage(1); // Reset to first page when changing rows per page
  };

  // Handle opening the action menu and determine direction
  const handleActionOpen = (requestId: string) => {
    const btn = actionBtnRefs.current[requestId];
    if (btn) {
      const rect = btn.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      // 160px is an estimate for dropdown height
      if (rect.bottom + 160 > viewportHeight) {
        setActionDirection("up");
      } else {
        setActionDirection("down");
      }
    }
    setActionOpen(actionOpen === requestId ? null : requestId);
  };

  return (
    <>
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Property Requests Management
            </h2>
            <p className="text-muted-foreground">
              Manage and monitor all property requests from users
            </p>
          </div>
          <Button onClick={handleExport} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filters & Search</CardTitle>
            <CardDescription>
              Filter requests by status or search by name/email/location
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Select
                value={status}
                onValueChange={(value) => {
                  setStatus(value);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s === "All"
                        ? "All Statuses"
                        : s.charAt(0).toUpperCase() + s.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Select
                value={type}
                onValueChange={(value) => {
                  setType(value);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  {PROPERTY_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t === "All"
                        ? "All Types"
                        : t.charAt(0).toUpperCase() + t.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Select
                value={rowsPerPage.toString()}
                onValueChange={handleRowsPerPageChange}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Rows per page" />
                </SelectTrigger>
                <SelectContent>
                  {ROWS_PER_PAGE_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option.toString()}>
                      {option} rows
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="relative flex-1 sm:max-w-[300px]">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search requests..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-8"
              />
            </div>

            {search && (
              <div className="text-sm text-muted-foreground">
                {filtered.length} of {propertyRequests.length} requests found
              </div>
            )}
          </CardContent>
        </Card>

        {/* Property Requests Table */}
        <Card>
          <CardHeader>
            <CardTitle>Property Requests List</CardTitle>
            <CardDescription>
              Showing {paginated.length} of {filtered.length} requests (
              {rowsPerPage} per page)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead
                      className="cursor-pointer w-32 min-w-[120px]"
                      onClick={() => {
                        setSortBy("name");
                        setSortDir(sortDir === "asc" ? "desc" : "asc");
                      }}
                    >
                      Name
                      {sortBy === "name" &&
                        (sortDir === "asc" ? (
                          <ChevronUp className="inline ml-1 w-4 h-4" />
                        ) : (
                          <ChevronDown className="inline ml-1 w-4 h-4" />
                        ))}
                    </TableHead>

                    <TableHead className="w-40 min-w-[140px]">Email</TableHead>
                    <TableHead className="w-32 min-w-[120px]">Phone</TableHead>
                    <TableHead className="w-24 min-w-[80px]">Type</TableHead>
                    <TableHead className="w-32 min-w-[120px]">
                      Budget Range
                    </TableHead>
                    <TableHead className="w-32 min-w-[120px]">
                      Location
                    </TableHead>
                    <TableHead
                      className="cursor-pointer w-32 min-w-[100px]"
                      onClick={() => {
                        setSortBy("createdAt");
                        setSortDir(sortDir === "asc" ? "desc" : "asc");
                      }}
                    >
                      Created
                      {sortBy === "createdAt" &&
                        (sortDir === "asc" ? (
                          <ChevronUp className="inline ml-1 w-4 h-4" />
                        ) : (
                          <ChevronDown className="inline ml-1 w-4 h-4" />
                        ))}
                    </TableHead>
                    <TableHead className="w-20 min-w-[80px]">Status</TableHead>
                    <TableHead className="w-20 min-w-[80px]">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginated.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={9}
                        className="text-center py-8 text-gray-500"
                      >
                        {search
                          ? "No requests found matching your search."
                          : "No property requests available."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginated.map((request: IPropertyRequest) => {
                      const status = getStatusLabel(request);
                      return (
                        <TableRow key={request.id} className="even:bg-muted/50">
                          <TableCell className="w-32 min-w-[120px]">
                            {request.name}
                          </TableCell>
                          <TableCell className="w-40 min-w-[140px]">
                            {request.email}
                          </TableCell>
                          <TableCell className="w-32 min-w-[120px]">
                            {request.phone}
                          </TableCell>
                          <TableCell className="w-24 min-w-[80px]">
                            {request.type}
                          </TableCell>
                          <TableCell className="w-32 min-w-[120px]">
                            {request.minPrice && request.maxPrice
                              ? `ETB ${request.minPrice.toLocaleString()} - ${request.maxPrice.toLocaleString()}`
                              : "N/A"}
                          </TableCell>
                          <TableCell className="w-32 min-w-[120px]">
                            {request.location}
                          </TableCell>
                          <TableCell className="w-32 min-w-[100px]">
                            {new Date(
                              String(request.createdAt)
                            ).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="w-20 min-w-[80px]">
                            <span className={`font-semibold ${status.color}`}>
                              {status.label}
                            </span>
                          </TableCell>
                          <TableCell className="w-20 min-w-[80px]">
                            <div className="relative">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                ref={(el) =>
                                  (actionBtnRefs.current[request.id] = el)
                                }
                                onClick={() => handleActionOpen(request.id)}
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                              {actionOpen === request.id && (
                                <Card
                                  ref={(el) =>
                                    (actionDropdownRefs.current[request.id] =
                                      el)
                                  }
                                  className={`absolute right-0 z-10 w-52 shadow-lg border border-gray-200 ${
                                    actionDirection === "up"
                                      ? "bottom-full mb-2"
                                      : "mt-2"
                                  }`}
                                >
                                  <CardContent className="p-1">
                                    <Button
                                      variant="ghost"
                                      className="w-full justify-start px-3 py-2 h-auto rounded-sm hover:bg-gray-100 text-gray-700"
                                      onClick={() => handleView(request)}
                                    >
                                      <Eye size={16} className="mr-3" /> View
                                      Details
                                    </Button>
                                    <div className="border-t border-gray-100 my-1"></div>
                                    {getAvailableStatuses(request.status).map(
                                      (statusOption) => {
                                        const config =
                                          getStatusConfig(statusOption);
                                        const IconComponent = config.icon;
                                        return (
                                          <Button
                                            key={statusOption}
                                            variant="ghost"
                                            className={`w-full justify-start px-3 py-2 h-auto rounded-sm ${config.className}`}
                                            onClick={() =>
                                              handleStatusUpdate(
                                                request.id,
                                                statusOption as
                                                  | "pending"
                                                  | "in-progress"
                                                  | "completed"
                                                  | "rejected"
                                              )
                                            }
                                            disabled={
                                              updateStatusMutation.isPending
                                            }
                                          >
                                            <IconComponent
                                              size={16}
                                              className={`mr-3 ${config.iconClassName}`}
                                            />
                                            {config.label}
                                          </Button>
                                        );
                                      }
                                    )}
                                  </CardContent>
                                </Card>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between pt-4">
              <div className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Property Request View Modal */}
      {selectedRequest && isViewModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4">
              <h3 className="text-xl font-bold text-white">
                Property Request Details
              </h3>
              <p className="text-gray-300 text-sm mt-1">
                Request ID: {selectedRequest.id}
              </p>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <User className="w-4 h-4 mr-2 text-blue-600" />
                      Contact Information
                    </h4>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium text-gray-600">
                          Name:
                        </span>
                        <p className="text-gray-900 font-medium">
                          {selectedRequest.name}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">
                          Email:
                        </span>
                        <p className="text-gray-900">{selectedRequest.email}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">
                          Phone:
                        </span>
                        <p className="text-gray-900">{selectedRequest.phone}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <Building className="w-4 h-4 mr-2 text-green-600" />
                      Property Details
                    </h4>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium text-gray-600">
                          Type:
                        </span>
                        <p className="text-gray-900 capitalize">
                          {selectedRequest.type}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">
                          Purpose:
                        </span>
                        <p className="text-gray-900 capitalize">
                          {selectedRequest.propertyPurpose}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">
                          Area:
                        </span>
                        <p className="text-gray-900">
                          {selectedRequest.area} sqm
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">
                          Location:
                        </span>
                        <p className="text-gray-900">
                          {selectedRequest.location}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <DollarSign className="w-4 h-4 mr-2 text-yellow-600" />
                      Budget Information
                    </h4>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium text-gray-600">
                          Budget Range:
                        </span>
                        <p className="text-gray-900 font-semibold">
                          ETB {selectedRequest.minPrice?.toLocaleString()} -{" "}
                          {selectedRequest.maxPrice?.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <FileText className="w-4 h-4 mr-2 text-purple-600" />
                      Description
                    </h4>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {selectedRequest.description}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2 text-orange-600" />
                      Current Status
                    </h4>
                    <div className="flex items-center">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          getStatusLabel(selectedRequest).color ===
                          "text-green-600"
                            ? "bg-green-100 text-green-800"
                            : getStatusLabel(selectedRequest).color ===
                              "text-blue-600"
                            ? "bg-blue-100 text-blue-800"
                            : getStatusLabel(selectedRequest).color ===
                              "text-yellow-600"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {getStatusLabel(selectedRequest).label}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Created:{" "}
                  {new Date(selectedRequest.createdAt).toLocaleDateString()}
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="default"
                    className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-2"
                    onClick={() => setIsViewModalOpen(false)}
                  >
                    Close
                  </Button>
                  {getAvailableStatuses(selectedRequest.status).map(
                    (statusOption) => {
                      const config = getStatusConfig(statusOption);
                      const IconComponent = config.icon;
                      return (
                        <Button
                          key={statusOption}
                          variant="outline"
                          className={`flex items-center gap-2 px-4 py-2 font-medium ${config.className} border-current hover:shadow-md transition-all duration-200`}
                          onClick={() => {
                            handleStatusUpdate(
                              selectedRequest.id,
                              statusOption as
                                | "pending"
                                | "in-progress"
                                | "completed"
                                | "rejected"
                            );
                            setIsViewModalOpen(false);
                          }}
                          disabled={updateStatusMutation.isPending}
                        >
                          <IconComponent size={16} />
                          {config.label}
                        </Button>
                      );
                    }
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

