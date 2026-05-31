import React from "react";

export default function LoadingSkeleton({ rows = 3, type = "card" }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="animate-pulse bg-white rounded-lg p-4 border" aria-hidden>
          <div className="h-4 bg-slate-200 rounded w-3/4 mb-3"></div>
          <div className="h-3 bg-slate-200 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );
}
