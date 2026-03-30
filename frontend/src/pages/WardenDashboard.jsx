import { useEffect, useState } from "react";
import api from "../services/api";
import LogoutButton from "../components/LogoutButton";
import "../styles/warden.css";

/* ===== CHART IMPORTS ===== */
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

export default function WardenDashboard() {
  /* ===== EXISTING STATES ===== */
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [reason, setReason] = useState("");

  /* ===== CHART STATE ===== */
  const [chartData, setChartData] = useState(null);

  /* ===== LOAD REQUESTS ===== */
  const loadRequests = async () => {
    try {
      setLoading(true);
      const res = await api.get("/warden/pending");
      setRequests(res.data);
    } catch (err) {
      console.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  /* ===== LOAD LEAVE ANALYTICS (BAR CHART) ===== */
  const loadLeaveAnalytics = async () => {
    try {
      const res = await api.get("/warden/analytics/leave-trends");

      if (!res.data || res.data.length === 0) {
        setChartData(null);
        return;
      }

      const labels = res.data.map(item => item._id);
      const values = res.data.map(item => item.leaveCount);

      setChartData({
        labels,
        datasets: [
          {
            label: "Number of Leaves",
            data: values,
            backgroundColor: "#4f46e5",
            borderRadius: 8,
            barThickness: 40
          }
        ]
      });
    } catch (err) {
      console.error("Failed to load leave analytics");
    }
  };

  useEffect(() => {
    loadRequests();
    loadLeaveAnalytics();
  }, []);

  /* ===== APPROVE ===== */
  const approveLeave = async (id) => {
    try {
      await api.put(`/warden/approve/${id}`);
      alert("Leave approved");
      loadRequests();
      loadLeaveAnalytics();
    } catch (err) {
      alert("Approval failed");
    }
  };

  /* ===== REJECT ===== */
  const openRejectPopup = (id) => {
    setSelectedId(id);
    setShowModal(true);
  };

  const rejectLeave = async () => {
    if (!reason.trim()) {
      alert("Rejection reason is mandatory");
      return;
    }

    try {
      await api.put(`/warden/reject/${selectedId}`, { reason });
      alert("Leave rejected");
      setShowModal(false);
      setReason("");
      loadRequests();
      loadLeaveAnalytics();
    } catch (err) {
      alert("Rejection failed");
    }
  };

  /* ===== EXPIRE CHECK ===== */
  const isExpired = (req) => {
    if (req.status !== "REJECTED") return false;
    const diff = Date.now() - new Date(req.rejectedAt).getTime();
    return diff > 24 * 60 * 60 * 1000;
  };

  const remainingHours = (req) => {
    const diff =
      24 * 60 * 60 * 1000 -
      (Date.now() - new Date(req.rejectedAt).getTime());
    return Math.max(Math.floor(diff / (1000 * 60 * 60)), 0);
  };

  /* ===== UI ===== */
  return (
    <div className="warden-page">
      <div className="warden-header">
        <h2>Warden Dashboard</h2>
        <LogoutButton />
      </div>

      {/* ===== BAR CHART ===== */}
      <div className="leave-chart-card">
        <h3 className="chart-title">📊 Department-wise Leave Count</h3>

        {chartData ? (
          <div style={{ height: "300px" }}>
            <Bar
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1 }
                  }
                }
              }}
            />
          </div>
        ) : (
          <p className="empty">No approved leave data available</p>
        )}
      </div>

      {/* ===== REQUEST LIST ===== */}
      {loading && <p className="empty">Loading requests...</p>}

      {!loading && requests.length === 0 && (
        <p className="empty">No pending or re-approvable requests</p>
      )}

      {!loading &&
        requests.map((req) => {
          const expired = isExpired(req);

          return (
            <div key={req._id} className="leave-card">
              <p><b>Student:</b> {req.studentId?.name}</p>
              <p><b>Email:</b> {req.studentId?.email}</p>
              <p><b>Purpose:</b> {req.purpose}</p>

              {req.status === "PENDING" && (
                <p className="status pending">Pending</p>
              )}

              {req.status === "REJECTED" && !expired && (
                <p className="status rejected">
                  Rejected (Re-approve within {remainingHours(req)} hrs)
                </p>
              )}

              {req.status === "REJECTED" && expired && (
                <p className="status expired">
                  Rejected (Expired – Reapply Required)
                </p>
              )}

              {req.status === "REJECTED" && (
                <p><b>Reason:</b> {req.rejectionReason}</p>
              )}

              <div className="actions">
                <button
                  className="btn btn-approve"
                  disabled={expired}
                  onClick={() => approveLeave(req._id)}
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

      {/* ===== REJECT MODAL ===== */}
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