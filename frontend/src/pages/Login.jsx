import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api, { setAuthToken } from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const role = params.get("role");

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", { email, password });
      const token = res.data.token;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      setAuthToken(token);

      if (role === "student") navigate("/student");
      else if (role === "warden") navigate("/warden");
      else navigate("/security");
    } catch {
      alert("Login failed");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>{role?.toUpperCase()} Login</h2>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <br /><br />
      <input type="password" placeholder="Password"
        onChange={e => setPassword(e.target.value)} />
      <br /><br />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
