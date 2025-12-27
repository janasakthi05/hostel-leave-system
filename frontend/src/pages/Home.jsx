import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.college}>Kongu Engineering College</h1>
        <p style={styles.subtitle}>Hostel Leave Management System</p>

        <div style={styles.divider}></div>

        <button
          style={{ ...styles.button, background: "#2563eb" }}
          onClick={() => navigate("/login?role=warden")}
        >
          Warden Login
        </button>

        <button
          style={{ ...styles.button, background: "#16a34a" }}
          onClick={() => navigate("/login?role=student")}
        >
          Student Login
        </button>

        <button
          style={{ ...styles.button, background: "#9333ea" }}
          onClick={() => navigate("/login?role=security")}
        >
          Security Login
        </button>
      </div>
    </div>
  );
}

/* 🎨 STYLES – UI ONLY */
const styles = {
  page: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #eef2ff, #f8fafc)",
    padding: 20
  },
  card: {
    background: "#ffffff",
    padding: "40px 30px",
    borderRadius: 12,
    width: 340,
    textAlign: "center",
    boxShadow: "0 15px 30px rgba(0,0,0,0.12)"
  },
  college: {
    marginBottom: 6,
    fontSize: 22,
    color: "#1f2937"
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 20
  },
  divider: {
    height: 1,
    background: "#e5e7eb",
    marginBottom: 20
  },
  button: {
    width: "100%",
    padding: "12px 0",
    marginBottom: 12,
    border: "none",
    borderRadius: 8,
    color: "#fff",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    transition: "transform 0.1s ease"
  }
};
