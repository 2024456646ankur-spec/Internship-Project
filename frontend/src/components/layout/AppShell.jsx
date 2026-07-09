import React from "react";

export default function AppShell({ children }) {
  return (
    <div className="relative min-h-full w-full overflow-y-auto" style={{ background: "#0a0a0f" }}>
      {/* Ambient mesh background */}
      <div className="mesh-bg" aria-hidden="true">
        <div className="mesh-mid" />
      </div>

      {/* Page content */}
      <div className="relative z-10 min-h-full">
        {children}
      </div>
    </div>
  );
}
