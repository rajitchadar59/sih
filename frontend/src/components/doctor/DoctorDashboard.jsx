import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || storedUser.role !== "doctor") navigate("/login");
    else {
      setUser(storedUser);
      fetchAppointments(storedUser._id);
    }
  }, [navigate]);

  const fetchAppointments = async (doctorId) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/appointment/doctor/${doctorId}`
      );
      if (res.data.success) setAppointments(res.data.appointments || []);
    } catch (err) {
      console.error(err);
    }
  };

  const confirmAppointment = async (appointmentId) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/appointment/confirm/${appointmentId}`
      );
      if (res.data.success) {
        alert("Appointment confirmed!");
        setAppointments((prev) =>
          prev.map((a) =>
            a._id === appointmentId ? { ...a, completed: true } : a
          )
        );
      }
    } catch (err) {
      console.error(err);
      alert("Error confirming appointment");
    }
  };

  if (!user) return null;

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Welcome Dr. {user.name}</h1>
      <p>Email: {user.email}</p>

      <h2 style={{ marginTop: "30px" }}>Appointments</h2>
      {appointments.length === 0 ? (
        <p>No appointments yet.</p>
      ) : (
        appointments.map((a) => (
          <div
            key={a._id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              margin: "10px 0",
              borderRadius: "6px",
            }}
          >
            <p>
              <strong>Patient:</strong> {a.patient?.name} ({a.patient?.email})
            </p>
            <p>
              <strong>Therapy:</strong> {a.therapy?.name}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(a.date).toLocaleDateString("en-IN")}
            </p>
            <p>
              <strong>Slot:</strong> {a.slot}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              {a.completed ? "✅ Confirmed" : "Pending"}
            </p>

            <button
              onClick={() => confirmAppointment(a._id)}
              style={{
                marginTop: "10px",
                padding: "6px 12px",
                backgroundColor: a.completed ? "gray" : "#4caf50",
                color: "#fff",
                border: "none",
                cursor: a.completed ? "not-allowed" : "pointer",
              }}
              disabled={a.completed}
            >
              {a.completed ? "Confirmed ✅" : "Confirm Appointment"}
            </button>
          </div>
        ))
      )}

      <button
        onClick={() => {
          localStorage.removeItem("user");
          navigate("/login");
        }}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#2196f3",
          color: "#fff",
          border: "none",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default DoctorDashboard;
