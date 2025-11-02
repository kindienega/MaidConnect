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
import { User } from "@/types";
import UserViewModal from "./UserViewModal";
import {
  useApproveUser,
  useUpgradeToAdmin,
  useDisapproveUser,
} from "@/hooks/useUserActions";
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

interface UsersTableProps {
  users: User[];
}

const ROLES = ["All", "SuperAdmin", "Admin", "Broker", "User"];
const STATUS = ["All", "approved", "pending", "rejected"];
const ROWS_PER_PAGE_OPTIONS = [10, 50, 100];
const DEFAULT_ROWS_PER_PAGE = 10;

function getStatusLabel(user: User) {
  switch (user.status) {
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

export default function UsersTable({ users }: UsersTableProps) {
  const [role, setRole] = useState("All");
  const [status, setStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [actionOpen, setActionOpen] = useState<string | null>(null);
  const [actionDirection, setActionDirection] = useState<"up" | "down">("down");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const actionBtnRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const actionDropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>(
    {}
  );

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE);

  // Action hooks
  const approveUserMutation = useApproveUser();
  const upgradeToAdminMutation = useUpgradeToAdmin();
  const disapproveUserMutation = useDisapproveUser();

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
    let data = [...users];
    console.log("Original users:", users.length);
    console.log("Search term:", search);

    if (role !== "All") {
      data = data.filter((u) => u.role === role);
      console.log("After role filter:", data.length);
    }

    if (status !== "All") {
      data = data.filter((u) => u.status === status);
      console.log("After status filter:", data.length);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      data = data.filter(
        (u) =>
          (u.name?.toLowerCase() || "").includes(searchLower) ||
          (u.email?.toLowerCase() || "").includes(searchLower)
      );
      console.log("After search filter:", data.length);
    }

    data.sort((a, b) => {
      if (sortBy === "name") {
        if (sortDir === "asc") return a.name.localeCompare(b.name);
        return b.name.localeCompare(a.name);
      }
      if (sortBy === "createdAt") {
        if (sortDir === "asc")
          return String(a.createdAt).localeCompare(String(b.createdAt));
        return String(b.createdAt).localeCompare(String(a.createdAt));
      }
      return 0;
    });

    return data;
  }, [users, role, status, search, sortBy, sortDir]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const paginated = filtered.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  // Export handler
  const handleExport = () => {
    downloadCSV(filtered, "users.csv");
  };

  // Action handlers
  const handleView = (user: User) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
    setActionOpen(null);
  };

  const handleEdit = (userId: string) => {
    alert(`Edit user ${userId}`);
    setActionOpen(null);
  };

  const handleDelete = (userId: string) => {
    alert(`Delete user ${userId}`);
    setActionOpen(null);
  };

  const handleApprove = async (userId: string) => {
    try {
      await approveUserMutation.mutateAsync(userId);
      // Modal stays open for debugging
      // setIsViewModalOpen(false);
    } catch (error) {
      console.error("Error approving user:", error);
    }
  };

  const handleUpgradeToAdmin = async (userId: string) => {
    try {
      await upgradeToAdminMutation.mutateAsync(userId);
      // Modal stays open for debugging
      // setIsViewModalOpen(false);
    } catch (error) {
      console.error("Error upgrading user to admin:", error);
    }
  };

  const handleDisapprove = async (userId: string) => {
    try {
      await disapproveUserMutation.mutateAsync(userId);
      // Modal stays open for debugging
      // setIsViewModalOpen(false);
    } catch (error) {
      console.error("Error disapproving user:", error);
    }
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (value: string) => {
    const newRowsPerPage = parseInt(value);
    setRowsPerPage(newRowsPerPage);
    setPage(1); // Reset to first page when changing rows per page
  };

  // Handle opening the action menu and determine direction
  const handleActionOpen = (userId: string) => {
    const btn = actionBtnRefs.current[userId];
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
    setActionOpen(actionOpen === userId ? null : userId);
  };

  return (
    <>
      {/* Header Section - Matching dashboard design */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Users Management
            </h2>
            <p className="text-muted-foreground">
              Manage and monitor all registered users
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
              Filter users by role, status, or search by name/email
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Select
                value={role}
                onValueChange={(value) => {
                  setRole(value);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

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
                placeholder="Search users..."
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
                {filtered.length} of {users.length} users found
              </div>
            )}
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Users List</CardTitle>
            <CardDescription>
              Showing {paginated.length} of {filtered.length} users (
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
                      Full Name
                      {sortBy === "name" &&
                        (sortDir === "asc" ? (
                          <ChevronUp className="inline ml-1 w-4 h-4" />
                        ) : (
                          <ChevronDown className="inline ml-1 w-4 h-4" />
                        ))}
                    </TableHead>
                    <TableHead className="w-48 min-w-[180px]">Email</TableHead>
                    <TableHead className="w-32 min-w-[120px]">Phone</TableHead>
                    <TableHead className="w-24 min-w-[80px]">Role</TableHead>
                    <TableHead
                      className="cursor-pointer w-32 min-w-[100px]"
                      onClick={() => {
                        setSortBy("createdAt");
                        setSortDir(sortDir === "asc" ? "desc" : "asc");
                      }}
                    >
                      Registered
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
                        colSpan={7}
                        className="text-center py-8 text-muted-foreground"
                      >
                        {search
                          ? "No users found matching your search."
                          : "No users available."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginated.map((user: User) => {
                      const status = getStatusLabel(user);
                      return (
                        <TableRow key={user.id} className="hover:bg-muted/50">
                          <TableCell className="w-32 min-w-[120px] font-medium">
                            {user.name}
                          </TableCell>
                          <TableCell className="w-48 min-w-[180px]">
                            {user.email}
                          </TableCell>
                          <TableCell className="w-32 min-w-[120px]">
                            {user.phone || "N/A"}
                          </TableCell>
                          <TableCell className="w-24 min-w-[80px]">
                            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                              {user.role}
                            </span>
                          </TableCell>
                          <TableCell className="w-32 min-w-[100px] text-sm text-muted-foreground">
                            {new Date(
                              String(user.createdAt)
                            ).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="w-20 min-w-[80px]">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                user.status === "approved"
                                  ? "bg-green-100 text-green-800"
                                  : user.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {getStatusLabel(user).label}
                            </span>
                          </TableCell>
                          <TableCell className="w-20 min-w-[80px]">
                            <div className="relative">
                              <Button
                                variant="ghost"
                                size="sm"
                                ref={(el) =>
                                  (actionBtnRefs.current[user.id] = el)
                                }
                                onClick={() => handleActionOpen(user.id)}
                              >
                                <MoreVertical size={16} />
                              </Button>
                              {actionOpen === user.id && (
                                <Card
                                  ref={(el) =>
                                    (actionDropdownRefs.current[user.id] = el)
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
                                      onClick={() => handleView(user)}
                                    >
                                      <Eye size={16} className="mr-2" /> View
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      className="w-full justify-start px-4 py-2 h-auto rounded-none hover:bg-muted"
                                      onClick={() => handleEdit(user.id)}
                                    >
                                      <Pencil size={16} className="mr-2" /> Edit
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      className="w-full justify-start px-4 py-2 h-auto text-destructive hover:text-destructive hover:bg-destructive/10 rounded-none"
                                      onClick={() => handleDelete(user.id)}
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

      {/* User View Modal */}
      <UserViewModal
        user={
          selectedUser
            ? users.find((u) => u.id === selectedUser.id) || selectedUser
            : null
        }
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedUser(null);
        }}
        onApprove={handleApprove}
        onUpgradeToAdmin={handleUpgradeToAdmin}
        onDisapprove={handleDisapprove}
        isLoading={
          approveUserMutation.isPending ||
          upgradeToAdminMutation.isPending ||
          disapproveUserMutation.isPending
        }
      />
    </>
  );
}
