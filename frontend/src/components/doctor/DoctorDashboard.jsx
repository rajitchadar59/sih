import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || storedUser.role !== "doctor") navigate("/login");
    else {
      setDoctor(storedUser);
      fetchAppointments(storedUser._id);
    }
  }, [navigate]);

  const fetchAppointments = async (doctorId) => {
    try {
      const res = await axios.get(`http://localhost:5000/appointment/doctor/${doctorId}`);
      if (res.data.success) setAppointments(res.data.appointments);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed": return "#4caf50";
      case "cancelled": return "#f44336";
      case "pending":
      default: return "#ff9800";
    }
  };

  if (!doctor) return null;

  return (
    <div style={{ minHeight: "100vh", padding: "20px", backgroundColor: "#f5f5f5" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h1>Welcome, Dr. {doctor.name}</h1>
        <button
          onClick={handleLogout}
          style={{ padding: "10px 20px", backgroundColor: "#f44336", color: "#000", border: "none", borderRadius: "5px", cursor: "pointer" }}
        >Logout</button>
      </header>

      <h2 style={{ marginBottom: "20px" }}>Your Appointments</h2>
      {appointments.length === 0 ? (
        <p>No appointments yet.</p>
      ) : (
        <div style={{ overflowX: "auto" ,color:"#000" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "#fff", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>
            <thead style={{ backgroundColor: "#1976d2", color: "#060505ff" }}>
              <tr>
                <th style={{ padding: "12px", border: "1px solid #000" }}>Patient</th>
                <th style={{ padding: "12px", border: "1px solid #000" }}>Therapy</th>
                <th style={{ padding: "12px", border: "1px solid #000" }}>Date</th>
                <th style={{ padding: "12px", border: "1px solid #000" }}>Slot</th>
                <th style={{ padding: "12px", border: "1px solid #000" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a._id} style={{ textAlign: "center" }}>
                  <td style={{ padding: "10px", border: "1px solid #000" }}>{a.patient?.name}</td>
                  <td style={{ padding: "10px", border: "1px solid #000" }}>{a.therapy?.name}</td>
                  <td style={{ padding: "10px", border: "1px solid #000" }}>
                    {a.date ? new Date(a.date).toLocaleString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" }) : "N/A"}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #000" }}>{a.slot}</td>
                  <td style={{ padding: "10px", border: "1px solid #000", color: "#fff", fontWeight: "bold", backgroundColor: getStatusColor(a.status || "pending"), borderRadius: "5px" }}>
                    {a.status || "Pending"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
