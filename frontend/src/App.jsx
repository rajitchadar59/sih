import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import PatientDashboard from "./components/patient/PatientDashboard";
import AdminDashboard from "./components/admin/AdminDashboard";
import DoctorDashboard from "./components/doctor/DoctorDashboard.jsx";
import Register from "./pages/Register.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login/:roleParam" element={<Login />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/patient-dashboard" element={<PatientDashboard />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
         <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
