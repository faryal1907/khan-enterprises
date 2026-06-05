"use client";
import { theme } from "@/lib/colors";

export default function AddBikePage() {
  return (
    <div className="p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1
            className="text-3xl font-bold mb-2"
            style={{ color: theme.text.primary }}
          >
            Add New Bike
          </h1>
          <p style={{ color: theme.text.secondary }}>
            Enter the details for the new bike unit
          </p>
        </div>

        <div
          className="rounded-lg p-6"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: theme.text.secondary }}
                >
                  Chassis Number *
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded text-sm"
                  style={{
                    backgroundColor: theme.backgrounds.tertiary,
                    border: `1px solid ${theme.borders.medium}`,
                    color: theme.text.primary,
                  }}
                  placeholder="Enter chassis number"
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: theme.text.secondary }}
                >
                  Engine Number *
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded text-sm"
                  style={{
                    backgroundColor: theme.backgrounds.tertiary,
                    border: `1px solid ${theme.borders.medium}`,
                    color: theme.text.primary,
                  }}
                  placeholder="Enter engine number"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: theme.text.secondary }}
                >
                  Branch *
                </label>
                <select
                  className="w-full px-3 py-2 rounded text-sm"
                  style={{
                    backgroundColor: theme.backgrounds.tertiary,
                    border: `1px solid ${theme.borders.medium}`,
                    color: theme.text.primary,
                  }}
                >
                  <option value="">Select branch</option>
                  <option value="1">Islamabad HQ</option>
                  <option value="2">Tordher Branch</option>
                </select>
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: theme.text.secondary }}
                >
                  Model *
                </label>
                <select
                  className="w-full px-3 py-2 rounded text-sm"
                  style={{
                    backgroundColor: theme.backgrounds.tertiary,
                    border: `1px solid ${theme.borders.medium}`,
                    color: theme.text.primary,
                  }}
                >
                  <option value="">Select model</option>
                  <option value="EVEE_SCOOTER_X">Evee Scooter X</option>
                  <option value="EVEE_SCOOTER_Y">Evee Scooter Y</option>
                  <option value="EVEE_ELECTRIC_500W">Evee Electric 500W</option>
                  <option value="ROADKING_70CC">RoadKing 70cc</option>
                  <option value="ROADKING_100CC">RoadKing 100cc</option>
                </select>
              </div>
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: theme.text.secondary }}
              >
                Vendor *
              </label>
              <select
                className="w-full px-3 py-2 rounded text-sm"
                style={{
                  backgroundColor: theme.backgrounds.tertiary,
                  border: `1px solid ${theme.borders.medium}`,
                  color: theme.text.primary,
                }}
              >
                <option value="">Select vendor</option>
                <option value="EVEE">Evee</option>
                <option value="ROADKING">RoadKing</option>
              </select>
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: theme.text.secondary }}
              >
                Status
              </label>
              <select
                className="w-full px-3 py-2 rounded text-sm"
                style={{
                  backgroundColor: theme.backgrounds.tertiary,
                  border: `1px solid ${theme.borders.medium}`,
                  color: theme.text.primary,
                }}
              >
                <option value="AVAILABLE">Available</option>
                <option value="SOLD">Sold</option>
                <option value="RESERVED">Reserved</option>
                <option value="IN_DELIVERY">In Delivery</option>
              </select>
            </div>

            <div className="border-t pt-6" style={{ borderColor: theme.borders.light }}>
              <h3
                className="text-lg font-semibold mb-4"
                style={{ color: theme.text.primary }}
              >
                Documents
              </h3>

              <div className="space-y-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: theme.text.secondary }}
                  >
                    Supplier Invoice
                  </label>
                  <div
                    className="border-2 border-dashed rounded-lg p-6 text-center"
                    style={{ borderColor: theme.borders.medium }}
                  >
                    <p className="text-sm" style={{ color: theme.text.muted }}>
                      Drag and drop file here, or click to select
                    </p>
                  </div>
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: theme.text.secondary }}
                  >
                    Warranty Document
                  </label>
                  <div
                    className="border-2 border-dashed rounded-lg p-6 text-center"
                    style={{ borderColor: theme.borders.medium }}
                  >
                    <p className="text-sm" style={{ color: theme.text.muted }}>
                      Drag and drop file here, or click to select
                    </p>
                  </div>
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: theme.text.secondary }}
                  >
                    Registration Papers
                  </label>
                  <div
                    className="border-2 border-dashed rounded-lg p-6 text-center"
                    style={{ borderColor: theme.borders.medium }}
                  >
                    <p className="text-sm" style={{ color: theme.text.muted }}>
                      Drag and drop file here, or click to select
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                className="px-6 py-2 text-sm font-medium rounded transition-colors hover:opacity-70"
                style={{
                  backgroundColor: theme.backgrounds.tertiary,
                  color: theme.text.secondary,
                  border: `1px solid ${theme.borders.medium}`,
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 text-sm font-medium rounded transition-colors hover:opacity-90"
                style={{
                  backgroundColor: theme.accents.primary,
                  color: theme.text.inverse,
                }}
              >
                Add Bike
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
