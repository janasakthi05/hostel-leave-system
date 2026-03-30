import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="auth-page">
      <div className="auth-wrapper">
        <div className="credentials-panel signin">
          <div className="slide-element">
            <h2>Kongu Engineering College</h2>
            <p className="subtitle">Hostel Leave Management System</p>

            <button
              className="submit-button"
              onClick={() => navigate("/login?role=warden")}
            >
              Warden Login
            </button>

            <button
              className="submit-button"
              onClick={() => navigate("/login?role=student")}
            >
              Student Login
            </button>

            <button
              className="submit-button"
              onClick={() => navigate("/login?role=security")}
            >
              Security Login
            </button>
          </div>
        </div>

        <div className="welcome-section signin">
          <h2>Welcome</h2>
          <p>
            Secure hostel leave approvals with real-time tracking and role-based
            access.
          </p>
        </div>

        <div className="background-shape"></div>
        <div className="secondary-shape"></div>
      </div>
    </div>
  );
}
