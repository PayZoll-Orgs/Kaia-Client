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
        onScan={(detectedCodes: unknown) => {
          const resultArray = detectedCodes as Array<{ rawValue: string }>;
          if (resultArray?.[0]?.rawValue) {
            onResult(resultArray[0].rawValue);
          }
        }}
        onError={(error: unknown) => {
          const err = error as Error;
          setError(err?.message || "Camera error");
        }}
        components={{
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



