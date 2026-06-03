"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { theme } from "@/lib/colors";
import { api } from "@/lib/api-client";

type User = {
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  role: string;
  status: string;
  branchId: string | null;
  branch: {
    id: string;
    name: string;
    city: string;
  } | null;
  createdAt: string;
  updatedAt: string;
};

export default function UserDetailPage() {
  const params = useParams<{ id: string }>();
  const userId = typeof params?.id === "string" ? params.id : "UNKNOWN";
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    role: "",
    branchId: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/auth/users/${userId}`);
        setUser(res.data);
        setFormData({
          fullName: res.data.fullName,
          phoneNumber: res.data.phoneNumber,
          role: res.data.role,
          branchId: res.data.branchId || "",
        });
      } catch (err) {
        setError("Failed to load user details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updateData: any = {
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        role: formData.role,
      };
      if (formData.branchId) {
        updateData.branchId = formData.branchId;
      } else {
        updateData.branchId = null;
      }

      const res = await api.put(`/auth/users/${userId}`, updateData);
      setUser(res.data);
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update user:", err);
      alert("Failed to update user");
    }
  };

  const handleDeactivate = async () => {
    if (!confirm("Are you sure you want to deactivate this user?")) {
      return;
    }

    try {
      await api.delete(`/auth/users/${userId}`);
      setUser((prev) => (prev ? { ...prev, status: "INACTIVE" } : null));
    } catch (err) {
      console.error("Failed to deactivate user:", err);
      alert("Failed to deactivate user");
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="max-w-5xl mx-auto">
          <p style={{ color: theme.text.secondary }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="p-8">
        <div className="max-w-5xl mx-auto">
          <p style={{ color: theme.text.secondary }}>{error || "User not found"}</p>
          <Link
            href="/users"
            className="mt-4 inline-block px-4 py-2 text-sm font-medium rounded"
            style={{
              backgroundColor: theme.backgrounds.tertiary,
              color: theme.text.secondary,
              border: `1px solid ${theme.borders.medium}`,
            }}
          >
            Back to Users
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: theme.text.primary }}>
              User Details
            </h1>
            <p className="mt-1 text-sm" style={{ color: theme.text.secondary }}>
              User ID: {userId}
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/users"
              className="px-4 py-2 text-sm font-medium rounded"
              style={{
                backgroundColor: theme.backgrounds.tertiary,
                color: theme.text.secondary,
                border: `1px solid ${theme.borders.medium}`,
              }}
            >
              Back
            </Link>

            {user.status === "ACTIVE" && (
              <button
                onClick={handleDeactivate}
                className="px-4 py-2 text-sm font-medium rounded"
                style={{
                  backgroundColor: theme.accents.secondary,
                  color: theme.text.inverse,
                }}
              >
                Deactivate User
              </button>
            )}
          </div>
        </div>

        {/* Info */}
        <div
          className="rounded-lg p-6 mb-6"
          style={{
            backgroundColor: theme.backgrounds.primary,
            border: `1px solid ${theme.borders.light}`,
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold" style={{ color: theme.text.primary }}>
              User Information
            </h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-sm font-medium"
              style={{ color: theme.accents.primary }}
            >
              {isEditing ? "Cancel" : "Edit"}
            </button>
          </div>

          {isEditing ? (
            <form onSubmit={handleUpdate}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1" style={{ color: theme.text.secondary }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded"
                    style={{
                      backgroundColor: theme.backgrounds.tertiary,
                      border: `1px solid ${theme.borders.medium}`,
                      color: theme.text.primary,
                    }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1" style={{ color: theme.text.secondary }}>
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded"
                    style={{
                      backgroundColor: theme.backgrounds.tertiary,
                      border: `1px solid ${theme.borders.medium}`,
                      color: theme.text.primary,
                    }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1" style={{ color: theme.text.secondary }}>
                    Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded"
                    style={{
                      backgroundColor: theme.backgrounds.tertiary,
                      border: `1px solid ${theme.borders.medium}`,
                      color: theme.text.primary,
                    }}
                    required
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="MANAGER">MANAGER</option>
                    <option value="SALES_STAFF">SALES_STAFF</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1" style={{ color: theme.text.secondary }}>
                    Branch
                  </label>
                  <select
                    value={formData.branchId}
                    onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded"
                    style={{
                      backgroundColor: theme.backgrounds.tertiary,
                      border: `1px solid ${theme.borders.medium}`,
                      color: theme.text.primary,
                    }}
                  >
                    <option value="">No Branch (Global)</option>
                    <option value="1">Islamabad Headquarters</option>
                    <option value="2">Tordher Branch</option>
                  </select>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium rounded"
                  style={{
                    backgroundColor: theme.accents.primary,
                    color: theme.text.inverse,
                  }}
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-sm font-medium rounded"
                  style={{
                    backgroundColor: theme.backgrounds.tertiary,
                    color: theme.text.secondary,
                    border: `1px solid ${theme.borders.medium}`,
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <Info label="User ID" value={user.id} />
              <Info label="Email" value={user.email} />
              <Info label="Full Name" value={user.fullName} />
              <Info label="Phone Number" value={user.phoneNumber} />
              <Info label="Role" value={user.role} />
              <Info label="Branch" value={user.branch ? `${user.branch.name} (${user.branch.city})` : "No Branch (Global)"} />
              <Info label="Status" value={user.status} />
              <Info label="Created At" value={new Date(user.createdAt).toLocaleString()} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm mb-1" style={{ color: theme.text.secondary }}>
        {label}
      </p>
      <p className="font-medium" style={{ color: theme.text.primary }}>
        {value}
      </p>
    </div>
  );
}
