import { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import { useDisclosure } from "@mantine/hooks";


const Scanner = () => {
    const [opened, { open, close }] = useDisclosure(false);
    const scanner = useRef<QrScanner | null>(null);
    const videoEl = useRef<HTMLVideoElement>(null);
    const qrBoxEl = useRef<HTMLDivElement>(null);
    const [qrOn, setQrOn] = useState<boolean>(true);

     const onScanSuccess = (result: QrScanner.ScanResult) => {
        console.log("scanned: " + result?.data);
        scanner.current?.stop();
    };

    const onScanFail = (err: string | Error) => {
        console.log(err);
    };

    useEffect(() => {
        if (opened) {
            const timeout = setTimeout(() => {
                if (videoEl.current) {
                    scanner.current = new QrScanner(videoEl.current, onScanSuccess, {
                        onDecodeError: onScanFail,
                        preferredCamera: "environment",
                        highlightScanRegion: true,
                        highlightCodeOutline: true,
                        overlay: qrBoxEl.current || undefined,
                    });

                    scanner.current
                        .start()
                        .then(() => setQrOn(true))
                        .catch((err) => {
                            console.error("Scanner start error:", err);
                            setQrOn(false);
                        });
                }
            }, 300);

            return () => {
                scanner.current?.stop();
                scanner.current = null;
                clearTimeout(timeout);
            };
        }
    }, [opened]);

    useEffect(() => {
        if (!qrOn) alert("The camera is disabled. Please enable it and refresh the site");
    }, [qrOn]);


    return <div>
        QR Code Scanner
        <br></br>
        <button onClick={open}>Open QR Scanner</button>
        {opened && <div style={{ position: "relative", width: "100%", maxWidth: 400, aspectRatio: "1/1" }}>
            <video ref={videoEl} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>}
    </div>;
}

export default Scanner;