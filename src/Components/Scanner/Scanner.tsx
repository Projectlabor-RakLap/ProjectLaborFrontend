import React, { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader, IScannerControls } from "@zxing/browser";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";

interface ScannerDialogProps {
  open: boolean;
  onClose: () => void;
  onScan: (text: string) => void;
}

const ScannerDialog: React.FC<ScannerDialogProps> = ({ open, onClose, onScan }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    if (!open) {
      stopScanning();
      return;
    }

    let timeout: NodeJS.Timeout;

    timeout = setTimeout(() => {
      startScanning();
    }, 300);

    return () => {
      clearTimeout(timeout);
      stopScanning();
    };
  }, [open]);

  const startScanning = async () => {
    if (!videoRef.current) return;

    const reader = new BrowserMultiFormatReader();
    setScanning(true);

    try {
      const controls = await reader.decodeFromVideoDevice(
        undefined,
        videoRef.current,
        (result, error) => {
          if (result) {
            console.log("Scanned:", result.getText());
            onScan(result.getText());
            stopScanning();
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
    if (controlsRef.current) {
      controlsRef.current.stop();
      controlsRef.current = null;
    }
    setScanning(false);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Scan Barcode / QR Code</DialogTitle>
      <DialogContent>
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "1 / 1",
            overflow: "hidden",
            borderRadius: "8px",
            border: "2px solid #1976d2",
            backgroundColor: "#000",
          }}
        >
          <video
            ref={videoRef}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: scanning ? "block" : "block",
            }}
            muted
            playsInline
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            stopScanning();
            onClose();
          }}
          color="error"
          variant="contained"
        >
          Stop
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ScannerDialog;
