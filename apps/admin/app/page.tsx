"use client";
import { useAuthStore } from "@/lib/auth-store";

export default function Dashboard() {
  const { user } = useAuthStore();

  // AuthProvider guarantees user is set by the time this renders
  if (!user) return null;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Welcome, {user.email}</h2>
        <div className="space-y-2 text-sm text-gray-700">
          <p><span className="font-medium">Role:</span> {user.role}</p>
          <p><span className="font-medium">Branch:</span> {user.branchId ?? "All branches (Admin)"}</p>
          <p><span className="font-medium">Status:</span> {user.status}</p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="font-semibold text-lg mb-2">Total Bikes</h3>
          <p className="text-3xl font-bold text-blue-600">—</p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg">
          <h3 className="font-semibold text-lg mb-2">Available</h3>
          <p className="text-3xl font-bold text-green-600">—</p>
        </div>
        <div className="bg-purple-50 p-6 rounded-lg">
          <h3 className="font-semibold text-lg mb-2">Pending Orders</h3>
          <p className="text-3xl font-bold text-purple-600">—</p>
        </div>
      </div>
    </div>
  );
}
