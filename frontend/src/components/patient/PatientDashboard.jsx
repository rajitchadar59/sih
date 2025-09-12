import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Notification from "./Notification.jsx";

const PatientDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [therapies, setTherapies] = useState([]);
  const [expandedTherapy, setExpandedTherapy] = useState(null);
  const [therapyDoctors, setTherapyDoctors] = useState({});
  const [expandedDoctor, setExpandedDoctor] = useState({});
  const [appointmentData, setAppointmentData] = useState({});
  const [upcoming, setUpcoming] = useState([]);

  // --- Load user and data ---
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || storedUser.role !== "patient") navigate("/login");
    else {
      setUser(storedUser);
      fetchTherapies();
      fetchUpcomingAppointments(storedUser._id);
    }
  }, [navigate]);

  // --- Fetch therapies ---
  const fetchTherapies = async () => {
    try {
      const res = await axios.get("http://localhost:5000/therapy/all");
      if (res.data.success) setTherapies(res.data.therapies || []);
    } catch (err) {
      alert("Error fetching therapies: " + err.message);
    }
  };

  // --- Fetch upcoming appointments ---
  const fetchUpcomingAppointments = async (patientId) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/appointment/patient/${patientId}`
      );
      if (res.data.success) setUpcoming(res.data.appointments || []);
    } catch (err) {
      console.log(err);
    }
  };

  // --- Expand therapy ---
  const handleTherapyClick = async (therapyId) => {
    const idStr = String(therapyId);
    if (expandedTherapy === idStr) {
      setExpandedTherapy(null);
    } else {
      setExpandedTherapy(idStr);
      // Load doctors if not already
      if (!therapyDoctors[idStr]) {
        try {
          const res = await axios.get(
            `http://localhost:5000/auth/doctors-by-therapy/${therapyId}`
          );
          if (res.data.success) {
            setTherapyDoctors((prev) => ({
              ...prev,
              [idStr]: res.data.doctors || [],
            }));
          }
        } catch (err) {
          console.log(err);
          setTherapyDoctors((prev) => ({ ...prev, [idStr]: [] }));
        }
      }
    }
  };

  // --- Book appointment ---
  const bookAppointment = async (therapyId, doctorId) => {
    const data = appointmentData[doctorId];
    if (!data?.date || !data?.slot)
      return alert("Select date and slot first");

    try {
      const payload = {
        therapy: therapyId,
        doctor: doctorId,
        patient: user._id,
        date: new Date(data.date).toISOString(),
        slot: data.slot,
      };

      const res = await axios.post(
        "http://localhost:5000/appointment/book",
        payload
      );

      if (res.data.success) {
        alert("Appointment booked successfully!");
        setAppointmentData((prev) => ({ ...prev, [doctorId]: {} }));
        fetchUpcomingAppointments(user._id);
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  // --- Cancel appointment ---
  const cancelAppointment = async (appointmentId) => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/appointment/cancel/${appointmentId}`
      );
      if (res.data.success) {
        setUpcoming((prev) => prev.filter((a) => a._id !== appointmentId));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <h1>Welcome, {user.name}</h1>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>

      {/* Therapies */}
      <h2 style={{ marginTop: "30px" }}>Available Therapies</h2>
      {therapies.length === 0 ? (
        <p>No therapies available yet.</p>
      ) : (
        therapies.map((therapy) => {
          const therapyIdStr = String(therapy._id);
          const doctors = therapyDoctors[therapyIdStr] || []; // ✅ safe fallback
          return (
            <div
              key={therapyIdStr}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                margin: "10px 0",
                padding: "10px",
              }}
            >
              <div
                onClick={() => handleTherapyClick(therapyIdStr)}
                style={{
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h3>{therapy.name}</h3>
                <span>{expandedTherapy === therapyIdStr ? "▲" : "▼"}</span>
              </div>

              {expandedTherapy === therapyIdStr && (
                <div style={{ marginTop: "10px" }}>
                  <p>
                    <strong>Duration:</strong> {therapy.duration}
                  </p>
                  <p>
                    <strong>Cost:</strong> {therapy.cost}
                  </p>
                  <p>
                    <strong>Pre Precaution:</strong> {therapy.prePrecaution || "N/A"}
                  </p>
                  <p>
                    <strong>Post Precaution:</strong> {therapy.postPrecaution || "N/A"}
                  </p>

                  <h4>Doctors for this therapy:</h4>
                  {doctors.length === 0 ? (
                    <p>No doctors assigned.</p>
                  ) : (
                    doctors.map((doc) => {
                      const docIdStr = String(doc._id);
                      return (
                        <div
                          key={docIdStr}
                          style={{
                            border: "1px solid #eee",
                            borderRadius: "6px",
                            padding: "8px",
                            marginBottom: "6px",
                          }}
                        >
                          <div
                            onClick={() =>
                              setExpandedDoctor((prev) => ({
                                ...prev,
                                [therapyIdStr]:
                                  prev[therapyIdStr] === docIdStr
                                    ? null
                                    : docIdStr,
                              }))
                            }
                            style={{
                              cursor: "pointer",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <p>
                              <strong>{doc.name}</strong> ({doc.specialization})
                            </p>
                            <span>
                              {expandedDoctor[therapyIdStr] === docIdStr
                                ? "▲"
                                : "▼"}
                            </span>
                          </div>

                          {expandedDoctor[therapyIdStr] === docIdStr && (
                            <div style={{ marginTop: "8px" }}>
                              <p><strong>Email:</strong> {doc.email}</p>
                              <p><strong>Contact:</strong> {doc.contact}</p>
                              <p>
                                <strong>Working Days:</strong>{" "}
                                {doc.workingDays?.join(", ") || "N/A"}
                              </p>

                              {/* Appointment Form */}
                              <div
                                style={{
                                  marginTop: "10px",
                                  borderTop: "1px solid #ccc",
                                  paddingTop: "8px",
                                }}
                              >
                                <h5>Book Appointment:</h5>
                                <div>
                                  <label>Date:</label>
                                  <input
                                    type="date"
                                    value={appointmentData[docIdStr]?.date || ""}
                                    onChange={(e) =>
                                      setAppointmentData((prev) => ({
                                        ...prev,
                                        [docIdStr]: {
                                          ...prev[docIdStr],
                                          date: e.target.value,
                                        },
                                      }))
                                    }
                                  />
                                </div>
                                <div>
                                  <label>Slot:</label>
                                  <select
                                    value={appointmentData[docIdStr]?.slot || ""}
                                    onChange={(e) =>
                                      setAppointmentData((prev) => ({
                                        ...prev,
                                        [docIdStr]: {
                                          ...prev[docIdStr],
                                          slot: e.target.value,
                                        },
                                      }))
                                    }
                                  >
                                    <option value="">Select</option>
                                    <option>10:00 AM - 11:00 AM</option>
                                    <option>11:00 AM - 12:00 PM</option>
                                    <option>2:00 PM - 3:00 PM</option>
                                    <option>3:00 PM - 4:00 PM</option>
                                  </select>
                                </div>
                                <button
                                  onClick={() =>
                                    bookAppointment(therapy._id, doc._id)
                                  }
                                  style={{
                                    marginTop: "8px",
                                    padding: "6px 12px",
                                    backgroundColor: "#4caf50",
                                    color: "#fff",
                                    border: "none",
                                    cursor: "pointer",
                                  }}
                                >
                                  Book
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          );
        })
      )}

      {/* Upcoming Appointments */}
      <h2 style={{ marginTop: "40px" }}>Your Upcoming Appointments</h2>
      {upcoming.length === 0 ? (
        <p>No upcoming appointments.</p>
      ) : (
        upcoming.map((a) => (
          <div
            key={a._id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              margin: "10px 0",
            }}
          >
            <p><strong>Therapy:</strong> {a.therapy?.name || "N/A"}</p>
            <p><strong>Doctor:</strong> {a.doctor?.name || "N/A"}</p>
            <p>
              <strong>Date:</strong>{" "}
              {a.date
                ? new Date(a.date).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })
                : "N/A"}
            </p>
            <p><strong>Slot:</strong> {a.slot || "N/A"}</p>
            <p><strong>Completed:</strong> {a.completed ? "Yes" : "No"}</p>
            <button
              onClick={() => cancelAppointment(a._id)}
              style={{
                marginTop: "10px",
                padding: "5px 15px",
                backgroundColor: "#f44336",
                color: "#fff",
                border: "none",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        ))
      )}

      <button
        onClick={handleLogout}
        style={{
          marginTop: "30px",
          padding: "10px 20px",
          backgroundColor: "#2196f3",
          color: "#fff",
          border: "none",
          cursor: "pointer",
        }}
      >
        Logout
      </button>


     {/* for notification  */}

     {/* Notifications */}
<h2 style={{ marginTop: "30px" }}>Notifications</h2>
{upcoming.length === 0 ? (
  <p>No notifications.</p>
) : (
  upcoming.map((appointment) => (
    <Notification key={appointment._id} appointment={appointment} />
  ))
)}

    </div>
  );
};



export default PatientDashboard;
