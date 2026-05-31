"use client";
import { useAuthStore } from "@/lib/auth-store";

export default function Home() {
  const { user } = useAuthStore();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Welcome to Khan Enterprises</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Hello, {user.email}</h2>
        <div className="space-y-2">
          <p><strong>Role:</strong> {user.role}</p>
          <p><strong>Branch ID:</strong> {user.branchId || "N/A"}</p>
          <p><strong>Status:</strong> {user.isActive ? "Active" : "Inactive"}</p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="font-semibold text-lg mb-2">Browse Bikes</h3>
          <p className="text-gray-600">View our available motorcycle inventory</p>
          <a href="/bikes" className="inline-block mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            View Bikes
          </a>
        </div>
        <div className="bg-green-50 p-6 rounded-lg">
          <h3 className="font-semibold text-lg mb-2">Browse Parts</h3>
          <p className="text-gray-600">Find parts and accessories</p>
          <a href="/parts" className="inline-block mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            View Parts
          </a>
        </div>
      </div>
    </div>
  );
}
