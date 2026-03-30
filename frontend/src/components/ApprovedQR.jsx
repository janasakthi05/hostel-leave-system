import { useEffect, useState } from "react";
import axios from "axios";

export default function ApprovedQR({ leaveId }) {
  const [qrImage, setQrImage] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
  const generateQR = async () => {
    try {
      const res = await axios.get(
        `https://hostel-backend-2fw3.onrender.com/api/qr/generate/${leaveId}`,
        {
          headers: {
            Authorization: `Bearer ${token}` // ✅ FIX
          }
        }
      );
      setQrImage(res.data.qrImage);
    } catch (err) {
      console.error("QR generation error:", err);
    }
  };

  generateQR();
}, [leaveId]);


  return (
    <div>
      <h4>QR Code</h4>
      {qrImage && (
        <img src={qrImage} alt="QR Code" width="200" />
      )}
    </div>
  );
}
