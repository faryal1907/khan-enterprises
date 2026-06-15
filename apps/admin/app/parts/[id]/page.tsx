"use client";
import { theme } from "@/lib/colors";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getPartById } from "@/lib/api/inventory";
import { getPartOrders } from "@/lib/api/orders";
import Link from "next/link";

export default function PartDetailPage() {
  const params = useParams();
  const partId = params.id as string;
  const [part, setPart] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPart = async () => {
      try {
        const [partData, ordersData] = await Promise.all([
          getPartById(partId),
          getPartOrders({ partId, limit: 10 })
        ]);
        setPart(partData);
        setOrders(ordersData.orders || []);
      } catch (error) {
        console.error("Failed to fetch part:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPart();
  }, [partId]);

  if (loading) {
    return (
      <div className="p-8">
        <div className="max-w-5xl mx-auto flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: theme.accents.primary }}></div>
        </div>
      </div>
    );
  }

  if (!part) {
    return <div className="p-8">Part not found</div>;
  }

  const totalStock = part.inventories?.reduce((acc: number, inv: any) => acc + inv.quantity, 0) || 0;
  const totalReorderLevel = part.inventories?.reduce((acc: number, inv: any) => acc + (inv.reorderLevel || 0), 0) || 0;

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1
              className="text-3xl font-bold mb-2"
              style={{ color: theme.text.primary }}
            >
              Part Details
            </h1>
            <p style={{ color: theme.text.secondary }}>
              View part information and stock status
            </p>
          </div>
          <Link
            href={`/parts/${partId}/edit`}
            className="px-4 py-2 text-sm font-medium rounded transition-colors hover:opacity-90"
            style={{
              backgroundColor: theme.accents.primary,
              color: theme.text.inverse,
            }}
          >
            Edit Part
          </Link>
        </div>

        {/* Information */}
        <div
          className="rounded-lg p-6 mb-6"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: theme.text.primary }}
          >
            Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label
                className="block text-xs font-medium uppercase tracking-wider mb-1"
                style={{ color: theme.text.muted }}
              >
                Part Name
              </label>
              <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                {part.name}
              </p>
            </div>
            <div>
              <label
                className="block text-xs font-medium uppercase tracking-wider mb-1"
                style={{ color: theme.text.muted }}
              >
                SKU
              </label>
              <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                {part.sku}
              </p>
            </div>
            <div>
              <label
                className="block text-xs font-medium uppercase tracking-wider mb-1"
                style={{ color: theme.text.muted }}
              >
                Category
              </label>
              <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                {part.category}
              </p>
            </div>
            <div>
              <label
                className="block text-xs font-medium uppercase tracking-wider mb-1"
                style={{ color: theme.text.muted }}
              >
                Price
              </label>
              <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                Rs {part.sellingPrice?.toLocaleString() || "N/A"}
              </p>
            </div>
            <div>
              <label
                className="block text-xs font-medium uppercase tracking-wider mb-1"
                style={{ color: theme.text.muted }}
              >
                Total Stock
              </label>
              <p className="text-2xl font-bold" style={{ color: theme.accents.primary }}>
                {totalStock}
              </p>
            </div>

          </div>
        </div>

        {/* Stock by Branch */}
        <div
          className="rounded-lg p-6 mb-6"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: theme.text.primary }}
          >
            Stock by Branch
          </h3>
          <div
            className="rounded-lg overflow-hidden"
            style={{ backgroundColor: theme.backgrounds.tertiary }}
          >
            <table className="w-full">
              <thead>
                <tr
                  style={{ backgroundColor: theme.backgrounds.primary, borderBottom: `1px solid ${theme.borders.light}` }}
                >
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                    Branch
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                    Quantity
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                    Reorder Level
                  </th>
                </tr>
              </thead>
              <tbody>
                {part.inventories?.map((inv: any) => (
                  <tr key={inv.id} style={{ borderBottom: `1px solid ${theme.borders.light}` }}>
                    <td className="px-4 py-3 whitespace-nowrap text-xs" style={{ color: theme.text.primary }}>
                      {inv.branch?.name || "Unknown"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs" style={{ color: theme.text.primary }}>
                      <span className={inv.quantity < (inv.reorderLevel || 0) ? "text-red-500 font-bold" : ""}>
                        {inv.quantity}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs" style={{ color: theme.text.primary }}>
                      {inv.reorderLevel}
                    </td>
                  </tr>
                ))}
                {(!part.inventories || part.inventories.length === 0) && (
                  <tr style={{ borderBottom: `1px solid ${theme.borders.light}` }}>
                    <td colSpan={3} className="px-4 py-3 text-center text-xs" style={{ color: theme.text.secondary }}>
                      No inventory records found for this part across any branches.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity */}
        <div
          className="rounded-lg p-6"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: theme.text.primary }}
          >
            Recent Activity
          </h3>
          <div
            className="rounded-lg overflow-hidden"
            style={{ backgroundColor: theme.backgrounds.tertiary }}
          >
            <table className="w-full">
              <thead>
                <tr
                  style={{ backgroundColor: theme.backgrounds.primary, borderBottom: `1px solid ${theme.borders.light}` }}
                >
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                    Date
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                    Order Number
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                    Customer
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                    Quantity
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order: any) => (
                  <tr key={order.id} style={{ borderBottom: `1px solid ${theme.borders.light}` }}>
                    <td className="px-4 py-3 whitespace-nowrap text-xs" style={{ color: theme.text.primary }}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs" style={{ color: theme.text.primary }}>
                      <Link href={`/part-orders/${order.id}`} className="hover:underline" style={{ color: theme.accents.primary }}>
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs" style={{ color: theme.text.primary }}>
                      {order.customerName}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs" style={{ color: theme.text.primary }}>
                      {order.quantity}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs" style={{ color: theme.text.primary }}>
                      <span className="px-2 py-1 rounded text-xs" style={{ backgroundColor: theme.backgrounds.secondary, color: theme.text.secondary }}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr style={{ borderBottom: `1px solid ${theme.borders.light}` }}>
                    <td colSpan={5} className="px-4 py-8 text-center text-xs" style={{ color: theme.text.secondary }}>
                      No recent orders for this part yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <a
            href="/parts"
            className="px-6 py-2 text-sm font-medium rounded transition-colors hover:opacity-70"
            style={{
              backgroundColor: theme.backgrounds.primary,
              color: theme.text.secondary,
              border: `1px solid ${theme.borders.medium}`,
            }}
          >
            Back
          </a>
        </div>
      </div>
    </div>
  );
}
