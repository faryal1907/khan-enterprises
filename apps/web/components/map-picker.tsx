"use client";

import dynamic from "next/dynamic";

const MapPickerInner = dynamic(() => import("./map-picker-inner"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[300px] bg-gray-100 animate-pulse rounded-lg flex items-center justify-center border border-gray-200">
      <span className="text-gray-400">Loading Map...</span>
    </div>
  ),
});

export function MapPicker(props: any) {
  return <MapPickerInner {...props} />;
}
