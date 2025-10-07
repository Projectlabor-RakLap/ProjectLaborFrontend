import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader, IScannerControls } from "@zxing/browser";
import { useDisclosure } from "@mantine/hooks";

const Scanner = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [scanning, setScanning] = useState(false);
  const videoEl = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<IScannerControls | null>(null);

  const onScanSuccess = (text: string) => {
    console.log("Scanned:", text);
    stopScanning();
    close();
  };

  const startScanning = async () => {
    if (!videoEl.current) return;

    const reader = new BrowserMultiFormatReader();
    setScanning(true);

    try {
      const controls = await reader.decodeFromVideoDevice(
        undefined,
        videoEl.current,
        (result, error) => {
          if (result) {
            onScanSuccess(result.getText());
          } else if (error && error.name !== "NotFoundException") {
            console.error("Decode error:", error);
          }
        }
      );

      controlsRef.current = controls;
    } catch (error) {
      console.error("Camera start error:", error);
      setScanning(false);
    }
  };

  const stopScanning = () => {
    controlsRef.current?.stop();
    controlsRef.current = null;
    setScanning(false);
  };

  useEffect(() => {
    if (opened) startScanning();
    else stopScanning();

    return () => stopScanning();
  }, [opened]);

  return (
    <div>
      <h3>QR / Barcode Scanner</h3>
      <button
        onClick={() => {
          if (!opened) open();
        }}
        disabled={scanning}
      >
        {opened ? "Scanning..." : "Open Scanner"}
      </button>

      {opened && (
        <div
          style={{
            position: "relative",
            width: "100%",
            maxWidth: 400,
            aspectRatio: "1/1",
          }}
        >
          <video
            ref={videoEl}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            muted
          />
        </div>
      )}
    </div>
  );
};

export default Scanner;
