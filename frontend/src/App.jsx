import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import StudentDashboard from "./pages/StudentDashboard";
import WardenDashboard from "./pages/WardenDashboard";
import SecurityScan from "./pages/SecurityScan";
import StudentSignup from "./pages/StudentSignup";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Auth />} />
<Route path="/student-signup" element={<StudentSignup />} />

        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/warden" element={<WardenDashboard />} />
        <Route path="/security" element={<SecurityScan />} />
      </Routes>
    </BrowserRouter>
  );
}
