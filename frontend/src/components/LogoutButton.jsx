import { useNavigate } from "react-router-dom";
import { setAuthToken } from "../services/api";

export default function LogoutButton() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setAuthToken(null);
    navigate("/");
  };

  return (
    <button
      onClick={logout}
      style={{
        float: "right",
        background: "red",
        color: "white",
        border: "none",
        padding: "6px 12px",
        borderRadius: 4
      }}
    >
      Logout
    </button>
  );
}
