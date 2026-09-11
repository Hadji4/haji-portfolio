"use client";

import { useEffect } from "react";
import { logger } from "@/lib/logger";

// Catches errors thrown by the root layout itself (outside the scope of any
// segment-level error.tsx), so it must render its own <html>/<body>.
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    logger.error("Unhandled error in root layout", error, { digest: error.digest });
  }, [error]);

  return (
    <html lang="en">
      <body style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
        <div style={{ textAlign: "center", padding: "0 24px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: 700 }}>Something went wrong.</h1>
          <p style={{ marginTop: "8px", color: "#888" }}>The error has been logged.</p>
          <button
            onClick={reset}
            style={{ marginTop: "24px", padding: "10px 20px", borderRadius: "8px", border: "1px solid #888", cursor: "pointer" }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
