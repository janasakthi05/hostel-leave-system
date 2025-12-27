import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

export default function StudentSignup() {
  const [form, setForm] = useState({
    name: "",
    rollNumber: "",      // ✅ correct
    email: "",
    password: "",
    hostelBlock: "",
    roomNumber: "",      // ✅ correct
    phone: ""
  });

  const [idCardPhoto, setIdCardPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const signup = async () => {
    const required = Object.values(form);

    if (required.some((v) => !v) || !idCardPhoto) {
      alert("Please fill all fields and upload ID card");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });
      formData.append("idCardPhoto", idCardPhoto);

      await API.post("/auth/student-signup", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      alert("Registration successful");
      navigate("/login?role=student");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Student Registration</h2>
        <p style={styles.subHeading}>Create your hostel account</p>

        <input
          style={styles.input}
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          required
        />

        <input
          style={styles.input}
          name="rollNumber"
          placeholder="Roll Number"
          onChange={handleChange}
          required
        />

        <input
          style={styles.input}
          name="email"
          placeholder="College Email"
          onChange={handleChange}
          required
        />

        <input
          style={styles.input}
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />

        <input
          style={styles.input}
          name="hostelBlock"
          placeholder="Hostel Block"
          onChange={handleChange}
          required
        />

        {/* ✅ THIS WAS THE MAIN BUG */}
        <input
          style={styles.input}
          name="roomNumber"          // ✅ FIXED
          placeholder="Room Number"
          onChange={handleChange}
          required
        />

        <input
          style={styles.input}
          name="phone"
          placeholder="Phone Number"
          onChange={handleChange}
          required
        />

        <label style={styles.fileLabel}>
          Upload ID Card
          <input
            type="file"
            accept="image/*"
            style={styles.fileInput}
            onChange={(e) => setIdCardPhoto(e.target.files[0])}
            required
          />
        </label>

        <button
  type="button"          // ✅ ADD THIS LINE
  style={{
    ...styles.button,
    opacity: loading ? 0.7 : 1,
    cursor: loading ? "not-allowed" : "pointer"
  }}
  disabled={loading}
  onClick={signup}
>
  {loading ? "Registering..." : "Register"}
</button>


        <p style={styles.footerText}>
          Already registered?{" "}
          <Link to="/login?role=student" style={styles.link}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

/* 🎨 STYLES (UNCHANGED) */
const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f4f6f8",
    padding: 20
  },
  card: {
    width: "100%",
    maxWidth: 420,
    background: "#ffffff",
    padding: "30px 25px",
    borderRadius: 10,
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
  },
  heading: {
    marginBottom: 5,
    textAlign: "center",
    color: "#333"
  },
  subHeading: {
    textAlign: "center",
    marginBottom: 20,
    color: "#777",
    fontSize: 14
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    marginBottom: 12,
    borderRadius: 6,
    border: "1px solid #ccc",
    fontSize: 14
  },
  fileLabel: {
    display: "block",
    marginBottom: 15,
    fontSize: 14,
    color: "#555",
    cursor: "pointer"
  },
  fileInput: {
    display: "block",
    marginTop: 6
  },
  button: {
    width: "100%",
    padding: 12,
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    fontSize: 15,
    fontWeight: 600
  },
  footerText: {
    marginTop: 18,
    textAlign: "center",
    fontSize: 14
  },
  link: {
    color: "#4f46e5",
    textDecoration: "none",
    fontWeight: 500
  }
};
