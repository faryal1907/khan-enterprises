"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { theme } from "@/lib/colors";
import { toast } from "sonner";
import { api } from "@/lib/api-client";
import { useAuthStore } from "@/lib/auth-store";
import { UserRole } from "@/lib/types";

type User = {
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  role: string;
  status: string;
  branch: {
    id: string;
    name: string;
    city: string;
  } | null;
  vendor: {
    id: string;
    name: string;
  } | null;
  createdAt: string;
};

export default function UsersPage() {
  const router = useRouter();
  const { user: currentUser } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userToDeactivate, setUserToDeactivate] = useState<string | null>(null);
  const [userToActivate, setUserToActivate] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Role check: Admin only
  useEffect(() => {
    if (currentUser && currentUser.role !== UserRole.ADMIN) {
      router.push("/");
    }
  }, [currentUser, router]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/auth/users");
        setUsers(res.data.users);
      } catch (err) {
        setError("Failed to load users");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const confirmDeactivate = async () => {
    if (!userToDeactivate) return;
    setIsProcessing(true);

    try {
      await api.delete(`/auth/users/${userToDeactivate}`);
      setUsers(users.map((u) => u.id === userToDeactivate ? { ...u, status: "INACTIVE" } : u));
      toast.success("User deactivated successfully");
    } catch (err) {
      console.error("Failed to deactivate user:", err);
      toast.error("Failed to deactivate user");
    } finally {
      setIsProcessing(false);
      setUserToDeactivate(null);
    }
  };

  const confirmActivate = async () => {
    if (!userToActivate) return;
    setIsProcessing(true);

    try {
      await api.post(`/auth/users/${userToActivate}/activate`);
      setUsers(users.map((u) => u.id === userToActivate ? { ...u, status: "ACTIVE" } : u));
      toast.success("User activated successfully");
    } catch (err) {
      console.error("Failed to activate user:", err);
      toast.error("Failed to activate user");
    } finally {
      setIsProcessing(false);
      setUserToActivate(null);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <p style={{ color: theme.text.secondary }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <p style={{ color: theme.text.secondary }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: theme.text.primary }}>
              User Management
            </h1>
            <p className="mt-1 text-sm" style={{ color: theme.text.secondary }}>
              Manage staff accounts and permissions
            </p>
          </div>

          <Link
            href="/users/new"
            className="px-4 py-2 text-sm font-medium rounded"
            style={{
              backgroundColor: theme.accents.primary,
              color: theme.text.inverse,
            }}
          >
            Create Staff Account
          </Link>
        </div>

        {/* Table */}
        <div
          className="rounded-lg overflow-hidden"
          style={{
            backgroundColor: theme.backgrounds.primary,
            border: `1px solid ${theme.borders.light}`,
          }}
        >
          <table className="min-w-full">
            <thead>
              <tr style={{ backgroundColor: theme.backgrounds.secondary }}>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                  Branch
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                  Vendor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center" style={{ color: theme.text.secondary }}>
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b"
                    style={{ borderColor: theme.borders.light }}
                  >
                    <td className="px-6 py-4 text-sm" style={{ color: theme.text.primary }}>
                      {user.fullName}
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: theme.text.primary }}>
                      {user.email}
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: theme.text.primary }}>
                      {user.role}
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: theme.text.primary }}>
                      {user.branch ? `${user.branch.name} (${user.branch.city})` : "—"}
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: theme.text.primary }}>
                      {user.role === "SALES_STAFF"
                        ? (user.vendor ? user.vendor.name : <span style={{ color: theme.accents.secondary }}>Not assigned</span>)
                        : "—"}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className="px-2 py-1 text-xs font-medium rounded"
                        style={{
                          backgroundColor:
                            user.status === "ACTIVE"
                              ? theme.accents.tertiary + "20"
                              : theme.accents.secondary + "20",
                          color:
                            user.status === "ACTIVE"
                              ? theme.accents.tertiary
                              : theme.accents.secondary,
                        }}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <Link href={`/users/${user.id}`}>
                          <button
                            className="font-medium hover:opacity-70"
                            style={{ color: theme.accents.primary }}
                          >
                            View
                          </button>
                        </Link>
                        {user.id === currentUser?.id ? (
                          <span 
                            className="text-xs italic ml-4"
                            style={{ color: theme.text.muted }}
                          >
                            Current User
                          </span>
                        ) : user.status === "ACTIVE" ? (
                          <button
                            onClick={() => setUserToDeactivate(user.id)}
                            className="font-medium hover:opacity-70 ml-4"
                            style={{ color: theme.accents.secondary }}
                          >
                            Deactivate
                          </button>
                        ) : (
                          <button
                            onClick={() => setUserToActivate(user.id)}
                            className="font-medium hover:opacity-70 ml-4"
                            style={{ color: theme.accents.tertiary }}
                          >
                            Activate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deactivate Confirmation Modal */}
      {userToDeactivate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => !isProcessing && setUserToDeactivate(null)}
          ></div>
          <div
            className="relative w-full max-w-md p-6 rounded-lg shadow-xl"
            style={{
              backgroundColor: theme.backgrounds.primary,
              border: `1px solid ${theme.borders.medium}`,
            }}
          >
            <h3 className="text-lg font-bold mb-2" style={{ color: theme.text.primary }}>
              Confirm Deactivation
            </h3>
            <p className="text-sm mb-6" style={{ color: theme.text.secondary }}>
              Are you sure you want to deactivate this user? They will immediately lose access to the system.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setUserToDeactivate(null)}
                disabled={isProcessing}
                className="px-4 py-2 text-sm font-medium rounded"
                style={{
                  backgroundColor: theme.backgrounds.tertiary,
                  color: theme.text.secondary,
                  border: `1px solid ${theme.borders.medium}`,
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDeactivate}
                disabled={isProcessing}
                className="px-4 py-2 text-sm font-medium rounded"
                style={{
                  backgroundColor: theme.accents.secondary,
                  color: "#fff",
                  opacity: isProcessing ? 0.7 : 1,
                }}
              >
                {isProcessing ? "Processing..." : "Deactivate User"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Activate Confirmation Modal */}
      {userToActivate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => !isProcessing && setUserToActivate(null)}
          ></div>
          <div
            className="relative w-full max-w-md p-6 rounded-lg shadow-xl"
            style={{
              backgroundColor: theme.backgrounds.primary,
              border: `1px solid ${theme.borders.medium}`,
            }}
          >
            <h3 className="text-lg font-bold mb-2" style={{ color: theme.text.primary }}>
              Confirm Activation
            </h3>
            <p className="text-sm mb-6" style={{ color: theme.text.secondary }}>
              Are you sure you want to activate this user? They will be granted access to the system based on their role.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setUserToActivate(null)}
                disabled={isProcessing}
                className="px-4 py-2 text-sm font-medium rounded"
                style={{
                  backgroundColor: theme.backgrounds.tertiary,
                  color: theme.text.secondary,
                  border: `1px solid ${theme.borders.medium}`,
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmActivate}
                disabled={isProcessing}
                className="px-4 py-2 text-sm font-medium rounded"
                style={{
                  backgroundColor: theme.accents.primary,
                  color: "#fff",
                  opacity: isProcessing ? 0.7 : 1,
                }}
              >
                {isProcessing ? "Processing..." : "Activate User"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
