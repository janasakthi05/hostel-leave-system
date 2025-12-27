import { useEffect, useState } from "react";
import axios from "axios";
import ApprovedQR from "../components/ApprovedQR";
import "../styles/StudentDashboard.css";

export default function StudentDashboard() {
  const [purpose, setPurpose] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [leaves, setLeaves] = useState([]);

  const token = localStorage.getItem("token");

  // Format date nicely
  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // Fetch leave history
  const fetchLeaves = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/student/my-leaves",
        {
          headers: {
            Authorization: `Bearer ${token}` // ✅ FIXED
          }
        }
      );
      setLeaves(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  // Apply leave
  const applyLeave = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/api/student/apply-leave",
        { purpose, fromDate, toDate },
        {
          headers: {
            Authorization: `Bearer ${token}` // ✅ FIXED
          }
        }
      );

      setPurpose("");
      setFromDate("");
      setToDate("");
      fetchLeaves();
      alert("Leave applied successfully");
    } catch {
      alert("Error applying leave");
    }
  };

  return (
    <div className="student-dashboard">
      <h1 className="dashboard-title">🎓 Student Dashboard</h1>

      {/* Apply Leave */}
      <div className="card">
        <h2>Apply Leave</h2>

        <form className="leave-form" onSubmit={applyLeave}>
          <input
            type="text"
            placeholder="Purpose of Leave"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            required
          />

          <div className="date-row">
            <div className="date-field">
              <label>Out Date</label>
              <input
                type="datetime-local"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                required
              />
            </div>

            <div className="date-field">
              <label>In Date</label>
              <input
                type="datetime-local"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit">Apply Leave</button>
        </form>
      </div>

      {/* Leave History */}
      <div className="card">
        <h2>My Leave Requests</h2>

        {leaves.length === 0 && (
          <p className="empty-text">No leave requests found.</p>
        )}

        {leaves.map((leave) => (
          <div key={leave._id} className="leave-item">

            {/* Status */}
            <div className="leave-header">
              <span className={`status ${leave.status.toLowerCase()}`}>
                {leave.status}
              </span>
            </div>

            {/* Purpose */}
            <p className="leave-purpose">
              <b>Purpose:</b> {leave.purpose || leave.reason || "—"}
            </p>

            {/* Dates */}
            <p className="leave-dates">
              <b>Out:</b> {formatDate(leave.fromDate)} <br />
              <b>In:</b> {formatDate(leave.toDate)}
            </p>

            {/* DELETE BUTTON – ONLY FOR PENDING */}
            {leave.status === "PENDING" && (
              <button
                className="delete-btn"
                onClick={async () => {
                  const confirmDelete = window.confirm(
                    "Are you sure you want to delete this pending leave request?"
                  );

                  if (!confirmDelete) return;

                  try {
                    await axios.delete(
                      `http://localhost:5000/api/student/leave/${leave._id}`,
                      {
                        headers: {
                          Authorization: `Bearer ${token}` // ✅ FIXED
                        }
                      }
                    );

                    fetchLeaves();
                  } catch (err) {
                    alert("Failed to delete leave request");
                  }
                }}
              >
                🗑 Delete
              </button>
            )}

            {/* Rejection Reason */}
            {leave.status === "REJECTED" && (
              <p className="reject-reason">
                ❌ Reason: {leave.rejectionReason}
              </p>
            )}

            {/* Approved QR */}
            {leave.status === "APPROVED" && leave.qrToken && (
              <div className="qr-section">
                <ApprovedQR leaveId={leave._id} />
                <p className="qr-note">
                  Show this QR to security while exiting
                </p>
              </div>
            )}

          </div>
        ))}
      </div>
    </div>
  );
}
