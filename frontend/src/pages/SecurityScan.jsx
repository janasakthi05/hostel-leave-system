import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import api from "../services/api";
import LogoutButton from "../components/LogoutButton";

export default function SecurityScan() {
  const [qrToken, setQrToken] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [showCamera, setShowCamera] = useState(false);

  const qrScannerRef = useRef(null);

  const scanQR = async (tokenFromCamera) => {
    setError("");
    setResult(null);

    const tokenToUse = tokenFromCamera || qrToken;

    if (!tokenToUse) {
      setError("Please enter or scan QR token");
      return;
    }

    try {
      const res = await api.post("/security/scan", {
        qrToken: tokenToUse
      });
      setResult(res.data);
      setShowCamera(false);
      stopCamera();
    } catch (err) {
      setError(err.response?.data?.message || "Access denied");
      setShowCamera(false);
      stopCamera();
    }
  };

  // Start camera when Scan button clicked
  useEffect(() => {
    if (!showCamera) return;

    qrScannerRef.current = new Html5Qrcode("qr-reader");

    qrScannerRef.current
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        (decodedText) => {
          setQrToken(decodedText);
          scanQR(decodedText);
        }
      )
      .catch(() => {
        setError("Camera permission denied");
        setShowCamera(false);
      });

    return () => stopCamera();
  }, [showCamera]);

  const stopCamera = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current
        .stop()
        .then(() => qrScannerRef.current.clear())
        .catch(() => {});
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f6f8",
        padding: 40,
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif",
        fontSize: 16,
        lineHeight: 1.6,
        color: "#111"
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 30
          }}
        >
          <h2 style={{ margin: 0, fontSize: 26, fontWeight: 700 }}>
            🔐 Security Gate Verification
          </h2>
          <LogoutButton />
        </div>

        {/* QR INPUT CARD */}
        <div
          style={{
            background: "#ffffff",
            padding: 26,
            borderRadius: 14,
            boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
            width: 400
          }}
        >
          <label style={{ fontWeight: 600, fontSize: 17 }}>
            QR Token
          </label>

          <input
            placeholder="Scan or paste QR token"
            value={qrToken}
            onChange={(e) => setQrToken(e.target.value)}
            style={{
              width: "100%",
              padding: 12,
              fontSize: 16,
              borderRadius: 8,
              border: "2px solid #cbd5e1",
              marginBottom: 18
            }}
          />

          <button
            onClick={() => setShowCamera(true)}
            style={{
              width: "100%",
              padding: 14,
              fontSize: 17,
              fontWeight: 700,
              borderRadius: 8,
              border: "none",
              background: "#1d4ed8",
              color: "#ffffff",
              cursor: "pointer"
            }}
          >
            📷 Scan QR
          </button>

          {/* CAMERA VIEW */}
          {showCamera && (
            <div style={{ marginTop: 20 }}>
              <div id="qr-reader" style={{ width: "100%" }} />
              <p style={{ marginTop: 8 }}>Scanning QR...</p>
            </div>
          )}

          {/* MANUAL VERIFY */}
          <button
            onClick={() => scanQR()}
            style={{
              marginTop: 12,
              width: "100%",
              padding: 12,
              fontSize: 15,
              borderRadius: 8,
              border: "2px solid #1d4ed8",
              background: "#ffffff",
              color: "#1d4ed8",
              fontWeight: 600
            }}
          >
            Verify Manually
          </button>
        </div>

        {/* ACCESS GRANTED */}
        {result && (
          <div
            style={{
              marginTop: 35,
              background: "#ecfdf5",
              border: "3px solid #22c55e",
              padding: 28,
              borderRadius: 16,
              maxWidth: 650
            }}
          >
            <h3 style={{ color: "#166534" }}>✅ ACCESS GRANTED</h3>
            <p><b>Name:</b> {result.student.name}</p>
            <p><b>Email:</b> {result.student.email}</p>
            <p><b>Hostel Block:</b> {result.student.hostelBlock}</p>
            <p><b>Room Number:</b> {result.student.roomNumber}</p>
            <p><b>Purpose:</b> {result.leaveDetails.purpose}</p>
          </div>
        )}

        {/* ACCESS DENIED */}
        {error && (
          <div
            style={{
              marginTop: 35,
              background: "#fff5f5",
              border: "3px solid #ef4444",
              padding: 28,
              borderRadius: 16,
              maxWidth: 650
            }}
          >
            <h3 style={{ color: "#991b1b" }}>❌ ACCESS DENIED</h3>
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
