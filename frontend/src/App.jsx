import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import PatientDashboard from "./components/patient/PatientDashboard";
import AdminDashboard from "./components/admin/AdminDashboard";
import DoctorDashboard from "./components/doctor/DoctorDashboard.jsx";
import PatientAnalytics from "./components/patient/PatientAnalytics.jsx";
import PatientInfo from "./components/patient/PatientInfo.jsx";
import PatientSchedule from "./components/patient/PatientSchedule.jsx";
import Register from "./pages/Register.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login/:roleParam" element={<Login />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/dashboard/Patient" element={<PatientDashboard />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
         <Route path="/register" element={<Register />} />

         <Route path="/analytics/Patient" element={<PatientAnalytics />} />
          <Route path="/schedules/Patient" element={<PatientSchedule />} />
          <Route path="/info/Patient" element={<PatientInfo />} />



      </Routes>
    </Router>
  );
}

export default App;
