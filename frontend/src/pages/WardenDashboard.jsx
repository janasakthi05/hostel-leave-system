import { useEffect, useState } from "react";
import api, { setAuthToken } from "../services/api";
import LogoutButton from "../components/LogoutButton";
import "../styles/warden.css";

export default function WardenDashboard() {
  const [requests, setRequests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [reason, setReason] = useState("");

  // Load requests
  const loadRequests = async () => {
    try {
      const res = await api.get("/warden/pending");
      setRequests(res.data);
    } catch (err) {
      alert("Failed to load requests");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAuthToken(token);
      loadRequests();
    }
  }, []);

  // Approve / Re-approve
  const approveLeave = async (id) => {
    try {
      await api.put(`/warden/approve/${id}`);
      alert("Leave approved");
      loadRequests();
    } catch (err) {
      alert(err.response?.data?.message || "Approval failed");
    }
  };

  // Reject popup
  const openRejectPopup = (id) => {
    setSelectedId(id);
    setShowModal(true);
  };

  // Reject leave
  const rejectLeave = async () => {
    if (!reason.trim()) {
      alert("Rejection reason is mandatory");
      return;
    }

    await api.put(`/warden/reject/${selectedId}`, { reason });
    alert("Leave rejected");
    setShowModal(false);
    setReason("");
    loadRequests();
  };

  // ⏱ Check if rejected request expired (24 hrs)
  const isExpired = (req) => {
    if (req.status !== "REJECTED") return false;
    const diff =
      Date.now() - new Date(req.rejectedAt).getTime();
    return diff > 24 * 60 * 60 * 1000;
  };

  // ⌛ Remaining hours
  const remainingHours = (req) => {
    const diff =
      24 * 60 * 60 * 1000 -
      (Date.now() - new Date(req.rejectedAt).getTime());
    return Math.max(Math.floor(diff / (1000 * 60 * 60)), 0);
  };

  return (
    <div className="warden-page">
      <div className="warden-header">
        <h2>Warden Dashboard</h2>
        <LogoutButton />
      </div>

      {requests.length === 0 && (
        <p className="empty">No pending or re-approvable requests</p>
      )}

      {requests.map((req) => {
        const expired = isExpired(req);

        return (
          <div key={req._id} className="leave-card">
            <p><b>Student:</b> {req.studentId.name}</p>
            <p><b>Email:</b> {req.studentId.email}</p>
            <p><b>Purpose:</b> {req.purpose}</p>

            {/* STATUS */}
            {req.status === "PENDING" && (
              <p className="status pending">Pending</p>
            )}

            {req.status === "REJECTED" && !expired && (
              <p className="status" style={{ color: "#dc2626" }}>
                Rejected (Re-approve within {remainingHours(req)} hrs)
              </p>
            )}

            {req.status === "REJECTED" && expired && (
              <p className="status" style={{ color: "#6b7280" }}>
                Rejected (Expired – Reapply Required)
              </p>
            )}

            {/* REJECTION REASON */}
            {req.status === "REJECTED" && (
              <p><b>Reason:</b> {req.rejectionReason}</p>
            )}

            {/* ACTIONS */}
            <div className="actions">
              <button
                className="btn btn-approve"
                disabled={expired}
                onClick={() => approveLeave(req._id)}
                style={{
                  background: expired ? "#9ca3af" : "#16a34a",
                  cursor: expired ? "not-allowed" : "pointer"
                }}
              >
                Approve
              </button>

              {req.status === "PENDING" && (
                <button
                  className="btn btn-reject"
                  onClick={() => openRejectPopup(req._id)}
                >
                  Reject
                </button>
              )}
            </div>
          </div>
        );
      })}

      {/* REJECT MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Reject Leave</h3>

            <textarea
              placeholder="Enter rejection reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />

            <div className="modal-actions">
              <button className="btn btn-reject" onClick={rejectLeave}>
                Submit
              </button>
              &nbsp;
              <button className="btn" onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
