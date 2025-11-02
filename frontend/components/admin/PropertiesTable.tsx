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
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Download,
} from "lucide-react";
import { Property } from "@/types";
import PropertyViewModal from "./PropertyViewModal";
import {
  useApproveProperty,
  useDisapproveProperty,
} from "@/hooks/usePropertyActions";
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

interface PropertiesTableProps {
  properties: Property[];
  onRefresh?: () => void;
}

const STATUS = ["All", "approved", "pending", "rejected"];
const PROPERTY_TYPES = ["All", "apartment", "house", "commercial", "office"];
const ROWS_PER_PAGE_OPTIONS = [10, 50, 100];
const DEFAULT_ROWS_PER_PAGE = 10;

function getStatusLabel(property: Property) {
  switch (property.moderationStatus) {
    case "approved":
      return { label: "Approved", color: "text-green-600" };
    case "pending":
      return { label: "Pending", color: "text-yellow-600" };
    case "rejected":
      return { label: "Rejected", color: "text-red-600" };
    default:
      return { label: "Pending", color: "text-yellow-600" };
  }
}

export default function PropertiesTable({
  properties,
  onRefresh,
}: PropertiesTableProps) {
  const [status, setStatus] = useState("All");
  const [type, setType] = useState("All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("title");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [actionOpen, setActionOpen] = useState<string | null>(null);
  const [actionDirection, setActionDirection] = useState<"up" | "down">("down");
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const actionBtnRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const actionDropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>(
    {}
  );

  // Property action mutations
  const approvePropertyMutation = useApproveProperty();
  const disapprovePropertyMutation = useDisapproveProperty();

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE);

  // Debug modal state
  useEffect(() => {
    console.log("Modal state:", {
      isViewModalOpen,
      selectedProperty: !!selectedProperty,
    });
  }, [isViewModalOpen, selectedProperty]);

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
    let data = [...properties];
    console.log("Original properties:", properties.length);
    console.log("Search term:", search);

    if (status !== "All") {
      data = data.filter((p) => p.moderationStatus === status);
      console.log("After status filter:", data.length);
    }

    if (type !== "All") {
      data = data.filter((p) => p.type === type);
      console.log("After type filter:", data.length);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      data = data.filter(
        (p) =>
          (p.title?.toLowerCase() || "").includes(searchLower) ||
          (p.description?.toLowerCase() || "").includes(searchLower)
      );
      console.log("After search filter:", data.length);
    }

    data.sort((a, b) => {
      if (sortBy === "title") {
        if (sortDir === "asc")
          return (a.title || "").localeCompare(b.title || "");
        return (b.title || "").localeCompare(a.title || "");
      }
      if (sortBy === "createdAt") {
        if (sortDir === "asc")
          return String(a.createdAt).localeCompare(String(b.createdAt));
        return String(b.createdAt).localeCompare(String(a.createdAt));
      }
      return 0;
    });

    console.log("Final filtered data:", data.length);
    return data;
  }, [properties, status, type, search, sortBy, sortDir]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const paginated = filtered.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  // Export handler
  const handleExport = () => {
    downloadCSV(filtered, "properties.csv");
  };

  // Action handlers
  const handleView = (property: Property) => {
    console.log("handleView called with property:", property);
    setSelectedProperty(property);
    setIsViewModalOpen(true);
    setActionOpen(null);
  };

  const handleEdit = (propertyId: string) => {
    alert(`Edit property ${propertyId}`);
    setActionOpen(null);
  };

  const handleDelete = (propertyId: string) => {
    alert(`Delete property ${propertyId}`);
    setActionOpen(null);
  };

  const handleApproveProperty = async (propertyId: string) => {
    console.log("Approving property:", propertyId);
    try {
      await approvePropertyMutation.mutateAsync(propertyId);
      console.log("Property approved successfully");
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error("Error approving property:", error);
      toast.error(
        `Error approving property: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  const handleRejectProperty = async (propertyId: string) => {
    console.log("Rejecting property:", propertyId);
    try {
      await disapprovePropertyMutation.mutateAsync(propertyId);
      console.log("Property rejected successfully");
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error("Error rejecting property:", error);
      toast.error(
        `Error rejecting property: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (value: string) => {
    const newRowsPerPage = parseInt(value);
    setRowsPerPage(newRowsPerPage);
    setPage(1); // Reset to first page when changing rows per page
  };

  // Handle opening the action menu and determine direction
  const handleActionOpen = (propertyId: string) => {
    const btn = actionBtnRefs.current[propertyId];
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
    setActionOpen(actionOpen === propertyId ? null : propertyId);
  };

  return (
    <>
      {/* Header Section - Matching dashboard design */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Properties Management
            </h2>
            <p className="text-muted-foreground">
              Manage and monitor all property listings
            </p>
          </div>
          <Button onClick={handleExport} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>

        {/* Filters and Search - Matching dashboard design */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filters & Search</CardTitle>
            <CardDescription>
              Filter properties by status or search by title/description
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
                placeholder="Search properties..."
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
                {filtered.length} of {properties.length} properties found
              </div>
            )}
          </CardContent>
        </Card>

        {/* Properties Table */}
        <Card>
          <CardHeader>
            <CardTitle>Properties List</CardTitle>
            <CardDescription>
              Showing {paginated.length} of {filtered.length} properties (
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
                        setSortBy("title");
                        setSortDir(sortDir === "asc" ? "desc" : "asc");
                      }}
                    >
                      Title
                      {sortBy === "title" &&
                        (sortDir === "asc" ? (
                          <ChevronUp className="inline ml-1 w-4 h-4" />
                        ) : (
                          <ChevronDown className="inline ml-1 w-4 h-4" />
                        ))}
                    </TableHead>

                    <TableHead className="w-32 min-w-[120px]">Price</TableHead>
                    <TableHead className="w-24 min-w-[80px]">Type</TableHead>
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
                        colSpan={6}
                        className="text-center py-8 text-gray-500"
                      >
                        {search
                          ? "No properties found matching your search."
                          : "No properties available."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginated.map((property: Property) => {
                      const status = getStatusLabel(property);
                      return (
                        <TableRow
                          key={property.id}
                          className="even:bg-muted/50"
                        >
                          <TableCell className="w-32 min-w-[120px]">
                            {property.title}
                          </TableCell>
                          <TableCell className="w-32 min-w-[120px]">
                            ${property.price?.toLocaleString() || "N/A"}
                          </TableCell>
                          <TableCell className="w-24 min-w-[80px]">
                            {property.type}
                          </TableCell>
                          <TableCell className="w-32 min-w-[100px]">
                            {new Date(
                              String(property.createdAt)
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
                                  (actionBtnRefs.current[property.id] = el)
                                }
                                onClick={() => handleActionOpen(property.id)}
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                              {actionOpen === property.id && (
                                <Card
                                  ref={(el) =>
                                    (actionDropdownRefs.current[property.id] =
                                      el)
                                  }
                                  className={`absolute right-0 z-10 w-40 ${
                                    actionDirection === "up"
                                      ? "bottom-full mb-2"
                                      : "mt-2"
                                  }`}
                                >
                                  <CardContent className="p-0">
                                    <Button
                                      variant="ghost"
                                      className="w-full justify-start px-4 py-2 h-auto rounded-none hover:bg-muted"
                                      onClick={() => handleView(property)}
                                    >
                                      <Eye size={16} className="mr-2" /> View
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      className="w-full justify-start px-4 py-2 h-auto rounded-none hover:bg-muted"
                                      onClick={() => handleEdit(property.id)}
                                    >
                                      <Pencil size={16} className="mr-2" /> Edit
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      className="w-full justify-start px-4 py-2 h-auto text-destructive hover:text-destructive hover:bg-destructive/10 rounded-none"
                                      onClick={() => handleDelete(property.id)}
                                    >
                                      <Trash2 size={16} className="mr-2" />{" "}
                                      Delete
                                    </Button>
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

            {/* Pagination - Matching dashboard design */}
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

      {/* Property View Modal */}
      {selectedProperty && (
        <PropertyViewModal
          property={
            properties.find((p) => p.id === selectedProperty.id) ||
            selectedProperty
          }
          isOpen={isViewModalOpen}
          onClose={() => {
            console.log("Modal closing");
            setIsViewModalOpen(false);
            setSelectedProperty(null);
          }}
          onApprove={handleApproveProperty}
          onReject={handleRejectProperty}
          isLoading={
            approvePropertyMutation.isPending ||
            disapprovePropertyMutation.isPending
          }
        />
      )}
    </>
  );
}

