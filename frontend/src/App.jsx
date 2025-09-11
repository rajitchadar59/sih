import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/Dashboard";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login/:roleParam" element={<Login />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/patient-dashboard" element={<Dashboard />} />
        <Route path="/doctor-dashboard" element={<Dashboard />} />
        <Route path="/admin-dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
