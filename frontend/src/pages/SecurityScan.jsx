import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import api from "../services/api";
import LogoutButton from "../components/LogoutButton";

const BACKEND_URL = "https://hostel-backend-2fw3.onrender.com";

export default function SecurityScan() {
  const [qrToken, setQrToken] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [showCamera, setShowCamera] = useState(false);
  const [processing, setProcessing] = useState(false);

  const qrScannerRef = useRef(null);

  const stopCamera = async () => {
    if (qrScannerRef.current) {
      try {
        await qrScannerRef.current.stop();
        await qrScannerRef.current.clear();
      } catch {}
    }
  };

  const scanQR = async (tokenFromCamera) => {
    if (processing) return;

    setProcessing(true);
    setError("");
    setResult(null);

    const tokenToUse = (tokenFromCamera || qrToken).trim();

    if (!tokenToUse) {
      setError("Please enter or scan QR token");
      setProcessing(false);
      return;
    }

    try {
      const res = await api.post("/security/scan", {
        qrToken: tokenToUse
      });

      if (res.data.status === "GRANTED") {
        setResult(res.data);
      } else {
        setError(res.data.message || "Access denied");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Access denied");
    } finally {
      setShowCamera(false);
      await stopCamera();
      setProcessing(false);
    }
  };

  useEffect(() => {
    if (!showCamera) return;

    qrScannerRef.current = new Html5Qrcode("qr-reader");

    qrScannerRef.current
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 260 },
        (decodedText) => {
          if (!processing) {
            setQrToken(decodedText);
            scanQR(decodedText);
          }
        }
      )
      .catch(() => {
        setError("Camera permission denied");
        setShowCamera(false);
      });

    return () => stopCamera();
  }, [showCamera]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a, #020617)",
        padding: "60px 20px",
        fontFamily: "Inter, system-ui, sans-serif",
        color: "#e5e7eb"
      }}
    >
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 40
          }}
        >
          <h2 style={{ fontSize: 26, fontWeight: 700, color: "#f8fafc" }}>
            Security Gate Verification
          </h2>
          <LogoutButton />
        </div>

        <div
          style={{
            background: "#020617",
            borderRadius: 18,
            padding: 30,
            width: 420,
            boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
            border: "1px solid #1e293b"
          }}
        >
          <label
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "#cbd5f5",
              marginBottom: 6,
              display: "block"
            }}
          >
            QR Token
          </label>

          <input
            value={qrToken}
            onChange={(e) => setQrToken(e.target.value)}
            placeholder="Scan or paste QR token"
            style={{
              width: "100%",
              padding: 14,
              borderRadius: 12,
              border: "1px solid #334155",
              background: "#020617",
              color: "#f8fafc",
              fontSize: 15,
              outline: "none",
              marginBottom: 20
            }}
          />

          <button
            onClick={() => setShowCamera(true)}
            disabled={processing}
            style={{
              width: "100%",
              padding: 14,
              borderRadius: 14,
              border: "none",
              fontSize: 15,
              fontWeight: 600,
              background: processing ? "#334155" : "#6366f1",
              color: "#ffffff",
              cursor: processing ? "not-allowed" : "pointer"
            }}
          >
            Scan QR Code
          </button>

          {showCamera && (
            <div
              style={{
                marginTop: 22,
                padding: 12,
                background: "#020617",
                borderRadius: 14,
                border: "1px dashed #475569"
              }}
            >
              <div id="qr-reader" />
              <p
                style={{
                  textAlign: "center",
                  marginTop: 10,
                  fontSize: 13,
                  color: "#94a3b8"
                }}
              >
                Scanning…
              </p>
            </div>
          )}

          <button
            onClick={() => scanQR()}
            disabled={processing}
            style={{
              marginTop: 14,
              width: "100%",
              padding: 13,
              borderRadius: 14,
              border: "1px solid #334155",
              background: "#020617",
              color: "#e5e7eb",
              fontSize: 14,
              cursor: processing ? "not-allowed" : "pointer"
            }}
          >
            Verify Manually
          </button>
        </div>

        {result && (
          <div
            style={{
              marginTop: 40,
              background: "linear-gradient(135deg, #052e16, #022c22)",
              padding: 30,
              borderRadius: 18,
              border: "1px solid #14532d"
            }}
          >
            <h3 style={{ color: "#86efac", marginBottom: 14 }}>
              ACCESS GRANTED
            </h3>

            {result.student.idCardPhoto && (
              <img
                src={
                  result.student.idCardPhoto.startsWith("http")
                    ? result.student.idCardPhoto
                    : `${BACKEND_URL}${result.student.idCardPhoto}`
                }
                alt="Student ID"
                style={{
                  width: 120,
                  height: 120,
                  objectFit: "cover",
                  borderRadius: 12,
                  border: "3px solid #22c55e",
                  marginBottom: 16
                }}
              />
            )}

            <p><b>Name:</b> {result.student.name}</p>
            <p><b>Email:</b> {result.student.email}</p>
            <p><b>Hostel Block:</b> {result.student.hostelBlock}</p>
            <p><b>Room Number:</b> {result.student.roomNumber}</p>
            <p><b>Purpose:</b> {result.leaveDetails.purpose}</p>
          </div>
        )}

        {error && (
          <div
            style={{
              marginTop: 40,
              background: "linear-gradient(135deg, #450a0a, #1f0707)",
              padding: 30,
              borderRadius: 18,
              border: "1px solid #7f1d1d"
            }}
          >
            <h3 style={{ color: "#fca5a5", marginBottom: 10 }}>
              ACCESS DENIED
            </h3>
            <p style={{ color: "#fecaca" }}>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
