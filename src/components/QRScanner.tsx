"use client";
import { Scanner } from "@yudiel/react-qr-scanner";
import { useState } from "react";

type QRScannerProps = {
  onResult: (text: string) => void;
};

export default function QRScanner({ onResult }: QRScannerProps) {
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="rounded-2xl overflow-hidden bg-black/5">
      <Scanner
        onResult={(result) => {
          if (result?.[0]?.rawValue) {
            onResult(result[0].rawValue);
          }
        }}
        onError={(err) => setError(err?.message || "Camera error")}
        components={{
          audio: false,
          torch: true,
          zoom: true,
        }}
        styles={{
          container: { width: "100%", height: 220, background: "#000" },
          video: { objectFit: "cover" },
        }}
        constraints={{ facingMode: "environment" }}
      />
      {error && (
        <div className="p-2 text-xs text-red-600 bg-red-50">{error}</div>
      )}
    </div>
  );
}



