import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import "../styles/Auth.css";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({});
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const role = searchParams.get("role") || "student";

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const login = async () => {
    if (!form.email || !form.password) {
      alert("Email and password required");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/auth/login", {
        email: form.email,
        password: form.password
      });

      localStorage.setItem("token", res.data.token);

      if (role === "warden") navigate("/warden");
      else if (role === "security") navigate("/security");
      else navigate("/student");

    } catch (err) {
      alert(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-wrapper">
        <div className="credentials-panel signin">
          <h2>{role.toUpperCase()} LOGIN</h2>

          <div className="field-wrapper">
            <input name="email" onChange={handleChange} />
            <label>Email</label>
          </div>

          <div className="field-wrapper">
            <input type="password" name="password" onChange={handleChange} />
            <label>Password</label>
          </div>

          <button disabled={loading} onClick={login}>
            {loading ? "Logging in..." : "Login"}
          </button>

          {role === "student" && (
            <p className="switch-link">
              New student? <Link to="/student-signup">Register</Link>
            </p>
          )}
        </div>

        <div className="background-shape"></div>
        <div className="secondary-shape"></div>
      </div>
    </div>
  );
}
